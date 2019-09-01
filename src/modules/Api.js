import {renderLoading} from "./renderLoading.js";

export class Api {
    constructor(options) {
        // тело конструктора
        this.options = options;
    }

    // РЕНДЕРИМ КАРТОЧКИ ИЗ МАССИВА
    getInitialCards() {
        return  fetch(`${this.options.baseUrl}/cards`, {
            headers: this.options.headers,
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

            })
            .then((result) => {
                if (result) {
                    return result
                }
                return Promise.reject(`Ошибка - не удалось получить данные с сервера: ${res.status}`);
                /* Можно лучше: лучше вынести работу с DOM из методом класса Api, оставить
                в классе Api только работу с сервером и возвращать его методов промисы которые возвращают данные:
                Например:

                getInitialCards() {
                    return fetch(.....)
                            .then(res => .....)
                            .then(result => {
                                if (result) {
                                    return result
                                }

                                return Promise.reject(`Ошибка: нет данных`);
                            })
                }

                Использование метода Api в этом случае:
                api.getInitialCards()
                   .then(result => работаем с DOM)
                   .catch((err) => ....)

                это относится ко всем методам класса Api которые сейчас работают с DOM
                */

            })
    }

    //Обращаемся к серверу за Юзер-инфой
    renderUserInfo() {
        return  fetch(`${this.options.baseUrl}/users/me`, {
            headers: this.options.headers,
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })

            //Полученные данные вносим в HTML и устанавливаем аватарку в качестве background-image
            .then((result) => {
                if (result) {
                    return result
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
    }

    editAndSaveUserInfo(nameVal, aboutVal) {

        return fetch(`${this.options.baseUrl}/users/me`, {
            method: 'PATCH',
            body: JSON.stringify({
                name: `${nameVal}`,
                about: `${aboutVal}`
            }),
            headers: this.options.headers
        })

            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then(res => {
                if (res) {
                    return res
                }
            })


    }

    downloadCard(nameVal, linkVal) {

        return fetch(`${this.options.baseUrl}/cards`, {
            method: 'POST',
            body: JSON.stringify({
                name: `${nameVal}`,
                link: `${linkVal}`
            }),
            headers: this.options.headers,
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(res => {
                if (res) {
                    return res;
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .finally(()=> {
                renderLoading(false)
            });
    }

    showLike() {

        fetch(`${this.options.baseUrl}/cards`, {
            headers: this.options.headers,
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then((result) => {
                result.forEach(function (element) {
                    //Ищем те карточки, которые уже лайкали и меняем на них сердечко
                    function filterIt(arr, searchKey) {
                        return arr.filter(obj => Object.keys(obj).some(key => obj[key].includes(searchKey)));
                    }
                    if (filterIt(element.likes,"0aafa365fab5f48885770619").length !==0) {
                        document.querySelectorAll('.place-card__like-icon')[result.indexOf(element)].classList.toggle("place-card__like-icon_liked");
                    }
                    //Маркируем все кнопки соотвествующими им ID и заполняем счетчик лайков соотвественно
                    document.querySelectorAll('.place-card__like-counter')[result.indexOf(element)].textContent = element.likes.length;
                    document.querySelectorAll('.place-card__like-icon')[result.indexOf(element)].setAttribute("id",`cardid_${element._id}`);
                });

            })
            .catch((err) => {
                console.log(err)
            })
    }

    addLike(cardId,method) {
        fetch(`${this.options.baseUrl}/cards/like/${cardId}`, {
            method: method,
            headers: this.options.headers,
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then((result) => {
                document.querySelector(`#cardid_${cardId}`).nextSibling.textContent = result.likes.length;
            })
            .catch((err) => {
                console.log(err)
            })
    }

    changeUserAvatar(url) {
        return  fetch(`${this.options.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this.options.headers,
            body: JSON.stringify({
                avatar: url
            })
        })

        //Проверяем ответ сервера, если данные дошли и все ОК - вносим их в HTML
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(res => {
                if (res) {
                    return res;
                }
                return Promise.reject(`Ошибка: ${res.statusText} ${res.status}`);
            })
    }

    deleteCard (id) {
        return  fetch(`${this.options.baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this.options.headers,
        })

        //Проверяем ответ сервера, если данные дошли и все ОК - вносим их в HTML
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                return Promise.reject(`Ошибка: ${res.statusText} ${res.status}`);
            })
            .then(res =>{
                if (res) {
                    return res
                }
                return Promise.reject(`Ошибка: ${res.statusText} ${res.status}`);
            })
    }
}



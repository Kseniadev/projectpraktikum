/* ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ */

//ПОП-АПЫ
const popupEdit = document.querySelector('#popup-edit');
const popupCard = document.querySelector('.popup');
const popupAvatar = document.querySelector("#popup-avatar");
const popupImage = document.querySelector('#popup-image');
//ИНПУТЫ
const userInfoName = document.querySelector('.user-info__name');
const userInfoJob = document.querySelector('.user-info__job');
const userInfoAvatar = document.querySelector(".user-info__photo");
const inputTypeName = popupEdit.querySelector('.popup__input_type_name');
const inputTypeLink = popupEdit.querySelector('.popup__input_type_link-url');
const inputTypeAvatar = popupAvatar.querySelector(".popup__input_type_avatar");

//КНОПКИ ОТКРЫТИЯ ПОП-АПОВ
const buttonPopupEditOpen = document.querySelector('#user-info__button-edit');
const buttonPopupCardOpen = document.querySelector('.user-info__button');
//КНОПКИ САБМИТА ПОП-АПОВ
const submitCard = document.querySelector('.popup__button');
const submitEdit = document.querySelector("#popup__button-edit");
const submitAvatar = document.querySelector("#popup__button-avatar");
//КОНТЕЙНЕР КАРТОЧЕК
const list = document.querySelector('.places-list');
//ФОРМЫ
const formEdit = document.forms.edit;
const formNew = document.forms.new;
const formAvatar = document.forms.avatar;
const name = formNew.elements.name;
const link = formNew.elements.link;
//Мой Owner ID
const myOwnerId = "0aafa365fab5f48885770619";

//МАССИВ NAME ИНПУТОВ
const arrayOfErrorIds = ["#error-name", "#error-link", "#error-user-name", "#error-user-about","#error-user-avatar"];


/* ОБЪЯВЛЕНИЕ КЛАССОВ */
class Card {
    constructor(name, link, id) {
        this.cardElement = this.create(name, link, id);
        /* Можно лучше: добавление обработчиков событий лучше перенести в метод create  */
        this.handleLikeClick = this.handleLikeClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleLikeClick(event) {
        event.target.classList.toggle("place-card__like-icon_liked");
        if (event.target.classList.contains("place-card__like-icon_liked")) {
            api.addLike(event.target.getAttribute("id").slice(7),'PUT');
        } else {
            api.addLike(event.target.getAttribute("id").slice(7),'DELETE');
        }

    }


    handleRemoveClick() {
        if (window.confirm("Вы действительно хотите удалить карточку?")) {
            this.parentNode.parentNode.removeEventListener('click', this.handleLikeClick);
            this.parentNode.parentNode.removeEventListener('click', this.handleRemoveClick);
            api.deleteCard(this.parentNode.parentNode.querySelector(".place-card__like-icon").getAttribute("id").slice(7))
                .then(res => {
                    if(res.message === "Пост удалён") {
                       return this.parentNode.parentNode.remove();
                    }
                    return Promise.reject(`Ошибка: ${res.message}`);
                })
                .catch((err) => {
                    console.log(err);
                });
            /* Можно лучше: удалять карточку со страницы, только когда пришел ответ с сервера, для этого из метода deleteCard
            можно вернуть промис, как это сделать я описал ниже в классе Api */

        }
    }

    create(nameValue, linkValue, cardid) {
        const card = document.createElement('div');
        card.classList.add('place-card');
        list.appendChild(card);

        const cardImage = document.createElement('div');
        cardImage.classList.add('place-card__image');
        card.appendChild(cardImage);

        cardImage.setAttribute("style", 'background-image: url(' + linkValue + ')');

        const cardDeleteIcon = document.createElement('button');
        cardDeleteIcon.classList.add('place-card__delete-icon');
        cardImage.appendChild(cardDeleteIcon);

        /* Можно лучше: этот ключ встречается в программе несколько раз, лучше вынести его в именованную константу */
        if (cardid === myOwnerId) {
            cardDeleteIcon.style.display = "block"
        }

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('place-card__description');
        card.append(cardDescription);

        const cardName = document.createElement('h3');
        cardName.classList.add('place-card__name');
        cardName.textContent += nameValue;
        cardDescription.appendChild(cardName);

        const likeContainer = document.createElement('div');
        cardDescription.appendChild(likeContainer);

        const likeCounter = document.createElement('div');
        likeCounter.classList.add('place-card__like-counter');
        likeCounter.setAttribute("style", 'text-align: center');

        const cardLikeIcon = document.createElement('button');
        cardLikeIcon.classList.add('place-card__like-icon');

        likeContainer.appendChild(cardLikeIcon);
        likeContainer.appendChild(likeCounter);

        card
            .querySelector('.place-card__like-icon')
            .addEventListener('click', this.handleLikeClick);

        card
            .querySelector('.place-card__delete-icon')
            .addEventListener('click', this.handleRemoveClick);

        return card;
    }
}

class CardList {
    constructor(container, array) {
        this.container = container;
        this.array = array;
    }

    addCard(name, link, id) {
        const {cardElement} = new Card(name, link, id);
        this.container.appendChild(cardElement);
    }

    render() {
        this.array.forEach(function (item) {
            new Card(item.name, item.link, item.owner._id);
        });
    }
}

class Popup {
    constructor(element) {
        this.element = element;
        this.element
            .querySelector('.popup__close')
            .addEventListener('click', this.close)
    }

    open() {
        this.element.classList.add('popup_is-opened');
        /* Можно лучше: загрузка данных в форму не относится к функционалу попапа, 
           лучше делать это перед открытием попапа +++*/
    }

    close() {
        document.querySelector('.popup_is-opened').classList.remove('popup_is-opened');
        /* Можно лучше: в функцию закрытия попапа включен ряд действий не относящихся
           к попапу, лучше делать классы более абстрактыми, если у нас будет попап без формы,
           а мы будем выполнять ещё какие то действия, это может привести к ошибкам */
        document.forms.new.reset();
        document.forms.avatar.reset();
        resetErrors();
        unactivePopupButton(submitCard);
        unactivePopupButton(submitAvatar);
    }
}

/* ОБЪЯВЛЕНИЕ ФУНКЦИЙ */

function addSubmitedCard() {
    /* Надо исправить: не нужно создавать экземпляра класса каждый раз, когда мы хотим его использовать
    Выше Вы уже создали экземпляр let givenArray = new CardList(list, initialCards);
    нужно использовать его +++++++++++++ */
    api.downloadCard(name.value, link.value)
        .then(res => {
            let givenArray = new CardList(list,null);
            givenArray.addCard(res.name,res.link ,res.owner._id);
            api.showLike();
            formNew.reset();
            popupCardOpen.close();
        })
        .catch((err) => {
            unactivePopupButton(submitCard);
            setError(document.querySelector(arrayOfErrorIds[1]), `Указанную картинку не удалось загрузить (${err})`);
        })

     /* Надо исправить: сбрасывать поля следует после того как пришел ответ с сервера ++++++*/

    /* Надо исправить: не нужно создавать экземпляра класса каждый раз, когда мы хотим его использовать
    Нужно создать попап один раз, а затем вызывать его методы
    Ниже по коду Вы создаете попапы
    const popupCardOpen = new Popup(popupCard);
    const popupEditOpen = new Popup(popupEdit);
    Нужно перенести их создание вверх и пользоваться ими
     ++++++++++++++   */
}

function addSubmitedInfo() {
    api.editAndSaveUserInfo(inputTypeName.value, inputTypeLink.value)
    /* Можно лучше: можно было написать без вложенности 
                .then(res => console.log(res))
                .then(() => api.renderUserInfo())
                .then(result => {
                    userInfoName.textContent = result.name;
                    userInfoJob.textContent = result.about;
                    userInfoAvatar.style.backgroundImage = `url(${result.avatar})`;
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    renderLoading(false);
                    popupEditOpen.close()
                });*/
        .then(res => {
            console.log(res);
            api.renderUserInfo()
                .then(result => {
                    userInfoName.textContent = result.name;
                    userInfoJob.textContent = result.about;
                    userInfoAvatar.style.backgroundImage = `url(${result.avatar})`;
                })
                .catch((err) => {
                    console.log(err)
                });
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            renderLoading(false);
            popupEditOpen.close()
        });
}

function addSubmitedAvatar() {
    api.changeUserAvatar(inputTypeAvatar.value)
        .then(res => {
            popupChangeAvatar.close();
            userInfoAvatar.style.backgroundImage = `url(${res.avatar})`;
        })

        .catch((err) => {
            unactivePopupButton(submitAvatar);
            setError(document.querySelector(arrayOfErrorIds[4]), `Указанную картинку не удалось загрузить (${err})`);
        });
}

//ПРОВЕРЯЕМ, ПРОХОДИТ ЛИ ВАЛИЦАДИЮ, ЕСЛИ ДА - СОХРАНЯЕМ ДАННЫЕ
    function checkAndSaveInputs(form, submitButton) {
        const inputsEdit = Array.from(form);

        const isInvalid = inputsEdit.some((elem) => {
            return (elem.classList !== submitButton.classList) && !validate(elem);
        });
        if (!isInvalid && form === formNew.elements) {
            addSubmitedCard();
        }
        if (!isInvalid && form === formEdit.elements) {
            addSubmitedInfo();
        }
        if (!isInvalid && form === formAvatar.elements) {
            addSubmitedAvatar();
        }
    }

//ВАЛИАДАЦИЯ
    function handleValidate(event) {
        const errorElement = document.querySelector(`#error-${event.target.name}`);
        setError(errorElement);
        validate(event.target);
    }

    function validate(element) {
        const errorElement = document.querySelector(`#error-${element.name}`);

        if (!isInputEmpty(element)) {
            setError(errorElement, "Это обязательное поле");
            return false;

        } else if (!element.checkValidity() && element.type === "url") {
            setError(errorElement, "Здесь должна быть ссылка");
            return false

        } else if (!isInputMisLength(element) && element.type !== "url") {
            setError(errorElement, "Должно быть от 2 до 30 символов");
            return false;
        }

        return true;
    }

    function isInputEmpty(element) {
        return element.value.length > 0;
    }

    function isInputMisLength(element) {
        return element.value.length >= 2 && element.value.length <= 30;
    }

//АКТИВАЦИЯ ОШИБОК
    function setError(element, errorText) {
        element.textContent = errorText;
        element.setAttribute('style', `opacity:${errorText ? '1' : '0'};`);
    }

//АКТИВАЦИЯ/ДЕЗАКТИВАЦИЯ КНОПОК
    function unactivePopupButton(button) {
        button.setAttribute('disabled', true);
        button.setAttribute('style', 'cursor: default;');
    }

    function activePopupButton(button) {
        button.removeAttribute('disabled');
        button.setAttribute('style', 'cursor: pointer; background-color: black; color: white;');
    }

// КНОПКА ЗАГРУЗКА

    function renderLoading(isLoading) {
        if (isLoading) {
            submitEdit.textContent = "Загрузка...";
            submitCard.textContent = "Загрузка...";

        } else {
            submitEdit.textContent = "Сохранить";
            submitCard.textContent = "+";

        }
    }

    /* ВЫЗОВ СЛУШАТЕЛЕЙ */

// ОТКРЫВАЕМ ПОПАП ДОБАВЛЕНИЯ КАРТОЧКИ
    const popupCardOpen = new Popup(popupCard);

    buttonPopupCardOpen.addEventListener('click', function () {
        popupCardOpen.open();
    });

// ОТКРЫВАЕМ ПОПАП ДОБАВЛЕНИЯ ИНФЫ
    const popupEditOpen = new Popup(popupEdit);

    buttonPopupEditOpen.addEventListener('click', function () {
        inputTypeName.value = userInfoName.textContent;
        inputTypeLink.value = userInfoJob.textContent;
        activePopupButton(submitEdit);

        popupEditOpen.open();
    });

// ОТКРЫВАЕМ ПОПАП СМЕНЫ АВАТАРА
    const popupChangeAvatar = new Popup(popupAvatar);
    userInfoAvatar.addEventListener('click', function () {
        activePopupButton(submitEdit);
        popupChangeAvatar.open();
    });


//САБМИТИМ ИНФОРМАЦИЮ ИЗ ПОЛЕЙ
    submitCard.addEventListener('click', function (event) {
        event.preventDefault();
        renderLoading(true);
        checkAndSaveInputs(document.forms.new.elements, submitCard);
    });

    submitEdit.addEventListener('click', function (event) {
        event.preventDefault();
        renderLoading(true);
        checkAndSaveInputs(document.forms.edit.elements, submitEdit);
    });

    submitAvatar.addEventListener('click', function (event) {
        event.preventDefault();
        renderLoading(true);
        checkAndSaveInputs(document.forms.avatar.elements, submitAvatar);
    });

//Прослушиваем инпуты на ошибки валидации в реал-тайм
    (function handler() {
        const slicedArray = arrayOfErrorIds.map(el => el.slice(7));
        slicedArray.forEach((elem) => {
            document.querySelector("#" + elem).addEventListener('input', handleValidate);
        })
    })();

    function editFormHandler(name, link, buttonToActivate) {
        if (name && link && (!validate(name) || !validate(link))) {
            unactivePopupButton(buttonToActivate);
        } else if (!validate(link)) {
            unactivePopupButton(buttonToActivate);
        } else {
            activePopupButton(buttonToActivate);
        }
    }

//Блокировки и разблокировки кнопки сохранения в формах, по инпуту
    formNew.addEventListener('input', function () {
        editFormHandler(document.querySelector("#name"), document.querySelector("#link"), submitCard)
    });
    formEdit.addEventListener('input', function () {
        editFormHandler(document.querySelector("#user-name"), document.querySelector("#user-about"), submitEdit)
    });
    formAvatar.addEventListener('input', function () {
        editFormHandler(null, document.querySelector("#user-avatar"), submitAvatar)
    });

// Деактивация ошибок
    function resetErrors() {
        arrayOfErrorIds.forEach(elem => {
            setError(document.querySelector(elem), "")
        })
    }

    const popupImageOpen = new Popup(popupImage);

//Открытие картиночки в поп-апе
    /* Можно лучше: для открытия картинки в попапе отлично было бы переиспользовать созданный ранее класс Popup */
    document.querySelector(".root").addEventListener('click', function (event) {
        if (event.target.matches(".place-card__image") && !event.target.matches(".place-card__delete-icon")) {

            popupImageOpen.open();
            const currentBG = event.target.getAttribute("style");
            const strippedSrc = currentBG.match(/url\((.*)\)/i);
            document.querySelector(".big-image").setAttribute("src", strippedSrc[1]);
        }
    });

    /*
        Теперь экземпляры класса не создаются когда не нужно. Хорошая работа!
    */

    class Api {
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

    const api = new Api({
        baseUrl: 'http://95.216.175.5/cohort1',
        headers: {
            authorization: '7e7bb132-bf3f-413e-b584-804493089f29',
            'Content-Type': 'application/json'
        }
    });

    api.renderUserInfo()
        .then(result => {
            userInfoName.textContent = result.name;
            userInfoJob.textContent = result.about;
            userInfoAvatar.style.backgroundImage = `url(${result.avatar})`;
        })
        .catch((err) => {
            console.log(err)
        });

    api.getInitialCards()
        .then(result => {
            let arraOfOwnerID = [];
            let arrayOfCards = [];

            result.forEach(function (element) {
                arraOfOwnerID.push(element.owner._id);
                arrayOfCards.push(element);
            });

            let arrRes = new CardList(list, arrayOfCards,arraOfOwnerID);
            arrRes.render();
            api.showLike();
        })
        .catch((err) => {
            console.log(err)
        });



/*
    Задание реализовано полностью, очень хорошая работа!

    Но в некоторых местах DOM изменяется до того как пришло подтверждение с сервера -
    например в функции addSubmitedInfo и при удалении удалении карточки. Это
    надо поправить. +++

    Так же я бы не стал оставлять работу с DOM в классе Api, оставив ему только работу с сервером,
    Для этого можно из его методом возвращать промисы с данными

*/

/*
        Здорово, почти во всех местах работает теперь правильно, но при сохранении данных пользователя
        он отправляются на сервер, но не сохраняются на странице (вызов api.renderUserInfo() внутри editAndSaveUserInfo
        запрашивает данные но не отображает их )
 */

 /*
        Отлично! Теперь все работает как надо
 */
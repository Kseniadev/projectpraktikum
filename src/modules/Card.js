import {api} from "./variables.js";
import {list} from './variables.js';
import {myOwnerId} from './variables.js';

export class Card {
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



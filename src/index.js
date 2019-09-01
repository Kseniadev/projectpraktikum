import "./style.css";

const popupImage = document.querySelector('#popup-image');

import {userInfoJob} from "./modules/variables.js";
import {userInfoName} from "./modules/variables.js";
import {inputTypeName} from "./modules/variables.js";
import {inputTypeLink} from "./modules/variables.js";
import {popupEditOpen} from "./modules/variables.js";
import {popupCardOpen} from "./modules/variables.js";
import {userInfoAvatar} from "./modules/variables.js";

const buttonPopupEditOpen = document.querySelector('#user-info__button-edit');
const buttonPopupCardOpen = document.querySelector('.user-info__button');

import {submitCard} from "./modules/variables.js";
import {submitEdit} from "./modules/variables.js";
import {submitAvatar} from "./modules/variables.js";
import {list} from './modules/variables.js';
import {formEdit} from "./modules/variables.js";
import {formNew} from "./modules/variables.js";
import {formAvatar} from "./modules/variables.js";
import {CardList} from "./modules/CardList.js";
import {Popup} from "./modules/Popup.js";
import {checkAndSaveInputs} from "./modules/checkAndSaveInputs.js";
import {activePopupButton} from "./modules/activePopupButton.js";
import {renderLoading} from "./modules/renderLoading.js";

buttonPopupCardOpen.addEventListener('click', function () {
    popupCardOpen.open();
});

buttonPopupEditOpen.addEventListener('click', function () {
    inputTypeName.value = userInfoName.textContent;
    inputTypeLink.value = userInfoJob.textContent;
    activePopupButton(submitEdit);

    popupEditOpen.open();
});

// ОТКРЫВАЕМ ПОПАП СМЕНЫ АВАТАРА
import {popupChangeAvatar} from "./modules/variables.js";
// const popupChangeAvatar = new Popup(popupAvatar);

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

import {editFormHandler} from "./modules/editFormHandler.js";

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


import {api} from './modules/variables.js'



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
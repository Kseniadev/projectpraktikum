import {Popup} from "./Popup.js";
import {Api} from "./Api.js";

export const list = document.querySelector('.places-list');
export const myOwnerId = "0aafa365fab5f48885770619";
export const formNew = document.forms.new;
export const formEdit = document.forms.edit;
export const formAvatar = document.forms.avatar;
export const arrayOfErrorIds = ["#error-name", "#error-link", "#error-user-name", "#error-user-about","#error-user-avatar"];
export const submitEdit = document.querySelector("#popup__button-edit");
export const submitCard = document.querySelector('.popup__button');
export const popupAvatar = document.querySelector("#popup-avatar");
export const inputTypeAvatar = popupAvatar.querySelector(".popup__input_type_avatar");
export const popupChangeAvatar = new Popup(popupAvatar);
export const userInfoAvatar = document.querySelector(".user-info__photo");
export const submitAvatar = document.querySelector("#popup__button-avatar");
export const api = new Api({
    baseUrl: 'https://praktikum.tk/cohort1',
    headers: {
        authorization: '7e7bb132-bf3f-413e-b584-804493089f29',
        'Content-Type': 'application/json'
    }
});
export const popupEdit = document.querySelector('#popup-edit');
export const inputTypeName = popupEdit.querySelector('.popup__input_type_name');
export const inputTypeLink = popupEdit.querySelector('.popup__input_type_link-url');
export const userInfoName = document.querySelector('.user-info__name');
export const userInfoJob = document.querySelector('.user-info__job');
export const popupEditOpen = new Popup(popupEdit);
export const popupCard = document.querySelector('.popup');
export const popupCardOpen = new Popup(popupCard);
export const name = formNew.elements.name;
export const link = formNew.elements.link;






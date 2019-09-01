import {resetErrors} from "./resetErrors.js";
import {unactivePopupButton} from "./unactivePopupButton.js";
import {submitCard} from "./variables.js";
import {submitAvatar} from "./variables.js";

export class Popup {
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


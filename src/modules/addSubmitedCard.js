import {CardList} from "./CardList.js";
import {list} from "./variables.js";
import {api} from "./variables.js";
import {unactivePopupButton} from "./unactivePopupButton.js";
import {submitCard} from "./variables.js";
import {setError} from "./setError.js";
import {arrayOfErrorIds} from "./variables.js";
import {formNew} from "./variables.js";
import {popupCardOpen} from "./variables.js";
import {name} from "./variables.js";
import {link} from "./variables.js";

export function addSubmitedCard() {
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


}

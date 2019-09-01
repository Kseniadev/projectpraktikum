import {inputTypeAvatar} from "./variables.js";
import {popupChangeAvatar} from "./variables.js";
import {userInfoAvatar} from "./variables.js";
import {unactivePopupButton} from "./unactivePopupButton.js";
import {setError} from "./setError.js";
import {submitAvatar} from "./variables.js";
import {arrayOfErrorIds} from "./variables.js";
import {api} from "./variables.js";

export function addSubmitedAvatar() {
    api.changeUserAvatar(inputTypeAvatar.value)
        .then(res => {
            popupChangeAvatar.close();
            userInfoAvatar.style.backgroundImage = `url(${res.avatar})`;
            console.log(res);
        })

        .catch((err) => {
            unactivePopupButton(submitAvatar);
            setError(document.querySelector(arrayOfErrorIds[4]), `Указанную картинку не удалось загрузить (${err})`);
        });
}

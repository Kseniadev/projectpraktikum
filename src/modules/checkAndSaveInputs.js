import {addSubmitedCard} from "./addSubmitedCard.js";
import {addSubmitedInfo} from "./addSubmitedInfo.js";
import {addSubmitedAvatar} from "./addSubmitedAvatar.js";
import {validate} from "./validate.js";
import {formNew} from "./variables.js";
import {formEdit} from "./variables.js";
import {formAvatar} from "./variables.js";

export function checkAndSaveInputs(form, submitButton) {
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

import {submitEdit} from "./variables.js";
import {submitCard} from "./variables.js";

export function renderLoading(isLoading) {
    if (isLoading) {
        submitEdit.textContent = "Загрузка...";
        submitCard.textContent = "Загрузка...";

    } else {
        submitEdit.textContent = "Сохранить";
        submitCard.textContent = "+";

    }
}

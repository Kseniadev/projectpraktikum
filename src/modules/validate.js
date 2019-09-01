import {isInputEmpty} from "./isInputEmpty.js"
import {isInputMisLength} from "./isInputMisLength.js";
import {setError} from "./setError.js";

export function validate(element) {
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

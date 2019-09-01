import {validate} from "./validate.js"
import {setError} from "./setError.js";

export function handleValidate(event) {
    const errorElement = document.querySelector(`#error-${event.target.name}`);
    setError(errorElement);
    validate(event.target);
}

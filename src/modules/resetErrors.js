import {setError} from "./setError.js";
import {arrayOfErrorIds} from "./variables.js";

export function resetErrors() {
    arrayOfErrorIds.forEach(elem => {
        setError(document.querySelector(elem), "")
    })
}

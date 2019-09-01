import {handleValidate} from "./handleValidate.js";
import {arrayOfErrorIds} from "./variables.js";

export const handlerCaller = (function handler() {
    const slicedArray = arrayOfErrorIds.map(el => el.slice(7));
    slicedArray.forEach((elem) => {
        document.querySelector("#" + elem).addEventListener('input', handleValidate);
    })
})();

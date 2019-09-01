import {validate} from "./validate.js";
import {unactivePopupButton} from "./unactivePopupButton.js";
import {activePopupButton} from "./activePopupButton.js";

export function editFormHandler(name, link, buttonToActivate) {
    if (name && link && (!validate(name) || !validate(link))) {
        unactivePopupButton(buttonToActivate);
    } else if (!validate(link)) {
        unactivePopupButton(buttonToActivate);
    } else {
        activePopupButton(buttonToActivate);
    }
}

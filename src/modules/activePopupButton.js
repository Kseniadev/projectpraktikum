export function activePopupButton(button) {
    button.removeAttribute('disabled');
    button.setAttribute('style', 'cursor: pointer; background-color: black; color: white;');
}

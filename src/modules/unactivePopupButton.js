export function unactivePopupButton(button) {
    button.setAttribute('disabled', true);
    button.setAttribute('style', 'cursor: default;');
}

export function setError(element, errorText) {
    element.textContent = errorText;
    element.setAttribute('style', `opacity:${errorText ? '1' : '0'};`);
}

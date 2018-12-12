const SCROLL_ASSIST_SPEED = 0.3;
export function getScrollData(componentEl, contentEl, keyboardHeight) {
    const itemEl = componentEl.closest('ion-item,[ion-item]') || componentEl;
    return calcScrollData(itemEl.getBoundingClientRect(), contentEl.getBoundingClientRect(), keyboardHeight, window.innerHeight);
}
function calcScrollData(inputRect, contentRect, keyboardHeight, platformHeight) {
    const inputTop = inputRect.top;
    const inputBottom = inputRect.bottom;
    const visibleAreaTop = contentRect.top;
    const visibleAreaBottom = Math.min(contentRect.bottom, platformHeight - keyboardHeight);
    const safeAreaTop = visibleAreaTop + 15;
    const safeAreaBottom = visibleAreaBottom * 0.5;
    const distanceToBottom = safeAreaBottom - inputBottom;
    const distanceToTop = safeAreaTop - inputTop;
    const scrollAmount = Math.round((distanceToBottom < 0)
        ? -distanceToBottom
        : (distanceToTop > 0)
            ? -distanceToTop
            : 0);
    const distance = Math.abs(scrollAmount);
    const duration = distance / SCROLL_ASSIST_SPEED;
    const scrollDuration = Math.min(400, Math.max(150, duration));
    return {
        scrollAmount,
        scrollDuration,
        scrollPadding: keyboardHeight,
        inputSafeY: -(inputTop - safeAreaTop) + 4
    };
}

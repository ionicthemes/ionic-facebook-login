import { pointerCoord } from '../../helpers';
import { isFocused, relocateInput } from './common';
import { getScrollData } from './scroll-data';
export function enableScrollAssist(componentEl, inputEl, contentEl, keyboardHeight) {
    let coord;
    const touchStart = (ev) => {
        coord = pointerCoord(ev);
        console.debug(`input-base, pointerStart, type: ${ev.type}`);
    };
    const touchEnd = (ev) => {
        console.debug(`input-base, pointerEnd, type: ${ev.type}`);
        if (!coord) {
            return;
        }
        const endCoord = pointerCoord(ev);
        if (!hasPointerMoved(6, coord, endCoord) && !isFocused(inputEl)) {
            ev.preventDefault();
            ev.stopPropagation();
            jsSetFocus(componentEl, inputEl, contentEl, keyboardHeight);
        }
    };
    componentEl.addEventListener('touchstart', touchStart, true);
    componentEl.addEventListener('touchend', touchEnd, true);
    return () => {
        componentEl.removeEventListener('touchstart', touchStart, true);
        componentEl.removeEventListener('touchend', touchEnd, true);
    };
}
function jsSetFocus(componentEl, inputEl, contentEl, keyboardHeight) {
    const scrollData = getScrollData(componentEl, contentEl, keyboardHeight);
    if (Math.abs(scrollData.scrollAmount) < 4) {
        inputEl.focus();
        return;
    }
    relocateInput(componentEl, inputEl, true, scrollData.inputSafeY);
    inputEl.focus();
    contentEl.scrollByPoint(0, scrollData.scrollAmount, scrollData.scrollDuration).then(() => {
        relocateInput(componentEl, inputEl, false, scrollData.inputSafeY);
        inputEl.focus();
    });
}
function hasPointerMoved(threshold, startCoord, endCoord) {
    if (startCoord && endCoord) {
        const deltaX = (startCoord.x - endCoord.x);
        const deltaY = (startCoord.y - endCoord.y);
        const distance = deltaX * deltaX + deltaY * deltaY;
        return distance > (threshold * threshold);
    }
    return false;
}

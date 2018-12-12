const cloneMap = new WeakMap();
export function relocateInput(componentEl, inputEl, shouldRelocate, inputRelativeY = 0) {
    if (cloneMap.has(componentEl) === shouldRelocate) {
        return;
    }
    console.debug(`native-input, hideCaret, shouldHideCaret: ${shouldRelocate}, input value: ${inputEl.value}`);
    if (shouldRelocate) {
        addClone(componentEl, inputEl, inputRelativeY);
    }
    else {
        removeClone(componentEl, inputEl);
    }
}
export function isFocused(input) {
    return input === input.getRootNode().activeElement;
}
function addClone(componentEl, inputEl, inputRelativeY) {
    const parentEl = inputEl.parentNode;
    const clonedEl = inputEl.cloneNode(false);
    clonedEl.classList.add('cloned-input');
    clonedEl.tabIndex = -1;
    parentEl.appendChild(clonedEl);
    cloneMap.set(componentEl, clonedEl);
    const doc = componentEl.ownerDocument;
    const tx = doc.dir === 'rtl' ? 9999 : -9999;
    componentEl.style.pointerEvents = 'none';
    inputEl.style.transform = `translate3d(${tx}px,${inputRelativeY}px,0) scale(0)`;
}
function removeClone(componentEl, inputEl) {
    const clone = cloneMap.get(componentEl);
    if (clone) {
        cloneMap.delete(componentEl);
        clone.remove();
    }
    componentEl.style.pointerEvents = '';
    inputEl.style.transform = '';
}

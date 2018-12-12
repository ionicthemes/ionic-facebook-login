import { h } from '../ionic.core.js';

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px';
function mdTransitionAnimation(AnimationC, _, opts) {
    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;
    const ionPageElement = getIonPageElement(enteringEl);
    const rootTransition = new AnimationC();
    rootTransition
        .addElement(ionPageElement)
        .beforeRemoveClass('ion-page-invisible');
    const backDirection = (opts.direction === 'back');
    if (backDirection) {
        rootTransition
            .duration(opts.duration || 200)
            .easing('cubic-bezier(0.47,0,0.745,0.715)');
    }
    else {
        rootTransition
            .duration(opts.duration || 280)
            .easing('cubic-bezier(0.36,0.66,0.04,1)')
            .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER, true)
            .fromTo('opacity', 0.01, 1, true);
    }
    const enteringToolbarEle = ionPageElement.querySelector('ion-toolbar');
    if (enteringToolbarEle) {
        const enteringToolBar = new AnimationC();
        enteringToolBar.addElement(enteringToolbarEle);
        rootTransition.add(enteringToolBar);
    }
    if (leavingEl && backDirection) {
        rootTransition
            .duration(opts.duration || 200)
            .easing('cubic-bezier(0.47,0,0.745,0.715)');
        const leavingPage = new AnimationC();
        leavingPage
            .addElement(getIonPageElement(leavingEl))
            .fromTo(TRANSLATEY, CENTER, OFF_BOTTOM)
            .fromTo('opacity', 1, 0);
        rootTransition.add(leavingPage);
    }
    return Promise.resolve(rootTransition);
}
function getIonPageElement(element) {
    if (element.classList.contains('ion-page')) {
        return element;
    }
    const ionPage = element.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs');
    if (ionPage) {
        return ionPage;
    }
    return element;
}

export { mdTransitionAnimation };

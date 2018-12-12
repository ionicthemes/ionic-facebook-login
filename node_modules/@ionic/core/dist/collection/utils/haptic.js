export function hapticAvailable() {
    const engine = window.TapticEngine;
    return !!engine;
}
export function hapticSelection() {
    const engine = window.TapticEngine;
    if (engine) {
        engine.selection();
    }
}
export function hapticSelectionStart() {
    const engine = window.TapticEngine;
    if (engine) {
        engine.gestureSelectionStart();
    }
}
export function hapticSelectionChanged() {
    const engine = window.TapticEngine;
    if (engine) {
        engine.gestureSelectionChanged();
    }
}
export function hapticSelectionEnd() {
    const engine = window.TapticEngine;
    if (engine) {
        engine.gestureSelectionEnd();
    }
}
export function hapticNotification(options) {
    const engine = window.TapticEngine;
    if (engine) {
        engine.notification(options);
    }
}
export function hapticImpact(options) {
    const engine = window.TapticEngine;
    if (engine) {
        engine.impact(options);
    }
}

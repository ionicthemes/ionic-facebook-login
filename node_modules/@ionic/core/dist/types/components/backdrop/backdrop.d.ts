import { ComponentInterface, EventEmitter } from '../../stencil.core';
export declare class Backdrop implements ComponentInterface {
    private lastClick;
    private blocker;
    doc: Document;
    /**
     * If `true`, the backdrop will be visible.
     */
    visible: boolean;
    /**
     * If `true`, the backdrop will can be clicked and will emit the `ionBackdropTap` event.
     */
    tappable: boolean;
    /**
     * If `true`, the backdrop will stop propagation on tap.
     */
    stopPropagation: boolean;
    /**
     * Emitted when the backdrop is tapped.
     */
    ionBackdropTap: EventEmitter<void>;
    componentDidLoad(): void;
    componentDidUnload(): void;
    protected onTouchStart(ev: TouchEvent): void;
    protected onMouseDown(ev: TouchEvent): void;
    private emitTap;
    hostData(): {
        tabindex: string;
        class: {
            'backdrop-hide': boolean;
            'backdrop-no-tappable': boolean;
        };
    };
}

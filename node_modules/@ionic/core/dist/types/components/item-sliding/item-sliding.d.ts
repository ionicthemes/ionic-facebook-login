import { ComponentInterface, EventEmitter, QueueApi } from '../../stencil.core';
declare const enum SlidingState {
    Disabled = 2,
    Enabled = 4,
    End = 8,
    Start = 16,
    SwipeEnd = 32,
    SwipeStart = 64
}
export declare class ItemSliding implements ComponentInterface {
    private item;
    private openAmount;
    private initialOpenAmount;
    private optsWidthRightSide;
    private optsWidthLeftSide;
    private sides;
    private tmr;
    private leftOptions?;
    private rightOptions?;
    private optsDirty;
    private gesture?;
    el: HTMLIonItemSlidingElement;
    state: SlidingState;
    queue: QueueApi;
    /**
     * If `true`, the user cannot interact with the sliding-item.
     */
    disabled: boolean;
    disabledChanged(): void;
    /**
     * Emitted when the sliding position changes.
     */
    ionDrag: EventEmitter;
    componentDidLoad(): Promise<void>;
    componentDidUnload(): void;
    /**
     * Get the amount the item is open in pixels.
     */
    getOpenAmount(): Promise<number>;
    /**
     * Get the ratio of the open amount of the item compared to the width of the options.
     * If the number returned is positive, then the options on the right side are open.
     * If the number returned is negative, then the options on the left side are open.
     * If the absolute value of the number is greater than 1, the item is open more than
     * the width of the options.
     */
    getSlidingRatio(): Promise<number>;
    /**
     * Close the sliding item. Items can also be closed from the [List](../../list/List).
     */
    close(): Promise<void>;
    /**
     * Close all of the sliding items in the list. Items can also be closed from the [List](../../list/List).
     */
    closeOpened(): Promise<boolean>;
    private updateOptions;
    private canStart;
    private onStart;
    private onMove;
    private onEnd;
    private calculateOptsWidth;
    private setOpenAmount;
    private getSlidingRatioSync;
    hostData(): {
        class: {
            'item-sliding-active-slide': boolean;
            'item-sliding-active-options-end': boolean;
            'item-sliding-active-options-start': boolean;
            'item-sliding-active-swipe-end': boolean;
            'item-sliding-active-swipe-start': boolean;
        };
    };
}
export {};

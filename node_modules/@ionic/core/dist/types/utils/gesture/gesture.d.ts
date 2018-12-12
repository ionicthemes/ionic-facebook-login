import { QueueApi } from '../../stencil.core';
export declare function createGesture(config: GestureConfig): Gesture;
export interface GestureDetail {
    type: string;
    startX: number;
    startY: number;
    startTimeStamp: number;
    currentX: number;
    currentY: number;
    velocityX: number;
    velocityY: number;
    deltaX: number;
    deltaY: number;
    timeStamp: number;
    event: UIEvent;
    data?: any;
}
export declare type GestureCallback = (detail: GestureDetail) => boolean | void;
export interface Gesture {
    setDisabled(disabled: boolean): void;
    destroy(): void;
}
export interface GestureConfig {
    el: Node;
    disableScroll?: boolean;
    queue: QueueApi;
    direction?: 'x' | 'y';
    gestureName: string;
    gesturePriority?: number;
    passive?: boolean;
    maxAngle?: number;
    threshold?: number;
    canStart?: GestureCallback;
    onWillStart?: (_: GestureDetail) => Promise<void>;
    onStart?: GestureCallback;
    onMove?: GestureCallback;
    onEnd?: GestureCallback;
    notCaptured?: GestureCallback;
}

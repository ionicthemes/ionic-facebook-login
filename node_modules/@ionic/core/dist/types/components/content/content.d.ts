import '../../stencil.core';
import { ComponentInterface, EventEmitter, QueueApi } from '../../stencil.core';
import { Color, Config, Mode, ScrollBaseDetail, ScrollDetail } from '../../interface';
export declare class Content implements ComponentInterface {
    private watchDog;
    private isScrolling;
    private lastScroll;
    private queued;
    private cTop;
    private cBottom;
    private scrollEl;
    private detail;
    mode: Mode;
    el: HTMLStencilElement;
    config: Config;
    queue: QueueApi;
    win: Window;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * If `true`, the content will scroll behind the headers
     * and footers. This effect can easily be seen by setting the toolbar
     * to transparent.
     */
    fullscreen: boolean;
    /**
     * If `true` and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
     * If the content exceeds the bounds of ionContent, nothing will change.
     * Note, the does not disable the system bounce on iOS. That is an OS level setting.
     */
    forceOverscroll?: boolean;
    /**
     * If you want to enable the content scrolling in the X axis, set this property to `true`.
     */
    scrollX: boolean;
    /**
     * If you want to disable the content scrolling in the Y axis, set this property to `false`.
     */
    scrollY: boolean;
    /**
     * Because of performance reasons, ionScroll events are disabled by default, in order to enable them
     * and start listening from (ionScroll), set this property to `true`.
     */
    scrollEvents: boolean;
    /**
     * Emitted when the scroll has started.
     */
    ionScrollStart: EventEmitter<ScrollBaseDetail>;
    /**
     * Emitted while scrolling. This event is disabled by default.
     * Look at the property: `scrollEvents`
     */
    ionScroll: EventEmitter<ScrollDetail>;
    /**
     * Emitted when the scroll has ended.
     */
    ionScrollEnd: EventEmitter<ScrollBaseDetail>;
    onNavChanged(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    private resize;
    private readDimensions;
    private onScroll;
    /**
     * Returns the element where the actual scrolling takes places.
     * This element is the one you could subscribe to `scroll` events or manually modify
     * `scrollTop`, however, it's recommended to use the API provided by `ion-content`:
     *
     * Ie. Using `ionScroll`, `ionScrollStart`, `ionScrollEnd` for scrolling events
     * and scrollToPoint() to scroll the content into a certain point.
     */
    getScrollElement(): Promise<HTMLElement>;
    /**
     * Scroll to the top of the component
     */
    scrollToTop(duration?: number): Promise<void>;
    /**
     * Scroll to the bottom of the component
     */
    scrollToBottom(duration?: number): Promise<void>;
    /**
     * Scroll by a specified X/Y distance in the component
     */
    scrollByPoint(x: number, y: number, duration: number): Promise<void>;
    /**
     * Scroll to a specified X/Y location in the component
     */
    scrollToPoint(x: number | undefined | null, y: number | undefined | null, duration?: number): Promise<void>;
    private onScrollStart;
    private onScrollEnd;
    hostData(): {
        class: {
            'content-sizing': boolean;
            'overscroll': boolean;
        } | {
            'content-sizing': boolean;
            'overscroll': boolean;
        };
        style: {
            '--offset-top': string;
            '--offset-bottom': string;
        };
    };
    render(): JSX.Element[];
}

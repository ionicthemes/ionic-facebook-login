import { ComponentInterface, EventEmitter, QueueApi } from '../../stencil.core';
import { BackButtonEvent, Config, RouterDirection, RouterEventDetail } from '../../interface';
export declare class Router implements ComponentInterface {
    private previousPath;
    private busy;
    private state;
    private lastState;
    private waitPromise?;
    el: HTMLElement;
    config: Config;
    queue: QueueApi;
    win: Window;
    /**
     * By default `ion-router` will match the routes at the root path ("/").
     * That can be changed when
     *
     */
    root: string;
    /**
     * The router can work in two "modes":
     * - With hash: `/index.html#/path/to/page`
     * - Without hash: `/path/to/page`
     *
     * Using one or another might depend in the requirements of your app and/or where it's deployed.
     *
     * Usually "hash-less" navigation works better for SEO and it's more user friendly too, but it might
     * requires additional server-side configuration in order to properly work.
     *
     * On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.
     *
     * By default, this property is `true`, change to `false` to allow hash-less URLs.
     */
    useHash: boolean;
    /**
     * Event emitted when the route is about to change
     */
    ionRouteWillChange: EventEmitter<RouterEventDetail>;
    /**
     * Emitted when the route had changed
     */
    ionRouteDidChange: EventEmitter<RouterEventDetail>;
    componentWillLoad(): Promise<void>;
    componentDidLoad(): void;
    protected onPopState(): Promise<boolean>;
    protected onBackButton(ev: BackButtonEvent): void;
    /**
     * Navigate to the specified URL.
     */
    push(url: string, direction?: RouterDirection): Promise<boolean>;
    /**
     * Go back to previous page in the window.history.
     */
    goBack(): Promise<void>;
    /** @internal */
    printDebug(): void;
    /** @internal */
    navChanged(intent: number): Promise<boolean>;
    private onRedirectChanged;
    private onRoutesChanged;
    private historyDirection;
    private writeNavStateRoot;
    private safeWriteNavState;
    private lock;
    private writeNavState;
    private setPath;
    private getPath;
    private routeChangeEvent;
}

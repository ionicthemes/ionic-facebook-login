import { ComponentInterface, QueueApi } from '../../stencil.core';
import { Config } from '../../interface';
export declare class App implements ComponentInterface {
    el: HTMLElement;
    win: Window;
    config: Config;
    queue: QueueApi;
    componentDidLoad(): void;
    hostData(): {
        class: {
            'ion-page': boolean;
            'force-statusbar-padding': boolean;
        };
    };
}

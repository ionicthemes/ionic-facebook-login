import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
export declare class FabList implements ComponentInterface {
    el: HTMLIonFabElement;
    /**
     * If `true`, the fab list will be show all fab buttons in the list.
     */
    activated: boolean;
    protected activatedChanged(activated: boolean): void;
    /**
     * The side the fab list will show on relative to the main fab button.
     */
    side: 'start' | 'end' | 'top' | 'bottom';
    hostData(): {
        class: {
            [x: string]: boolean;
            'fab-list-active': boolean;
        };
    };
    render(): JSX.Element;
}

import { ComponentInterface } from '../../stencil.core';
import { ComponentProps, NavComponent } from '../../interface';
export declare class NavPush implements ComponentInterface {
    el: HTMLElement;
    /**
     * Component to navigate to
     */
    component?: NavComponent;
    /**
     * Data you want to pass to the component as props
     */
    componentProps?: ComponentProps;
    push(): void;
}

import { ComponentInterface } from '../../stencil.core';
import { Mode } from '../../interface';
export declare class CardContent implements ComponentInterface {
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    hostData(): {
        class: import("../../interface").CssClassMap;
    };
}

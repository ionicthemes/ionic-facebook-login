import { ComponentInterface } from '../../stencil.core';
import { Mode } from '../../interface';
export declare class Header implements ComponentInterface {
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * If `true`, the header will be translucent.
     * Note: In order to scroll content behind the header, the `fullscreen`
     * attribute needs to be set on the content.
     */
    translucent: boolean;
    hostData(): {
        class: {};
    };
}

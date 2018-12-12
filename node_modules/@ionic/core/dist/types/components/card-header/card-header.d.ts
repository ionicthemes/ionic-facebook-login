import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Color, Mode } from '../../interface';
export declare class CardHeader implements ComponentInterface {
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * If `true`, the card header will be translucent.
     */
    translucent: boolean;
    hostData(): {
        class: {
            'card-header-translucent': boolean;
        } | {
            'card-header-translucent': boolean;
        };
    };
    render(): JSX.Element;
}

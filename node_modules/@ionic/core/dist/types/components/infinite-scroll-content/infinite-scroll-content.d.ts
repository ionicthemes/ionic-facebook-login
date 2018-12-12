import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Config, Mode, SpinnerTypes } from '../../interface';
export declare class InfiniteScrollContent implements ComponentInterface {
    mode: Mode;
    config: Config;
    /**
     * An animated SVG spinner that shows while loading.
     */
    loadingSpinner?: SpinnerTypes | null;
    /**
     * Optional text to display while loading.
     */
    loadingText?: string;
    componentDidLoad(): void;
    hostData(): {
        class: import("../../interface").CssClassMap;
    };
    render(): JSX.Element;
}

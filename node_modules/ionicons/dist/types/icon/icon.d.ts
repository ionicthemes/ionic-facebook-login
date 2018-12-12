import '../stencil.core';
export declare class Icon {
    private io?;
    el: HTMLElement;
    private svgContent?;
    private isVisible;
    isServer: boolean;
    resourcesUrl: string;
    doc: Document;
    win: any;
    /**
     * The color to use for the background of the item.
     */
    color?: string;
    /**
     * The mode determines which platform styles to use.
     * Possible values are: `"ios"` or `"md"`.
     */
    mode?: 'ios' | 'md';
    /**
     * Specifies the label to use for accessibility. Defaults to the icon name.
     */
    ariaLabel?: string;
    /**
     * Specifies which icon to use on `ios` mode.
     */
    ios?: string;
    /**
     * Specifies which icon to use on `md` mode.
     */
    md?: string;
    /**
     * Specifies which icon to use from the built-in set of icons.
     */
    name?: string;
    /**
     * Specifies the exact `src` of an SVG file to use.
     */
    src?: string;
    /**
     * A combination of both `name` and `src`. If a `src` url is detected
     * it will set the `src` property. Otherwise it assumes it's a built-in named
     * SVG and set the `name` property.
     */
    icon?: string;
    /**
     * The size of the icon.
     * Available options are: `"small"` and `"large"`.
     */
    size?: string;
    /**
     * If enabled, ion-icon will be loaded lazily when it's visible in the viewport.
     * Default, `false`.
     */
    lazy: boolean;
    componentWillLoad(): void;
    componentDidUnload(): void;
    private waitUntilVisible;
    loadIcon(): void;
    getUrl(): string | null;
    private getNamedUrl;
    hostData(): {
        'role': string;
        class: {};
    };
    render(): JSX.Element;
}

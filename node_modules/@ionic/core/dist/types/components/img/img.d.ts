import '../../stencil.core';
import { ComponentInterface, EventEmitter } from '../../stencil.core';
export declare class Img implements ComponentInterface {
    private io?;
    el: HTMLElement;
    loadSrc?: string;
    /**
     * This attribute defines the alternative text describing the image.
     * Users will see this text displayed if the image URL is wrong,
     * the image is not in one of the supported formats, or if the image is not yet downloaded.
     */
    alt?: string;
    /**
     * The image URL. This attribute is mandatory for the <img> element.
     */
    src?: string;
    srcChanged(): void;
    /** Emitted when the img src is loaded */
    ionImgDidLoad: EventEmitter<void>;
    componentDidLoad(): void;
    private addIO;
    private removeIO;
    render(): JSX.Element;
}

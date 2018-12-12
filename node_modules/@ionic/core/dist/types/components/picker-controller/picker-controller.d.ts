import { ComponentInterface } from '../../stencil.core';
import { OverlayController, PickerOptions } from '../../interface';
/** @internal */
export declare class PickerController implements ComponentInterface, OverlayController {
    doc: Document;
    /**
     * Create a picker overlay with picker options.
     */
    create(opts: PickerOptions): Promise<HTMLIonPickerElement>;
    /**
     * Dismiss the open picker overlay.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened picker overlay.
     */
    getTop(): Promise<HTMLIonPickerElement | undefined>;
}

import { ComponentInterface } from '../../stencil.core';
import { ComponentRef, OverlayController, PopoverOptions } from '../../interface';
export declare class PopoverController implements ComponentInterface, OverlayController {
    doc: Document;
    /**
     * Create a popover overlay with popover options.
     */
    create<T extends ComponentRef>(opts: PopoverOptions<T>): Promise<HTMLIonPopoverElement>;
    /**
     * Dismiss the open popover overlay.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened popover overlay.
     */
    getTop(): Promise<HTMLIonPopoverElement | undefined>;
}

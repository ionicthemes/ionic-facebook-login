import { ComponentInterface } from '../../stencil.core';
import { ComponentRef, ModalOptions, OverlayController } from '../../interface';
export declare class ModalController implements ComponentInterface, OverlayController {
    doc: Document;
    /**
     * Create a modal overlay with modal options.
     */
    create<T extends ComponentRef>(opts: ModalOptions<T>): Promise<HTMLIonModalElement>;
    /**
     * Dismiss the open modal overlay.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened modal overlay.
     */
    getTop(): Promise<HTMLIonModalElement | undefined>;
}

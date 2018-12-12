import { ComponentInterface } from '../../stencil.core';
import { OverlayController, ToastOptions } from '../../interface';
export declare class ToastController implements ComponentInterface, OverlayController {
    doc: Document;
    /**
     * Create a toast overlay with toast options.
     */
    create(opts?: ToastOptions): Promise<HTMLIonToastElement>;
    /**
     * Dismiss the open toast overlay.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened toast overlay.
     */
    getTop(): Promise<HTMLIonToastElement | undefined>;
}

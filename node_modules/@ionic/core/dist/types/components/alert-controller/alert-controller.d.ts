import { ComponentInterface } from '../../stencil.core';
import { AlertOptions, OverlayController } from '../../interface';
export declare class AlertController implements ComponentInterface, OverlayController {
    doc: Document;
    /**
     * Create an alert overlay with alert options
     */
    create(opts: AlertOptions): Promise<HTMLIonAlertElement>;
    /**
     * Dismiss the open alert overlay.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened alert overlay.
     */
    getTop(): Promise<HTMLIonAlertElement | undefined>;
}

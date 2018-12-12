import { ComponentInterface } from '../../stencil.core';
import { LoadingOptions, OverlayController } from '../../interface';
export declare class LoadingController implements ComponentInterface, OverlayController {
    doc: Document;
    /**
     * Create a loading overlay with loading options.
     */
    create(opts?: LoadingOptions): Promise<HTMLIonLoadingElement>;
    /**
     * Dismiss the open loading overlay.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened loading overlay.
     */
    getTop(): Promise<HTMLIonLoadingElement | undefined>;
}

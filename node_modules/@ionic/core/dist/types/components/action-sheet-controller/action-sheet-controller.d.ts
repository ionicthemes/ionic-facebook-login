import { ComponentInterface } from '../../stencil.core';
import { ActionSheetOptions, OverlayController } from '../../interface';
export declare class ActionSheetController implements ComponentInterface, OverlayController {
    doc: Document;
    /**
     * Create an action sheet overlay with action sheet options.
     */
    create(opts: ActionSheetOptions): Promise<HTMLIonActionSheetElement>;
    /**
     * Dismiss the open action sheet overlay.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened action sheet overlay.
     */
    getTop(): Promise<HTMLIonActionSheetElement | undefined>;
}

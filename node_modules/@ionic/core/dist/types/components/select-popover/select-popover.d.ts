import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Mode, SelectPopoverOption } from '../../interface';
export declare class SelectPopover implements ComponentInterface {
    mode: Mode;
    /** Header text for the popover */
    header?: string;
    /** Subheader text for the popover */
    subHeader?: string;
    /** Text for popover body */
    message?: string;
    /** Array of options for the popover */
    options: SelectPopoverOption[];
    onSelect(ev: any): void;
    render(): JSX.Element;
}

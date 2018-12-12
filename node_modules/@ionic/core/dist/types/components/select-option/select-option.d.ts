import { ComponentInterface, EventEmitter } from '../../stencil.core';
export declare class SelectOption implements ComponentInterface {
    private inputId;
    el: HTMLElement;
    /**
     * If `true`, the user cannot interact with the select option.
     */
    disabled: boolean;
    /**
     * If `true`, the element is selected.
     */
    selected: boolean;
    /**
     * The text value of the option.
     */
    value?: any | null;
    /**
     * Emitted when the select option loads.
     * @internal
     */
    ionSelectOptionDidLoad: EventEmitter<void>;
    /**
     * Emitted when the select option unloads.
     * @internal
     */
    ionSelectOptionDidUnload: EventEmitter<void>;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    hostData(): {
        'role': string;
        'id': string;
    };
}

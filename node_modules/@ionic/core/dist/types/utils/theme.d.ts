import { Color, CssClassMap, Mode, RouterDirection } from '../interface';
export declare function hostContext(selector: string, el: HTMLElement): boolean;
/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export declare function createColorClasses(color: Color | undefined | null): CssClassMap | undefined;
export declare function createThemedClasses(mode: Mode | undefined, name: string): CssClassMap;
export declare function getClassList(classes: string | (string | null | undefined)[] | undefined): string[];
export declare function getClassMap(classes: string | string[] | undefined): CssClassMap;
export declare function openURL(win: Window, url: string | undefined | null, ev: Event | undefined | null, direction: RouterDirection): Promise<boolean>;

import { Animation, MenuI } from '../../../interface';
/**
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
export declare function menuOverlayAnimation(AnimationC: Animation, _: HTMLElement, menu: MenuI): Promise<Animation>;

import { Animation, MenuI } from '../../../interface';
/**
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
export declare function menuRevealAnimation(AnimationC: Animation, _: HTMLElement, menu: MenuI): Promise<Animation>;

import { Animation } from '../../interface';
import { TransitionOptions } from '../transition';
export declare function shadow<T extends Element>(el: T): ShadowRoot | T;
export declare function iosTransitionAnimation(AnimationC: Animation, navEl: HTMLElement, opts: TransitionOptions): Promise<Animation>;

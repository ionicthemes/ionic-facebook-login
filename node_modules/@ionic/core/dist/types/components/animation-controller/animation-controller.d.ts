import { ComponentInterface } from '../../stencil.core';
import { Animation, AnimationBuilder, AnimationController, Config } from '../../interface';
/** @internal */
export declare class AnimationControllerImpl implements ComponentInterface, AnimationController {
    config: Config;
    /**
     * Creates an animation instance
     */
    create(animationBuilder?: AnimationBuilder, baseEl?: any, opts?: any): Promise<Animation>;
}

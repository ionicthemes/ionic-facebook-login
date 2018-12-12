import { Animator } from './animator';
export class AnimationControllerImpl {
    create(animationBuilder, baseEl, opts) {
        Animator.animated = this.config.getBoolean('animated', true);
        if (animationBuilder) {
            return animationBuilder(Animator, baseEl, opts);
        }
        return Promise.resolve(new Animator());
    }
    static get is() { return "ion-animation-controller"; }
    static get properties() { return {
        "config": {
            "context": "config"
        },
        "create": {
            "method": true
        }
    }; }
}

import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
export class LoadingController {
    create(opts) {
        return createOverlay(this.doc.createElement('ion-loading'), opts);
    }
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'ion-loading', id);
    }
    async getTop() {
        return getOverlay(this.doc, 'ion-loading');
    }
    static get is() { return "ion-loading-controller"; }
    static get properties() { return {
        "create": {
            "method": true
        },
        "dismiss": {
            "method": true
        },
        "doc": {
            "context": "document"
        },
        "getTop": {
            "method": true
        }
    }; }
}

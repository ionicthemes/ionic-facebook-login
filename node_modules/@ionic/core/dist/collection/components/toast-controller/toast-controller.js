import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
export class ToastController {
    create(opts) {
        return createOverlay(this.doc.createElement('ion-toast'), opts);
    }
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'ion-toast', id);
    }
    async getTop() {
        return getOverlay(this.doc, 'ion-toast');
    }
    static get is() { return "ion-toast-controller"; }
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

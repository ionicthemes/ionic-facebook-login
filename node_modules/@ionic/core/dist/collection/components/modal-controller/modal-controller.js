import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
export class ModalController {
    create(opts) {
        return createOverlay(this.doc.createElement('ion-modal'), opts);
    }
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'ion-modal', id);
    }
    async getTop() {
        return getOverlay(this.doc, 'ion-modal');
    }
    static get is() { return "ion-modal-controller"; }
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

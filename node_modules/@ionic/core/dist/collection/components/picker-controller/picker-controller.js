import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
export class PickerController {
    create(opts) {
        return createOverlay(this.doc.createElement('ion-picker'), opts);
    }
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'ion-picker', id);
    }
    async getTop() {
        return getOverlay(this.doc, 'ion-picker');
    }
    static get is() { return "ion-picker-controller"; }
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

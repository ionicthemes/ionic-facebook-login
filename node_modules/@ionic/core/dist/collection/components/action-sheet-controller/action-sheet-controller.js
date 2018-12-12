import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
export class ActionSheetController {
    create(opts) {
        return createOverlay(this.doc.createElement('ion-action-sheet'), opts);
    }
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'ion-action-sheet', id);
    }
    async getTop() {
        return getOverlay(this.doc, 'ion-action-sheet');
    }
    static get is() { return "ion-action-sheet-controller"; }
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

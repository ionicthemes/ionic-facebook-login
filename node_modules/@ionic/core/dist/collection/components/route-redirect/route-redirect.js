export class RouteRedirect {
    propDidChange() {
        this.ionRouteRedirectChanged.emit();
    }
    componentDidLoad() {
        this.ionRouteRedirectChanged.emit();
    }
    componentDidUnload() {
        this.ionRouteRedirectChanged.emit();
    }
    static get is() { return "ion-route-redirect"; }
    static get properties() { return {
        "from": {
            "type": String,
            "attr": "from",
            "watchCallbacks": ["propDidChange"]
        },
        "to": {
            "type": String,
            "attr": "to",
            "watchCallbacks": ["propDidChange"]
        }
    }; }
    static get events() { return [{
            "name": "ionRouteRedirectChanged",
            "method": "ionRouteRedirectChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
}

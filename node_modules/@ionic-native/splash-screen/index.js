var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { IonicNativePlugin, cordova } from '@ionic-native/core';
var SplashScreenOriginal = /** @class */ (function (_super) {
    __extends(SplashScreenOriginal, _super);
    function SplashScreenOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SplashScreenOriginal.prototype.show = function () { return cordova(this, "show", { "sync": true }, arguments); };
    SplashScreenOriginal.prototype.hide = function () { return cordova(this, "hide", { "sync": true }, arguments); };
    SplashScreenOriginal.pluginName = "SplashScreen";
    SplashScreenOriginal.plugin = "cordova-plugin-splashscreen";
    SplashScreenOriginal.pluginRef = "navigator.splashscreen";
    SplashScreenOriginal.repo = "https://github.com/apache/cordova-plugin-splashscreen";
    SplashScreenOriginal.platforms = ["Amazon Fire OS", "Android", "iOS", "Windows"];
    return SplashScreenOriginal;
}(IonicNativePlugin));
var SplashScreen = new SplashScreenOriginal();
export { SplashScreen };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL3NwbGFzaC1zY3JlZW4vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE9BQU8sOEJBQXNDLE1BQU0sb0JBQW9CLENBQUM7O0lBMkJ0QyxnQ0FBaUI7Ozs7SUFRakQsMkJBQUk7SUFTSiwyQkFBSTs7Ozs7O3VCQTdDTjtFQTRCa0MsaUJBQWlCO1NBQXRDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb3Jkb3ZhLCBJb25pY05hdGl2ZVBsdWdpbiwgUGx1Z2luIH0gZnJvbSAnQGlvbmljLW5hdGl2ZS9jb3JlJztcblxuXG4vKipcbiAqIEBuYW1lIFNwbGFzaCBTY3JlZW5cbiAqIEBkZXNjcmlwdGlvbiBUaGlzIHBsdWdpbiBkaXNwbGF5cyBhbmQgaGlkZXMgYSBzcGxhc2ggc2NyZWVuIGR1cmluZyBhcHBsaWNhdGlvbiBsYXVuY2guIFRoZSBtZXRob2RzIGJlbG93IGFsbG93cyBzaG93aW5nIGFuZCBoaWRpbmcgdGhlIHNwbGFzaHNjcmVlbiBhZnRlciB0aGUgYXBwIGhhcyBsb2FkZWQuXG4gKiBAdXNhZ2VcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IFNwbGFzaFNjcmVlbiB9IGZyb20gJ0Bpb25pYy1uYXRpdmUvc3BsYXNoLXNjcmVlbic7XG4gKlxuICogY29uc3RydWN0b3IocHJpdmF0ZSBzcGxhc2hTY3JlZW46IFNwbGFzaFNjcmVlbikgeyB9XG4gKlxuICogLi4uXG4gKlxuICogdGhpcy5zcGxhc2hTY3JlZW4uc2hvdygpO1xuICpcbiAqIHRoaXMuc3BsYXNoU2NyZWVuLmhpZGUoKTtcbiAqIGBgYFxuICovXG5AUGx1Z2luKHtcbiAgcGx1Z2luTmFtZTogJ1NwbGFzaFNjcmVlbicsXG4gIHBsdWdpbjogJ2NvcmRvdmEtcGx1Z2luLXNwbGFzaHNjcmVlbicsXG4gIHBsdWdpblJlZjogJ25hdmlnYXRvci5zcGxhc2hzY3JlZW4nLFxuICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2FwYWNoZS9jb3Jkb3ZhLXBsdWdpbi1zcGxhc2hzY3JlZW4nLFxuICBwbGF0Zm9ybXM6IFsnQW1hem9uIEZpcmUgT1MnLCAnQW5kcm9pZCcsICdpT1MnLCAnV2luZG93cyddXG59KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNwbGFzaFNjcmVlbiBleHRlbmRzIElvbmljTmF0aXZlUGx1Z2luIHtcblxuICAvKipcbiAgICogU2hvd3MgdGhlIHNwbGFzaHNjcmVlblxuICAgKi9cbiAgQENvcmRvdmEoe1xuICAgIHN5bmM6IHRydWVcbiAgfSlcbiAgc2hvdygpOiB2b2lkIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgc3BsYXNoc2NyZWVuXG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgc3luYzogdHJ1ZVxuICB9KVxuICBoaWRlKCk6IHZvaWQge1xuICB9XG5cbn1cbiJdfQ==
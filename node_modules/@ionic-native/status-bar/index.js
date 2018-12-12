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
import { IonicNativePlugin, cordova, cordovaPropertyGet, cordovaPropertySet } from '@ionic-native/core';
var StatusBarOriginal = /** @class */ (function (_super) {
    __extends(StatusBarOriginal, _super);
    function StatusBarOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusBarOriginal.prototype.overlaysWebView = function (doesOverlay) { return cordova(this, "overlaysWebView", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.styleDefault = function () { return cordova(this, "styleDefault", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.styleLightContent = function () { return cordova(this, "styleLightContent", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.styleBlackTranslucent = function () { return cordova(this, "styleBlackTranslucent", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.styleBlackOpaque = function () { return cordova(this, "styleBlackOpaque", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.backgroundColorByName = function (colorName) { return cordova(this, "backgroundColorByName", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.backgroundColorByHexString = function (hexString) { return cordova(this, "backgroundColorByHexString", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.hide = function () { return cordova(this, "hide", { "sync": true }, arguments); };
    StatusBarOriginal.prototype.show = function () { return cordova(this, "show", { "sync": true }, arguments); };
    Object.defineProperty(StatusBarOriginal.prototype, "isVisible", {
        get: function () { return cordovaPropertyGet(this, "isVisible"); },
        set: function (value) { cordovaPropertySet(this, "isVisible", value); },
        enumerable: true,
        configurable: true
    });
    StatusBarOriginal.pluginName = "StatusBar";
    StatusBarOriginal.plugin = "cordova-plugin-statusbar";
    StatusBarOriginal.pluginRef = "StatusBar";
    StatusBarOriginal.repo = "https://github.com/apache/cordova-plugin-statusbar";
    StatusBarOriginal.platforms = ["Android", "iOS", "Windows"];
    return StatusBarOriginal;
}(IonicNativePlugin));
var StatusBar = new StatusBarOriginal();
export { StatusBar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL3N0YXR1cy1iYXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE9BQU8sc0VBS04sTUFBTSxvQkFBb0IsQ0FBQzs7SUFpQ0csNkJBQWlCOzs7O0lBZ0I5QyxtQ0FBZSxhQUFDLFdBQW9CO0lBUXBDLGdDQUFZO0lBUVoscUNBQWlCO0lBUWpCLHlDQUFxQjtJQVFyQixvQ0FBZ0I7SUFhaEIseUNBQXFCLGFBQUMsU0FBaUI7SUFZdkMsOENBQTBCLGFBQUMsU0FBaUI7SUFRNUMsd0JBQUk7SUFRSix3QkFBSTswQkFwRkosZ0NBQVM7Ozs7Ozs7Ozs7O29CQTVDWDtFQXVDK0IsaUJBQWlCO1NBQW5DLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb3Jkb3ZhLFxuICBDb3Jkb3ZhUHJvcGVydHksXG4gIElvbmljTmF0aXZlUGx1Z2luLFxuICBQbHVnaW5cbn0gZnJvbSAnQGlvbmljLW5hdGl2ZS9jb3JlJztcblxuLyoqXG4gKiBAbmFtZSBTdGF0dXMgQmFyXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1hbmFnZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgbmF0aXZlIHN0YXR1cyBiYXIuXG4gKlxuICogUmVxdWlyZXMgQ29yZG92YSBwbHVnaW46IGBjb3Jkb3ZhLXBsdWdpbi1zdGF0dXNiYXJgLiBGb3IgbW9yZSBpbmZvLCBwbGVhc2Ugc2VlIHRoZSBbU3RhdHVzQmFyIHBsdWdpbiBkb2NzXShodHRwczovL2dpdGh1Yi5jb20vYXBhY2hlL2NvcmRvdmEtcGx1Z2luLXN0YXR1c2JhcikuXG4gKlxuICogQHVzYWdlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBTdGF0dXNCYXIgfSBmcm9tICdAaW9uaWMtbmF0aXZlL3N0YXR1cy1iYXInO1xuICpcbiAqIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RhdHVzQmFyOiBTdGF0dXNCYXIpIHsgfVxuICpcbiAqIC4uLlxuICpcbiAqIC8vIGxldCBzdGF0dXMgYmFyIG92ZXJsYXkgd2Vidmlld1xuICogdGhpcy5zdGF0dXNCYXIub3ZlcmxheXNXZWJWaWV3KHRydWUpO1xuICpcbiAqIC8vIHNldCBzdGF0dXMgYmFyIHRvIHdoaXRlXG4gKiB0aGlzLnN0YXR1c0Jhci5iYWNrZ3JvdW5kQ29sb3JCeUhleFN0cmluZygnI2ZmZmZmZicpO1xuICogYGBgXG4gKlxuICovXG5AUGx1Z2luKHtcbiAgcGx1Z2luTmFtZTogJ1N0YXR1c0JhcicsXG4gIHBsdWdpbjogJ2NvcmRvdmEtcGx1Z2luLXN0YXR1c2JhcicsXG4gIHBsdWdpblJlZjogJ1N0YXR1c0JhcicsXG4gIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vYXBhY2hlL2NvcmRvdmEtcGx1Z2luLXN0YXR1c2JhcicsXG4gIHBsYXRmb3JtczogWydBbmRyb2lkJywgJ2lPUycsICdXaW5kb3dzJ11cbn0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhdHVzQmFyIGV4dGVuZHMgSW9uaWNOYXRpdmVQbHVnaW4ge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgU3RhdHVzQmFyIGlzIGN1cnJlbnRseSB2aXNpYmxlIG9yIG5vdC5cbiAgICovXG4gIEBDb3Jkb3ZhUHJvcGVydHkoKVxuICBpc1Zpc2libGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHRoZSBzdGF0dXMgYmFyIG92ZXJsYXlzIHRoZSBtYWluIGFwcCB2aWV3LiBUaGUgZGVmYXVsdFxuICAgKiBpcyB0cnVlLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRvZXNPdmVybGF5ICBXaGV0aGVyIHRoZSBzdGF0dXMgYmFyIG92ZXJsYXlzIHRoZSBtYWluIGFwcCB2aWV3LlxuICAgKi9cbiAgQENvcmRvdmEoe1xuICAgIHN5bmM6IHRydWVcbiAgfSlcbiAgb3ZlcmxheXNXZWJWaWV3KGRvZXNPdmVybGF5OiBib29sZWFuKSB7fVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGRlZmF1bHQgc3RhdHVzYmFyIChkYXJrIHRleHQsIGZvciBsaWdodCBiYWNrZ3JvdW5kcykuXG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgc3luYzogdHJ1ZVxuICB9KVxuICBzdHlsZURlZmF1bHQoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGxpZ2h0Q29udGVudCBzdGF0dXNiYXIgKGxpZ2h0IHRleHQsIGZvciBkYXJrIGJhY2tncm91bmRzKS5cbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBzeW5jOiB0cnVlXG4gIH0pXG4gIHN0eWxlTGlnaHRDb250ZW50KCkge31cblxuICAvKipcbiAgICogVXNlIHRoZSBibGFja1RyYW5zbHVjZW50IHN0YXR1c2JhciAobGlnaHQgdGV4dCwgZm9yIGRhcmsgYmFja2dyb3VuZHMpLlxuICAgKi9cbiAgQENvcmRvdmEoe1xuICAgIHN5bmM6IHRydWVcbiAgfSlcbiAgc3R5bGVCbGFja1RyYW5zbHVjZW50KCkge31cblxuICAvKipcbiAgICogVXNlIHRoZSBibGFja09wYXF1ZSBzdGF0dXNiYXIgKGxpZ2h0IHRleHQsIGZvciBkYXJrIGJhY2tncm91bmRzKS5cbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBzeW5jOiB0cnVlXG4gIH0pXG4gIHN0eWxlQmxhY2tPcGFxdWUoKSB7fVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHN0YXR1cyBiYXIgdG8gYSBzcGVjaWZpYyBuYW1lZCBjb2xvci4gVmFsaWQgb3B0aW9uczpcbiAgICogYmxhY2ssIGRhcmtHcmF5LCBsaWdodEdyYXksIHdoaXRlLCBncmF5LCByZWQsIGdyZWVuLCBibHVlLCBjeWFuLCB5ZWxsb3csIG1hZ2VudGEsIG9yYW5nZSwgcHVycGxlLCBicm93bi5cbiAgICpcbiAgICogaU9TIG5vdGU6IHlvdSBtdXN0IGNhbGwgU3RhdHVzQmFyLm92ZXJsYXlzV2ViVmlldyhmYWxzZSkgdG8gZW5hYmxlIGNvbG9yIGNoYW5naW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3JOYW1lICBUaGUgbmFtZSBvZiB0aGUgY29sb3IgKGZyb20gYWJvdmUpXG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgc3luYzogdHJ1ZVxuICB9KVxuICBiYWNrZ3JvdW5kQ29sb3JCeU5hbWUoY29sb3JOYW1lOiBzdHJpbmcpIHt9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgc3RhdHVzIGJhciB0byBhIHNwZWNpZmljIGhleCBjb2xvciAoQ1NTIHNob3J0aGFuZCBzdXBwb3J0ZWQhKS5cbiAgICpcbiAgICogaU9TIG5vdGU6IHlvdSBtdXN0IGNhbGwgU3RhdHVzQmFyLm92ZXJsYXlzV2ViVmlldyhmYWxzZSkgdG8gZW5hYmxlIGNvbG9yIGNoYW5naW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyaW5nICBUaGUgaGV4IHZhbHVlIG9mIHRoZSBjb2xvci5cbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBzeW5jOiB0cnVlXG4gIH0pXG4gIGJhY2tncm91bmRDb2xvckJ5SGV4U3RyaW5nKGhleFN0cmluZzogc3RyaW5nKSB7fVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSBTdGF0dXNCYXJcbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBzeW5jOiB0cnVlXG4gIH0pXG4gIGhpZGUoKSB7fVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSBTdGF0dXNCYXJcbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBzeW5jOiB0cnVlXG4gIH0pXG4gIHNob3coKSB7fVxufVxuIl19
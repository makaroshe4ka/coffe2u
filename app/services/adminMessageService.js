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
define(["require", "exports", "../common/settings", "baseService"], function (require, exports, settings, BaseService) {
    "use strict";
    var AdminMessageService = (function (_super) {
        __extends(AdminMessageService, _super);
        function AdminMessageService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.load = function (data) {
                if (data === void 0) { data = undefined; }
                var template = { data: data, url: settings.Settings.apiUrls.getMessages };
                return _this.request(template);
            };
            return _this;
        }
        return AdminMessageService;
    }(BaseService));
    return new AdminMessageService;
});
//# sourceMappingURL=adminMessageService.js.map
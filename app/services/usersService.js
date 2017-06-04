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
    var UsersService = (function (_super) {
        __extends(UsersService, _super);
        function UsersService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.load = function (data) {
                if (data === void 0) { data = undefined; }
                var template = { data: data, url: settings.Settings.apiUrls.users };
                return _this.request(template);
            };
            _this.loadUserTypes = function () {
                var template = { url: settings.Settings.apiUrls.userTypes };
                return _this.request(template);
            };
            _this.updateUser = function (id, data) {
                var template = {
                    url: settings.Settings.apiUrls.updateUser + '\\' + id,
                    type: 'PUT',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.addUser = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.addUser,
                    type: 'POST',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.deleteUser = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.deleteUser,
                    type: 'DELETE',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.unassignUser = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.unassignUser,
                    type: 'DELETE',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            return _this;
        }
        return UsersService;
    }(BaseService));
    return new UsersService();
});
//# sourceMappingURL=usersService.js.map
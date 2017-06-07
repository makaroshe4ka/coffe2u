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
    var FranchiseesService = (function (_super) {
        __extends(FranchiseesService, _super);
        function FranchiseesService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.load = function (data) {
                if (data === void 0) { data = undefined; }
                var template = { data: data, url: settings.Settings.apiUrls.baseFranchiseesInfo };
                return _this.request(template);
            };
            _this.loadAllFranchisees = function (data) {
                if (data === void 0) { data = undefined; }
                var template = { data: data, url: settings.Settings.apiUrls.getAllFranchisees };
                return _this.request(template);
            };
            _this.loadFranchisee = function (id) {
                var template = { data: { id: id }, url: settings.Settings.apiUrls.getFranchisee };
                return _this.request(template);
            };
            _this.deleteFranchisee = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.deleteFranchisee,
                    type: 'DELETE',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.getFranchiseeStatuses = function () {
                var template = {
                    url: settings.Settings.apiUrls.getFranchiseeStatuses,
                    type: 'GET'
                };
                return _this.request(template);
            };
            _this.updateFranchisee = function (id, data) {
                var template = {
                    url: settings.Settings.apiUrls.updateFranchisee + '\\' + id,
                    type: 'PUT',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.addFranchisee = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.addFranchisee,
                    type: 'POST',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            return _this;
        }
        return FranchiseesService;
    }(BaseService));
    return new FranchiseesService();
});
//# sourceMappingURL=franchiseesService.js.map
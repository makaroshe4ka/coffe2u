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
    var VehicleService = (function (_super) {
        __extends(VehicleService, _super);
        function VehicleService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.load = function (data) {
                if (data === void 0) { data = undefined; }
                var template = { data: data, url: settings.Settings.apiUrls.vehicles };
                return _this.request(template);
            };
            _this.updateVehicle = function (id, data) {
                var template = {
                    url: settings.Settings.apiUrls.updateVehicle + '\\' + id,
                    type: 'PUT',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.addVehicle = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.addVehicle,
                    type: 'POST',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.deleteVehicle = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.deleteVehicle,
                    type: 'DELETE',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.unassignVehicle = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.unassignVehicle,
                    type: 'DELETE',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            return _this;
        }
        return VehicleService;
    }(BaseService));
    return new VehicleService();
});
//# sourceMappingURL=vehicleService.js.map
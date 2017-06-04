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
    var ProductsService = (function (_super) {
        __extends(ProductsService, _super);
        function ProductsService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getCategories = function (all, franchiseeId) {
                var template = {
                    data: { all: all, franchiseeId: franchiseeId },
                    url: settings.Settings.apiUrls.getCategories,
                    type: 'GET'
                };
                return _this.request(template);
            };
            _this.getGroups = function (categoryId) {
                var template = {
                    data: { id: categoryId },
                    url: settings.Settings.apiUrls.getGroups,
                    type: 'GET'
                };
                return _this.request(template);
            };
            _this.getItems = function (filter) {
                var template = {
                    data: { filter: filter },
                    url: settings.Settings.apiUrls.getItems,
                    type: 'GET'
                };
                return _this.request(template);
            };
            _this.addProduct = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.addProduct,
                    type: 'POST',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.updateProduct = function (id, data) {
                var template = {
                    url: settings.Settings.apiUrls.updateProduct + '\\' + id,
                    type: 'PUT',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.deleteProduct = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.removeProduct,
                    type: 'DELETE',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.addCategory = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.addCategory,
                    type: 'POST',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.deleteCategory = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.deleteCategory,
                    type: 'DELETE',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.updateCategory = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.updateCategory,
                    type: 'PUT',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.addGroup = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.addGroup,
                    type: 'POST',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.deleteGroup = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.deleteGroup,
                    type: 'DELETE',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            _this.updateGroup = function (data) {
                var template = {
                    url: settings.Settings.apiUrls.updateGroup,
                    type: 'PUT',
                    data: JSON.stringify(data)
                };
                return _this.request(template);
            };
            return _this;
        }
        return ProductsService;
    }(BaseService));
    return new ProductsService();
});
//# sourceMappingURL=productsService.js.map
define(["require", "exports", "knockout", "lodash", "../../../common/settings"], function (require, exports, ko, lodash, settings) {
    "use strict";
    var ProductViewModel = (function () {
        function ProductViewModel(addProductMode) {
            if (addProductMode === void 0) { addProductMode = false; }
            this.id = ko.observable();
            this.code = ko.observable().extend({ limitLength: 25 });
            this.name = ko.observable().extend({ limitLength: 25 });
            this.price1 = ko.observable().extend({ currency: true });
            this.price2 = ko.observable().extend({ currency: true });
            this.createdBy = ko.observable();
            this.selectedState = ko.observable();
            this.allStates = ko.observableArray();
            this.franchiseeId = ko.observable();
            this.addProductMode = addProductMode;
            this.allStates(settings.Settings.commonStatuses);
        }
        ProductViewModel.prototype.initialize = function () {
        };
        ProductViewModel.prototype.setProperties = function (entity) {
            var vm = this;
            vm.id(entity.id);
            vm.code(entity.code);
            vm.name(entity.name);
            vm.price1(entity.price1);
            vm.price2(entity.price2);
            vm.createdBy(entity.createdBy);
            vm.selectedState(entity.status);
            vm.franchiseeId(entity.franchiseeID);
        };
        ProductViewModel.prototype.isValidModel = function () {
            var rowForValidation = _.pick(this, ProductViewModel.VALIDATION_INCLUDED);
            var value = !_.some(rowForValidation, function (value) {
                var property = ko.unwrap(value);
                var isValid = lodash.isFunction(value.isValid) ? !value.isValid() : false;
                return lodash.isNil(property) || (property === "") || isValid;
            });
            if (this.price1() > this.price2()) {
                return false;
            }
            return value;
        };
        ProductViewModel.prototype.activate = function () {
            this.initialize();
        };
        return ProductViewModel;
    }());
    ProductViewModel.VALIDATION_INCLUDED = ['code', 'name', 'price1', 'price2'];
    return ProductViewModel;
});
//# sourceMappingURL=productViewModel.js.map
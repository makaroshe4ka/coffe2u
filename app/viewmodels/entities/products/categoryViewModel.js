define(["require", "exports", "knockout", "lodash"], function (require, exports, ko, lodash) {
    "use strict";
    var CategoryViewModel = (function () {
        function CategoryViewModel(addCategoryMode) {
            if (addCategoryMode === void 0) { addCategoryMode = false; }
            this.id = ko.observable();
            this.code = ko.observable().extend({ limitLength: 25 });
            this.name = ko.observable().extend({ limitLength: 25 });
            this.categoryStatus = 'update';
            this.franchiseeId = ko.observable();
            this.addCategoryMode = addCategoryMode;
        }
        CategoryViewModel.prototype.initialize = function () {
        };
        CategoryViewModel.prototype.setProperties = function (entity) {
            var vm = this;
            vm.id(entity.id);
            vm.code(entity.code);
            vm.name(entity.name);
            vm.franchiseeId(entity.franchiseeID);
        };
        CategoryViewModel.prototype.isValidModel = function () {
            var rowForValidation = _.pick(this, CategoryViewModel.VALIDATION_INCLUDED);
            var value = !_.some(rowForValidation, function (value) {
                var property = ko.unwrap(value);
                var isValid = lodash.isFunction(value.isValid) ? !value.isValid() : false;
                return lodash.isNil(property) || (property === "") || isValid;
            });
            return value;
        };
        CategoryViewModel.prototype.activate = function () {
            this.initialize();
        };
        return CategoryViewModel;
    }());
    CategoryViewModel.VALIDATION_INCLUDED = ['code', 'name'];
    return CategoryViewModel;
});
//# sourceMappingURL=categoryViewModel.js.map
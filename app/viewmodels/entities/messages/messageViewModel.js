define(["require", "exports", "knockout", "../../../services/usersService", "../../../services/franchiseesService", "lodash"], function (require, exports, ko, usersService, franchiseesService, lodash) {
    "use strict";
    var MessageViewModel = (function () {
        function MessageViewModel(addFranchiseeMode) {
            if (addFranchiseeMode === void 0) { addFranchiseeMode = false; }
            this.id = ko.observable();
            this.firstName = ko.observable().extend({ limitLength: 25 });
            this.lastName = ko.observable().extend({ limitLength: 25 });
            this.emailAddress = ko.observable().extend({ mail: true });
            this.franchiseeName = ko.observable();
            this.linkedTo = ko.observable();
            this.password = ko.observable().extend({ password: true });
            this.hidden = ko.observable();
            this.franchisees = ko.observableArray();
            this.selectedFranchisee = ko.observable();
            this.franchiseeID = ko.observable();
            this.userTypes = ko.observableArray();
            this.selectedUserType = ko.observable();
            this.userType = ko.observable();
            this.addFranchiseeMode = addFranchiseeMode;
        }
        MessageViewModel.prototype.initialize = function () {
            var _this = this;
            franchiseesService.load().then(function (data) {
                _this.franchisees(data);
                _this.setSelectedFranchisee();
            });
            usersService.loadUserTypes().then(function (data) {
                _this.userTypes(data);
                _this.setSelectedUserType();
            });
        };
        MessageViewModel.prototype.setSelectedUserType = function () {
            var _this = this;
            var selected = lodash.find(this.userTypes(), function (value) {
                return value.value === _this.userType();
            });
            this.selectedUserType(selected);
        };
        MessageViewModel.prototype.setSelectedFranchisee = function () {
            var _this = this;
            var selected = lodash.find(this.franchisees(), function (value) {
                return value.id === _this.franchiseeID();
            });
            this.selectedFranchisee(selected);
        };
        MessageViewModel.prototype.setProperties = function (entity) {
            var vm = this;
            vm.id(entity.id);
            vm.userType(entity.userType);
            vm.password(entity.password);
            vm.firstName(entity.firstName);
            vm.lastName(entity.lastName);
            vm.emailAddress(entity.emailAddress);
            vm.franchiseeName(entity.franchiseeName);
            vm.linkedTo(entity.userType);
            vm.hidden(entity.hidden);
            vm.franchiseeID(entity.franchiseeID);
        };
        MessageViewModel.prototype.isValidModel = function () {
            var rowForValidation = _.pick(this, MessageViewModel.VALIDATION_INCLUDED);
            var value = !_.some(rowForValidation, function (value) {
                var property = ko.unwrap(value);
                var isValid = lodash.isFunction(value.isValid) ? !value.isValid() : false;
                return lodash.isNil(property) || (property === "") || isValid;
            });
            return value;
        };
        MessageViewModel.prototype.activate = function () {
            this.initialize();
        };
        return MessageViewModel;
    }());
    MessageViewModel.VALIDATION_INCLUDED = ['firstName', 'lastName', 'emailAddress', 'password'];
    return MessageViewModel;
});
//# sourceMappingURL=messageViewModel.js.map
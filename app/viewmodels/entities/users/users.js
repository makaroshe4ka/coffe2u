define(["require", "exports", "knockout", "lodash", "../gridViewModel", "../../../viewModels/entities/users/userViewModel", "../../../common/settings", "../../../services/usersService"], function (require, exports, ko, lodash, gridViewmodel, userViewModel, settings, usersService) {
    "use strict";
    var Users = (function () {
        function Users() {
            var template = "entities/users/usersTemplate";
            var headerTemplate = settings.Settings.defaultHeaderTemplate;
            var filtersTemplate = settings.Settings.defaultFiltersTemplate;
            var templates = {
                rowTemplate: template,
                headerTemplate: headerTemplate,
                filtersTemplate: filtersTemplate
            };
            var entityName = 'пользователь';
            var headers = [
                { title: 'Код', fieldName: 'id', className: 'col-md-1' },
                { title: 'Имя', fieldName: 'firstName', className: 'col-md-2' },
                { title: 'Фамилия', fieldName: 'lastName', className: 'col-md-2' },
                { title: 'E-mail адрес', fieldName: 'emailAddress', className: 'col-md-2' },
                { title: 'Франшиза', fieldName: 'franchiseeName', className: 'col-md-2' },
                { title: 'Скрыт', fieldName: 'hidden', className: 'col-md-1' }
            ];
            this.users = ko.observableArray();
            this.users([
                { fieldName: 'isHidden', title: 'Со скрытыми пользователями', id: 1 },
                { fieldName: 'isHidden', title: 'Без скрытых пользователей', id: 0 }
            ]);
            var selectedFilterTitle = 'title';
            var selectedFilter = ko.observable();
            var filtersData = [
                {
                    entities: this.users,
                    selectedValue: selectedFilter,
                    selectedText: selectedFilterTitle
                }
            ];
            var callbacks = {
                getValues: this.getUsers,
                onRemove: this.removeUser,
                onUpdate: this.updateUser.bind(this),
                onAdd: this.addUser.bind(this)
            };
            this.gridConfig = new gridViewmodel(entityName, templates, filtersData, headers, callbacks, userViewModel, null);
        }
        Users.prototype.getUsers = function (filter) {
            return usersService.load(filter);
        };
        Users.prototype.updateUser = function (user) {
            var mappedEntity = this.mapToEntity(user);
            return usersService.updateUser(user.id, mappedEntity);
        };
        Users.prototype.mapToEntity = function (user) {
            var franchiseeId = lodash.isNil(user.selectedFranchisee) ? null : user.selectedFranchisee.id;
            return {
                userType: user.selectedUserType.value,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                franchiseeID: franchiseeId,
                hidden: user.hidden,
                password: user.password
            };
        };
        Users.prototype.addUser = function (user) {
            var mappedEntity = this.mapToEntity(user);
            return usersService.addUser(mappedEntity);
        };
        Users.prototype.removeUser = function (user) {
            return usersService.deleteUser(user.id);
        };
        return Users;
    }());
    return Users;
});
//# sourceMappingURL=users.js.map
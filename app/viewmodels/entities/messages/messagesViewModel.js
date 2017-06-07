define(["require", "exports", "knockout", "lodash", "../gridViewModel", "../../../viewModels/entities/users/userViewModel", "../../../common/settings", "../../../services/adminMessageService"], function (require, exports, ko, lodash, gridViewmodel, userViewModel, settings, usersService) {
    "use strict";
    var MessagesViewModel = (function () {
        function MessagesViewModel() {
            var template = "entities/messages/messagesTemplate";
            var headerTemplate = settings.Settings.defaultHeaderTemplate;
            var filtersTemplate = settings.Settings.defaultFiltersTemplate;
            var templates = {
                rowTemplate: template,
                headerTemplate: headerTemplate,
                filtersTemplate: filtersTemplate
            };
            var entityName = 'Сообщение администратора';
            var headers = [
                { title: 'Id сообщения', fieldName: 'id', className: 'col-md-1' },
                { title: 'Дата/Время', fieldName: 'modified', className: 'col-md-2' },
                { title: 'Кому', fieldName: 'userId', className: 'col-md-2' },
                { title: 'Сообщение', fieldName: 'message', className: 'col-md-2' }
            ];
            this.messages = ko.observableArray();
            var selectedFilterTitle = 'title';
            var selectedFilter = ko.observable();
            var filtersData = [];
            var callbacks = {
                getValues: this.getMessages,
                onRemove: this.removeUser,
                onUpdate: this.updateUser.bind(this),
                onAdd: this.addUser.bind(this)
            };
            this.gridConfig = new gridViewmodel(entityName, templates, filtersData, headers, callbacks, userViewModel, null);
        }
        MessagesViewModel.prototype.getMessages = function (filter) {
            var deffered = $.Deferred();
            usersService.load(filter).then(function (data) {
                deffered.resolve(data);
            });
            return deffered.promise();
        };
        MessagesViewModel.prototype.updateUser = function (user) {
            var mappedEntity = this.mapToEntity(user);
        };
        MessagesViewModel.prototype.mapToEntity = function (user) {
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
        MessagesViewModel.prototype.addUser = function (user) {
            var mappedEntity = this.mapToEntity(user);
        };
        MessagesViewModel.prototype.removeUser = function (user) {
        };
        return MessagesViewModel;
    }());
    return MessagesViewModel;
});
//# sourceMappingURL=messagesViewModel.js.map
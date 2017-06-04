import ko = require('knockout');
import lodash = require('lodash');
import gridViewmodel = require("../gridViewModel");
import userViewModel = require("../../../viewModels/entities/users/userViewModel");
import settings = require("../../../common/settings");
import jquery = require('jquery');
import usersService = require("../../../services/usersService");

import helper = require('../../../common/CsvDownloader');


class Users {

    public gridConfig: any;
    public users: KnockoutObservableArray<any>;
    public selectedUser: KnockoutObservable<any>;
    constructor() {
        let template: string = "entities/users/usersTemplate";
        let headerTemplate: string = settings.Settings.defaultHeaderTemplate;
        let filtersTemplate: string = settings.Settings.defaultFiltersTemplate;


        let templates: any = {
            rowTemplate: template,
            headerTemplate: headerTemplate,
            filtersTemplate: filtersTemplate
        }
        let entityName: string = 'пользователь';
        let headers: Array<any> = [
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
        let selectedFilterTitle = 'title';
        let selectedFilter = ko.observable();


        let filtersData = [
            {
                entities: this.users,
                selectedValue: selectedFilter,
                selectedText: selectedFilterTitle
            }
        ];

        let callbacks = {
            getValues: this.getUsers,
            onRemove: this.removeUser,
            onUpdate: (this.updateUser as any).bind(this),
            onAdd: (this.addUser as any).bind(this)
        }

        this.gridConfig = new gridViewmodel(entityName, templates, filtersData, headers, callbacks, userViewModel, null);
    }

    private getUsers(filter) {
        return usersService.load(filter);
    }
    public updateUser(user: any) {
        let mappedEntity = this.mapToEntity(user);
        return usersService.updateUser(user.id,mappedEntity);
    }
    public mapToEntity(user: any) {
        let franchiseeId = lodash.isNil(user.selectedFranchisee) ? null : user.selectedFranchisee.id;
        return {
            userType: user.selectedUserType.value,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            franchiseeID: franchiseeId,
            hidden: user.hidden,
            password: user.password
        }
    }

    public addUser(user: any) {
        let mappedEntity = this.mapToEntity(user);
        return usersService.addUser(mappedEntity);
    }
    private removeUser(user: any) {
        return usersService.deleteUser(user.id);
    }
}

export = Users;
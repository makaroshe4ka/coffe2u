import ko = require('knockout');
import lodash = require('lodash');
import gridViewmodel = require("../gridViewModel");
import userViewModel = require("../../../viewModels/entities/messages/messageViewModel");
import settings = require("../../../common/settings");
import jquery = require('jquery');
import usersService = require("../../../services/adminMessageService");

import helper = require('../../../common/CsvDownloader');


class MessagesViewModel {

    public gridConfig: any;
    public messages: KnockoutObservableArray<any>;

    constructor() {
        let template: string = "entities/messages/messagesTemplate";
        let headerTemplate: string = settings.Settings.defaultHeaderTemplate;
        let filtersTemplate: string = settings.Settings.defaultFiltersTemplate;


        let templates: any = {
            rowTemplate: template,
            headerTemplate: headerTemplate,
            filtersTemplate: filtersTemplate
        }
        let entityName: string = 'Сообщение администратора';
        let headers: Array<any> = [
            { title: 'Id сообщения', fieldName: 'id', className: 'col-md-2' },
            { title: 'Дата/Время', fieldName: 'modified', className: 'col-md-2' },
            { title: 'Кому', fieldName: 'userId', className: 'col-md-2' },
            { title: 'Сообщение', fieldName: 'message', className: 'col-md-3' }
        ];

        this.messages = ko.observableArray();
       
        let selectedFilterTitle = 'title';
        let selectedFilter = ko.observable();


        let filtersData = [];

        let callbacks = {
            getValues: this.getMessages,
            onRemove: this.removeUser,
            onUpdate: (this.updateUser as any).bind(this),
            onAdd: (this.addUser as any).bind(this)
        }

        this.gridConfig = new gridViewmodel(entityName, templates, filtersData, headers, callbacks, userViewModel, null);
    }

    private getMessages(filter) {
        let deffered = $.Deferred();
         usersService.load(filter).then((data) => {
            deffered.resolve(data);
        });
        return deffered.promise();

    }
    public updateUser(user: any) {
        let mappedEntity = this.mapToEntity(user);
      
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
  
    }
    private removeUser(user: any) {
       
    }
}

export = MessagesViewModel;
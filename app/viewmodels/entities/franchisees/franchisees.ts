import ko = require('knockout');
import lodash = require('lodash');
import gridViewmodel = require("../gridViewModel");
import settings = require("../../../common/settings");
import jquery = require('jquery');
import franchiseesService = require("../../../services/franchiseesService");
import linkBuilder = require("../../../common/linkBuilder");



class Franchisees {


    public gridConfig: any;
    public franchisees: KnockoutObservableArray<any>;
    public selectedFranchisee: KnockoutObservable<any>;
    public tableUsersTemplate: any;
    public tableVehiclesTemplate: any;
    public tableCategoriesTemplate: any;
    public addFranchiseeLink: string;

    constructor() {


        let template: string = "entities/franchisees/franchiseesTemplate";
        let headerTemplate: string = settings.Settings.defaultHeaderTemplate;
        let filtersTemplate: string = settings.Settings.defaultFiltersTemplate;
        let frahchisePreHeaderTemplate = 'entities/franchisees/franchiseePreHeaderTemplate';
        this.addFranchiseeLink = linkBuilder.hash(['franchisees']);

        let templates: any = {
            rowTemplate: template,
            headerTemplate: headerTemplate,
            filtersTemplate: filtersTemplate,
            preHeaderTemplate: frahchisePreHeaderTemplate
        }
        let entityName: string = 'франшиза';
        let headers: Array<any> = [
            { title: 'Код', fieldName: 'id', className: 'col-md-1' },
            { title: 'Название франшизы', fieldName: 'legalName', className: 'col-md-3' },
            { title: 'Номер франшизы', fieldName: 'codeNumber', className: 'col-md-2' },
            { title: 'Статус', fieldName: 'status', className: 'col-md-2' }
        ];

        this.franchisees = ko.observableArray();
        this.franchisees([

        ]);
        let selectedFilterTitle = 'title';
        let selectedFilter = ko.observable();
        this.tableUsersTemplate = {
            name: 'Операторы',
            headers: ['Код', 'Имя пользователя', 'Права пользователя'],
            contentTemplate: 'entities/templates/usersTemplate'
        };
        this.tableVehiclesTemplate = {
            name: 'Транспорт',
            headers: ['Код', 'Номерной знак','Статус'],
            contentTemplate: 'entities/templates/vehiclesTemplate'
        };

        this.tableCategoriesTemplate = {
            name: 'Категории',
            headers: ['Код', 'Имя'],
            contentTemplate: 'entities/templates/categoriesTemplate'
        };

        let callbacks = {
            getValues: (this.getFranchisees as any).bind(this),
            onRemove: this.removeFranchisee
    }
        
        this.gridConfig = new gridViewmodel(entityName, templates, null, headers, callbacks, null, null);
    }

    private getFranchisees(filter) {
        let deffered = $.Deferred();
        let global = this;
        franchiseesService.loadAllFranchisees(filter).then((data) => {
            _.forEach(data.items, (value) => {
                value.configureLink = linkBuilder.hash([{ 'franchisees': value.id }]);
                value.detailsOpened = ko.observable(false);
                value.switchDetail = global.switchDetails;
                value.status = lodash.find<any>(settings.Settings.commonStatuses, 'value', value.status - 1);
                _.forEach(value.vehicles, vehicle => {
                    vehicle.status = lodash.find<any>(settings.Settings.commonStatuses, 'value', vehicle.status - 1);
                });
            });
            deffered.resolve(data);
        });

        return deffered.promise();
    }

    public addFranchisee() {

        linkBuilder.navigate([{ 'addfranchisee': '' }]);
    }

    public switchDetails() {
        let context = (this as any);
        context.detailsOpened(!context.detailsOpened());
    }

    private removeFranchisee(data: any) {
        return franchiseesService.deleteFranchisee(data.id);
    }
}

export = Franchisees;
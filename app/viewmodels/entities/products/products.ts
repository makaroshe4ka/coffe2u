import ko = require('knockout');
import lodash = require('lodash');
import gridViewmodel = require("../gridViewModel");
import settings = require("../../../common/settings");
import jquery = require('jquery');
import productsService = require("../../../services/productsService");
import linkBuilder = require("../../../common/linkBuilder");
import ViewModel = require("../products/productViewModel");
import app = require("durandal/app");
import errorHandler = require("../../../common/errorHandler");


class Products {
    private currentCategory: KnockoutObservable<any>;
    private categories: KnockoutObservableArray<any>;
    private currentGroup: KnockoutObservable<any>;
    private groups: KnockoutObservableArray<any>;
    private codeGroupHeader: KnockoutObservable<string>;
    private nameGroupHeader: KnockoutObservable<string>;
    private gridConfig: any;
    private raiseUpdate: KnockoutObservable<boolean>;
    private additionFilter: any;
    private groupFranchisee: any;

    private groupName: KnockoutObservable<string>;

    private selectedOption = ko.observable<any>();

    public currentSelectedFranchisee: KnockoutComputed<string>;


    constructor() {
        this.currentCategory = ko.observable<any>();
        this.currentGroup = ko.observable<any>();
        this.categories = ko.observableArray<any>();
        this.groups = ko.observableArray<any>();
        this.getcategories();
        this.codeGroupHeader = ko.observable<string>();
        this.nameGroupHeader = ko.observable<string>();
        this.raiseUpdate = ko.observable<boolean>(false);

        this.groupFranchisee = ko.observableArray<any>();

        this.groupName = ko.observable<string>();
        let template: string = "entities/products/productsTemplate";
        let headerTemplate: string = settings.Settings.defaultHeaderTemplate;
        let filtersTemplate: string = settings.Settings.defaultFiltersTemplate;

        this.currentGroup.subscribe((group) => {
            this.codeGroupHeader( 'КОД');
            this.nameGroupHeader( 'НАЗВАНИЕ');
        });

        let templates: any = {
            rowTemplate: template,
            headerTemplate: headerTemplate,
            filtersTemplate: filtersTemplate
        }

        let entityName: string = 'товар';
        let headers: Array<any> = [
            { title: this.codeGroupHeader, fieldName: 'code', className: 'col-md-1' },
            { title: this.nameGroupHeader, fieldName: 'name', className: 'col-md-2' },


            { title: 'Цена 1', fieldName: 'price1', className: 'col-md-1' },
            { title: 'Цена 2', fieldName: 'price2', className: 'col-md-1' },
            { title: 'Прибыль', fieldName: 'money', className: 'col-md-1' },
            { title: 'Статус', fieldName: 'status', className: 'col-md-2' },
            { title: 'Сделано', fieldName: 'createdBy', className: 'col-md-2' }
        ];


        let selectedFilterTitle = 'title';
        let selectedFilter = ko.observable();



        let callbacks = {
            getValues: (this.getItems as any).bind(this),
            onRemove: this.removeItem,
            onUpdate: (this.updateItem as any).bind(this),
            onAdd: (this.addItem as any).bind(this)
        }

        this.gridConfig = new gridViewmodel(entityName, templates, null, headers, callbacks, ViewModel, this.raiseUpdate);


        productsService.getCategories(true, null).then((categories) => {
            let groupedByFranchisee = lodash.groupBy<any>(categories, x => {
                return x.franchiseeID;
            });




            _.forEach<any>(groupedByFranchisee, (value) => {
                value.franchiseeName =
                    _.first<any>(value).franchiseeName;
            });
            this.groupFranchisee(_.values(groupedByFranchisee));
        });



        this.currentSelectedFranchisee = ko.computed<string>(() => {
            let startWith = "Текущая франшиза: ";
            if (this.selectedOption()) {
                return startWith + this.selectedOption().franchiseeName;
            }
            if (this.currentCategory()) {
                return startWith + this.currentCategory().franchiseeName;
            }
            return startWith + "не выбрана";
        });

    }

    public getItems(filter) {
        let deffered = $.Deferred();

        if (_.isNil(this.additionFilter)) {
            return deffered.promise();
        }
        productsService.getItems(_.assign({}, this.additionFilter, filter)).then((data) => {

            _.forEach(data.items, (value) => {

                value.money = ko.computed(() => {
                    return (value.price2 - value.price1) + "$";
                });

                value.status = lodash.find<any>(settings.Settings.commonStatuses, 'value', value.status - 1);
            });
            deffered.resolve(data);
        });
        return deffered.promise();
    }



    private getExtendedFilter() {
        let filter: any;
        filter = {};
        filter.franchiseeId = this.currentCategory().franchiseeID;
        filter.categoryId = this.currentCategory().id;
        filter.groupId = this.currentGroup().id;
        return filter;
    }
    public removeItem(entity: any) {

        let deffered = $.Deferred();

        productsService.deleteProduct(entity.id).then(() => {
            deffered.resolve();
        });

        return deffered.promise();
    }
    public updateItem(entity: any) {
        let deffered = $.Deferred();
        var mapped = this.mapItemToEntity(entity);
        productsService.updateProduct(entity.id, mapped).then(result => {
            deffered.resolve(result);
        });
        return deffered.promise();
    }

    public addItem(entity: any) {

        let deffered = $.Deferred();

        var mapped = this.mapItemToEntity(entity) as any;

        mapped.groupId = this.currentGroup().id;
        mapped.franchiseeId = this.currentCategory().franchiseeID;
        productsService.addProduct(mapped).then(result => {
            deffered.resolve(result);
        });


        return deffered.promise();
    }

    private getcategories() {

        productsService.getCategories(false, null).then((categories) => {
            this.extendToViewModel(categories);
            this.categories(categories);
            this.setDefaultState(this.categories);
            this.currentCategory(lodash.first<any>(this.categories())); // should be inside initialize method
            this.getGroups(this.currentCategory().id).then(() => { this.updateGrid(this.getExtendedFilter()); });
        });
    }


    public changeFrahcnhisee(value: any) {
        this.getGroups(this.selectedOption().id).then(() => {



            let customFilter = {
                franchiseeId: value.franchiseeID,
                categoryId: value.id,
                groupId: this.currentGroup().id
            }

            this.updateGrid(customFilter);
        });
    }


    public addGroup() {

        if (_.isEmpty(this.groupName())) {
            return;
        }

        let config = {
            name: this.groupName(),
            categoryId: this.selectedOption().id
        }

        productsService.addGroup(config).then(() => {
            this.getGroups(this.selectedOption().id);
        });

    }

    public deleteGroup(group) {

        app.showMessage('Вы уверены,что хотите удалить данную группу? ','Удаление',["Да", "Нет"])
            .then((dialogResult) => {
                if (dialogResult === 'Да') {
                    productsService.deleteGroup(group.id).then(() => {
                        this.getGroups(this.selectedOption().id);
                    }).fail((ex) => {
                        errorHandler.onServiceError(ex);

                    });
                }
            });
    }




    private getGroups(categoryId: any) {
        return productsService.getGroups(categoryId).then((groups) => {
            this.extendToViewModel(groups);
            this.groups(groups);
            let first = this.setDefaultState(this.groups);
            this.currentGroup(first);

        });
    }

    private setDefaultState(data) {
        let first = lodash.first<any>(data());
        if (!_.isNil(first)) {
            first.active(true);
        }
        return first;
    }
    private extendToViewModel(data) {
        lodash.forEach(data, (val) => {
            val.active = ko.observable(false);
        });
    }


    public activate() {

    }
    public selectTab(category) {
        this.resetValues(this.categories);
        category.active(true);
        this.currentCategory(category);
        this.getGroups(this.currentCategory().id).then(() => { this.updateGrid(this.getExtendedFilter()); });
    }

    public selectGroup(group) {
        this.resetValues(this.groups);
        group.active(true);
        this.currentGroup(group);

        this.updateGrid(this.getExtendedFilter());


    }

    private resetValues(data) {
        _.each<any>(data(), (item) => {
            item.active(false);
        });
    }



    private updateGrid(filter: any) {
        if (_.isNil(filter)) {
            return;
        }

        this.additionFilter = this.getExtendedFilter();
        this.raiseUpdate(true);
    }


    public mapItemToEntity(item: any) {
        return {
            id: item.id,
            code: item.code,
            name: item.name,
            price1: item.price1,
            price2: item.price2,
            createdBy: item.createdBy,
            status: item.selectedState.value
        }
    }

}

export = Products;
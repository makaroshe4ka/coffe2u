import ko = require('knockout');
import lodash = require('lodash');
import $ = require('jquery');
import settings = require("../../common/settings");
import saveModal = require("../../common/modalTemplates/saveModal/saveModal");
import ViewModel = require("pageViewModel");
import errorHandler = require("../../common/errorHandler");
import app = require("durandal/app");
import csvHelper = require("../../common/csvDownloader");

class GridVM {

    public filters: KnockoutObservableArray<any>;
    public selectedCountItems: KnockoutObservable<number>;
    public totalItemsCount: KnockoutObservable<number>;
    public modalMessages: Array<string>;
    public currentEntity: string;
    public entityViewModel: any;
    public callbacks: any;
    public values: KnockoutObservableArray<any>;
    public pageSlide: KnockoutObservable<number>;
    public pagesCount: KnockoutComputed<any>;
    public searchText: KnockoutObservable<string>;

    public headers: KnockoutObservable<any>;
    public filtersTemplate: KnockoutObservable<string>;
    public headerTemplate: KnockoutObservable<string>;
    public template: KnockoutObservable<string>;
    public preHeaderTemplate: String;
    public preHeaderModel: any;
    public initiateUpdate: any; // determine concrete type!
    public currentPageIndex: KnockoutObservable<number>;
    public currentPage: KnockoutObservable<any>;
    public pages: KnockoutObservableArray<any>;
    public usePaging: boolean;
    public allPages: KnockoutComputed<any>;
    public countItems: Array<number>;

    constructor() {
        this.preHeaderModel = {
            onAdd: (this.onAdd as any).bind(this)
        };

        this.currentPage = ko.observable<any>();
        this.currentEntity = '';
        this.totalItemsCount = ko.observable<number>();
        this.modalMessages = new Array<string>();
        this.filters = ko.observableArray<any>();
        this.selectedCountItems = ko.observable<number>(settings.Settings.defaultCountItems);
        this.headers = ko.observableArray<any>();
        this.headerTemplate = ko.observable<string>();
        this.template = ko.observable<string>();
        this.currentPageIndex = ko.observable<number>(0);
        this.filtersTemplate = ko.observable<string>();
        this.pageSlide = ko.observable<number>(settings.Settings.defaultPageSlide);
        this.pagesCount = ko.computed(() => {
            return Math.ceil(this.totalItemsCount() / this.selectedCountItems()) || 1;
        });
        this.searchText = ko.observable<string>();
        this.pages = ko.observableArray<any>();
        this.usePaging = true;
        this.allPages = ko.pureComputed(() => {
            let pages = [];
            let pagesCount = Math.ceil(this.totalItemsCount() / this.selectedCountItems()) || 1;
            for (var i = 0; i < pagesCount; i++) {
                pages.push(new ViewModel.PageViewModel(i));
            }
            return pages;
        });
        this.values = ko.observableArray<any>();
        this.countItems = settings.Settings.countItems;
    }

    private initializeSubscribes() {
        this.selectedCountItems.subscribe(item => {
            if (item && this.totalItemsCount()) {
                this.currentPageIndex(0);
                let parametersForLoadValues = this.getParamtersForLoadValues();
                this.getValues(parametersForLoadValues, this.currentPage());
            }
        });
        if (!lodash.isNil(this.initiateUpdate)) {
            this.initiateUpdate.subscribe(value => {
                if (value === true) {
                    this.initiateUpdate(false);
                    this.currentPageIndex(0);
                    let parametersForLoadValues = this.getParamtersForLoadValues();
                    this.getValues(parametersForLoadValues, this.currentPage());
                }
            });
        }

    }

    private initializeFilterSubscribes() {
        this.filters.subscribe(items => {
            lodash.forEach(items, filter => {
                filter.selectedValue.subscribe(value => {
                    this.currentPageIndex(0);
                    let parametersForLoadValues = this.getParamtersForLoadValues();
                    this.getValues(parametersForLoadValues, this.currentPage());
                });
            });
        });
    }

    private getValues(filter: any, activePage: any) {
        this.callbacks.getValues(filter).done(response => {
            this.values.removeAll();
            if (!lodash.isEmpty(response.items)) {
                this.values(response.items);
                this.totalItemsCount(response.count);
                this.updatePages(activePage);
            } else {
                this.totalItemsCount(0);
                this.updatePages();
            }
        });
    }

    private updatePages(currentPage: any = undefined) {
        let pages = [];
        if (this.pagesCount()) {
            let pageFrom = Math.max(0, this.currentPageIndex() - this.pageSlide());
            let pageTo = Math.min(this.pagesCount(), this.currentPageIndex() + this.pageSlide());
            pageFrom = Math.max(0, Math.min(pageTo - 2 * this.pageSlide(), pageFrom));
            pageTo = Math.min(this.pagesCount(), Math.max(pageFrom + 2 * this.pageSlide(), pageTo));

            for (var i = pageFrom; i < pageTo; i++) {

                var page = new ViewModel.PageViewModel(i);
                if (currentPage && page.name === currentPage.name) {
                    page.isActive(true);
                }
                if (!currentPage && page.name === 1) {
                    page.isActive(true);
                }
                pages.push(page);
            }
        }
        this.pages(pages);
    }

    private getFirstPage = () => {

        let page = this.getPageByIndex(0);
        this.changePage(page);
    }
    private getLastPage = () => {
        var page = this.getPageByIndex(this.pagesCount() - 1);
        this.changePage(page);
    }

    private getPageByIndex = (index: number) => {
        var vm = this;
        return lodash.find(vm.allPages(), { 'value': index });
    }


    private changePage = (activePage: any) => {
        var vm = this;
        _.forEach(vm.pages(), page => {
            page.isActive(false);
        });

        this.usePaging = true;
        this.currentPage(activePage);
        this.currentPageIndex(activePage.value);
        this.getValues(this.getParamtersForLoadValues(), activePage);
    }


    private onAdd() {

        var viewModel = new this.entityViewModel(false);

        var dialog = new saveModal('Добавить новую запись -  ' + this.currentEntity, viewModel);
        dialog.show().then((status, entity) => {
            if (status === 'save') {
                this.callbacks.onAdd(ko.toJS(entity)).then(() => {
                    this.getValues(this.getParamtersForLoadValues(), this.currentPage());
                });
            }
        });
    }

    private onRemove = (value) => {
        var vm = this;
        app.showMessage('Вы уверены,что хотите удалить запись - ' + vm.currentEntity + '?',
            'Удалить запись - ' + vm.currentEntity, ["Да", "Нет"])
            .then((dialogResult) => {
                if (dialogResult === 'Да') {
                    vm.callbacks.onRemove(value).done( () => {
                        vm.getValues(vm.getParamtersForLoadValues(), vm.currentPage());
                    }).fail((ex) => {
                        errorHandler.onServiceError(ex);

                    });
                }
            });
    }

    private onSort = (value) => {
        var vm = this;
        if (!value.fieldName) {
            return;
        }

        if (value.isSort()) {
            value.isAsc(!value.isAsc());
        } else {
            _.forEach(vm.headers(), header => {
                header.isSort(false);
                header.isAsc(false);
            });
            value.isSort(true);
            value.isAsc(true);
        }
        vm.getValues(vm.getParamtersForLoadValues(), vm.currentPage());
    }
    private onSearch = text => {
        var vm = this;
        if (text) {
            vm.usePaging = false;
            vm.getValues(vm.getParamtersForLoadValues(), vm.currentPage());
        }
    }


    private getNextPage = () => {
        var vm = this;
        if (vm.hasNextPage()) {
            var page = vm.getPageByIndex(vm.currentPageIndex() + 1);
            vm.changePage(page);
        }

    }
    private getPrevPage = () => {
        if (this.hasPrevPage()) {
            var page = this.getPageByIndex(this.currentPageIndex() - 1);
            this.changePage(page);
        }

    }
    private hasPrevPage = () => {

        if (!this.currentPageIndex()) {
            return false;
        }
        return this.currentPageIndex() > 0;
    }

    private hasNextPage = () => {
        var vm = this;
        return vm.currentPageIndex() + 1 < vm.pagesCount();
    }


    private getParamtersForLoadValues() {
        var vm = this;
        var sortedHeader = lodash.filter<any>(vm.headers(), header => {
            return header.isSort() === true;
        });

        var requestData = {
            searchContent: this.searchText(),
            from: this.usePaging ? vm.currentPageIndex() * vm.selectedCountItems() : 0,
            count: vm.selectedCountItems(),
        } as any;
        let filtered = lodash.filter<any,any>(vm.filters(), filter => {
            return  filter.selectedValue();
        });
        var filters = lodash.map<any, any>(filtered, value => {
            var testObj = {};
            testObj[value.selectedValue().fieldName] = value.selectedValue().id;
            return testObj;
        });

        _.forEach(filters, filter => {
            requestData = lodash.assign(filter, requestData);
        });


        if (sortedHeader.length !== 0) {
            requestData.sortBy = sortedHeader[0].fieldName;
            requestData.IsAscending = sortedHeader[0].isAsc();
        }
        return requestData;
    }

    private onConfig = (entity) => {
        return this.callbacks.onConfig(entity);
    }

    private onConfigIcon = (entity) => {
        this.callbacks.onConfigIcon(entity).then(() => {
            this.getValues(this.getParamtersForLoadValues(), this.currentPage());
        });
    }

    private showField = (field: any, fieldName: any) => {
        this.callbacks.onShowField(field, fieldName);
    }
    private getIcon = (entity) => {
        return this.callbacks.getIcon(entity);
    }

    private updateCheckbox = (value) => {
        this.callbacks.onUpdate(value).done(() => {
            this.getValues(this.getParamtersForLoadValues(), this.currentPage());
        });
    }

    private updateCheckboxList = (active) => {
        this.callbacks.updateCheckboxList(active).done(() => {
            this.getValues(this.getParamtersForLoadValues(), this.currentPage());
        });
    }

    private onUpdate = (value: any) => {
        let viewModel = new this.entityViewModel(false);
        viewModel.setProperties(value);
        let dialog = new saveModal('Обновить запись - ' + this.currentEntity, viewModel);
        dialog.show().then((status, entity) => {
            if (status === 'save') {
                let resultEntity = ko.toJS(entity);
                resultEntity.id = value.id;
                this.callbacks.onUpdate(resultEntity).done(() => {
                    this.getValues(this.getParamtersForLoadValues(), this.currentPage);

                }).fail(ex => {
                    errorHandler.onServiceError(ex);
                });
            }
        });
    }

    public downloadCSV() {
        if (this.values()) {
            csvHelper.downloadCsv(this.values());
        }
    }

    public activate = (activationData: any) => {
        if (!activationData.options) {
            return;
        }
        if (activationData.options.templates.preHeaderTemplate) {
            this.preHeaderTemplate = activationData.options.templates.preHeaderTemplate;
        }
        if (activationData.options.templates.preHeaderModel) {
            this.preHeaderModel = activationData.options.templates.preHeaderModel;
        }
        if (activationData.options.initiateUpdate) {
            this.initiateUpdate = activationData.options.initiateUpdate;
        }
        this.initializeFilterSubscribes();
        this.template(activationData.options.templates.rowTemplate);
        this.headerTemplate(activationData.options.templates.headerTemplate);
        this.filtersTemplate = activationData.options.templates.filtersTemplate || [];
        this.headers(activationData.options.headers);
        this.callbacks = activationData.options.callbacks;
        this.entityViewModel = activationData.options.entityViewModel;
        this.currentEntity = activationData.options.entityName;
        this.modalMessages = activationData.options.modalMessages || {};

        let filters = activationData.options.filters || [];
        lodash.forEach(filters, filter => {
            filter.entities.sort((left, right) => {
                return left.title > right.title ? 1 : -1;
            });
        });
        this.filters(filters);

        this.initializeSubscribes();
        let parametersForLoadValues = this.getParamtersForLoadValues();
        this.getValues(parametersForLoadValues, this.currentPage());

    };

    private isNill = (object: any) => { return lodash.isNull(object); }
}

export = GridVM;
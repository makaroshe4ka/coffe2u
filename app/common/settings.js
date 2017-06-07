define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Settings = (function () {
        function Settings() {
        }
        return Settings;
    }());
    Settings.countItems = [5, 10, 15, 20, 30, 40];
    Settings.defaultPageSlide = 3;
    Settings.defaultCountItems = 30;
    Settings.defaultPreHeaderTemplate = 'entities/defaultPreHeaderTemplate';
    Settings.emptyPreHeaderTemplate = 'entities/emptyPreHeaderTemplate';
    Settings.defaultHeaderTemplate = 'entities/defaultHeaderTemplate';
    Settings.defaultFiltersTemplate = 'entities/filterViewModel';
    Settings.outputTypes = ['smallmoney', 'money', 'real', 'float', 'tinyint', 'smallint', 'int', 'bigint'];
    Settings.commonStatuses = [
        { typeName: 'Активно', value: 1, style: 'label label-sm label-success' },
        { typeName: 'Пауза', value: 2, style: 'label label label-warning' },
        { typeName: 'Приостановлено', value: 3, style: 'label label-sm label-danger' }
    ];
    Settings.apiUrls = {
        users: 'api/Users/GetUsers',
        userTypes: 'api/Users/GetUserTypes',
        addUser: 'api/Users/AddUser',
        deleteUser: 'api/Users/DeleteUser',
        unassignUser: 'api/Users/UnassignUser',
        updateUser: 'api/Users/UpdateUser',
        getCsv: 'api/Users/GetCsv',
        baseFranchiseesInfo: 'api/Franchisees/GetBaseInfo',
        getAllFranchisees: 'api/Franchisees/GetAllFranchisees',
        getFranchisee: 'api/Franchisees/GetFranchisee',
        getFranchiseeStatuses: 'api/Franchisees/GetFranchiseeStatuses',
        addFranchisee: 'api/Franchisees/AddFranchisee',
        updateFranchisee: 'api/Franchisees/UpdateFranchisee',
        deleteFranchisee: 'api/Franchisees/DeleteFranchisee',
        vehicles: 'api/Vehicles/GetVehicles',
        addVehicle: 'api/Vehicles/AddVehicle',
        deleteVehicle: 'api/Vehicles/DeleteVehicle',
        unassignVehicle: 'api/Users/UnassignVehicle',
        updateVehicle: 'api/Vehicles/UpdateVehicle',
        getCategories: 'api/Categories/GetAll',
        getGroups: 'api/Groups/GetByCategoryId',
        getItems: 'api/Groups/GetItems',
        addProduct: 'api/Items/AddItem',
        updateProduct: 'api/Items/UpdateItem',
        removeProduct: 'api/Items/Remove',
        addCategory: 'api/Category/Add',
        deleteCategory: 'api/Category/Delete',
        updateCategory: 'api/Category/Update',
        addGroup: 'api/Group/Add',
        deleteGroup: 'api/Group/Delete',
        updateGroup: 'api/Group/Update',
        getMessages: 'api/messages/get'
    };
    exports.Settings = Settings;
});
//# sourceMappingURL=settings.js.map
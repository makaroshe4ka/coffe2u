export class Settings {
    static countItems = [5, 10, 15, 20, 30, 40];
    static defaultPageSlide = 3;
    static defaultCountItems = 30;
    static defaultPreHeaderTemplate = 'entities/defaultPreHeaderTemplate';
    static emptyPreHeaderTemplate = 'entities/emptyPreHeaderTemplate';
    static defaultHeaderTemplate = 'entities/defaultHeaderTemplate';
    static defaultFiltersTemplate = 'entities/filterViewModel';
    static outputTypes = ['smallmoney', 'money', 'real', 'float', 'tinyint', 'smallint', 'int', 'bigint'];
    static commonStatuses = [
        { typeName: 'Активно', value: 1, style: 'label label-sm label-success' },
        { typeName: 'Пауза', value: 2, style: 'label label label-warning' },
        { typeName: 'Приостановлено', value: 3, style: 'label label-sm label-danger' }
    ];
    static apiUrls = {
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
        updateGroup: 'api/Group/Update'
    }
}
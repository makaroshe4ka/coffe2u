import settings = require("../common/settings");
import BaseService = require("baseService");

class ProductsService extends BaseService {
   

    public getCategories = (all,franchiseeId) => {
        let template = {
            data: { all:all,franchiseeId: franchiseeId },
            url: settings.Settings.apiUrls.getCategories,
            type: 'GET'
        }
        return this.request(template);
    }
    public getGroups = (categoryId) => {
        let template = {
            data: {id: categoryId },
            url: settings.Settings.apiUrls.getGroups,
            type: 'GET'
        }
        return this.request(template);
    }
    public getItems = (filter) => {
        let template = {
            data: { filter: filter },
            url: settings.Settings.apiUrls.getItems,
            type: 'GET'
        }
        return this.request(template);
    }
    public addProduct = (data) => {
        let template = {
            url: settings.Settings.apiUrls.addProduct,
            type: 'POST',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public updateProduct = (id, data) => {
        let template = {
            url: settings.Settings.apiUrls.updateProduct + '\\' + id,
            type: 'PUT',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public deleteProduct = (data) => {
        let template = {
            url: settings.Settings.apiUrls.removeProduct,
            type: 'DELETE',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }

    public addCategory = (data) => {
        let template = {
            url: settings.Settings.apiUrls.addCategory,
            type: 'POST',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }

    public deleteCategory = (data) => {
        let template = {
            url: settings.Settings.apiUrls.deleteCategory,
            type: 'DELETE',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public updateCategory = (data) => {
        let template = {
            url: settings.Settings.apiUrls.updateCategory,
            type: 'PUT',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }


    public addGroup = (data) => {
        let template = {
            url: settings.Settings.apiUrls.addGroup,
            type: 'POST',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }

    public deleteGroup = (data) => {
        let template = {
            url: settings.Settings.apiUrls.deleteGroup,
            type: 'DELETE',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public updateGroup = (data) => {
        let template = {
            url: settings.Settings.apiUrls.updateGroup,
            type: 'PUT',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }

}

export = new ProductsService();
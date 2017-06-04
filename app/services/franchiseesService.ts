import settings = require("../common/settings");
import BaseService = require("baseService");

class FranchiseesService extends BaseService {
    public load = (data = undefined) => {
        let template = { data: data, url: settings.Settings.apiUrls.baseFranchiseesInfo };
        return this.request(template);
    }
    public loadAllFranchisees = (data = undefined) => {
        let template = { data: data, url: settings.Settings.apiUrls.getAllFranchisees };
        return this.request(template);
    }
    public loadFranchisee = (id: number) => {
    
        let template = { data: {id: id}, url: settings.Settings.apiUrls.getFranchisee};
        return this.request(template);
    }
    public deleteFranchisee = (data) => {
        let template = {
            url: settings.Settings.apiUrls.deleteFranchisee,
            type: 'DELETE',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public getFranchiseeStatuses = () => {
        let template = {
            url: settings.Settings.apiUrls.getFranchiseeStatuses,
            type: 'GET'
        }
        return this.request(template);
    }
    public updateFranchisee = (id, data) => {
        let template = {
            url: settings.Settings.apiUrls.updateFranchisee + '\\' + id,
            type: 'PUT',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public addFranchisee = (data) => {
        let template = {
            url: settings.Settings.apiUrls.addFranchisee,
            type: 'POST',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }

}

export = new FranchiseesService();
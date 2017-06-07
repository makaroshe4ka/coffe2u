import settings = require("../common/settings");
import BaseService = require("baseService");

class UsersService extends BaseService {
    public load = (data = undefined) => {
        let template = { data: data, url: settings.Settings.apiUrls.users };
        return this.request(template);
    }
    public loadUserTypes = () => {
        let template = { url: settings.Settings.apiUrls.userTypes };
        return this.request(template);
    }
    public updateUser = (id, data) => {
        let template = {
            url: settings.Settings.apiUrls.updateUser + '\\' + id,
            type: 'PUT',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public addUser = (data) => {
        let template = {
            url: settings.Settings.apiUrls.addUser,
            type: 'POST',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public deleteUser = (data) => {
        let template = {
            url: settings.Settings.apiUrls.deleteUser,
            type: 'DELETE',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public unassignUser = (data) => {
        let template = {
            url: settings.Settings.apiUrls.unassignUser,
            type: 'DELETE',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }

  

}

export = new UsersService();
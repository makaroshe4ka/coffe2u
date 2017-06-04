import settings = require("../common/settings");
import BaseService = require("baseService");

class VehicleService extends BaseService {
    public load = (data = undefined) => {
        let template = { data: data, url: settings.Settings.apiUrls.vehicles };
        return this.request(template);
    }
    public updateVehicle = (id, data) => {
        let template = {
            url: settings.Settings.apiUrls.updateVehicle + '\\' + id,
            type: 'PUT',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public addVehicle = (data) => {
        let template = {
            url: settings.Settings.apiUrls.addVehicle,
            type: 'POST',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public deleteVehicle = (data) => {
        let template = {
            url: settings.Settings.apiUrls.deleteVehicle,
            type: 'DELETE',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }
    public unassignVehicle = (data) => {
        let template = {
            url: settings.Settings.apiUrls.unassignVehicle,
            type: 'DELETE',
            data: JSON.stringify(data)
        }
        return this.request(template);
    }

}

export = new VehicleService();
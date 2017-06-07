import settings = require("../common/settings");
import BaseService = require("baseService");

class AdminMessageService extends BaseService {
    public load = (data = undefined) => {
        let template = { data: data, url: settings.Settings.apiUrls.getMessages };
        return this.request(template);
    }
    



}

export = new AdminMessageService;
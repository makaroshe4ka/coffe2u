import $ = require('jquery');
import lodash = require('lodash');
import errorHandler = require("../common/errorHandler");

class BaseService {
    private deafultOptions: any;
    constructor() {
        this.deafultOptions = {
            async: true,
            type: 'GET',
            contentType: 'application/json',
            data: {},
            dataType: 'json',
            responseType: 'json',
            cache: false
        }
    }

    protected request = (options) => {
        let deffered: JQueryDeferred<any> = $.Deferred();
        let extendOptions = this.extendOptions(options, deffered);
        $.ajax(extendOptions);
        return deffered.promise();
    }

    private extendOptions = (options: any, deffered: JQueryDeferred<any>) => {
        let requestOptions:any = lodash.assign({}, this.deafultOptions, options);
        requestOptions.url = '../' + requestOptions.url;
        requestOptions.success = this.successCallback(deffered,options.success);
        requestOptions.error = this.errorCallback(deffered, options.error);

        if (requestOptions.isJSON) {
            requestOptions.contentType = 'application/json';
            if (requestOptions.data) {
                requestOptions.data = JSON.stringify(requestOptions.data);

            }
        }
        return requestOptions;
    }

    private successCallback = (deffered: JQueryDeferred<any>, callback) => {
        return (data, status, jqXhr) => {
            if (lodash.isFunction(callback)) {
                callback(data, status, jqXhr);
            }
            deffered.resolve(data);
        }
    }
    private errorCallback = (deffered: JQueryDeferred<any>, callback: any) => {
        return (jqXhr, status,text) => {
            if (lodash.isFunction(callback)) {
                callback(jqXhr, status, text);
            } else {
                errorHandler.onServiceError(jqXhr);
            }
            deffered.reject(jqXhr, status, text);
        }
    }
}

export = BaseService;
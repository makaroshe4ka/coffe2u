define(["require", "exports", "jquery", "lodash", "../common/errorHandler"], function (require, exports, $, lodash, errorHandler) {
    "use strict";
    var BaseService = (function () {
        function BaseService() {
            var _this = this;
            this.request = function (options) {
                var deffered = $.Deferred();
                var extendOptions = _this.extendOptions(options, deffered);
                $.ajax(extendOptions);
                return deffered.promise();
            };
            this.extendOptions = function (options, deffered) {
                var requestOptions = lodash.assign({}, _this.deafultOptions, options);
                requestOptions.url = '../' + requestOptions.url;
                requestOptions.success = _this.successCallback(deffered, options.success);
                requestOptions.error = _this.errorCallback(deffered, options.error);
                if (requestOptions.isJSON) {
                    requestOptions.contentType = 'application/json';
                    if (requestOptions.data) {
                        requestOptions.data = JSON.stringify(requestOptions.data);
                    }
                }
                return requestOptions;
            };
            this.successCallback = function (deffered, callback) {
                return function (data, status, jqXhr) {
                    if (lodash.isFunction(callback)) {
                        callback(data, status, jqXhr);
                    }
                    deffered.resolve(data);
                };
            };
            this.errorCallback = function (deffered, callback) {
                return function (jqXhr, status, text) {
                    if (lodash.isFunction(callback)) {
                        callback(jqXhr, status, text);
                    }
                    else {
                        errorHandler.onServiceError(jqXhr);
                    }
                    deffered.reject(jqXhr, status, text);
                };
            };
            this.deafultOptions = {
                async: true,
                type: 'GET',
                contentType: 'application/json',
                data: {},
                dataType: 'json',
                responseType: 'json',
                cache: false
            };
        }
        return BaseService;
    }());
    return BaseService;
});
//# sourceMappingURL=baseService.js.map
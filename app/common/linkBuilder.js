define(["require", "exports", "plugins/router", "lodash"], function (require, exports, router, lodash) {
    "use strict";
    var LinkBuilder = (function () {
        function LinkBuilder() {
        }
        LinkBuilder.prototype.hash = function (params, query) {
            if (query === void 0) { query = undefined; }
            var that = this;
            var keys = [];
            var paramsObj = {};
            lodash.forEach(params, function (item) {
                lodash.forEach(item, function (val, key) {
                    paramsObj[key] = val;
                    keys.push(key);
                });
            });
            var result = lodash.map(keys, function (key) {
                return key + "/" + paramsObj[key];
            });
            var paramsStr = "#" + result.join("/");
            if (_.isObject(query)) {
                query = [query];
            }
            if (_.isUndefined(query) || !_.isArray(query) || !query.length) {
                return paramsStr;
            }
            var queryArr = [];
            lodash.forEach(query, function (obj) {
                lodash.forEach(obj, function (val, key) {
                    queryArr.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
                });
            });
            var resultHash = paramsStr + '?' + queryArr.join('&');
            return resultHash;
        };
        LinkBuilder.prototype.navigate = function (params, query, options) {
            if (query === void 0) { query = undefined; }
            if (options === void 0) { options = undefined; }
            var that = this;
            var hashStr = that.hash(params, query);
            return router.navigate(hashStr, options);
        };
        return LinkBuilder;
    }());
    return new LinkBuilder();
});
//# sourceMappingURL=linkBuilder.js.map
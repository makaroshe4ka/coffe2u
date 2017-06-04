import router = require('plugins/router');
import lodash = require('lodash');


class LinkBuilder {
    public hash(params, query = undefined) {
        let that = this;
        let keys = [];
        let paramsObj = {}
        lodash.forEach(params, item  => {
            lodash.forEach(item,(val, key) => {
                paramsObj[key] = val;
                keys.push(key);
            });
        });
        let result = lodash.map<any,any>(keys, key => {
            return key + "/" + paramsObj[key];
        });
       let paramsStr = "#" + result.join("/");
        if (_.isObject(query)) {
            query = [query];
        }
        if (_.isUndefined(query) || !_.isArray(query) || !query.length) {
            return paramsStr;
        }
        let queryArr = [];
        lodash.forEach(query, obj => {
            lodash.forEach(obj,(val, key) => {
                queryArr.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
            });
        });
        let resultHash = paramsStr + '?' + queryArr.join('&');
        return resultHash;
    }
    public navigate(params, query = undefined, options = undefined) {
       let that = this;
       let hashStr = that.hash(params, query);
       return router.navigate(hashStr, options);
    }

}

export = new LinkBuilder()
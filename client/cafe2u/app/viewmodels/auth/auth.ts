import ko = require('knockout');
import lodash = require('lodash');
import $ = require('jquery');
import router = require('plugins/router');
import linkBuilder = require("../../common/linkBuilder");
import usersService = require("../../services/usersService");
import app = require('durandal/app');




class Auth {

    public name: KnockoutObservable<string>;
    public password: KnockoutObservable<string>;

    constructor() {
        this.name = ko.observable<string>();
        this.password = ko.observable<string>();
    }

    public authorize() {
        this.setCookies();
        usersService.load().then((result) => {
            window.location.href = window.location.protocol + '//' + window.location.host + '/';
        }).fail((err : any) => {
            if (err.status === 401)
            app.showMessage("Неправильный логин или пароль!");
        });
    }
    // Warning! I hope it will not make you cry. Really kind of bad smell code!
    private setCookies() {

        document.cookie = "name=" + this.name();
        document.cookie = "password=" + this.password();
    }
}

export = Auth;
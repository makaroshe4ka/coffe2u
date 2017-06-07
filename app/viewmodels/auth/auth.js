define(["require", "exports", "knockout", "../../services/usersService", "durandal/app"], function (require, exports, ko, usersService, app) {
    "use strict";
    var Auth = (function () {
        function Auth() {
            this.name = ko.observable();
            this.password = ko.observable();
        }
        Auth.prototype.authorize = function () {
            this.setCookies();
            usersService.load().then(function (result) {
                window.location.href = window.location.protocol + '//' + window.location.host + '/';
            }).fail(function (err) {
                if (err.status === 401)
                    app.showMessage("Неправильный логин или пароль!");
            });
        };
        Auth.prototype.setCookies = function () {
            document.cookie = "name=" + this.name();
            document.cookie = "password=" + this.password();
        };
        return Auth;
    }());
    return Auth;
});
//# sourceMappingURL=auth.js.map
define(["require", "exports", "plugins/router", "knockout"], function (require, exports, router, ko) {
    "use strict";
    var Shell = (function () {
        function Shell() {
            this.router = router;
            this.activate = function () {
                var configs = [
                    { route: '', title: 'Пользователи', moduleId: 'viewmodels/entities/users/users', nav: true, style: 'fa fa-user' },
                    { route: 'franchisees', title: 'Франшизы', moduleId: 'viewmodels/entities/franchisees/franchisees', nav: true, style: 'fa fa-user-circle' },
                    { route: 'franchisees(/:id)', title: 'Франшизы', moduleId: 'viewmodels/entities/franchisees/franchiseesSettings', style: '' },
                    { route: 'addfranchisee', title: 'Франшизы', moduleId: 'viewmodels/entities/franchisees/franchiseesSettings', style: '' },
                    { route: 'vehicles', title: 'Транспорт', moduleId: 'viewmodels/entities/vehicles/vehicles', nav: true, style: 'fa fa-car' },
                    { route: 'products', title: 'Продукты', moduleId: 'viewmodels/entities/products/products', nav: true, style: 'fa fa-shopping-cart' },
                    { route: 'vehicles', title: 'Сообщения', moduleId: 'viewmodels/entities/vehicles/vehicles', nav: true, style: 'fa fa-envelope' },
                    { route: 'help', title: 'Справка', moduleId: 'viewmodels/help/help', nav: true, style: 'fa fa-question' }
                ];
                return router.map(configs).buildNavigationModel().activate();
            };
            this.currentTitle = ko.computed(function () {
                var activeRoute = ko.utils.arrayFirst(router.navigationModel(), function (item) {
                    return item.isActive();
                });
                if (activeRoute)
                    return activeRoute.title;
            });
            this.currentUser = ko.computed(function () {
                var name = "name";
                var value = "; " + document.cookie;
                var parts = value.split("; " + name + "=");
                if (parts.length === 2) {
                    var userName = parts.pop().split(";").shift();
                    return userName;
                }
                return value;
            });
        }
        Shell.prototype.logOut = function () {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
            window.location.href = window.location.protocol + '//' + window.location.host + '/';
        };
        return Shell;
    }());
    return Shell;
});
//# sourceMappingURL=shell.js.map
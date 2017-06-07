import router = require('plugins/router');
import ko = require('knockout');


class Shell {
    public currentTitle: KnockoutComputed<any>;
    public currentUser: KnockoutComputed<any>;

    constructor() {
        this.currentTitle = ko.computed(() => {
            var activeRoute = ko.utils.arrayFirst(router.navigationModel(),
                (item) => {
                    return item.isActive();
                });
            if (activeRoute)
                return activeRoute.title;
        });
        this.currentUser = ko.computed(() => {

            var name = "name";

            var value = "; " + document.cookie;
            var parts = (value as any).split("; " + name + "=");
            if (parts.length === 2) {
                let userName =  parts.pop().split(";").shift();
                return  userName ;
            }
            return value;
        });
    }
    public logOut() {
        var cookies = (document.cookie as any).split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        window.location.href = window.location.protocol + '//' + window.location.host + '/';
    }
    router: DurandalRouter = router;
    activate = () => {
        var configs: any = [
            { route: '', title: 'Пользователи', moduleId: 'viewmodels/entities/users/users', nav: true, style: 'fa fa-user' },
            { route: 'franchisees', title: 'Франшизы', moduleId: 'viewmodels/entities/franchisees/franchisees', nav: true, style: 'fa fa-user-circle'  },
            { route: 'franchisees(/:id)', title: 'Франшизы', moduleId: 'viewmodels/entities/franchisees/franchiseesSettings', style: '' },
            { route: 'addfranchisee', title: 'Франшизы', moduleId: 'viewmodels/entities/franchisees/franchiseesSettings', style: '' },
            { route: 'vehicles', title: 'Транспорт', moduleId: 'viewmodels/entities/vehicles/vehicles', nav: true, style: 'fa fa-car' },
            { route: 'products', title: 'Продукты', moduleId: 'viewmodels/entities/products/products', nav: true, style: 'fa fa-shopping-cart' },
            { route: 'adminMessages', title: 'Сообщения', moduleId: 'viewmodels/entities/messages/messages', nav: true, style: 'fa fa-envelope' },
            { route: 'help', title: 'Справка', moduleId: 'viewmodels/help/help', nav: true, style: 'fa fa-question' }
        ];

        return router.map(configs).buildNavigationModel().activate();
    };
}

export = Shell;
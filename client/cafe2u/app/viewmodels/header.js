define(["require", "exports", "plugins/router", "knockout"], function (require, exports, router, ko) {
    "use strict";
    var Header = (function () {
        function Header() {
            this.activate = function () {
            };
            this.currentTitle = ko.computed(function () {
                var activeRoute = ko.utils.arrayFirst(router.navigationModel(), function (item) {
                    return item.isActive();
                });
                if (activeRoute)
                    return activeRoute.title;
            });
        }
        return Header;
    }());
    return Header;
});
//# sourceMappingURL=header.js.map
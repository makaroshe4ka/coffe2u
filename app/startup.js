define(["require", "exports", "durandal/system", "durandal/app", "durandal/viewLocator", "plugins/widget", "common/utils/knockout/validationRules"], function (require, exports, system, app, viewLocator, widget, validationRules) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function start() {
        system.debug(true);
        app.title = 'Cafe2u';
        app.configurePlugins({
            router: true,
            dialog: true,
            widget: {
                kinds: ['expander']
            }
        });
        app.start().then(function () {
            viewLocator.useConvention();
            widget.convertKindToModulePath = function (kind) {
                return 'widgets/' + kind + '/viewModel';
            };
            widget.convertKindToViewPath = function (kind) {
                return 'widgets/' + kind + '/view.html';
            };
            app.setRoot('viewmodels/shell');
            validationRules.registerValidation();
        });
    }
    exports.start = start;
});
//# sourceMappingURL=startup.js.map
import system = require('durandal/system');
import app = require('durandal/app');
import viewLocator = require('durandal/viewLocator');
import widget = require("plugins/widget");
import validationRules = require("common/utils/knockout/validationRules");

export function start() {
    system.debug(true);

    app.title = 'Cafe2u';

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: {
            kinds: ['expander']
        }
    });

    app.start().then(() => {
        viewLocator.useConvention();
        widget.convertKindToModulePath = (kind) => {
            return 'widgets/' + kind + '/viewModel';
        };
        widget.convertKindToViewPath = (kind) => {
            return 'widgets/' + kind + '/view.html';
        };
        app.setRoot('viewmodels/shell');
        validationRules.registerValidation();
    });
}
requirejs.config({
    paths: {
        'require': '../lib/require/require',
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'knockout': '../lib/knockout/knockout-3.4.0',
        'komapping': '../lib/knockout/knockout.mapping-latest',
        'jquery': '../lib/jquery/jquery-1.9.1',
        'settings': '../app/common/settings',
        'userViewModel': '../app/viewmodels/entities/users/userViewModel',
        'lodash': '../lib/lodash/lodash-4.17.4.min',
        'pageViewModel': '../app/widgets/editableGrid/pageViewModel',
        'baseService': '../app/services/baseService',
        '../common/errorHandler': '../app/common/errorHandler',
        'knockout.validation': '../lib/knockout/knockout.validation'
 
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});

define(['../startup'], startup => {
    startup.start();
});
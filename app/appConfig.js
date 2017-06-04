requirejs.config({
    paths: {
        'require': '../lib/require/require',
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'knockout': '../lib/knockout/knockout-3.1.0',
        'komapping': '../lib/knockout/knockout.mapping-latest',
        'jquery': '../lib/jquery/jquery-1.9.1'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});
define(['../startup'], function (startup) {
    startup.start();
});

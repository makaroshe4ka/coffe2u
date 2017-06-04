define(['lodash'], function (_) {

    var helpers = {
        inherit: function (ctor, baseCtor) {
            function F() { }
            F.prototype = baseCtor.prototype;

            ctor.prototype = new F();
            ctor.prototype.constructor = ctor;
            ctor.baseclass = baseCtor.prototype;
        }
    };

    return helpers;
});
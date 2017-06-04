define(["require", "exports", "durandal/app"], function (require, exports, app) {
    "use strict";
    var ErrorHandler = (function () {
        function ErrorHandler() {
            var _this = this;
            this.onServiceError = function (ex) {
                if (ex.status === 401) {
                    _this.processUnauthorized();
                }
                else {
                    app.showMessage(_this.internalError, "Ошибка сервера: ");
                }
            };
            this.internalError = "Ошибка сервера! Пожалуйста, попробуйте перезагрузить страницу..";
        }
        ErrorHandler.prototype.processUnauthorized = function () {
            app.setRoot("viewmodels/auth/auth");
        };
        return ErrorHandler;
    }());
    return new ErrorHandler();
});
//# sourceMappingURL=errorHandler.js.map
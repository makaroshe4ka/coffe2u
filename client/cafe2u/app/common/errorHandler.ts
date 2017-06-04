import app = require('durandal/app');

class ErrorHandler {
    public internalError: string;
    constructor() {
        this.internalError = "Ошибка сервера! Пожалуйста, попробуйте перезагрузить страницу..";
    }
    public onServiceError = (ex: any) => {


        if (ex.status === 401) {
            this.processUnauthorized();
        } else {
            app.showMessage(this.internalError, "Ошибка сервера: ");
        }
    }

    private processUnauthorized() {
        app.setRoot("viewmodels/auth/auth");
    }
}

export = new ErrorHandler();



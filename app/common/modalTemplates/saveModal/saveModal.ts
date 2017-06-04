import system = require('durandal/system');
import app = require('durandal/app');
import dialog = require('plugins/dialog');
import ko = require('knockout');
import lodash = require('lodash');


 class SaveModal {

    public title: string;
    public model: any;
    public isValid: KnockoutComputed<boolean>;

    constructor(title: string, model: any) {

        this.title = title;
        this.model = model;
        this.isValid = ko.computed(() => {
        
            return model.isValidModel();
        });
    }
    save = () => {
        var vm = this;
        if (vm.model.isValidModel()) {
            dialog.close(vm, 'save', vm.model);
        } else {
            app.showMessage("Модель невалидна!");
        }
    }

    close = () => {
        var vm = this;
        dialog.close(vm, 'close');
    }

    show =  () => {
        var vm = this;
        return dialog.show(vm);
    }

    activate = () => {
        var vm = this;
    }
}

export = SaveModal;
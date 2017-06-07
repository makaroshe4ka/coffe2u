import ko = require('knockout');
import koValid = require('knockout.validation');

 class ValidationRules {
    constructor() {
      
     }
    public registerValidation() {
      
        koValid.rules['mail'] = {
            validator: (val, required) => {
                if (!val) {
                    return !required;
                }
                return val.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            },
            message: 'Электронная почта введена некорректно!'
        };
        koValid.rules['password'] = {
            validator: (val, required) => {
                if (!val) {
                    return !required;
                }
                return val.length >= 4 && val.length <= 40;
            },
            message: 'Размер пароля должен быть от 4 до 40 символов!'
        };
        koValid.rules['limitLength'] = {
            validator: (val, maxLength) => {
                if (!val) {
                    return true;
                }
                return val.length >= 1 && val.length <= maxLength;
            },
            message: 'Размер поля должен быть от 1 до 25 символов!'
        };

        koValid.rules['currency'] = {
            validator: (val, maxLength) => {
                let regex = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
                if (!val) {
                    return true;
                }
                return val.toString().match(regex);
            },
            message: 'Валюта введена неверно!'
        };

        koValid.rules['number'] = {
            validator: (val, maxLength) => {
                let regex = /^\d+(?:\.\d{1,2})?$/;
                if (!val) {
                    return true;
                }
                return val.toString().match(regex);
            },
            message: 'Неверный формат числа!'
        };

        koValid.rules['phoneNumber'] = {
            validator: (val, maxLength) => {
                let regex = /^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$/;
                if (!val) {
                    return true;
                }
                return val.toString().match(regex);
            },
            message: 'Неверный формат телефона!'
        };

        ko.validation.registerExtenders();
    }
}

export = new ValidationRules();
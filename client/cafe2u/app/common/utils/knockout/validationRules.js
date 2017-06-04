define(["require", "exports", "knockout", "knockout.validation"], function (require, exports, ko, koValid) {
    "use strict";
    var ValidationRules = (function () {
        function ValidationRules() {
        }
        ValidationRules.prototype.registerValidation = function () {
            koValid.rules['mail'] = {
                validator: function (val, required) {
                    if (!val) {
                        return !required;
                    }
                    return val.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                },
                message: 'Электронная почта введена некорректно!'
            };
            koValid.rules['password'] = {
                validator: function (val, required) {
                    if (!val) {
                        return !required;
                    }
                    return val.length >= 4 && val.length <= 40;
                },
                message: 'Размер пароля должен быть от 4 до 40 символов!'
            };
            koValid.rules['limitLength'] = {
                validator: function (val, maxLength) {
                    if (!val) {
                        return true;
                    }
                    return val.length >= 1 && val.length <= maxLength;
                },
                message: 'Размер поля должен быть от 1 до 25 символов!'
            };
            koValid.rules['currency'] = {
                validator: function (val, maxLength) {
                    var regex = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
                    if (!val) {
                        return true;
                    }
                    return val.toString().match(regex);
                },
                message: 'Валюта введена неверно!'
            };
            koValid.rules['number'] = {
                validator: function (val, maxLength) {
                    var regex = /^\d+(?:\.\d{1,2})?$/;
                    if (!val) {
                        return true;
                    }
                    return val.toString().match(regex);
                },
                message: 'Неверный формат числа!'
            };
            koValid.rules['phoneNumber'] = {
                validator: function (val, maxLength) {
                    var regex = /^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$/;
                    if (!val) {
                        return true;
                    }
                    return val.toString().match(regex);
                },
                message: 'Неверный формат телефона!'
            };
            ko.validation.registerExtenders();
        };
        return ValidationRules;
    }());
    return new ValidationRules();
});
//# sourceMappingURL=validationRules.js.map
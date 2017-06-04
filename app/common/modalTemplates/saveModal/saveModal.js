define(["require", "exports", "durandal/app", "plugins/dialog", "knockout"], function (require, exports, app, dialog, ko) {
    "use strict";
    var SaveModal = (function () {
        function SaveModal(title, model) {
            var _this = this;
            this.save = function () {
                var vm = _this;
                if (vm.model.isValidModel()) {
                    dialog.close(vm, 'save', vm.model);
                }
                else {
                    app.showMessage("Модель невалидна!");
                }
            };
            this.close = function () {
                var vm = _this;
                dialog.close(vm, 'close');
            };
            this.show = function () {
                var vm = _this;
                return dialog.show(vm);
            };
            this.activate = function () {
                var vm = _this;
            };
            this.title = title;
            this.model = model;
            this.isValid = ko.computed(function () {
                return model.isValidModel();
            });
        }
        return SaveModal;
    }());
    return SaveModal;
});
//# sourceMappingURL=saveModal.js.map
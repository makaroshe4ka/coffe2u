define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageViewModel = (function () {
        function PageViewModel(i) {
            var _this = this;
            this.setActive = function () {
                var vm = _this;
                vm.isActive(true);
            };
            var vm = this;
            vm.name = i + 1;
            vm.value = i;
            vm.isActive = ko.observable(false);
        }
        return PageViewModel;
    }());
    exports.PageViewModel = PageViewModel;
});
//# sourceMappingURL=pageViewModel.js.map
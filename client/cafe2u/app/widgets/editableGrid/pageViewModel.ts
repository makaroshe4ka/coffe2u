import system = require('durandal/system');
import app = require('durandal/app');
import dialog = require('plugins/dialog');
import ko = require('knockout');
import lodash = require('lodash');


export class PageViewModel {
    public name: number;
    public value: number;
    public isActive: KnockoutObservable<boolean>;

    constructor (i) {
        var vm = this;
        vm.name = i + 1;
        vm.value = i;
        vm.isActive = ko.observable(false);
    }

    private setActive = () => {
        var vm = this;
        vm.isActive(true);
    }

}
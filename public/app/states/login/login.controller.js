(function () {
    'use strict';

    angular
            .module('herreroApp')
            .controller('loginController', LoginController);

    LoginController.$inject = ['authService'];

    function LoginController(authService) {

        var vm = this;
        vm.auth = authService;

    }

}());
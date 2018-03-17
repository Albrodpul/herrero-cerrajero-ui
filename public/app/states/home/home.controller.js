(function () {

  'use strict';

  angular
    .module('herreroApp')
    .controller('homeController', homeController);

  homeController.$inject = ['authService', '$scope', '$state'];

  function homeController(authService, $scope, $state) {

    var vm = this;
    vm.auth = authService;

    vm.profile;
    if (authService.isAuthenticated()) {
      authService.getProfile(function (err, profile) {
        vm.profile = profile;
        if (!authService.isAdmin(vm.profile)) {
          $state.go("login");
        }
      });
    } else {
      $state.go("login");
    }


  }

})();
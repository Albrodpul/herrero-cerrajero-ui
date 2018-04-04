(function () {

  'use strict';

  angular
    .module('herreroApp')
    .controller('nCuentasController', nCuentasController);

  nCuentasController.$inject = ['authService', '$scope', '$state', '$timeout', 'nCuentasService', 'ibanValidatorService', 'dniValidatorService'];

  function nCuentasController(authService, $scope, $state, $timeout, nCuentasService, ibanValidatorService, dniValidatorService) {

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

    var refresh = function () {
      $scope.error = null;
      $scope.referenciaCheck1 = true;
      $scope.referenciaCheck2 = false;
      $scope.reference = "Con referencia";
      $scope.sortKey = "idAdmin";
      angular.element("input[id='text']").val(null);
      nCuentasService.getCuentas()
        .then(data => {
          console.log("Refreshing...");
          $timeout(function () {
            angular.element('#cuentasList').trigger('click');
          }, 100);
          if (Object.keys(data).length == 0) {
            $scope.cuentasTable = false;
          } else {
            $scope.cuentasTable = true;
            $scope.cuentas = data;
          }
        })
    }

    refresh();

    $scope.nuevaCuenta = function () {
      $scope.cuentasListAux = false;
      $scope.nuevaCuentaAux = true;
      $scope.error = null;
    }

    $scope.cuentasList = function () {
      $scope.cuentasListAux = true;
      $scope.nuevaCuentaAux = false;
      $scope.error = null;
    }

    $scope.cancel = function () {
      var cancelCuenta = window.confirm("¿Está seguro que desea cancelar la creación del número de cuenta?");
      if (cancelCuenta) {
        delete $scope.error;
        angular.element("input[id='text']").val(null);
      }
    }

    $scope.addCuenta = function (administrador, direccion, iban, nif, referenciaCheck1) {
      if (!administrador) {
        $scope.error = "Falta el campo administrador por rellenar";
        $scope.success = null;
      } else if (!direccion) {
        $scope.error = "Falta el campo dirección por rellenar";
        $scope.success = null;
      } else if (!iban) {
        $scope.error = "Falta el campo iban por rellenar";
        $scope.success = null;
      } else if (!nif) {
        $scope.error = "Falta el campo nif por rellenar";
        $scope.success = null;
      } else if (!ibanValidatorService.validator(iban)) {
        $scope.error = "Iban erróneo";
        $scope.success = null;
      } else if (!dniValidatorService.validator(nif)) {
        $scope.error = "NIF erróneo";
        $scope.success = null;
      } else {
        $scope.error = null;
        if (referenciaCheck1) {
          nCuentasService.getCuentaLast()
            .then(data => {
              var referencia;
              var aux = data.referencia;
              var letters = /[a-zA-Z]/g;
              var count = (aux.match(letters) || []).length;
              console.log(aux);
              if (count == 10) {
                aux = parseInt(aux.substring(10, aux.length)) + 1;
              } else {
                aux = parseInt(aux.substring(9, aux.length)) + 1;
              }
              console.log(aux);
              if (aux < 100) {
                referencia = "Referencia" + aux.toString();
              } else {
                referencia = "Referenci" + aux.toString();
              }
              var json = '{"idAdmin":"' + administrador + '", "direccion":"' + direccion + '","iban":"' + iban + '","nif":"' + nif + '","referencia":"' + referencia + '"}';
              console.log(json);
              nCuentasService.insertCuenta(json)
                .then(response => {
                  refresh();
                  $scope.success = response.message;
                  $timeout(function () {
                    $scope.success = null;
                  }, 5000);
                }, err => {
                  $scope.error = err.message;
                });
            });
        } else {
          var json = '{"idAdmin":"' + administrador + '", "direccion":"' + direccion + '","iban":"' + iban + '","nif":"' + nif + '","referencia":""}';
          console.log(json);
          nCuentasService.insertCuenta(json)
            .then(response => {
              refresh();
              $scope.success = response.message;
              $timeout(function () {
                $scope.success = null;
              }, 5000);
            }, err => {
              $scope.error = err.message;
            });
        }
      }
    }

    $scope.checkReferencia1 = function (referenciaCheck1) {
      if (referenciaCheck1 == true) {
        $scope.reference = "Con referencia";
      } else {
        $scope.reference = "Sin referencia";
      }
    }


    $scope.delete = function (administrador, direccion) {
      var deleteCuenta = window.confirm("¿Está seguro que desea borrar el grupo?");
      if (deleteCuenta) {
        nCuentasService.deleteCuenta(administrador, direccion)
          .then(response => {
            refresh();
            $scope.success = response.message;
            $timeout(function () {
              $scope.success = null;
            }, 5000);
          });
      }
    }


    $scope.edit1 = function (administrador, direccion, iban, nif, referencia) {
      $scope.updatedAdmin = administrador;
      $scope.updatedDireccion = direccion;
      $scope.updatedIban = iban;
      $scope.updatedNif = nif;
      $scope.updatedReferencia = referencia;
    }

    $scope.edit2 = function (administrador, direccion, iban, nif, referencia) {
      if (!iban) {
        $scope.error2 = "Falta el campo iban por rellenar";
        $scope.success = null;
      } else if (!nif) {
        $scope.error2 = "Falta el campo nif por rellenar";
        $scope.success = null;
      } else if (!ibanValidatorService.validator(iban)) {
        $scope.error2 = "Iban erróneo";
        $scope.success = null;
      } else if (!dniValidatorService.validator(nif)) {
        $scope.error2 = "NIF erróneo";
        $scope.success = null;
      } else {
        var json = '{"idAdmin":"' + administrador + '", "direccion":"' + direccion + '","iban":"' + iban + '","nif":"' + nif + '","referencia":"' + referencia + '"}';
        console.log(json);
        nCuentasService.updateCuenta(json, administrador, direccion)
          .then(response => {
            refresh();
            $timeout(function () {
              angular.element('.modal-close').trigger('click');
            }, 100);
            $scope.success = response.message;
            $timeout(function () {
              $scope.success = null;
            }, 5000);
          }, err => {
            $scope.error = err.message;
          });
      }
    }

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      $scope.sortKeyAux = null;
    }

    $scope.sortReferencia = function (){
      $scope.sortKey = null;
      $scope.sortKeyAux = "referencia";
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }


  }

})();
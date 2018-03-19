(function () {

    'use strict';

    angular
        .module('herreroApp')
        .controller('facturasController', facturasController);

    facturasController.$inject = ['authService', '$scope', '$state', '$timeout', 'facturasService'];

    function facturasController(authService, $scope, $state, $timeout, facturasService) {

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
            angular.element("input[id='text']").val(null);
            facturasService.getFacturas()
                .then(data => {
                    console.log("Refreshing...");
                    $timeout(function () {
                        angular.element('#facturasList').trigger('click');
                    }, 100);
                    if (Object.keys(data).length == 0) {
                        $scope.facturasTable = false;
                    } else {
                        $scope.facturasTable = true;
                        $scope.facturas = data;
                    }
                })
        }

        refresh();

        $scope.nuevaFactura = function () {
            $scope.facturasListAux = false;
            $scope.nuevaFacturaAux = true;
            $scope.error = null;
        }

        $scope.facturasList = function () {
            $scope.facturasListAux = true;
            $scope.nuevaFacturaAux = false;
            $scope.error = null;
        }

        $scope.addFactura = function (administrador, direccion, numero) {
            if (!administrador) {
                $scope.error = "Falta el campo administrador por rellenar";
                $scope.success = null;
            } else if (!direccion) {
                $scope.error = "Falta el campo dirección por rellenar";
                $scope.success = null;
            } else if (!numero) {
                $scope.error = "Falta el campo número de factura por rellenar";
                $scope.success = null;
            } else {
                $scope.error = null;
                var aux = new Date();
                var day = aux.getDate();
                var month = aux.getMonth() + 1;
                var year = aux.getFullYear();
                var fecha = day + "-" + month + "-" + year;
                var estado = "Factura enviada, remesa no enviada";
                var json = '{"fecha":"' + fecha + '", "idAdmin":"' + administrador + '","direccion":"' + direccion + '","numero":"' + numero + '","estado":"' + estado + '"}';
                console.log(json);
                facturasService.insertFactura(json)
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

        $scope.delete = function (numero) {
            var deleteFactura = window.confirm("¿Está seguro que desea borrar la factura?");
            if (deleteFactura) {
                facturasService.deleteFactura(numero)
                    .then(response => {
                        refresh();
                        $scope.success = response.message;
                        $timeout(function () {
                            $scope.success = null;
                        }, 5000);
                    });
            }
        }

        $scope.edit1 = function (fecha, administrador, direccion, numero, estado) {
            $scope.updatedAdmin = administrador;
            $scope.updatedDireccion = direccion;
            $scope.updatedNumero = numero;
            $scope.updatedEstado = estado;
            $scope.origEstado = estado;
            $scope.origFecha = fecha;
        }

        $scope.edit2 = function (administrador, direccion, numero, estado) {
            if (!numero) {
                $scope.error2 = "Falta el campo numero por rellenar";
                $scope.success = null;
            } else {
                if ($scope.origEstado != estado) {
                    var aux = new Date();
                    var day = aux.getDate();
                    var month = aux.getMonth() + 1;
                    var year = aux.getFullYear();
                    var fecha = day + "-" + month + "-" + year;
                } else {
                    var fecha = $scope.origFecha;
                }
                var json = '{"fecha":"' + fecha + '", "idAdmin":"' + administrador + '","direccion":"' + direccion + '","numero":"' + numero + '","estado":"' + estado + '"}';
                console.log(json);
                facturasService.updateFactura(json, numero)
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

    }
})();
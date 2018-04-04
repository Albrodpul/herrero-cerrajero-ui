(function () {

    'use strict';

    angular
        .module('herreroApp')
        .service('dniValidatorService', function dniValidatorService($state, $q, $http, $stateParams) {

            function validator(dni) {
                var numero;
                var letr;
                var letra;
                var dni_particular;
                var dni_empresa;

                dni_particular = /^\d{8}[a-zA-Z]$/;
                dni_empresa = /^([a-zA-Z])(\d{7})([0-9A-J])$/;

                if (dni_particular.test(dni)) {
                    numero = dni.substr(0, dni.length - 1);
                    letr = dni.substr(dni.length - 1, 1);
                    numero = numero % 23;
                    letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
                    letra = letra.substring(numero, numero + 1);
                    if (letra != letr.toUpperCase()) {
                        return false;
                    } else {
                        return true;
                    }
                } else if (dni_empresa.test(dni)) {
                    if (!dni || dni.length !== 9) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            return {
                validator: validator
            };

        });

})();
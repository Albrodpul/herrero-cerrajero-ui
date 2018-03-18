(function () {

    'use strict';

    angular
        .module('herreroApp')
        .service('ibanValidatorService', function ibanValidatorService($state, $q, $http, $stateParams) {

            // Función que devuelve los números correspondientes a cada letra
            function getNumIBAN(letra) {
                var letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                return letras.search(letra) + 10;
            }

            // Función que calcula el módulo sin hacer ninguna división
            function mod(dividendo, divisor) {
                var cDividendo = '';
                var cResto = '';

                for (var i in dividendo) {
                    var cChar = dividendo[i];
                    var cOperador = cResto + '' + cDividendo + '' + cChar;

                    if (cOperador < parseInt(divisor)) {
                        cDividendo += '' + cChar;
                    } else {
                        cResto = cOperador % divisor;
                        if (cResto == 0) {
                            cResto = '';
                        }
                        cDividendo = '';
                    }
                }
                cResto += '' + cDividendo;
                if (cResto == '') {
                    cResto = 0;
                }
                return cResto;
            }

            // El típico trim que inexplicamente JavaScript no trae implementado
            function trim(texto) {
                return texto.replace(/^\s+/g, '').replace(/\s+$/g, '');
            }

            // Función que comprueba el IBAN
            function validator(IBAN) {
                IBAN = IBAN.toUpperCase();
                IBAN = trim(IBAN); // Quita espacios al principio y al final
                IBAN = IBAN.replace(/\s/g, ""); // Quita espacios del medio
                var num1, num2;
                var isbanaux;
                var resto;
                if (IBAN.length != 24) { // En España el IBAN son 24 caracteres
                    return false;
                } else {
                    num1 = getNumIBAN(IBAN.substring(0, 1));
                    num2 = getNumIBAN(IBAN.substring(1, 2));
                    isbanaux = IBAN.substr(4) + String(num1) + String(num2) + IBAN.substr(2, 2);
                    resto = mod(isbanaux, 97);
                    return (resto == 1);
                }
            }

            return {
                validator: validator
            };

        });

})();
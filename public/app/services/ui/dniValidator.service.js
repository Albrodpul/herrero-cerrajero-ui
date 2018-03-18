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
                dni_empresa = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;;

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
                    }

                    var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
                    var digits = dni.substr(1, dni.length - 2);
                    var letter = dni.substr(0, 1);
                    var control = dni.substr(dni.length - 1);
                    var sum = 0;
                    var i;
                    var digit;

                    if (!letter.match(/[A-Z]/)) {
                        return false;
                    }

                    for (i = 0; i < digits.length; ++i) {
                        digit = parseInt(digits[i]);

                        if (isNaN(digit)) {
                            return false;
                        }

                        if (i % 2 === 0) {
                            digit *= 2;
                            if (digit > 9) {
                                digit = parseInt(digit / 10) + (digit % 10);
                            }

                            sum += digit;
                        } else {
                            sum += digit;
                        }
                    }

                    sum %= 10;
                    if (sum !== 0) {
                        digit = 10 - sum;
                    } else {
                        digit = sum;
                    }

                    if (letter.match(/[ABEH]/)) {
                        return String(digit) === control;
                    }
                    if (letter.match(/[NPQRSW]/)) {
                        return letters[digit] === control;
                    }
                    return String(digit) === control || letters[digit] === control;
                } else {
                    return false;
                }
            }

            return {
                validator: validator
            };

        });

})();
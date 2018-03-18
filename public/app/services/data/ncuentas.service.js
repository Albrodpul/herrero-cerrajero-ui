"use strict";
(function () {
  angular.module("herreroApp").service("nCuentasService", function nCuentasService($state, $q, $http, $location) {
    var baseDomain = $location.host();
    var url;
    if (baseDomain == "localhost") {
      url = "http://localhost:8080";
    } else {
      url = "https://herrero-cerrajero-api.herokuapp.com"
    }

    var getCuentas = function () {
      return $q((resolve, reject) => {
        $http.get(url + "/api/v1/ncuentas").then(function (response) {
          return resolve(response.data);
        });
      });
    };

    var getCuentaLast = function () {
      return $q((resolve, reject) => {
        $http.get(url + "/api/v1/ncuentas/last").then(function (response) {
          return resolve(response.data);
        });
      });
    };

    var insertCuenta = function (data) {
      return $q((resolve, reject) => {
        $http.post(url + "/api/v1/ncuentas/", data).then(
          function (response) {
            return resolve({
              status: response.status,
              message: "El número de cuenta ha sido creado con éxito"
            });
          },
          function (err) {
            if (err.status == 409) {
              return reject({
                status: err.status,
                message: "Este administrador y dirección ya existe"
              });
            } else if (err.status != 201) {
              return reject({
                status: err.status,
                message: err.statusText
              });
            }
          }
        );
      });
    };

    var updateCuenta = function (data, administrador, direccion) {
      return $q((resolve, reject) => {
        $http.put(url + "/api/v1/ncuentas/" + administrador + "/" + encodeURIComponent(direccion), data).then(
          function (response) {
            return resolve({
              status: response.status,
              message: "El número de cuenta ha sido actualizado con éxito"
            });
          },
          function (err) {
            if (err.status != 201) {
              return reject({
                status: err.status,
                message: err.statusText
              });
            }
          }
        );
      });
    };

    var deleteCuenta = function (administrador, direccion) {
      return $q((resolve, reject) => {
        $http.delete(url + "/api/v1/ncuentas/" + administrador + "/" + encodeURIComponent(direccion)).then(function (response) {
          return resolve({
            status: response.status,
            message: "El número de cuenta ha sido borrado con éxito"
          });
        });
      });
    };

    return {
      getCuentas: getCuentas,
      getCuentaLast: getCuentaLast,
      insertCuenta: insertCuenta,
      updateCuenta: updateCuenta,
      deleteCuenta: deleteCuenta
    };
  });
})();
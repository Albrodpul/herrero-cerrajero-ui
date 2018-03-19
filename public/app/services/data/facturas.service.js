"use strict";
(function () {
  angular.module("herreroApp").service("facturasService", function nCuentasService($state, $q, $http, $location) {
    var baseDomain = $location.host();
    var url;
    if (baseDomain == "localhost") {
      url = "http://localhost:8080";
    } else {
      url = "https://herrero-cerrajero-api.herokuapp.com"
    }

    var getFacturas = function () {
      return $q((resolve, reject) => {
        $http.get(url + "/api/v1/facturas").then(function (response) {
          return resolve(response.data);
        });
      });
    };

    var insertFactura = function (data) {
      return $q((resolve, reject) => {
        $http.post(url + "/api/v1/facturas/", data).then(
          function (response) {
            return resolve({
              status: response.status,
              message: "La factura ha sido creada con éxito"
            });
          },
          function (err) {
            if (err.status == 409) {
              return reject({
                status: err.status,
                message: "Este número de factura ya existe"
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

    var updateFactura = function (data, numero) {
      return $q((resolve, reject) => {
        $http.put(url + "/api/v1/facturas/" + numero, data).then(
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

    var deleteFactura = function (numero) {
      return $q((resolve, reject) => {
        $http.delete(url + "/api/v1/facturas/" + numero).then(function (response) {
          return resolve({
            status: response.status,
            message: "La factura ha sido borrada con éxito"
          });
        });
      });
    };

    return {
      getFacturas: getFacturas,
      insertFactura: insertFactura,
      updateFactura: updateFactura,
      deleteFactura: deleteFactura
    };
  });
})();
(function () {

  'use strict';

  angular
    .module('herreroApp', ['auth0.auth0', 'ui.router', 'ui.materialize', "angularUtils.directives.dirPagination"])
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    'angularAuth0Provider'
  ];

  function config(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider,
    angularAuth0Provider
  ) {

    $stateProvider
      .state('/', {
        url: '/',
        controller: 'homeController',
        templateUrl: 'app/states/home/home.template.html',
        controllerAs: 'vm'
      })
      .state('home', {
        url: '/home',
        controller: 'homeController',
        templateUrl: 'app/states/home/home.template.html',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        controller: 'loginController',
        templateUrl: 'app/states/login/login.template.html',
        controllerAs: 'vm'
      })
      .state('unauthorized', {
        url: '/login',
        controller: 'loginController',
        templateUrl: 'app/states/login/login.template.html',
        controllerAs: 'vm'
      })
      .state('callback', {
        url: '/callback',
        controller: 'CallbackController',
        templateUrl: 'app/states/callback/callback.template.html',
        controllerAs: 'vm'
      })
      .state('ncuentas', {
        url: '/ncuentas',
        controller: 'nCuentasController',
        templateUrl: 'app/states/ncuentas/ncuentas.template.html',
        controllerAs: 'vm'
      });

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: 'wN3P0wpbXrZHNjF0wAj9kvgYu2i9R8Q1',
      domain: 'tfg1718-arp.eu.auth0.com',
      responseType: 'token id_token',
      audience: 'https://tfg1718-arp.eu.auth0.com/userinfo',
      redirectUri: window.location.protocol + '//' + window.location.host + '/callback',
      scope: 'openid profile'
    });

    $urlRouterProvider.otherwise('/home');

    $locationProvider.hashPrefix('');

    /// Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);
  }

})();
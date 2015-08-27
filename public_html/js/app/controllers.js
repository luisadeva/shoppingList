var phonecatApp = angular.module('ShoppingListApp', ['ngMaterial'])
        .config(function ($mdThemingProvider) {
             $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('orange');
});



phonecatApp.controller('ShoppingListCtrl', function ($scope) {
  $scope.saludo = "HOLA";
});
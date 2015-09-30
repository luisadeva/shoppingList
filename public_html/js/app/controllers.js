var phonecatApp = angular.module('ShoppingListApp', 
    ['ngMaterial', 'ngRoute', 'ui.utils.masks', 'ngMdIcons', 'shoppingListServices']
)
        .config(function ($mdThemingProvider) {
             $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('orange');
}
    );



phonecatApp.controller('ShoppingListCtrl', 
    ["$scope", "$route", "shoppingListServicesBD", "shoppingListServicesWebRtc","$mdSidenav", "$mdBottomSheet", 
     function ($scope, $route, shoppingListServicesBD, shoppingListServicesWebRtc, $mdSidenav, $mdBottomSheet) {
    
     
    
    
    
    
    
    
    /**
    * Identificador de la lista que se esta viendo
    * @type type
    */
  $scope.idListaActual=0;
  
  
  $scope.pestanaSuperSelected=0;
  
  
  
  $scope.nombreSupermercado = "";
  
  $scope.$watch('pestanaSuperSelected', function(current, old){
      console.log("Actual " + current);
      console.log("Antiguo " + old);
      
        $scope.pestanaSuperSelected = current;
        console.log("pestanaSuperSelected " + $scope.pestanaSuperSelected);
      
    });
  
  
  
  //load the init 
  shoppingListServicesBD.initBD(function () {
      shoppingListServicesBD.getAllLists(function (results) {
                        $scope.listas = results[0];
                        $route.reload();
                    });
  });
  
  
  $scope.toggleList = function () {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    };
  
  
 $scope.refreshList = function (idLista) {
      $scope.idListaActual = idLista;
      console.log("Elegida:" + $scope.idListaActual);
      
      
      $route.reload();
      
  };
  
  
  $scope.cambiarCheck = function (articulo) {
      console.log(articulo.nombre); 
      articulo.check = !articulo.check;
  };
  
  
  $scope.anadirLista = function () {
      
      var newList = {nombre: $scope.nuevaLista, supermercados: []};
      
      if (!$scope.listas) {
          $scope.listas = [];
      } 
      
      $scope.listas.push(newList);
      
      shoppingListServicesBD.saveLists($scope.listas, function (){
          $scope.refreshList($scope.listas.length-1);
      });
      
      $scope.nuevaLista = "";
      
  };
  
  $scope.anadirSupermercado = function () {
      console.log("Añadimos super " + $scope.idListaActual);
      var supermercados = $scope.listas[$scope.idListaActual].supermercados;
      
      
      if (!supermercados) {
          supermercados = [];
      }
      
      
    supermercados.push(
        {nombre: $scope.nombreSupermercado}
    );
    
    shoppingListServicesBD.saveLists($scope.listas, function (){});
    
    $scope.nombreSupermercado = "";
    
    $scope.pestanaSuperSelected=supermercados.length;

    console.log(JSON.stringify($scope.listas));
  };
  
  
  $scope.anadirArticulo = function (nombreArticulo, precioArticulo) {
      
      
      var listaArticulos = $scope.listas[$scope.idListaActual].supermercados[$scope.pestanaSuperSelected-1].articulos;
      
      
      //inicializamos la lista articulos
      if (!listaArticulos) {
          listaArticulos = [];
          $scope.listas[$scope.idListaActual].supermercados[$scope.pestanaSuperSelected-1].articulos = listaArticulos;
      }
      console.log("Añadimos articulo " + listaArticulos.length);
      console.log("Añadimos articulo " + nombreArticulo);
      
      var productoNuevo = {nombre: nombreArticulo, precio: precioArticulo, check: true};
      
      listaArticulos.push(productoNuevo);
      
      shoppingListServicesBD.saveLists($scope.listas, function (){});
      
      nombreArticulo = "";
      precioArticulo = "";
      
      console.log(JSON.stringify($scope.listas));
  };
  
  
  $scope.removeList = function (id) {
      
      var list = $scope.listas;
      
      if (id > -1) {
        list.splice(id, 1);
      }
      
      var newIdList = 0;
      
      if (id-1>0) {
          newIdList = id-1;
      }
      
      $scope.refreshList(newIdList);
      
      shoppingListServicesBD.saveLists($scope.listas, function () {
          
      });
      
  };
  
  
  $scope.removeSuper = function (id) {
      
      var list = $scope.listas[$scope.idListaActual].supermercados;  
      
      if (id > -1) {
        list.splice(id, 1);
      }
      
      var newIdList = 0;
      
      if (id-1>0) {
          newIdList = id-1;
      }
      
      $scope.refreshList(newIdList);
      
      shoppingListServicesBD.saveLists($scope.listas, function () {
          
      });
      
  };
  
  
  $scope.removeProduct = function (id) {
    
      var list = $scope.listas[$scope.idListaActual].supermercados[$scope.pestanaSuperSelected].articulos;  
      
      var newIdList = 0;
      
      if (id-1>0) {
          newIdList = id-1;
      }
      
      $scope.refreshList(newIdList);
      
      
      shoppingListServicesBD.saveLists($scope.listas, function () {
          
      });
      
  };
  
  
  
  
  $scope.removeAll = function () {
      
      shoppingListServicesBD.removeAll(function () {
          $scope.listas = [];
          $route.reload();
      });
      
  };
  
  
  $scope.shareList = function (idUserPeer) {
      
      console.log ("Compartir lista: " + idUserPeer);
      
      
      var listaToShare = "HOLA LISTA";
      
      
      shoppingListServicesWebRtc.shareList(listaToShare, function () {
          console.log("Enviada lista");
      });
      
      
  };
  
  $scope.receiveList = function () {
      
      console.log("valor switchReceiveList: "+ $scope.switchReceiveList);
      
      shoppingListServicesWebRtc.receiveList(function () {
          console.log("Enviada lista");
      });
      
      
  };
  
  
}]);
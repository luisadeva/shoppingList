var shoppingListServices = angular.module('shoppingListServices', []);

shoppingListServices.factory('shoppingListServicesBD', [
  function(){
        
        
    
    return {
        
        initBD: function (callback) {
            if (!(window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB)) {
                alert("ERROR: Not support Data Base");
            } else {
                myStore = new IDBStore(
                    {
                        storeName: 'shoppingList',
                        storePrefix: 'IDBWrapper-',
                        dbVersion: 13,
                        keyPath: 'id',
                        autoIncrement: true,
                        indexes: [
                                {name: 'lista', keyPath: 'id', unique: true, multiEntry: false},


                        ],
                        onStoreReady: function(){
                            console.log("Data base created!");

                            //init BD, only DEV enviroment
                            //myStore.clear();

                            //for (var i in listasPrueba) {
                            //    myStore.put(listasPrueba[i], function (id) {console.log("List created: " + id); listasPrueba[i].listaId = id;}, function (error) {console.log(error)});
                            //}
                            
                            //myStore.put(listasPrueba, callback, function (error) {console.log(error)});
                            
                            
                            callback();

                        },
                        onError: function(error){ console.log("Error when init DB: " + error); throw error;}


                    }
                )
            }
        },
        
        
        
        
        getAllLists : function (onsuccess) {
            
            return myStore.getAll(onsuccess);
              
        },
        
        saveLists: function (lists, callback){
            myStore.put(lists, 
                function (){
                       console.log("List saved");
                       callback();
                } , 
                function (error) {console.log(error); throw error;});
        },
        
        removeAll: function (callback) {
            myStore.clear();
            callback();
        }
        
        
    };
    
      
    
  }]);
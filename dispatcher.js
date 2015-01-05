angular.module('starter.services')
  .factory('dispatcher', function () {
    'use strict';

  var _callbacks = [];
  var _promises = [];


  var _addPromise = function(callback, payload) {
    _promises.push(new Promise(function(resolve, reject) {
      if (callback(payload)) {
        resolve(payload);
      } else {
        reject(new Error('Dispatcher callback unsuccessful'));
      }
    }));
  };

  var _clearPromises = function() {
    _promises = [];
  };

  var Dispatcher = function() {};
  Dispatcher.prototype = angular.extend({},Dispatcher.prototype, {

    register: function(callback) {
      _callbacks.push(callback);
      return _callbacks.length - 1; // index
    },

 
    dispatch: function(payload) {
      _callbacks.forEach(function(callback) {
        _addPromise(callback, payload);
      });
      Promise.all(_promises).then(_clearPromises, function(error){console.log("error en dispatcher", error)});
    },


    waitFor: function(promiseIndexes, callback) {
      var selectedPromises = _promises.filter(function(_, j) {
        return promiseIndexes.indexOf(j) !== -1;
      });
      var prm = Promise.all(selectedPromises); 
      return prm.then(callback).then(function(){return "ready"},function(error){console.log("error en promesa", error)});
    }

  });

  return Dispatcher;

})

.factory('AppDispatcher', function (dispatcher) {

  var AppDispatcher = angular.extend({}, dispatcher.prototype, {

  handleViewAction: function(action) {
      this.dispatch({
        source: 'VIEW_ACTION',
        action: action
      });
    },

  handleServerAction: function(action){
    this.dispatch({
      source:'SERVER_ACTION',
      action: action
    })
  }

  });

  return AppDispatcher

});


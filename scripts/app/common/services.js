﻿"use strict";   

define(["angular"], function(angular) {
    return angular.module("Common.services", [])
        .service("helloWorld", function() {
            return function() {
                return "hello world";
            };
        })
        .service('messageService', ['$rootScope', function($rootScope) {
            var sharedService = {};

            sharedService.publish = function(msg, data) {
                data = angular.copy(data) || {};
                $rootScope.$broadcast(msg, data);
            };

            sharedService.subscribe = function(msg, scope, func) {
                scope.$on(msg, func);
            };

            return sharedService;
        }])
        .service('messageBus', ['$rootScope', function($rootScope) {
            var messageBus = {};

            messageBus.publish = function(msg, data) {
                data = angular.copy(data) || {};
                $rootScope.$emit(msg, data);
            };

            messageBus.subscribe = function(msg, scope, func) {
                var unsubscribe = $rootScope.$on(msg, func);
                if (scope) {
                    //remove the listener when $scope is destroyed
                    scope.$on('$destroy', unsubscribe);
                }
                //return the unsubscribe function so the user can do their own memory management
                return unsubscribe;
            };

            return messageBus;
        }]);
});
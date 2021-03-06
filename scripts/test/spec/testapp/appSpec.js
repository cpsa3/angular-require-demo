/*jshint unused: vars */
define(['test'], function(app) {
    'use strict';

    describe('testApp/myState', function() {

        var $rootScope, $state, $stateParams, $injector, myServiceMock, state = 'myState';
        var goTo;

        beforeEach(function() {
            //load template.html by ngHtml2Js
            module('ngTemplates');
            module('testApp');

            inject(function(_$rootScope_, _$state_, _$injector_, $templateCache, _$location_, _$stateParams_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                $injector = _$injector_;
                $stateParams = _$stateParams_;

                goTo = function(url) {
                    _$location_.url(url);
                    $rootScope.$digest();
                };
                // We need add the template entry into the templateCache if we ever specify a templateUrl
                //$templateCache.put('modules/testapp/template.html', '');
            })
        });

        it('state.href', function() {
            expect($state.href(state, {
                id: 1
            })).toEqual('#/state/1');
        });

        it('state.go', function() {
            $state.go(state);
            $rootScope.$digest();
            expect($state.current.name).toBe(state);
        });

        it('location.url', function() {
            goTo('/state/1');
            expect($state.current.name).toBe(state);
        });
    });
});
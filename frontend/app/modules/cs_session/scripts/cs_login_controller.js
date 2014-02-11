define(['angular', '../module'], function (ng) {
  'use strict';

  ng.module('cs_session.controllers')
  .controller('CSLoginController', [
    '$scope',
    'CSSession',
    'CSSessionHelpers',
    '$log',
    function ($scope, CSSessionProvider, CSSessionHelpersProvider, $log) {
      $scope.helpers = CSSessionHelpersProvider;

      $scope.captchaOptions = {
        imgPath: '/components/visualcaptcha.angular/img/',
        captcha: {
          url: 'http://localhost:8080/captcha',
          numberOfImages: 6
        },
        init: function ( captcha ) {
          $scope.captcha = captcha;
        }
      };

      $scope.login = function () {
        // get captcha data
        var cData = $scope.captcha.getCaptchaData();
        if ( !cData.valid || ! $scope.credentials ) {
          $log.error('Please fill the form and solve the CAPTCHA and try again.');
        } else {
          //Add captcha answer to the $scope.credentials object
          $scope.credentials[ cData.name ] = cData.value;

          CSSessionProvider.login($scope.credentials);
        }
      };

      $scope.$on('CSSessionProvider:loginFailure', function (event, data) {
        $log.log('CSLoginController:', event, data);
        if(data.status === '403') {
          $log.error('Invalid username/password');
        }

        // alert the visualCaptcha status
        alert( 'visualCaptcha is ' + data.captcha.status );
        // We need to make sure we refresh captcha after trying to validate, to avoid abuse
        $scope.captcha.refresh();
      });

    }
  ]);

});

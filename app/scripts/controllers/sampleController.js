(function() {
	
	'use strict';
	
	angular.module('sampleApp')
		.controller('sampleController', ['$scope', SampleController])
	
	function SampleController($scope) {
		$scope.value = 'Hello Angular';
		$scope.hello = function() {
			alert('Hello AngularJS Material !');
		}
		
	}
	
})();
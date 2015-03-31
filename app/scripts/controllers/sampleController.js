(function() {
	
	'use strict';
	
	angular.module('sampleApp')
		.controller('sampleController', ['$scope', '$filter', '$mdBottomSheet', SampleController])
	
	function SampleController($scope, $filter, $mdBottomSheet) {
		$scope.value = 'Hello Angular';
		$scope.pageItems = 6;
		$scope.hello = function() {
			alert('Hello AngularJS Material !');
		}

        $scope.selectedContent = '';

        
        $scope.headerClass = {date: 'table-date-content', label:'fill-content', amount: 'table-amount-content'};
        $scope.contentClass = {date: 'bold', label:'grey', amount: 'grey'};

        $scope.headers = initHeaders();
        
        $scope.loadDatas = function() {
        	$scope.contents = initContent();
        }


        $scope.deleteOperation = function(selectedContent, $event) {
            $mdBottomSheet.show({
                template: '<md-bottom-sheet class="md-grid"><span flex></span><md-button aria-label="Delete" ng-click="deleteItem()"><img src="http://google.github.io/material-design-icons/action/svg/ic_delete_24px.svg" /></md-button></md-bottom-sheet>',
                controller: function($scope) {
                    $scope.deleteItem = function() {
                        $mdBottomSheet.hide();
                    }
                },
                targetEvent: $event
            }).then(function() {
                console.log(selectedContent);
            });
        }

        $scope.selectOperation = function(checked, selectedContent) {
            console.log('Is it checked ? ' + checked);
            console.log(selectedContent);
        }
	}

    function initHeaders() {
        return [{
            label: 'Date',
            sortableField: true,
            contentField: 'date',
            contentType: 'text',
            contentFilter: { 
                filter: 'date',
                pattern : 'dd/MM/yyyy'
            }
        },{
            label: 'Label',
            sortableField: true,
            contentField: 'label',
            contentType: 'text',
            contentFilter: { 
                filter: 'uppercase'
            }
        }, {
            label: 'Amount',
            sortableField: true,
            contentField: 'amount',
            contentType: 'input'
        }];
    }

    function initContent() {
        return [
            { date: new Date().getMilliseconds(), label: 'Task 1', amount: 10.0},
            { date: new Date().getMilliseconds(), label: 'Task 2', amount: 20.0},
            { date: new Date().getMilliseconds(), label: 'Task 3', amount: 90.0},
            { date: new Date().getMilliseconds(), label: 'Task 4', amount: 60.0},
            { date: new Date().getMilliseconds(), label: 'Task 5', amount: 70.0},
            { date: new Date().getMilliseconds(), label: 'Task 6', amount: 30.0},
            { date: new Date().getMilliseconds(), label: 'Task 7', amount: 50.0},
            { date: new Date().getMilliseconds(), label: 'Task 8', amount: 80.0},
            { date: new Date().getMilliseconds(), label: 'Task 9', amount: 5.0}
        ];
    }
	
})();
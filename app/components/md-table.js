/**
 * 
 */
'use strict';

angular.module('material.components.table', ['material.core'])
        .controller('mdTableController', ['$scope', '$filter', mdTableController])
        .directive('mdTable', mdTableDirective)
        .filter('pageFilter', mdTablePageFilter);

/**
 * Create md-table Directive
 */
function mdTableDirective() {
    return {
        restrict: 'E',
        scope: {
            headers: '=',
            headersClass: '=',
            contents: '=',
            contentsClass: '=',
            enableSelection: '=selection',
            select: '&onSelect',
            enableAction: '=action',
            action: '&onAction',
            enablePagination: '=pagination',
            pageCount: '=?',
            contentFilter: '=filter'
        },
        link: mdTableLink,
        controller: mdTableController,
        templateUrl: 'components/md-table.html'
    };
}

/**
 * Create mdTableController
 * 
 * @param {type} $scope
 * @param {type} $filter
 * @returns {undefined}
 */
function mdTableController($scope, $filter) {

    initializeControllerDatas($scope);

    $scope.$watchCollection(function () {
        return $scope.contents;
    },
            function () {
                initializePagination($scope);
            });

    /**
     * Sorting content
     */
    $scope.sort = function (predicate, reverse) {
        $scope.reverse = !reverse;
        $scope.contents = $filter('orderBy')($scope.contents, predicate, $scope.reverse);
        $scope.predicate = predicate;
    }

    /**
     * Display next page
     */
    $scope.next = function () {
        $scope.currentPage = $scope.currentPage + 1;
    }

    /**
     * Display previous page
     */
    $scope.previous = function () {
        $scope.currentPage = $scope.currentPage - 1;
    }

    /**
     * Determine if  "Previous" button is enable
     */
    $scope.previousDisabled = function () {
        return $scope.currentPage == 0;
    }

    /**
     * Determine if  "Next" button is enable
     */
    $scope.nextDisabled = function () {
        return $scope.pages.length == 0 || $scope.currentPage == ($scope.pages.length - 1);
    }

    /**
     * Select the page
     */
    $scope.selectPage = function (pageIndex) {
        $scope.currentPage = pageIndex;
    }

    /* TODO Not implemented yet
     $scope.selectAll = function(checked) {
     checked = !checked;
     console.log(checked);
     }
     */
}

/**
 * Create mdTableLink
 */
function mdTableLink($scope, $element, $attr) {
    $element.attr({
        'role': 'table'
    });
}

/**
 * @return The filter use to paginate
 */
function mdTablePageFilter() {
    return function (contents, selectedPage) {
        var status = contents.$$state.status;
        selectedPage = +selectedPage;
        if (status !== 0) {
            var values = contents.$$state.value;
            return values.slice(selectedPage);
        } else {
            return '';
        }
    };
}

/**
 * Initialization of controller's data
 */
function initializeControllerDatas($scope) {
    $q.when($scope.content);
    // Sorting
    $scope.reverse = true;
    $scope.predicate = '';
    // Pagination
    $scope.currentPage = 0;
    initializePagination($scope);
}

/**
 * Determine the number of pages
 * 
 * @return Pages representing by an array
 */
function initializePagination($scope) {
    var status = $scope.contents.$$state.status;
    var pages = [];
    if (status !== 0) {
        var contents = $scope.contents.$$state.value;
        if (!$scope.pageCount) {
            $scope.pageCount = contents.length;
        }
        var numberOfPages = Math.ceil(contents.length / $scope.pageCount);
        for (var i = 0; i < numberOfPages; i++) {
            pages.push({name: 'page' + i, index: i});
        }
    }
    $scope.pages = pages;
}

/**
 * This method help to create an header object
 * 
 * @param label 
 *            Label of the header (Mandatory)
 * @param contentField 
 *            Link with the content's field (Mantadory)
 * @param contentType 
 *            Nature of content's field (Default => 'text' :
 *            - 'input'
 *            - 'text' 
 *            - 'image'            
 * @param sortableField 
 *            Flag to indicate if the field is sortable
 */
function mdTableHeader(label, contentField, contentType, sortableField) {
    this.label = label;
    this.contentField = contentField;
    this.contentType = contentType || 'text';
    this.sortableField = sortableField || false;
}

/**
 * This method help to create a content object
 * 
 * @param data 
 *            Content data's (Mandatory)
 */
function mdTableContent(data) {
    this.data = data;
}
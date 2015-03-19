/**
 * 
 */
'use strict';

angular.module('material.components.table', ['material.core'])
        .controller('mdTableController', ['$scope', '$filter', '$q', mdTableController])
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
        template: '<div>\
				<table class="md-table">\
			<!-- Header -->\
			<thead>\
				<tr class="md-table-headers-row">\
					<!-- Multiple selection -->\
					<th class="md-table-header" ng-show="enableSelection">\
						<!--\
						<md-checkbox aria-label="Select all" on-change="selectAll(checked)"/>\
						 -->\
					</th>\
					<!-- Content -->\
					<th class="md-table-header" ng-repeat="header in headers" ng-class="headersClass[header.contentField]">\
						<!-- Sortable Field -->\
						<a href ng-if="header.sortableField" ng-click="sort(header.contentField, reverse);">\
							{{header.label}}\
							<span class="md-table-caret" ng-show="reverse && header.contentField == predicate">\
								<img src="https://google.github.io/material-design-icons/navigation/svg/ic_arrow_drop_up_24px.svg">\
							</span>\
							<span class="md-table-caret" ng-show="!reverse && header.contentField == predicate">\
								<img src="https://google.github.io/material-design-icons/navigation/svg/ic_arrow_drop_down_24px.svg">\
							</span>\
							<span class="unsorted" ng-show="!(header.contentField == predicate)">\
							</span>\
						</a>\
						<!-- Unsortable Field -->\
						<span ng-if="!header.sortableField">\
							{{header.label}}\
						</span>\
					</th>\
					<!-- Actions -->\
					<th class="md-table-header" ng-show="enableAction" />\
				</tr>\
			</thead>\
			<!-- Body -->\
			<tbody>\
				<tr class="md-table-content-row" ng-repeat="content in contents | filter: contentFilter | pageFilter: currentPage * pageCount | limitTo: pageCount">\
					<!-- Selection -->\
					<td class="md-table-td-check" ng-show="enableSelection">\
						<md-checkbox aria-label="Select content" ng-model="checkedValue" ng-change="select({checked: checkedValue, selectedContent: content})"></md-checkbox>\
					</td>\
					<!-- Content -->\
					<td ng-model="header" ng-repeat="header in headers">\
						<div ng-switch="header.contentType">\
							<!-- Thumb -->\
							<div class="md-table-thumbs" ng-switch-when="image">\
								<div style="background-image:url({{content[header.contentField]}})"></div>\
							</div>\
							<!-- Text -->\
							<div class="md-table-content" ng-switch-when="text" ng-class="contentsClass[header.contentField]">\
								{{content[header.contentField]}}\
							</div>\
							<!-- Input -->\
							<div class="md-table-content" ng-switch-when="input">\
								<input ng-value="content[header.contentField]" />\
							</div>\
						</div>\
					</td>\
					<!-- Actions -->\
					<td class="md-table-td-more" ng-show="enableAction">\
						<md-button class="md-action" ng-click="action({selectedContent: content})" aria-label="Action">\
							<img src="http://google.github.io/material-design-icons/navigation/svg/ic_more_vert_24px.svg" />\
						</md-button>\
					</td>\
				</tr>\
			</tbody>\
		</table>\
		<!-- Footer / Pagination -->\
		<div class="md-table-footer" layout="row">\
			<span flex></span>\
			<span ng-show="enablePagination">\
				<!-- Previous page -->\
				<md-button aria-label="Previous" class="md-table-footer-item" ng-click="previous()" ng-disabled="previousDisabled();">\
					<img src="http://google.github.io/material-design-icons/hardware/svg/ic_keyboard_arrow_left_24px.svg" />\
				</md-button>\
				<!-- Current page selection -->\
				<a class="md-table-page-link" href ng-repeat="page in pages">\
					<md-button aria-label="Index" class="md-primary md-table-footer-item" ng-click="selectPage(page.index)">\
						<span ng-class="{\'md-table-active-page\': currentPage == page.index}">{{page.index}}</span>\
					</md-button>\
				</a>\
				<!-- Next page -->\
				<md-button aria-label="Next" class="md-table-footer-item" ng-click="next()" ng-disabled="nextDisabled();">\
					<img src="http://google.github.io/material-design-icons/hardware/svg/ic_keyboard_arrow_right_24px.svg" />\
				</md-button>\
			</span>\
		</div>\
	</div>'
    };
}

/**
 * Create mdTableController
 */
function mdTableController($scope, $filter, $q) {

    initializeControllerDatas($scope, $q);

    $scope.$watchCollection(function () {
        return $scope.contents
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
 *			  - 'text' 
 *			  - 'image'            
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
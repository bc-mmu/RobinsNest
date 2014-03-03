// Model (data).
var items = [];

// Create shop module
var shopModule = angular.module('shopItems', ['angularLocalStorage']); //https://github.com/agrublev/angularLocalStorage

// Set up mappings between URLs, sub-pages and controllers.
function textsRouteConfig($routeProvider)
{	
    $routeProvider.when('/', {
        controller: listController,
        templateUrl: 'list.html'
    }).
    // Parameterise the URL by using a colon in front of the id.
    when('/view/:id', {
        controller: detailController,
        templateUrl: 'detail.html'
    }).
    otherwise({
        redirectTo: '/'
    });
}

// Setup routes so that the shopItems module can find them.
shopModule.config(textsRouteConfig);

// Controller exposing full item list.
function listController($scope, $http)
{
	// Get data from server.
	$http.get('getdata.php?format=json').success(function(data, status, headers, config) 
	{
		$scope.items = data;
	});

    // Expose all the shop items in order to show listing.
    $scope.items = items;
	
	// Expose all the basket items in order to show basket listing.
	$scope.basket = new Object(); // basket;
}

// Controller exposing a single item.
function detailController($scope, $routeParams, $http)
{
	// Get data from server.
	$http.get('getdata.php?format=json&id=' + $routeParams.id).success(function(data, status, headers, config) 
	{
		$scope.item = data;
	});
	
    // Expose the selected item in order to show details.
    //$scope.item = items[0];
	//$scope.item = items[$routeParams.id];
}

// Create SubTotal service.
shopModule.factory('SubTotal', function() 
{
	var subTotal = {};

	subTotal.compute = function($scope) 
	{
		var total = 0;
		var len = $scope.basket.length;
		for (var i = 0; i < len; i++)
		{
			total = total + $scope.basket[i].price * $scope.basket[i].qty;
		}
		return total;
	}
	// Finish by returning the helper object.
	return subTotal;
});

// Create Shipping service.
shopModule.factory('Shipping', function() 
{
	var shipping = {};
	
	// Only need to change these 2 lines if the shipping rates change.
	shipping.rate1 = 2.50;
	shipping.rate2 = 6;
	shipping.compute = function($scope) 
	{
		// Get number of items to be shipped.		
		var itemCount = 0;
		var len = $scope.basket.length;
		for (var i = 0; i < len; i++)
		{
			itemCount = itemCount + $scope.basket[i].qty;
		}
		
		if (itemCount == 0)
		{
			return 0;
		}
		else if (itemCount > 0 && itemCount < 4)
		{
			// less than 4 items == shipping rate1
			return shipping.rate1;
		}
		else
		{
			// all other item volumes shipped at rate2
			return shipping.rate2;
		}
	}
	// Finish by returning the helper object.
	return shipping;
});

// Add a controller to the shopModule so we can expose functions to the views.
shopModule.controller('shopController',
	function ($scope, Shipping, SubTotal, storage) // add each additional service to the arguments list in this function's signature 
	{
		// Fill basket with items from previous visit.
		$scope.basket = storage.get('basket'); // basket;
		
		// Expose a function on the scope to add an item to the basket.
		$scope.add = function(itemID, itemTitle, itemPrice, itemQty, index)
		{
			// Check that entered quantity is an integer.
			var intRegex = /^\d+$/;
			if (intRegex.test(itemQty))
			{
				// Update quantity if item is already in the basket.
				var len = $scope.basket.length;
				for (var i = 0; i < len; i++)
				{
					if ($scope.basket[i].id == itemID)
					{
						$scope.basket[i].qty = itemQty;
						storage.clearAll();
						storage.set('basket', $scope.basket);
						return;
					}
				}
				
				// Item not already in basket, so add it.
				$scope.basket.push({ id: itemID, title: itemTitle, price: itemPrice, qty: itemQty });
				storage.clearAll();
				storage.set('basket', $scope.basket);
			}
			else
			{
				alert("Invalid quantity - value must contain only numeric characters.");
			}
		}
		
		// Expose a function on the scope to remove an item from the basket.
		$scope.remove = function(index)
		{
			$scope.basket.splice(index, 1);
			storage.clearAll();
			storage.set('basket', $scope.basket);
		}
		
		// Expose a function on the scope to increment basket item quantity.
		$scope.inc = function(index)
		{
			// Only a maximum of 10 of each item can be ordered.
			if ($scope.basket[index].qty < 10)
			{
				$scope.basket[index].qty++;				
			}
			
			storage.clearAll();
			storage.set('basket', $scope.basket);
		}
		
		// Expose a function on the scope to decrement basket item quantity.
		$scope.dec = function(index)
		{
			$scope.basket[index].qty--;
			
			// Remove item from basket if quantity has been set to zero.
			if ($scope.basket[index].qty == 0)
			{
				$scope.basket.splice(index, 1);				
			}
			
			storage.clearAll();
			storage.set('basket', $scope.basket);
		}
		
		// Expose a function on the scope to calculate value of all items in basket (excluding shipping).
		$scope.getSubTotal = function()
		{
			// Use SubTotal service to do the calculation.
			return SubTotal.compute($scope);
		}
		
		// Expose a function on the scope to calculate shipping.
		$scope.getShipping = function()
		{
			// Use shipping service to do the calculation.
			return Shipping.compute($scope);
		}
	});
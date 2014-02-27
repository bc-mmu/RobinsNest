// Model (data):
var items = [
    {
        title: "Baseball Cap",
        description: "A stylish black baseball cap.",
        price: 9.99,
		id: 0
    },
    {
        title: "Can Insulator",
        description: "A stylish white can insulator to keep your can chilled.",
        price: 3.99,
		id: 1
    },
    {
        title: "Card Holder",
        description: "Store all your credit cards in this stylish white card holder.",
        price: 1.99,
		id: 2
    },
	{
        title: "Car Flag",
        description: "A white flag that can be attached to a car.",
        price: 1.99,
		id: 3
    },
	{
        title: "Cocktail Shaker",
        description: "A metallic cocktail shaker.",
        price: 9.99,
		id: 4
    },
	{
        title: "Flask",
        description: "A metallic hip flask.",
        price: 3.99,
		id: 5
    },
	{
        title: "Gym Bag",
        description: "A white gym bag.",
        price: 9.99,
		id: 6
    },
	{
        title: "iPad Case",
        description: "A blue protective case for the iPad tablet.",
        price: 6.99,
		id: 7
    },
	{
        title: "Journal",
        description: "A white bound journal for note taking.",
        price: 1.99,
		id: 8
    },
	{
        title: "Key Chain",
        description: "A white plastic key chain.",
        price: 1.49,
		id: 9
    },
	{
        title: "Key Hanger",
        description: "A white key holder with metal hooks to hang your keys from.",
        price: 2.49,
		id: 10
    },
	{
        title: "Mouse Pad",
        description: "A white mousepad to provide a smooth surface for your mouse.",
        price: 2.99,
		id: 11
    },
	{
        title: "Travel Mug",
        description: "A white travel mug made from insulated plastic to keep your drink warm.",
        price: 2.99,
		id: 12
    },
	{
        title: "Trucker Hat",
        description: "A white and black trucker hat.",
        price: 2.99,
		id: 13
    },
	{
        title: "T-Shirt",
        description: "A stylish white t-shirt.",
        price: 3.99,
		id: 14
    },
	{
        title: "Wine Chiller",
        description: "A metallic wine chiller to keep your wine chilled.",
        price: 7.99,
		id: 15
    }
];

// basket - an array of objects
var basket = new Array();

//basket.push({ id: 0, title: "test item1", price: 9.99, qty: 2 });
//basket.push({ id: 1, title: "test item2", price: 3.49, qty: 5 });

//var data = {
//   'manager': ["Prateek","Rudresh","Prashant"], 
//    'employee': ["namit","amit","sushil"], 
//   'hr': ["priya","seema","nakul"]
//};

// Create a module:
//var newsModule = angular.module('newsStories', []);
var shopModule = angular.module('shopItems', []);

// Set up mappings between our URLs, sub-pages and controllers:
function textsRouteConfig($routeProvider)
{	
    $routeProvider.when('/', {
        controller: listController,
        templateUrl: 'list.html'
    }).
    // Notice that we parameterise the URL by using a colon in front of the index:
    when('/view/:index', {
        controller: detailController,
        templateUrl: 'detail.html'
    }).
    otherwise({
        redirectTo: '/'
    });
}

// set up our routes so that the shopItems module can find them:
shopModule.config(textsRouteConfig);

// Controllers (not embedded in the module for brevity):

//function dataController($scope, $http)
//{ 
//	$http.get('getdata.php?format=json').success(function(data, status, headers, config) 
//	{
//		$scope.items = data;
//	});
//});

function listController($scope)
{
    // expose all the shop items in order to show listing:	
    $scope.items = items;
	
	// expose all the basket items in order to show listing:
	$scope.basket = basket;
}

function detailController($scope, $routeParams)
{	
    // expose the selected item in order to show details:
    $scope.item = items[$routeParams.index];
}

// Create Shipping service (any module can use it!):
shopModule.factory('Shipping', function() 
{
	var shipping = {};
	// we only need to change these 2 lines (if the shipping rates change):
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
	// we finish by returning the helper object:
	return shipping;
});

// Add a controller to the shopModule so we can expose functions.
shopModule.controller('shopController',
	function ($scope, Shipping) // add each additional service to the arguments list in this function's signature 
	{
		$scope.basket = basket;
		
		// expose a function for Shipping calculation on the scope:
		$scope.getShipping = function()
		{
			// use our service to do the calculation:
			return Shipping.compute($scope);
		}
		
		// Add an item to the basket.
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
						return;
					}
				}
				
				// Item not already in basket, so add it.
				$scope.basket.push({ id: itemID, title: itemTitle, price: itemPrice, qty: itemQty });
			}
			else
			{
				alert("Invalid quantity - must contain only numeric characters.");
			}
		}
		
		// Remove an item from the basket.
		$scope.remove = function(index)
		{
			$scope.basket.splice(index, 1);
		}
		
		// Increment basket item quantity.
		$scope.inc = function(index)
		{
			// Only a maximum of 10 of each item can be ordered.
			if ($scope.basket[index].qty < 10)
			{
				$scope.basket[index].qty++;
			}
		}
		
		// Decrement basket item quantity.
		$scope.dec = function(index)
		{
			$scope.basket[index].qty--;
			
			// Remove item from basket if quantity has been set to zero.
			if ($scope.basket[index].qty == 0)
			{
				$scope.basket.splice(index, 1);
			}
		}
		
		// Return value of books in basket.
		$scope.getSubTotal = function()
		{
			var total = 0;
			var len = $scope.basket.length;
			for (var i = 0; i < len; i++)
			{
				total = total + $scope.basket[i].price * $scope.basket[i].qty;
			}
			return total;
		}
		
		// Return value of books in basket plus total shipping.
		$scope.getTotal = function()
		{
			var total = 0;
			var len = $scope.basket.length;
			for (var i = 0; i < len; i++)
			{
				total = total + $scope.basket[i].price * $scope.basket[i].qty;
			}
			return total + Shipping.compute($scope);
		}
	});
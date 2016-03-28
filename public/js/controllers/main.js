angular.module('todoController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
		$scope.formData = {};
		$scope.time = new Date();
		$scope.limit = 20;
		$scope.loading = true;
		$scope.van_available = 4;
		$scope.item_selected = 0;
		$scope.items = [];

		// setInterval run the code inside after every 1 second
		setInterval(function(){
			$scope.time = new Date();
			$scope.duringTheDay = true;
			// CHECKS FOR THE TIME SLOTS AVAILABILITY
			if(($scope.time.getHours() < 9
				|| $scope.time.getHours() > 18)
				|| ($scope.time.getHours() > 13
					&& $scope.time.getHours() < 14)) {
				$scope.duringTheDay = false;
			}
			// UPDATION OF VAN AVAILABILITY
			if($scope.lastFourSlots.length > 0) {
				for(var i in $scope.lastFourSlots) {
					var date = new Date($scope.lastFourSlots[i].created_at);
					if($scope.time.getTime() - date.getTime() > 7200000){
						$scope.lastFourSlots.splice(i,1);
						$scope.van_available++;
					};
				}
			}
			// $$phase is a flag set while angular is in a $digest cycle.
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		}, 1000);

		// WHEN SUBMITTING THE ADD FORM, UPADTE IT INTO ITEM ARRAY 
		$scope.createData = function() {
			if ($scope.formData.text != undefined
				&& $scope.items.length < $scope.limit) {
				$scope.loading = true;
				$scope.items.push($scope.formData);
				$scope.item_selected += 1;
				$scope.loading = false;
				$scope.formData = {}; 
			}
		};

		// REMOVE THE ITEM FROM ITEM ARRAY
		$scope.deleteItem = function(id) {
			$scope.loading = true;
			$scope.items.splice(id,1);
			$scope.item_selected -= 1;
			$scope.loading = false;	
		};

		// WHEN SUBMIT A SLOT, SUBMIT THE ITEM ARRAY TO NODE API
		$scope.launchSlot = function() {			
			if ($scope.items.length == $scope.limit
				&& $scope.van_available > 0) {
				$scope.loading = true;
				var data = {
					created_at: new Date,
					items: $scope.items
				}

				// call the create function from our service (returns a promise object)
				Todos.create(data)
					.success(function(data) {
						$scope.lastFourSlots = data;
						$scope.van_available = 4 - $scope.lastFourSlots.length;
						$scope.loading = false;
						$scope.formData = {};
						$scope.item_selected = 0;
						$scope.items = [];
					});

			};
		};
		// WHEN LANDING ON THE PAGE, GET LAST 4 SUBMITTED ITEM AND SHOW THEM
		Todos.get()
			.success(function(data) {
				$scope.lastFourSlots = data;
				$scope.van_available = $scope.van_available - $scope.lastFourSlots.length;
				$scope.loading = false;
			});
	}]);
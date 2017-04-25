'use strict';


angular.module('ngCart', ['ngCart.directives'])

    .config([function () {

    }])

    .provider('$ngCart', function () {
        this.$get = function () {
        };
    })

    .run(['$rootScope', 'ngCart','ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

        $rootScope.$on('ngCart:change', function(){
            ngCart.$save();
        });

        if (angular.isObject(store.get('cart'))) {
            ngCart.$restore(store.get('cart'));

        } else {
            ngCart.init();
        }

    }])

    .service('ngCart', ['$rootScope', '$http', '$location', '$state', '$window', 'ngCartItem', 'store', function ($rootScope, $http, $location, $state, $window, ngCartItem, store) {
        var myTimeout;

        this.init = function(){
            this.$cart = {
                shipping : null,
                taxRate : null,
                tax : null,
                items : []
            };
        };

        this.addItem = function (id, sku, name, price, quantity, data, attr) {
            var that = this;
            var timerAmount = 60000;
            var inCart = this.getItemBySku(sku);

            if (typeof inCart === 'object'){
                //Update quantity of an item if it's already in the cart
                var diff;
                var inCartQ = inCart.getQuantity();
                if (inCart._data.product_type === "ticket"){
                    diff = quantity - inCartQ;
                    var data = {
                        ticketId: inCart.parent,
                        ticketCount: diff
                    }
                    $http.post('/store/changeSessionTicket', data).then(function(){
                        console.log("success");
                        clearTimeout(myTimeout);
                        $rootScope.$broadcast('setTimer', true);
                        console.log("should be restarting timer");
                        myTimeout = setTimeout(function(){ 
                            that.removeTickets();
                            $rootScope.$broadcast('setTimer', false);
                        }, timerAmount);
                        inCart.setQuantity(quantity, false);
                        $rootScope.$broadcast('ngCart:itemUpdated', inCart);
                    }, function(err){
                    // didn't work
                        console.log(err);
                        $rootScope.$broadcast('lowCount', {bool: true, originalVal: inCartQ});
                    });

                } else {
                inCart.setQuantity(quantity, false);
                $rootScope.$broadcast('ngCart:itemUpdated', inCart);
                }

            } else {
                var newItem = new ngCartItem(id, sku, name, price, quantity, data, attr);
                if (newItem._data.product_type === "ticket"){
                    console.log("A ticket was added! ",newItem);
                    var data = {
                        ticketId: newItem.parent,
                        ticketCount: newItem.quantity
                    }
                    $http.post('/store/addSessionTicket', data).then(function(){
                    $rootScope.$broadcast('setTimer', true);
                    myTimeout = setTimeout(function(){ 
                        that.removeTickets();
                        $rootScope.$broadcast('setTimer', false);
                    }, timerAmount);
                }, function(err){
                    // didn't work
                        console.log(err);
                    });
          
                }
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('ngCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngCart:change', {});
        };

        this.addItemBtn = function (id, sku, name, price, quantity, data) {
            var count = 0;
            var skuParsed = JSON.parse(sku);
            for (var prop in skuParsed){
                console.log("prop: ",skuParsed[prop]);
                count++;
            }
            console.log("count is : ",count);
            if (count < 2){
            var inCart = this.getItemBySku(sku);

            if (typeof inCart === 'object'){
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, false);
                $rootScope.$broadcast('ngCart:itemUpdated', inCart);
            } else {
                var newItem = new ngCartItem(id, sku, name, price, quantity, data);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('ngCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngCart:change', {});
            } else {
                $location.url('/store/'+ id);
            }
        };


        this.changeQuantity = function (sku, quantity){
            var inCart = this.getItemBySku(sku);
            if (typeof inCart === 'object'){
            inCart.setQuantity(quantity, true);
            $rootScope.$broadcast('ngCart:itemUpdated', inCart);
            } else {
                console.log("nothing there");
            }
            $rootScope.$broadcast('ngCart:change', {});
        }


        this.getItemById = function (itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if  (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

         this.getItemBySku = function (itemSku) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if  (item.getSku() === itemSku) {
                    build = item;
                }
            });
            return build;
        };

        this.setShipping = function(shipping){
            this.$cart.shipping = shipping;
            $rootScope.$broadcast('ngCart:change', {});
            return this.getShipping();
        };

        this.getShipping = function(){
            if (this.getCart().items.length == 0) return 0;
            return  this.getCart().shipping;
        };

        this.setTaxRate = function(taxRate){
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            $rootScope.$broadcast('ngCart:change', {});
            return this.getTaxRate();
        };

        this.getTaxRate = function(){
            return this.$cart.taxRate
        };

        this.getTax = function(){
            return Math.round(((this.getSubTotal()/100) * this.getCart().taxRate ));
        };

        this.setCart = function (cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function(){
            return this.$cart;
        };

        this.getItems = function(){
            return this.getCart().items;
        };

        this.getTotalItems = function () {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function (item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function () {
            return this.getCart().items.length;
        };

        this.getCartTotal = function(){
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            return parseFloat(total);
        };

        this.getSubTotal = function(){
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            var shipping = this.getShipping() || 0;
                total += shipping;
            return parseFloat(total);
        };

        this.removeTickets = function(){
            var _self = this;
            angular.forEach(this.getCart().items, function (item, i) {
                if (item._data.product_type === "ticket"){
                    _self.removeItem(i);
                }
            });
        };

        this.totalCost = function () {
            return +parseInt(this.getCartTotal() + this.getShipping() + this.getTax());
        };

        this.removeItem = function (index) {
            var item = this.$cart.items.splice(index, 1)[0] || {};
            $rootScope.$broadcast('ngCart:itemRemoved', item);
            $rootScope.$broadcast('ngCart:change', {});

        };

        this.removeItemById = function (id) {
            var item;
            var cart = this.getCart();
            angular.forEach(cart.items, function (item, index) {
                if(item.getId() === id) {
                    item = cart.items.splice(index, 1)[0] || {};
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('ngCart:itemRemoved', item);
            $rootScope.$broadcast('ngCart:change', {});
        };

        this.empty = function () {
            
            $rootScope.$broadcast('ngCart:change', {});
            this.$cart.items = [];
            $window.localStorage.removeItem('cart');
        };
        
        this.isEmpty = function () {
            
            return (this.$cart.items.length > 0 ? false : true);
            
        };

        this.toObject = function() {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function(item){
                items.push (item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                items:items
            }
        };


        this.$restore = function(storedCart){
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.taxRate = storedCart.taxRate;
            _self.$cart.tax = storedCart.tax;

            angular.forEach(storedCart.items, function (item) {
                console.log("item: ",item);
                _self.$cart.items.push(new ngCartItem(item.parent, item.sku, item.description, item.amount, item.quantity, item._data, item.attr));
            });
            this.$save();
        };



        this.$save = function () {
            return store.set('cart', angular.toJson(this.getCart()));
        }

    }])

    .factory('ngCartItem', ['$rootScope', '$log', function ($rootScope, $log) {

        var item = function (id, sku, name, price, quantity, data, attr) {
            console.log("what is id? ",id);
            console.log("what is data? ",data);

            // if (myData.product_type === 'ticket'){
            //     myData.unix = data.date;
            // } else if (myData.product_type === 'shippable'){
            //     myData.ship_details = data.ship_details;
            // }
            
            this.setId(id);
            this.setSku(sku);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
            this.setAttr(attr || data.attr);
        };


        item.prototype.setId = function(id){
            if (id)  this.parent = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.setSku = function(sku){
            if (sku)  this.sku = sku;
            else {
                $log.error('A sku must be provided');
            }
        };

        item.prototype.getId = function(){
            return this.parent;
        };

        item.prototype.getSku = function(){
            return this.sku;
        };


        item.prototype.setName = function(name){
            if (name)  this.description = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function(){
            return this.description;
        };

        item.prototype.setPrice = function(price){
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    $log.error('A price must be over 0');
                } else {
                    this.amount = (priceFloat);
                }
            } else {
                $log.error('A price must be provided');
            }
        };
        item.prototype.getPrice = function(){
            return this.amount;
        };

    
        item.prototype.setQuantity = function(quantity, relative){


            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0){
                if (relative === true){
                    this.quantity  += quantityInt;
                } else {
                    this.quantity = quantityInt;
                }
                if (this.quantity < 1) this.quantity = 1;

            } else {
                this.quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }


        };

        item.prototype.getQuantity = function(){
            return this.quantity;
        };

        item.prototype.setData = function(data){
            console.log("setting data");
            if (data) this._data = data;
        };

        item.prototype.getData = function(){
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };

        item.prototype.setAttr = function(attributes){
            if (attributes) this.attr = attributes;
        };

        item.prototype.getAttr = function(){
            if (this.attr){
                return this.attr;
            } 
            else {
                return false;
            };
        };
        



        item.prototype.getTotal = function(){
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function() {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                data: this.getData(),
                total: this.getTotal()
            }
        };

        return item;

    }])

    .service('store', ['$window', function ($window) {

        return {

            get: function (key) {
                if ( $window.localStorage.getItem(key) )  {
                    var cart = angular.fromJson( $window.localStorage.getItem(key) ) ;
                    return JSON.parse(cart);
                }
                return false;

            },


            set: function (key, val) {

                if (val === undefined) {
                    $window.localStorage.removeItem(key);
                } else {
                    $window.localStorage.setItem( key, angular.toJson(val) );
                }
                return $window.localStorage.getItem(key);
            }
        }
    }])

    .controller('CartController',['$scope','$rootScope', 'ngCart','$timeout', function($scope, $rootScope, ngCart, $timeout) {
        $scope.loaded = false;
        $scope.toggleCart = false;
        $scope.ngCart = ngCart;
        $timeout(function(){
            $scope.loaded = true;
        })

          var items = ngCart.getItems();
            // loop to determine if any items are shippable
            console.log("items before filtering shippable: ",items);
            var filtered = [];
            angular.forEach(items, function(item) {
                if (item._data.shippable === true) {
                    filtered.push(item);
                }
            });
            if (filtered.length > 0){
                console.log("should be set shippable!!!!");
                $scope.shipBool = true;
                $scope.$emit('setShippable', true);
            } else {
                console.log("should not be shippable!!!!");
                $scope.shipBool = false;
                $scope.$emit('setShippable', false);
            }

        

    }])

    .controller('CartBtnController',['$scope', 'ngCart','$timeout', function($scope, ngCart, $timeout) {
        
        $scope.loaded = false;
        $scope.toggleCart = false;
        $scope.ngCart = ngCart;
        $timeout(function(){
            $scope.loaded = true;
        })

    }])

    .value('version', '1.0.0');
;'use strict';


angular.module('ngCart.directives', ['ngCart.fulfilment'])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {
        
        $scope.ngCart = ngCart;

        
        
    }])

          .directive('ngcartAddBtn', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartBtnController',
            scope: {
                id:'@',
                sku: '@',
                name:'@',
                quantity:'@',
                quantityMax:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/addtocartBtn.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return  ngCart.getItemBySku(attrs.sku);
                };

                if (scope.inCart()){
                    scope.q = ngCart.getItemBySku(attrs.sku).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.qtyOpt =  [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

            }

        };
    }])

    .directive('ngcartAddtocart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {
                id:'@',
                sku: '@',
                name:'@',
                quantity:'@',
                quantityMax:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/addtocart.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return  ngCart.getItemBySku(attrs.sku);
                };

                if (scope.inCart()){
                    scope.q = ngCart.getItemBySku(attrs.sku).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                 scope.qtyOpt =  [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

                
              

            }

        };
    }])

    .directive('ngcartAddtocartProduct', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {
                id:'@',
                sku: '@',
                name:'@',
                attr: '@',
                quantity:'@',
                quantityMax:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/addtocartProduct.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return  ngCart.getItemBySku(attrs.sku);
                };

                if (scope.inCart()){
                    scope.q = ngCart.getItemBySku(attrs.sku).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.updateQ = function(count){
                    console.log("count should be: ",count);
                    scope.qtyOpt =  [];
                    for (var i = 1; i <= count; i++) {
                        scope.qtyOpt.push(i);
                    }
                }
                scope.updateQ(scope.quantityMax);

                scope.$on('changeQ',function(event, data){
                    console.log("data in $on? ",data);
                    console.log("updating in directive!")
                scope.updateQ(data.count); 
                });
                    

                

            }

        };
    }])



    .directive('ngcartCart', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/cart.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartSummary', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/summary.html';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }])

     .directive('ngcartCartConfirm', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/cart-confirm.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartSmallCart', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/small-cart.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartSmallCartCollapse', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'views/ngCart/small-cart-collapse.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartCheckout', [function(){
        return {
            restrict : 'E',
            controller : ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfilmentProvider', function($rootScope, $scope, ngCart, fulfilmentProvider) {
                $scope.ngCart = ngCart;

                $scope.checkout = function () {
                    fulfilmentProvider.setService($scope.service);
                    fulfilmentProvider.setSettings($scope.settings);
                    fulfilmentProvider.checkout()
                        .success(function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_succeeded', data);
                        })
                        .error(function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_failed', {
                                statusCode: status,
                                error: data
                            });
                        });
                }
            }]),
            scope: {
                service:'@',
                settings:'='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'template/ngCart/checkout.html';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }]);
;
angular.module('ngCart.fulfilment', [])
    .service('fulfilmentProvider', ['$injector', function($injector){

        this._obj = {
            service : undefined,
            settings : undefined
        };

        this.setService = function(service){
            this._obj.service = service;
        };

        this.setSettings = function(settings){
            this._obj.settings = settings;
        };

        this.checkout = function(){
            var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
              return provider.checkout(this._obj.settings);

        }

    }])


.service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function($q, $log, ngCart){

        this.checkout = function(){

            var deferred = $q.defer();

            $log.info(ngCart.toObject());
            deferred.resolve({
                cart:ngCart.toObject()
            });

            return deferred.promise;

        }

 }])

.service('ngCart.fulfilment.http', ['$http', 'ngCart', function($http, ngCart){

        this.checkout = function(settings){
            return $http.post(settings.url,
                { data: ngCart.toObject(), options: settings.options});
        }
 }])


.service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function($http, ngCart){


}]);

angular.module('SistersCtrls')


  .controller('AdminMainCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "Auth", function ($scope, $state, $http, $timeout, $location, $sessionStorage, Auth) {
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    main.style.padding = '0';
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.auth = Auth;

    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });
  }])

  .controller('AdminSidebarCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "$window", "Auth", function ($scope, $state, $http, $timeout, $location, $sessionStorage, $window, Auth) {
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.activePill = $state.current.activetab;
    $scope.subPill = $state.current.activesub || null;

    $scope.goToPage = function (url) {
      $location.url(url);
    }

    $scope.model = {
      name: 'Tabs'
    };
  }])

  .controller('AdminOrdersCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "Auth", "Orders", "ReturnCompleteOrders", "ReturnPendingOrders", function ($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, Orders, ReturnCompleteOrders, ReturnPendingOrders) {
    $scope.completeOrders = ReturnCompleteOrders(Orders);
    $scope.pendingOrders = ReturnPendingOrders(Orders);
    $scope.orders = $scope.completeOrders;
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.auth = Auth;

    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      // console.log("firebase user is ",$scope.firebaseUser);
    });
  }])

  .controller('AdminProductsCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "Auth", "allProducts", function ($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, allProducts) {

    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    $scope.$emit('loadMainContainer', 'loaded');

    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.products = allProducts;

    $scope.addProduct = function () {
      $state.go('admin.products-add');
    }

    $scope.editProduct = function (id) {
      $state.go('admin.products-edit', { id: id });
    }

    $scope.deleteProduct = function (i) {
      allProducts.$remove(allProducts[i]).then(function (ref) {
        console.log("deleted");
      });
    }
  }])


  .controller('AdminProductsInventoryCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "Auth", "allProducts", "UpdateAllCounts", function ($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, allProducts, UpdateAllCounts) {

    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.auth = Auth;

    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.products = allProducts;

    $scope.getFirstSkuCount = function (obj) {
      var sku = obj[Object.keys(obj)[0]];
      return sku.count;
    }

    $scope.setFirstSkuCount = function (obj, newCount) {
      var sku = obj[Object.keys(obj)[0]];
      sku.count = newCount;
    }

    $scope.updateInventory = function (prods) {
      UpdateAllCounts(allProducts).then(function () {
        console.log("what are products now? ", allProducts);
      })
    }
  }])


  .controller('AdminProductsAddCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "Auth", "ProdSkuFactory", "UploadImages", "HelperService", "Variant", function ($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, ProdSkuFactory, UploadImages, HelperService, Variant) {

    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.auth = Auth;

    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      // console.log("firebase user is ",$scope.firebaseUser);
    });

    $scope.obj = {
      "price": 0
    };
    $scope.newSkus = [];
    $scope.product = {
      variant: {
        bool: false,
        skus: []
      },
      shippable: false,
      active: true,
      product_type: "merch"
    };

    $scope.addVariant = function () {
      var myObj = new Variant();
      $scope.newSkus.push(myObj);
    }

    $scope.deleteVariant = function (index) {
      $scope.newSkus.splice(index, 1);
    }

    $scope.variantUp = function (index) {
      if (index > 0) {
        var temp = $scope.newSkus[index];
        $scope.newSkus[index] = $scope.newSkus[index - 1];
        $scope.newSkus[index - 1] = temp;
      }
    }

    $scope.variantDown = function (index) {
      if (index < $scope.newSkus.length - 1) {
        var temp = $scope.newSkus[index];
        $scope.newSkus[index] = $scope.newSkus[index + 1];
        $scope.newSkus[index + 1] = temp;
      }
    }

    $scope.makeMainImage = function (i) {
      var tmp = $scope.obj.flow.files.splice(i, 1);
      $scope.obj.flow.files.unshift(tmp[0]);
    }


    $scope.submit = function () {
      ProdSkuFactory.get("prod").then(function (id) {
        var productId = HelperService.idGenerator(id, "prod");
        UploadImages($scope.obj.flow.files, "store", productId).then(function (links) {
          $scope.product.images = links;
          $scope.product.id = productId;
          var skus = {};
          ProdSkuFactory.get("sku").then(function (skuNum) {
            var productRef = firebase.database().ref('products/' + productId);
            if ($scope.newSkus.length > 0) {
              var array = $scope.newSkus;
              for (var i = 0; i < array.length; i++) {
                var currentSku = HelperService.idGenerator(skuNum, "sku");
                array[i].changeSku(currentSku);
                array[i].changeProductId(productId);
                array[i].changeIndex(i);
                skus[currentSku] = array[i];
                if (i !== array.length - 1) {
                  skuNum++;
                }
              }
              $scope.product.variant.skus = angular.copy(skus);
              productRef.set($scope.product).then(function () {
                ProdSkuFactory.set(id, "prod");
                ProdSkuFactory.set(skuNum, "sku");
                $state.go('admin.products');
              }, function (error) {
                console.log("ERROR! ", error);
              })
            } else {
              ProdSkuFactory.get("sku").then(function (skuNum) {
                var currentSku = HelperService.idGenerator(skuNum, "sku");
                var masterItem = new Variant(productId, currentSku, null, $scope.obj.price, null, $scope.obj.count)
                skus[currentSku] = masterItem;
                $scope.product.variant.skus = angular.copy(skus);
                productRef.set($scope.product).then(function () {
                  ProdSkuFactory.set(id, "prod");
                  ProdSkuFactory.set(skuNum, "sku");
                  $state.go('admin.products');
                }, function (error) {
                  console.log("ERROR! ", error);
                })
              });
            }
          });
        });
      })
    }
  }])


  .controller('AdminProductsEditCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "Auth", "ProdSkuFactory", "UploadImages", "HelperService", "product", "images", "Variant", function ($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, ProdSkuFactory, UploadImages, HelperService, product, images, Variant) {
    console.log("images: ",images);
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    $scope.$emit('loadMainContainer', 'loaded');

    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.product = product;
    $scope.obj = {};
    $scope.price = "";
    if (product.variant.bool === false) {
      var key = Object.keys(product.variant.skus);
      $scope.obj.price = product.variant.skus[key].price;
      $scope.obj.count = product.variant.skus[key].count;
    } else {
      $scope.obj.price = 0;
    }

    $scope.newSkus = [];

    $scope.addVariant = function () {
      var myObj = new Variant(product.id);
      $scope.newSkus.push(myObj);
      console.log($scope.newSkus);
    }

    $scope.deleteVariant = function (index) {
      $scope.newSkus.splice(index, 1);
    }

    $scope.variantUp = function (index) {
      if (index > 0) {
        var temp = $scope.newSkus[index];
        $scope.newSkus[index] = $scope.newSkus[index - 1];
        $scope.newSkus[index - 1] = temp;
      }
    }

    $scope.variantDown = function (index) {
      if (index < $scope.newSkus.length - 1) {
        var temp = $scope.newSkus[index];
        $scope.newSkus[index] = $scope.newSkus[index + 1];
        $scope.newSkus[index + 1] = temp;
      }
    }

    // fill newSkus array with saved data
    for (prop in product.variant.skus) {
      var skus = product.variant.skus;
      var obj = new Variant(product.id, prop, skus[prop].variantName, skus[prop].price, skus[prop].index, skus[prop].count);
      $scope.newSkus[skus[prop].index] = obj;
    }

    $scope.makeMainImage = function (i) {
      var tmp = $scope.obj.flow.files.splice(i, 1);
      $scope.obj.flow.files.unshift(tmp[0]);
      console.log("after make main image: ",$scope.obj.flow.files);
    }

    $scope.submit = function () {
      $scope.product.product_type = "merch";
      UploadImages($scope.obj.flow.files, "store", product.id).then(function (links) {
        console.log("what are links? ",links);
        $scope.product.images = links;
        var skus = {};
        ProdSkuFactory.get("sku").then(function (skuResult) {
          var skuNum = skuResult;
          if ($scope.product.variant.bool === true) {
            if ($scope.newSkus.length === 0) {
              alert('Either select "No Variants" or add some.');
              return;
            }
            for (var i = 0; i < $scope.newSkus.length; i++) {
              if ($scope.newSkus[i].id === null) {
                var currentSku = HelperService.idGenerator(skuNum, "sku");
                $scope.newSkus[i].id = currentSku;
                $scope.newSkus[i].changeIndex(i);
                skus[currentSku] = $scope.newSkus[i];
                if (i !== $scope.newSkus.length - 1) {
                  skuNum++;
                }
              } else {
                $scope.newSkus[i].changeIndex(i);
                skus[$scope.newSkus[i].id] = $scope.newSkus[i];
              }
            }
            ProdSkuFactory.set(skuNum, "sku");
            product.variant.skus = skus;
            product.$save().then(function (ref) {
              ref.key === obj.$id; // true
              $state.go('admin.products');
            }, function (error) {
              console.log("Error:", error);
            });
          } else {
            if ($scope.price === 0) {
              alert("please enter a price for this item.")
              return;
            }
            ProdSkuFactory.get("sku").then(function (skuNum) {
              var currentSku = HelperService.idGenerator(skuNum, "sku");
              var masterItem = new Variant(product.id, currentSku, null, $scope.obj.price, null, $scope.obj.count);
              skus[currentSku] = masterItem;
              product.variant.skus = skus;
              product.$save().then(function (ref) {
                ref.key === obj.$id; // true
                $state.go('admin.products');
              }, function (error) {
                console.log("Error:", error);
              });
            });
          }
        });
      });
    }

    // make into service to use in resolve (with $q) !!!!!!
    $timeout(function () {
      if (images.length > 0) {
        console.log("images exist");
        for (var i = 0; i < images.length; i++) {
          var blob = images[i];
          console.log("blob: ", images[i]);
          console.log("flow: ", $scope.obj);
          $scope.obj.flow.addFile(blob);
        }
      }
    }, 100)
  }])


  .controller('AdminTicketsCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "Auth", "Tickets", function ($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, Tickets) {
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    main.style.padding = '0';
    $scope.tickets = Tickets;
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.auth = Auth;

    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });
  }])


  .controller('AdminTicketsEachCtrl', ["$scope", "$state", "$http", "$timeout", "$location", "$sessionStorage", "Auth", "ThisTicket", "WillCall", "WillCallToBlob", "FileSaver", "moment", function ($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, ThisTicket, WillCall, WillCallToBlob, FileSaver, moment) {
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    main.style.padding = '0';
    $scope.ticket = ThisTicket;
    // var willCallBlob = WillCallToBlob(WillCall);
    $scope.ticketsSold = $scope.ticket.ticketCapacity - $scope.ticket.totalTickets;

    $scope.chartColors = ['#adadad', '#f891af'];
    $scope.labels = ["Remaining Tickets", "Tickets Sold"];
    $scope.data = [$scope.ticket.totalTickets, $scope.ticketsSold];

    $scope.$emit('loadMainContainer', 'loaded');

    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.downloadList = function () {
      var formatDate = moment($scope.ticket.unix * 1000).format('MM/DD/YYYY');
      var textTitle = $scope.ticket.title + " (" + formatDate + ")";
      var blob = WillCallToBlob(WillCall, textTitle);
      FileSaver.saveAs(blob, moment($scope.ticket.unix * 1000).format('MM-DD-YYYY') + '.txt');
    }
  }])


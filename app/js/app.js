var authWait = ["Auth", function(Auth) { return Auth.$waitForSignIn(); }]
var authRequire = ["Auth", function(Auth) { return Auth.$requireSignIn(); }]

angular.module("SistersApp", ['SistersCtrls','SistersDirectives','ui.router','ui.bootstrap','firebase','angularMoment','ngCart','ngStorage','angularPayments','ngAnimate','picardy.fontawesome','textAngular','ui.router.metatags','angular-parallax','angular-google-analytics', 'tableSort','chart.js','ngFileSaver'])



.run(["$rootScope", "$state","$location","$window",'MetaTags','Analytics', function($rootScope, $state, $location, $window,MetaTags,Analytics) {
  $rootScope.MetaTags = MetaTags;
  moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });
  $rootScope.$on('$stateChangeSuccess', function(event) {
   document.body.scrollTop = document.documentElement.scrollTop = 0;

                if (!$window.ga)
                    return;
 
                $window.ga('send', 'pageview', { page: $location.path() });


  });
}])

   .config(['tableSortConfigProvider', function(tableSortConfigProvider){
        var filterString = "<div class='row'>";
        filterString +=      "<div class='col-sm-4 col-md-3 col-sm-offset-8 col-md-offset-9'>";
        filterString +=        "<div class='form-group has-feedback'>";
        filterString +=          "<input type='search' class='form-control' placeholder='filter {{ITEM_NAME_PLURAL}}' ng-model='FILTER_STRING'/>";
        filterString +=          "<span class='glyphicon glyphicon-search form-control-feedback' aria-hidden='true'></span>";
        filterString +=        "</div>";
        filterString +=      "</div>";
        filterString +=    "</div>";
        tableSortConfigProvider.filterTemplate = filterString;

        var pagerString = "<div class='text-center'>";

        pagerString +=      "<ul uib-pagination style='vertical-align:middle;' ng-show='ITEMS_PER_PAGE < TOTAL_COUNT' ng-model='CURRENT_PAGE_NUMBER' ";
        pagerString +=        "total-items='FILTERED_COUNT' items-per-page='ITEMS_PER_PAGE' force-ellipses='false'></ul>";
        pagerString +=      "<div class='form-group' style='display:inline-block;'>";
        pagerString +=      "</div>";
        pagerString +=      "<br/><small class='text-muted'>Showing {{CURRENT_PAGE_RANGE}} {{FILTERED_COUNT === 0 ? '' : 'of'}} ";
        pagerString +=        "<span ng-if='FILTERED_COUNT === TOTAL_COUNT'>{{TOTAL_COUNT | number}} {{TOTAL_COUNT === 1 ? ITEM_NAME_SINGULAR : ITEM_NAME_PLURAL}}</span>";
        pagerString +=        "<span ng-if='FILTERED_COUNT !== TOTAL_COUNT'>{{FILTERED_COUNT | number}} {{FILTERED_COUNT === 1 ? ITEM_NAME_SINGULAR : ITEM_NAME_PLURAL}} (filtered from {{TOTAL_COUNT | number}})</span>";
        pagerString +=      "</small>&nbsp;";
        pagerString +=    "</div>";
        tableSortConfigProvider.paginationTemplate = pagerString;
   }])



.config(['$stateProvider', '$urlRouterProvider','$locationProvider','UIRouterMetatagsProvider','$provide','AnalyticsProvider', function($stateProvider, $urlRouterProvider,$locationProvider, UIRouterMetatagsProvider, $provide, AnalyticsProvider){
  UIRouterMetatagsProvider
        .setDefaultTitle('SISTERS')
        .setDefaultDescription('Seattle duo. "Drink Champagne", the debut album, out Valentine\'s Day 2017!')
        .setStaticProperties({
                'og:site_name': 'SISTERS'
            })
        .setOGURL(true);


        AnalyticsProvider
        .logAllCalls(true)
        .setAccount('UA-85668273-1');

  
  
  
  
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    metaTags: {
                title: 'SISTERS',
                description: 'Seattle duo. "Drink Champagne", the debut album, out Valentine\'s Day 2017!'
            },
    templateUrl: '/views/home.html',
    controller: 'HomeCtrl'
  })
  .state('admin', {
    templateUrl: '/views/admin/adminTemplate.html',
    controller: 'AdminMainCtrl',
    resolve: {
      "currentAuth": authRequire
    }
  })
  .state('admin.main', {
    url: '/admin',
    templateUrl: '/views/admin/adminMain.html',
    controller: 'AdminMainCtrl',
    resolve: {
      "currentAuth": authRequire,
      "Orders": function(GetAllOrders){
        return GetAllOrders().$loaded();
      }    
    },
    activetab: 0
  })
  .state('admin.orders', {
    url: '/admin/orders',
    templateUrl: '/views/admin/adminOrders.html',
    controller: 'AdminOrdersCtrl',
    resolve: {
      "currentAuth": authRequire,
      "Orders": function(GetAllOrders){
        return GetAllOrders().$loaded();
      }    
    },
    activetab: 1
  })
   .state('admin.tickets', {
    url: '/admin/tickets',
    templateUrl: '/views/admin/adminTickets.html',
    controller: 'AdminTicketsCtrl',
    resolve: {
      "currentAuth": authRequire,
      "Tickets": function(GetAllTickets){
        return GetAllTickets().$loaded();
      }    
    },
    activetab: 2
  })

   .state('admin.ticketEach', {
    url: '/admin/tickets/:id',
    templateUrl: '/views/admin/adminTicketEach.html',
    controller: 'AdminTicketsEachCtrl',
    resolve: {
      "currentAuth": authRequire,
      "ThisTicket": function(GetSingleTicket, $stateParams){
        return GetSingleTicket($stateParams.id).$loaded();
      },
      "WillCall": function(ThisWillCall, $stateParams){
        return ThisWillCall($stateParams.id).$loaded();
      },    
    }
  })
  
  .state('about', {
    url: '/about',
    templateUrl: '/views/about.html',
    controller: 'AboutCtrl'
  })

   .state('press', {
    url: '/press',
    templateUrl: '/views/press.html',
    controller: 'PressCtrl'
  })

    .state('contact', {
    url: '/contact',
    templateUrl: '/views/contact.html',
    controller: 'ContactCtrl'
  })

  .state('download', {
    url: '/download/:id',
    resolve: {
      "downloadKey": function(DownloadKeyService, $stateParams){
        return DownloadKeyService($stateParams.id).$loaded();
      }
    },
    onEnter: function($state, $stateParams, $timeout, downloadKey) {
      if (downloadKey === true) {
          $timeout(function() {
                  console.log("success!");
                  // $state.go('downloadConfirm');
              }, 0);
      } else {
          $timeout(function() {
                  console.log("failed!");
                  // $state.go('downloadFailed');
              }, 0);
      }
    }
  })


  .state('blog', {
    templateUrl: '/views/blog/blog.html',
    controller: 'BlogMasterCtrl',
    resolve: {
      "currentAuth": authWait,
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      }      
    }
  })

  .state('blog-new', {
    url: '/blog/new',
    templateUrl: '/views/blog/newBlogPost.html',
    controller: 'NewBlogCtrl',
    resolve: {
      "currentAuth": authRequire,
      "AllTags": function(AllTagsService){
        return AllTagsService().$loaded();
      }
    }
  })
  .state('blog-edit', {
    url: '/blog/edit/:slug',
    templateUrl: '/views/blog/editBlogPost.html',
    controller: 'EditBlogCtrl',
    resolve: {
      "currentAuth": authRequire,
      "AllTags": function(AllTagsService){
        return AllTagsService().$loaded();
      },
      "thisPost": function($stateParams, ThisPostService){
        return ThisPostService($stateParams.slug).$loaded();
      }
    }
  })
  .state('blog-tags-edit', {
    url: '/blog/editTags/',
    templateUrl: '/views/blog/editTags.html',
    controller: 'EditBlogTagsCtrl',
    resolve: {
      "currentAuth": authRequire,
      "AllTags": function(AllTagsService){
        return AllTagsService().$loaded();
      }
    }
  })

  .state('blog.main', {
    url: '/blog',
    metaTags: {
            title: 'SISTERS - Blog',
            description: 'Updates, news, and commentary from Seattle band SISTERS.'
        },
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogCtrl',
    resolve: {
      "currentAuth": authWait
    }
  })
    .state('blog.page', {
    url: '/blog/:page',
    metaTags: {
            title: 'SISTERS - Blog',
            description: 'Updates, news, and commentary from Seattle band SISTERS.'
        },
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogCtrl',
    resolve: {
      "currentAuth": authWait     
    }
  })

     .state('blog.archive', {
    url: '/blog/archives/:year/:month',
    metaTags: {
            title: 'SISTERS - Blog',
            description: 'Updates, news, and commentary from Seattle band SISTERS.'
        },
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogArchiveCtrl',
    resolve: {
      "currentAuth": authWait,
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      },
      "Archive": function($stateParams, ArchiveShowService){
        return ArchiveShowService($stateParams.year, $stateParams.month).$loaded();
      }      
    }
  })

    .state('blog.archivePage', {
      url: '/blog/archives/:year/:month/:page',
      metaTags: {
            title: 'SISTERS - Blog',
            description: 'Updates, news, and commentary from Seattle band SISTERS.'
        },
      templateUrl: '/views/blog/blog-content.html',
      controller: 'BlogArchiveCtrl',
      resolve: {
        "currentAuth": authWait,
        "Blog": function(BlogPosts){
          return BlogPosts().$loaded();
        },
        "Archive": function($stateParams, ArchiveShowService){
          return ArchiveShowService($stateParams.year, $stateParams.month).$loaded();
        }

      }
    })

    .state('blog.tags', {
    url: '/blog/tags/:tagName',
    metaTags: {
            title: 'SISTERS - Blog',
            description: 'Updates, news, and commentary from Seattle band SISTERS.'
        },
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogTagsCtrl',
    resolve: {
      "currentAuth": authWait,
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      },
      "TagsShow": function($stateParams, TagsShowService){
        return TagsShowService($stateParams.tagName).$loaded();
      }      
    }
  })



  .state('blog.show', {
    url: '/blog/show/:slug',
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogShowCtrl',
    resolve: {
      "currentAuth": authWait,
      "thisPost": function($stateParams, ThisPostService){        
        return ThisPostService($stateParams.slug).$loaded();
      },
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      }       
    },
    metaTags: {
            title: function(thisPost){
              console.log("what is Blog? ",thisPost);
              var title = "SISTERS - " + thisPost[0].postTitle;
              return title;
            },
            description: function(thisPost){
              return thisPost[0].postBody;
            }
        },
  })
  


  .state('shows', {
    url: '/shows',
    metaTags: {
            title: 'SISTERS - Shows',
            description: 'Upcoming shows for Seattle duo SISTERS.'
        },
    templateUrl: '/views/shows/shows.html',
    controller: 'ShowsCtrl',
    resolve: {
      "currentAuth": authWait,
      getShows: function(GetShows){
        console.log("app resolve entered");
        return GetShows().$loaded();
      }
    }
  })

  .state('shows-new', {
    url: '/shows/new',
    templateUrl: '/views/shows/newShow.html',
    controller: 'NewShowCtrl',
    resolve: {
      "currentAuth": authWait,
      getShows: function(GetShows){
        console.log("app resolve entered");
        return GetShows().$loaded();
      }
    }
  })

  .state('showTickets', {
    url: '/shows/:showId',
    templateUrl: '/views/shows/singleShow.html',
    controller: 'SingleShowCtrl',
      resolve: {
      "currentAuth": authWait,
      "GetShow": function(GetSingleShow, $stateParams){
        return GetSingleShow($stateParams.showId).$loaded();
      },
       "GetTicket": function(ticketFactory, $stateParams){
         console.log("state params! ",$stateParams);
        return ticketFactory.getTicket($stateParams.showId);
      }
    }
  })

  .state('store', {
    url: '/store',
    metaTags: {
            title: 'SISTERS - Store',
            description: 'The official store for Seattle duo SISTERS.'
        },
    templateUrl: '/views/store/store.html',
    controller: 'StoreCtrl',
    resolve: {
      "currentAuth": authWait,
      "allProducts": function(ProductsService){
        return ProductsService.allProducts();
      }
    }
  })

  .state('addProduct', {
    url: '/store/add',
    templateUrl: '/views/store/addProduct.html',
    controller: 'StoreProductAddCtrl',
    resolve: {
      "currentAuth": authRequire
    }
  })




  .state('storeCart', {
    url: '/store/cart',
    templateUrl: '/views/store/cart.html',
    controller: 'StoreCartCtrl',
    resolve: {
      "currentAuth": authWait
    }
  })

  .state('storeShow', {
    url: '/store/:id',
    templateUrl: '/views/store/storeShow.html',
    controller: 'StoreShowCtrl',
    resolve: {
      "currentAuth": authWait,
      "oneProduct": function(ProductsService, $stateParams){
        console.log("params are: ",$stateParams);
        return ProductsService.oneProduct($stateParams.id).$loaded();
      }
    }
  })


   .state('editProduct', {
    url: '/store/edit/:id',
    templateUrl: '/views/store/editProduct.html',
    controller: 'StoreProductEditCtrl',
    resolve: {
      "currentAuth": authRequire,
      "oneProduct": function(ProductsService, $stateParams){
        return ProductsService.oneProduct($stateParams.id);
      }
    }
  })




  .state('checkout', {
    templateUrl: '/views/store/checkoutTemplate.html',
    controller: 'CheckoutTemplateCtrl',
    resolve: {
      "currentAuth": authWait,
    }
  })
  .state('checkout.address', {
    url: '/store/checkout/address',
    templateUrl: '/views/store/checkoutAddress.html',
    controller: 'StoreAddressCtrl',
    resolve: {
      "currentAuth": authWait
    }
  })
  .state('checkout.payment', {
    url: '/store/checkout/payment',
    templateUrl: '/views/store/checkoutPayment.html',
    controller: 'StorePaymentCtrl',
    resolve: {
      "currentAuth": authWait,
      "currentOrder": function($http){
        return $http({method: 'GET', url: '/storeAPI/order'})
      },
      "shipment": function($http){
        return $http({method: 'GET', url: '/storeAPI/shipment'})
      }
    }
  })

   .state('checkout.confirm', {
    url: '/store/checkout/confirm',
    templateUrl: '/views/store/checkoutConfirm.html',
    controller: 'StoreConfirmCtrl',
    resolve: {
      "currentAuth": authWait,
      "AllTickets": function(GetAllTickets){
        return GetAllTickets().$loaded();
      }
    }
  })
  
  
  .state('login', {
    url: '/login',
    templateUrl: '/views/login.html',
    controller: 'LoginCtrl'
  })

  
  $locationProvider.html5Mode(true);

}])



.filter('cut', function () {
  return function (value, enable, wordwise, max, tail) {
    var source = angular.element('<div/>').html(value);
    console.log("source: ",source);
    var length = source.text().length;
    console.log("length: ",length);
  };
})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
  return function(val) {
    return $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+val);
  };
}])


.filter('MomentFilter', ['moment', function(moment){
  return function(val){
    return  moment(val).tz("America/Los_Angeles").format('dddd, MMMM Do, YYYY');
  }
}])

.filter('tooOld', function() {
  return function(events) {
    var currentDay = moment().tz("America/Los_Angeles").unix()
    var filtered = [];
    angular.forEach(events, function(event) {
      var thisEvent = event.unixDate/1000;
      if ((currentDay - thisEvent) <= 86400) {
        filtered.push(event);
      }
    });
    return filtered;
  };
})

.filter('DeliveryEstDate', ['moment', function(moment){
  return function(val){
    return  moment(val).tz("America/Los_Angeles").format('dddd, MMMM Do');
  }
}])

.filter('TimeDate', ['moment', function(moment){
  return function(val){
    return  moment(val).tz("America/Los_Angeles").format('MMMM Do YYYY, h:mm:ss a');
  }
}])

.filter('slashDate', ['moment', function(moment){
  return function(val){
    console.log("val is: ",val);
    return  moment(val * 1000).tz("America/Los_Angeles").format('MM/DD/YYYY');
  }
}])

.filter('timeAgo', ['moment', function(){
  return function(val){
    var date = new Date(val);
    console.log(date);
    console.log(typeof date);
    return moment(date).tz("America/Los_Angeles").fromNow();
  }
}])

.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  })



.filter('centsToDollars', function(){
  return function(val){
    return  val/100;
  }
});




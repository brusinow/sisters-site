var uiroutermetatags;!function(uiroutermetatags){function runBlock($log,$rootScope,MetaTags,$window){function stateChangeStart(event,toState,toParams,from,fromParams){$window.prerenderReady=!1}function stateChangeSuccess(event,toState){toState.metaTags||$log.debug('MetaTags - route: "'+toState.name+'" does not contain any metatags'),MetaTags.update(toState.metaTags)}function stateChangeError(event,toState,toParams,fromState,fromParams,error){MetaTags.prerender.statusCode=500,$window.prerenderReady=!0}function stateNotFound(event,unfoundState,fromState){MetaTags.prerender.statusCode=404,$window.prerenderReady=!0}$rootScope.MetaTags=MetaTags,$rootScope.$on("$stateChangeStart",stateChangeStart),$rootScope.$on("$stateChangeSuccess",stateChangeSuccess),$rootScope.$on("$stateChangeError",stateChangeError),$rootScope.$on("$stateNotFound",stateNotFound)}runBlock.$inject=["$log","$rootScope","MetaTags","$window"];var appModule=angular.module("ui.router.metatags",["ui.router"]),UIRouterMetatags=function(){function UIRouterMetatags(){this.prefix="",this.suffix="",this.defaultTitle="",this.defaultDescription="",this.defaultKeywords="",this.defaultRobots="",this.staticProperties={},this.enableOGURL=!1}return UIRouterMetatags.prototype.setTitlePrefix=function(prefix){return this.prefix=prefix,this},UIRouterMetatags.prototype.setTitleSuffix=function(suffix){return this.suffix=suffix,this},UIRouterMetatags.prototype.setDefaultTitle=function(title){return this.defaultTitle=title,this},UIRouterMetatags.prototype.setDefaultDescription=function(description){return this.defaultDescription=description,this},UIRouterMetatags.prototype.setDefaultKeywords=function(keywords){return this.defaultKeywords=keywords,this},UIRouterMetatags.prototype.setDefaultRobots=function(robots){return this.defaultRobots=robots,this},UIRouterMetatags.prototype.setStaticProperties=function(properties){return this.staticProperties=properties,this},UIRouterMetatags.prototype.setOGURL=function(enabled){return this.enableOGURL=enabled,this},UIRouterMetatags.prototype.$get=function(){return{prefix:this.prefix,suffix:this.suffix,defaultTitle:this.defaultTitle,defaultDescription:this.defaultDescription,defaultKeywords:this.defaultKeywords,defaultRobots:this.defaultRobots,staticProperties:this.staticProperties,enableOGURL:this.enableOGURL}},UIRouterMetatags}();appModule.provider("UIRouterMetatags",UIRouterMetatags);var MetaTags=function(){function MetaTags($log,UIRouterMetatags,$interpolate,$injector,$state,$location,$window){this.$log=$log,this.UIRouterMetatags=UIRouterMetatags,this.$interpolate=$interpolate,this.$injector=$injector,this.$state=$state,this.$location=$location,this.$window=$window,this.prerender={}}return MetaTags.$inject=["$log","UIRouterMetatags","$interpolate","$injector","$state","$location","$window"],MetaTags.prototype.update=function(tags){var _this=this;try{this.properties=angular.extend({},this.UIRouterMetatags.staticProperties),this.UIRouterMetatags.enableOGURL&&(this.properties["og:url"]=this.$location.absUrl()),tags?(this.title=tags.title?this.UIRouterMetatags.prefix+(this.getValue("title",tags.title)||"")+this.UIRouterMetatags.suffix:this.UIRouterMetatags.defaultTitle,this.description=tags.description?this.getValue("description",tags.description):this.UIRouterMetatags.defaultDescription,this.keywords=tags.keywords?this.getValue("keywords",tags.keywords):this.UIRouterMetatags.defaultKeywords,this.robots=tags.robots?this.getValue("robots",tags.robots):this.UIRouterMetatags.defaultRobots,angular.forEach(tags.properties,function(value,key){var v=_this.getValue(key,value);v&&(_this.properties[key]=v)})):(this.title=this.UIRouterMetatags.defaultTitle,this.description=this.UIRouterMetatags.defaultDescription,this.keywords=this.UIRouterMetatags.defaultKeywords,this.robots=this.UIRouterMetatags.defaultRobots),tags&&tags.prerender?(this.prerender.statusCode=tags.prerender.statusCode?this.getValue("prerender.statusCode",tags.prerender.statusCode):200,this.prerender.header=tags.prerender.header?this.getValue("rerender.header",tags.prerender.header):null):(this.prerender.statusCode=200,this.prerender.header=null),this.$window.prerenderReady=!0}catch(err){this.$log.error("error occured when extracting metatags:",err)}},MetaTags.prototype.getValue=function(tagType,tag){try{return tag?"number"==typeof tag?tag:"string"==typeof tag&&0===tag.trim().length?null:angular.isFunction(tag)||Array.isArray(tag)?this.$injector.invoke(tag,this,this.$state.$current.locals.globals):this.$interpolate(tag)(this.$state.$current.locals.globals):null}catch(err){return this.$log.error("error occured when trying to get the value of tag:",tagType,err),null}},MetaTags}();appModule.service("MetaTags",MetaTags),appModule.run(runBlock)}(uiroutermetatags||(uiroutermetatags={}));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVpLXJvdXRlci1tZXRhdGFncy5qcyJdLCJuYW1lcyI6WyJ1aXJvdXRlcm1ldGF0YWdzIiwicnVuQmxvY2siLCIkbG9nIiwiJHJvb3RTY29wZSIsIk1ldGFUYWdzIiwiJHdpbmRvdyIsInN0YXRlQ2hhbmdlU3RhcnQiLCJldmVudCIsInRvU3RhdGUiLCJ0b1BhcmFtcyIsImZyb20iLCJmcm9tUGFyYW1zIiwicHJlcmVuZGVyUmVhZHkiLCJzdGF0ZUNoYW5nZVN1Y2Nlc3MiLCJtZXRhVGFncyIsImRlYnVnIiwibmFtZSIsInVwZGF0ZSIsInN0YXRlQ2hhbmdlRXJyb3IiLCJmcm9tU3RhdGUiLCJlcnJvciIsInByZXJlbmRlciIsInN0YXR1c0NvZGUiLCJzdGF0ZU5vdEZvdW5kIiwidW5mb3VuZFN0YXRlIiwiJG9uIiwiJGluamVjdCIsImFwcE1vZHVsZSIsImFuZ3VsYXIiLCJtb2R1bGUiLCJVSVJvdXRlck1ldGF0YWdzIiwidGhpcyIsInByZWZpeCIsInN1ZmZpeCIsImRlZmF1bHRUaXRsZSIsImRlZmF1bHREZXNjcmlwdGlvbiIsImRlZmF1bHRLZXl3b3JkcyIsImRlZmF1bHRSb2JvdHMiLCJzdGF0aWNQcm9wZXJ0aWVzIiwiZW5hYmxlT0dVUkwiLCJwcm90b3R5cGUiLCJzZXRUaXRsZVByZWZpeCIsInNldFRpdGxlU3VmZml4Iiwic2V0RGVmYXVsdFRpdGxlIiwidGl0bGUiLCJzZXREZWZhdWx0RGVzY3JpcHRpb24iLCJkZXNjcmlwdGlvbiIsInNldERlZmF1bHRLZXl3b3JkcyIsImtleXdvcmRzIiwic2V0RGVmYXVsdFJvYm90cyIsInJvYm90cyIsInNldFN0YXRpY1Byb3BlcnRpZXMiLCJwcm9wZXJ0aWVzIiwic2V0T0dVUkwiLCJlbmFibGVkIiwiJGdldCIsInByb3ZpZGVyIiwiJGludGVycG9sYXRlIiwiJGluamVjdG9yIiwiJHN0YXRlIiwiJGxvY2F0aW9uIiwidGFncyIsIl90aGlzIiwiZXh0ZW5kIiwiYWJzVXJsIiwiZ2V0VmFsdWUiLCJmb3JFYWNoIiwidmFsdWUiLCJrZXkiLCJ2IiwiaGVhZGVyIiwiZXJyIiwidGFnVHlwZSIsInRhZyIsInRyaW0iLCJsZW5ndGgiLCJpc0Z1bmN0aW9uIiwiQXJyYXkiLCJpc0FycmF5IiwiaW52b2tlIiwiJGN1cnJlbnQiLCJsb2NhbHMiLCJnbG9iYWxzIiwic2VydmljZSIsInJ1biJdLCJtYXBwaW5ncyI6IkFBR0EsR0FBSUEsbUJBQ0osU0FBV0Esa0JBNklQLFFBQVNDLFVBQVNDLEtBQU1DLFdBQVlDLFNBQVVDLFNBTTFDLFFBQVNDLGtCQUFpQkMsTUFBT0MsUUFBU0MsU0FBVUMsS0FBTUMsWUFDdEROLFFBQVFPLGdCQUFpQixFQUU3QixRQUFTQyxvQkFBbUJOLE1BQU9DLFNBQzFCQSxRQUFRTSxVQUNUWixLQUFLYSxNQUFNLHNCQUF5QlAsUUFBUVEsS0FBTyxtQ0FFdkRaLFNBQVNhLE9BQU9ULFFBQVFNLFVBRTVCLFFBQVNJLGtCQUFpQlgsTUFBT0MsUUFBU0MsU0FBVVUsVUFBV1IsV0FBWVMsT0FDdkVoQixTQUFTaUIsVUFBVUMsV0FBYSxJQUNoQ2pCLFFBQVFPLGdCQUFpQixFQUU3QixRQUFTVyxlQUFjaEIsTUFBT2lCLGFBQWNMLFdBQ3hDZixTQUFTaUIsVUFBVUMsV0FBYSxJQUNoQ2pCLFFBQVFPLGdCQUFpQixFQXBCN0JULFdBQVdDLFNBQVdBLFNBQ3RCRCxXQUFXc0IsSUFBSSxvQkFBcUJuQixrQkFDcENILFdBQVdzQixJQUFJLHNCQUF1Qlosb0JBQ3RDVixXQUFXc0IsSUFBSSxvQkFBcUJQLGtCQUNwQ2YsV0FBV3NCLElBQUksaUJBQWtCRixlQWpKckN0QixTQUFTeUIsU0FBVyxPQUFRLGFBQWMsV0FBWSxVQUN0RCxJQUFJQyxXQUFZQyxRQUFRQyxPQUFPLHNCQUF1QixjQUNsREMsaUJBQW1CLFdBRW5CLFFBQVNBLG9CQUNMQyxLQUFLQyxPQUFTLEdBQ2RELEtBQUtFLE9BQVMsR0FDZEYsS0FBS0csYUFBZSxHQUNwQkgsS0FBS0ksbUJBQXFCLEdBQzFCSixLQUFLSyxnQkFBa0IsR0FDdkJMLEtB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Q0osS0FBS2lCLFNBQVdqQixLQUFLRCxpQkFBaUJNLGdCQUN0Q0wsS0FBS21CLE9BQVNuQixLQUFLRCxpQkFBaUJPLGVBRXBDd0IsTUFBUUEsS0FBS3hDLFdBQ2JVLEtBQUtWLFVBQVVDLFdBQWF1QyxLQUFLeEMsVUFBVUMsV0FBYVMsS0FBS2tDLFNBQVMsdUJBQXdCSixLQUFLeEMsVUFBVUMsWUFBYyxJQUMzSFMsS0FBS1YsVUFBVWlELE9BQVNULEtBQUt4QyxVQUFVaUQsT0FBU3ZDLEtBQUtrQyxTQUFTLGtCQUFtQkosS0FBS3hDLFVBQVVpRCxRQUFVLE9BRzFHdkMsS0FBS1YsVUFBVUMsV0FBYSxJQUM1QlMsS0FBS1YsVUFBVWlELE9BQVMsTUFFNUJ2QyxLQUFLMUIsUUFBUU8sZ0JBQWlCLEVBRWxDLE1BQU8yRCxLQUNIeEMsS0FBSzdCLEtBQUtrQixNQUFNLDBDQUEyQ21ELE9BR25FbkUsU0FBU29DLFVBQVV5QixTQUFXLFNBQVVPLFFBQVNDLEtBQzdDLElBQ0ksTUFBS0EsS0FHbUIsZ0JBQVJBLEtBQ0xBLElBRWEsZ0JBQVJBLE1BQTBDLElBQXRCQSxJQUFJQyxPQUFPQyxPQUNwQyxLQUVGL0MsUUFBUWdELFdBQVdILE1BQVFJLE1BQU1DLFFBQVFMLEtBQ3ZDMUMsS0FBSzJCLFVBQVVxQixPQUFPTixJQUFLMUMsS0FBTUEsS0FBSzRCLE9BQU9xQixTQUFTQyxPQUFPQyxTQUc3RG5ELEtBQUswQixhQUFhZ0IsS0FBSzFDLEtBQUs0QixPQUFPcUIsU0FBU0MsT0FBT0MsU0FabkQsS0FlZixNQUFPWCxLQUVILE1BREF4QyxNQUFLN0IsS0FBS2tCLE1BQU0scURBQXNEb0QsUUFBU0QsS0FDeEUsT0FHUm5FLFdBRVh1QixXQUFVd0QsUUFBUSxXQUFZL0UsVUEwQjlCdUIsVUFBVXlELElBQUluRixXQUNmRCxtQkFBcUJBIiwiZmlsZSI6InVpLXJvdXRlci1tZXRhdGFncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWV0YXRhZ3MgZm9yIGFuZ3VsYXItdWktcm91dGVyXG4gKi9cbnZhciB1aXJvdXRlcm1ldGF0YWdzO1xuKGZ1bmN0aW9uICh1aXJvdXRlcm1ldGF0YWdzKSB7XG4gICAgcnVuQmxvY2suJGluamVjdCA9IFtcIiRsb2dcIiwgXCIkcm9vdFNjb3BlXCIsIFwiTWV0YVRhZ3NcIiwgXCIkd2luZG93XCJdO1xuICAgIHZhciBhcHBNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLm1ldGF0YWdzJywgWyd1aS5yb3V0ZXInXSk7XG4gICAgdmFyIFVJUm91dGVyTWV0YXRhZ3MgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAgICAgZnVuY3Rpb24gVUlSb3V0ZXJNZXRhdGFncygpIHtcbiAgICAgICAgICAgIHRoaXMucHJlZml4ID0gJyc7XG4gICAgICAgICAgICB0aGlzLnN1ZmZpeCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0VGl0bGUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdERlc2NyaXB0aW9uID0gJyc7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRLZXl3b3JkcyA9ICcnO1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0Um9ib3RzID0gJyc7XG4gICAgICAgICAgICB0aGlzLnN0YXRpY1Byb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlT0dVUkwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBVSVJvdXRlck1ldGF0YWdzLnByb3RvdHlwZS5zZXRUaXRsZVByZWZpeCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIFVJUm91dGVyTWV0YXRhZ3MucHJvdG90eXBlLnNldFRpdGxlU3VmZml4ID0gZnVuY3Rpb24gKHN1ZmZpeCkge1xuICAgICAgICAgICAgdGhpcy5zdWZmaXggPSBzdWZmaXg7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgVUlSb3V0ZXJNZXRhdGFncy5wcm90b3R5cGUuc2V0RGVmYXVsdFRpdGxlID0gZnVuY3Rpb24gKHRpdGxlKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRUaXRsZSA9IHRpdGxlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIFVJUm91dGVyTWV0YXRhZ3MucHJvdG90eXBlLnNldERlZmF1bHREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0RGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBVSVJvdXRlck1ldGF0YWdzLnByb3RvdHlwZS5zZXREZWZhdWx0S2V5d29yZHMgPSBmdW5jdGlvbiAoa2V5d29yZHMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdEtleXdvcmRzID0ga2V5d29yZHM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgVUlSb3V0ZXJNZXRhdGFncy5wcm90b3R5cGUuc2V0RGVmYXVsdFJvYm90cyA9IGZ1bmN0aW9uIChyb2JvdHMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdFJvYm90cyA9IHJvYm90cztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBVSVJvdXRlck1ldGF0YWdzLnByb3RvdHlwZS5zZXRTdGF0aWNQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGljUHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgVUlSb3V0ZXJNZXRhdGFncy5wcm90b3R5cGUuc2V0T0dVUkwgPSBmdW5jdGlvbiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5lbmFibGVPR1VSTCA9IGVuYWJsZWQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgVUlSb3V0ZXJNZXRhdGFncy5wcm90b3R5cGUuJGdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcHJlZml4OiB0aGlzLnByZWZpeCxcbiAgICAgICAgICAgICAgICBzdWZmaXg6IHRoaXMuc3VmZml4LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRUaXRsZTogdGhpcy5kZWZhdWx0VGl0bGUsXG4gICAgICAgICAgICAgICAgZGVmYXVsdERlc2NyaXB0aW9uOiB0aGlzLmRlZmF1bHREZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICBkZWZhdWx0S2V5d29yZHM6IHRoaXMuZGVmYXVsdEtleXdvcmRzLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRSb2JvdHM6IHRoaXMuZGVmYXVsdFJvYm90cyxcbiAgICAgICAgICAgICAgICBzdGF0aWNQcm9wZXJ0aWVzOiB0aGlzLnN0YXRpY1Byb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgZW5hYmxlT0dVUkw6IHRoaXMuZW5hYmxlT0dVUkxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBVSVJvdXRlck1ldGF0YWdzO1xuICAgIH0pKCk7XG4gICAgYXBwTW9kdWxlLnByb3ZpZGVyKCdVSVJvdXRlck1ldGF0YWdzJywgVUlSb3V0ZXJNZXRhdGFncyk7XG4gICAgdmFyIE1ldGFUYWdzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyogQG5nSW5qZWN0ICovXG4gICAgICAgIE1ldGFUYWdzLiRpbmplY3QgPSBbXCIkbG9nXCIsIFwiVUlSb3V0ZXJNZXRhdGFnc1wiLCBcIiRpbnRlcnBvbGF0ZVwiLCBcIiRpbmplY3RvclwiLCBcIiRzdGF0ZVwiLCBcIiRsb2NhdGlvblwiLCBcIiR3aW5kb3dcIl07XG4gICAgICAgIGZ1bmN0aW9uIE1ldGFUYWdzKCRsb2csIFVJUm91dGVyTWV0YXRhZ3MsICRpbnRlcnBvbGF0ZSwgJGluamVjdG9yLCAkc3RhdGUsICRsb2NhdGlvbiwgJHdpbmRvdykge1xuICAgICAgICAgICAgdGhpcy4kbG9nID0gJGxvZztcbiAgICAgICAgICAgIHRoaXMuVUlSb3V0ZXJNZXRhdGFncyA9IFVJUm91dGVyTWV0YXRhZ3M7XG4gICAgICAgICAgICB0aGlzLiRpbnRlcnBvbGF0ZSA9ICRpbnRlcnBvbGF0ZTtcbiAgICAgICAgICAgIHRoaXMuJGluamVjdG9yID0gJGluamVjdG9yO1xuICAgICAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgICAgICB0aGlzLiRsb2NhdGlvbiA9ICRsb2NhdGlvbjtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdyA9ICR3aW5kb3c7XG4gICAgICAgICAgICB0aGlzLnByZXJlbmRlciA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIE1ldGFUYWdzLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAodGFncykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gYW5ndWxhci5leHRlbmQoe30sIHRoaXMuVUlSb3V0ZXJNZXRhdGFncy5zdGF0aWNQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5VSVJvdXRlck1ldGF0YWdzLmVuYWJsZU9HVVJMKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllc1snb2c6dXJsJ10gPSB0aGlzLiRsb2NhdGlvbi5hYnNVcmwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRhZ3MudGl0bGUgPyB0aGlzLlVJUm91dGVyTWV0YXRhZ3MucHJlZml4ICsgKHRoaXMuZ2V0VmFsdWUoJ3RpdGxlJywgdGFncy50aXRsZSkgfHwgJycpICsgdGhpcy5VSVJvdXRlck1ldGF0YWdzLnN1ZmZpeCA6IHRoaXMuVUlSb3V0ZXJNZXRhdGFncy5kZWZhdWx0VGl0bGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0YWdzLmRlc2NyaXB0aW9uID8gdGhpcy5nZXRWYWx1ZSgnZGVzY3JpcHRpb24nLCB0YWdzLmRlc2NyaXB0aW9uKSA6IHRoaXMuVUlSb3V0ZXJNZXRhdGFncy5kZWZhdWx0RGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgICAgIHRoaXMua2V5d29yZHMgPSB0YWdzLmtleXdvcmRzID8gdGhpcy5nZXRWYWx1ZSgna2V5d29yZHMnLCB0YWdzLmtleXdvcmRzKSA6IHRoaXMuVUlSb3V0ZXJNZXRhdGFncy5kZWZhdWx0S2V5d29yZHM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9ib3RzID0gdGFncy5yb2JvdHMgPyB0aGlzLmdldFZhbHVlKCdyb2JvdHMnLCB0YWdzLnJvYm90cykgOiB0aGlzLlVJUm91dGVyTWV0YXRhZ3MuZGVmYXVsdFJvYm90cztcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRhZ3MucHJvcGVydGllcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gX3RoaXMuZ2V0VmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnByb3BlcnRpZXNba2V5XSA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRoaXMuVUlSb3V0ZXJNZXRhdGFncy5kZWZhdWx0VGl0bGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLlVJUm91dGVyTWV0YXRhZ3MuZGVmYXVsdERlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXdvcmRzID0gdGhpcy5VSVJvdXRlck1ldGF0YWdzLmRlZmF1bHRLZXl3b3JkcztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb2JvdHMgPSB0aGlzLlVJUm91dGVyTWV0YXRhZ3MuZGVmYXVsdFJvYm90cztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRhZ3MgJiYgdGFncy5wcmVyZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVyZW5kZXIuc3RhdHVzQ29kZSA9IHRhZ3MucHJlcmVuZGVyLnN0YXR1c0NvZGUgPyB0aGlzLmdldFZhbHVlKCdwcmVyZW5kZXIuc3RhdHVzQ29kZScsIHRhZ3MucHJlcmVuZGVyLnN0YXR1c0NvZGUpIDogMjAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXJlbmRlci5oZWFkZXIgPSB0YWdzLnByZXJlbmRlci5oZWFkZXIgPyB0aGlzLmdldFZhbHVlKCdyZXJlbmRlci5oZWFkZXInLCB0YWdzLnByZXJlbmRlci5oZWFkZXIpIDogbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlcmVuZGVyLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlcmVuZGVyLmhlYWRlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuJHdpbmRvdy5wcmVyZW5kZXJSZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kbG9nLmVycm9yKCdlcnJvciBvY2N1cmVkIHdoZW4gZXh0cmFjdGluZyBtZXRhdGFnczonLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBNZXRhVGFncy5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAodGFnVHlwZSwgdGFnKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghdGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGFnID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGFnID09PSAnc3RyaW5nJyAmJiB0YWcudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRhZykgfHwgQXJyYXkuaXNBcnJheSh0YWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRpbmplY3Rvci5pbnZva2UodGFnLCB0aGlzLCB0aGlzLiRzdGF0ZS4kY3VycmVudC5sb2NhbHMuZ2xvYmFscyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kaW50ZXJwb2xhdGUodGFnKSh0aGlzLiRzdGF0ZS4kY3VycmVudC5sb2NhbHMuZ2xvYmFscyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuJGxvZy5lcnJvcignZXJyb3Igb2NjdXJlZCB3aGVuIHRyeWluZyB0byBnZXQgdGhlIHZhbHVlIG9mIHRhZzonLCB0YWdUeXBlLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gTWV0YVRhZ3M7XG4gICAgfSkoKTtcbiAgICBhcHBNb2R1bGUuc2VydmljZSgnTWV0YVRhZ3MnLCBNZXRhVGFncyk7XG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gcnVuQmxvY2soJGxvZywgJHJvb3RTY29wZSwgTWV0YVRhZ3MsICR3aW5kb3cpIHtcbiAgICAgICAgJHJvb3RTY29wZS5NZXRhVGFncyA9IE1ldGFUYWdzO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBzdGF0ZUNoYW5nZVN0YXJ0KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBzdGF0ZUNoYW5nZVN1Y2Nlc3MpO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBzdGF0ZUNoYW5nZUVycm9yKTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZU5vdEZvdW5kJywgc3RhdGVOb3RGb3VuZCk7XG4gICAgICAgIGZ1bmN0aW9uIHN0YXRlQ2hhbmdlU3RhcnQoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgICAkd2luZG93LnByZXJlbmRlclJlYWR5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc3RhdGVDaGFuZ2VTdWNjZXNzKGV2ZW50LCB0b1N0YXRlKSB7XG4gICAgICAgICAgICBpZiAoIXRvU3RhdGUubWV0YVRhZ3MpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKFwiTWV0YVRhZ3MgLSByb3V0ZTogXFxcIlwiICsgdG9TdGF0ZS5uYW1lICsgXCJcXFwiIGRvZXMgbm90IGNvbnRhaW4gYW55IG1ldGF0YWdzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgTWV0YVRhZ3MudXBkYXRlKHRvU3RhdGUubWV0YVRhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHN0YXRlQ2hhbmdlRXJyb3IoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKSB7XG4gICAgICAgICAgICBNZXRhVGFncy5wcmVyZW5kZXIuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICAgICR3aW5kb3cucHJlcmVuZGVyUmVhZHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHN0YXRlTm90Rm91bmQoZXZlbnQsIHVuZm91bmRTdGF0ZSwgZnJvbVN0YXRlKSB7XG4gICAgICAgICAgICBNZXRhVGFncy5wcmVyZW5kZXIuc3RhdHVzQ29kZSA9IDQwNDtcbiAgICAgICAgICAgICR3aW5kb3cucHJlcmVuZGVyUmVhZHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFwcE1vZHVsZS5ydW4ocnVuQmxvY2spO1xufSkodWlyb3V0ZXJtZXRhdGFncyB8fCAodWlyb3V0ZXJtZXRhdGFncyA9IHt9KSk7XG5cblxuIl19

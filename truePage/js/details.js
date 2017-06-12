/**
 * Created by HuWen on 2017/4/28.
 */
angular.module("detailApp", ['config','api'])
            .controller('detailCtr', [ '$scope', '$http','UrlConstant','$timeout',function( $scope, $http,UrlConstant,$timeout) {
                $scope.babyInfo={};
                $scope.showDetail=false;
                // $scope.babyId=492;
                // $scope.userId=1456;
                $scope.babyId=Number(GetQueryString("babyId"));
                $scope.userId=Number(GetQueryString("userId"));
                $scope.inviteAddress = GetQueryString('inviteAddress');
                $scope.treatStatus = GetQueryString('treatStatus');
                $scope.haveYue = GetQueryString('haveOrder');
                $scope.isShow=false;
                $scope.falg=false;
                $scope.showBao=false;
                $scope.isClass=false;
                $scope.haveClick=false;
                $scope.baoNum=0;
                storeElem("babyId",$scope.babyId);
                storeElem("userId",$scope.userId);
                $http.post(UrlConstant.url + '/order/currentOrder.do',{json:JSON.stringify({
                  "userId":$scope.userId
                })}).success(function(data){
                  if (data.code == 200) {
                    $scope.showBao = true;
                  }else{

                  }
                });

                function addT(){
                  return '&t=' + new Date().getTime();
                }

                /*阻止用户双击使屏幕上滑*/
                var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
                var iLastTouch = null;                                //缓存上一次tap的时间
                if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0)
                {
                    document.body.addEventListener('touchend', function(event)
                    {
                        var iNow = new Date().getTime();
                        iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
                        var delta = iNow - iLastTouch;
                        if (delta < 500 && delta > 0)
                        {
                            event.preventDefault();
                            return false;
                        }
                        iLastTouch = iNow;
                    }, false);
                }
                $http.post(UrlConstant.url + "/user/free/babyDetail.do", {json:JSON.stringify({
                    "babyId":$scope.babyId,
                    "UserId":$scope.userId
                })}).success(function(data) {
                    //alert(1)
                    $scope.babyInfo=[];
                    $scope.babyInfo=data.data.baby;
                    $scope.scaleName= data.data.baby.scaleName;
                    $scope.rateAvg=data.data.rateAvg;
                    $scope.imgList=data.data.showImgs;
                    $scope.isAttention=data.data.isAttention;
                    $scope.scaleNameList=$scope.babyInfo.scaleName.split(",");
                    showStar($scope.rateAvg);
                 
                     

                });
                    $scope.load = function() {  
                      $scope.showDetail=true; 
                   }  
                // 星星评级
                function showStar(n){
                    var con_wid=document.getElementById("star_con").offsetWidth;
                    var del_star=document.getElementById("del_star");
                    //透明星星移动的像素/////
                    var del_move=(n*con_wid)/5;
                    del_star.style.backgroundPosition=-del_move+"px 0px";
                    del_star.style.left=del_move+"px";
                }

                function setupWebViewJavascriptBridge(callback) {
                    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
                    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
                    window.WVJBCallbacks = [callback];
                    var WVJBIframe = document.createElement('iframe');
                    WVJBIframe.style.display = 'none';
                    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                    document.documentElement.appendChild(WVJBIframe);
                    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
                }

         //调用上面定义的函数
                setupWebViewJavascriptBridge(function (bridge){
                  $scope.tiaozhuan=function(val){
                      if($scope.haveYue || $scope.haveClick){

                      }else{
                        $http.post(UrlConstant.url + "/order/invite.do", {json:JSON.stringify({
                            "babyId":$scope.babyId,
                            "userId":$scope.userId
                        })}).success(function(data) {
                            $scope.baoShow=false;
                            if(!$scope.userId){
                              bridge.callHandler('NotLogin', {}, function(response) {});
                            }else{
                              if($scope.inviteAddress){
                                $scope.placeArr = $scope.babyInfo.placeName.split(",");
                                if(data.code == 200){
                                  for (var i = 0; i < $scope.placeArr.length; i++) {
                                    if($scope.placeArr[i] == '其他' || $scope.placeArr[i] == $scope.inviteAddress || $scope.inviteAddress == '其他'){
                                      if(val){
                                        if(i >= $scope.placeArr.length-1){
                                          $scope.baoShow = !$scope.baoShow;
                                       }
                                      }else{
                                        if($scope.treatStatus){
                                            location.href="order.html?userId="+$scope.userId+'&hasChoose=true' + addT();
                                        }else{
                                            bridge.callHandler('commonFun', {}, function(response) {})
                                        }
                                      }
                                    }else{
                                      if(i >= $scope.placeArr.length-1){
                                         $scope.baoShow = !$scope.baoShow;
                                       }
                                    }
                                    if($scope.baoShow){
                                      $scope.haveClick=true;
                                      $scope.baoNum=true;
                                      $scope.isShow=true;
                                      $scope.content='加入包厢成功！快去结算吧！';
                                      $timeout(function() {
                                          $scope.isShow = false;
                                      }, 2000);
                                    }
                                  }
                                }else{
                                  $scope.isShow=true;
                                  $scope.content=data.msg;
                                  $timeout(function() {
                                      $scope.isShow = false;
                                  }, 2000);
                                }
                              }else{
                                if(data.code==200){
                                  if($scope.treatStatus){
                                      location.href="order.html?userId="+$scope.userId+'&hasChoose=true' + addT();
                                    }else{
                                      if(val){
                                        $scope.haveClick=true;
                                        $scope.baoNum=true;
                                        $scope.isShow=true;
                                        $scope.content='加入包厢成功！快去结算吧！';
                                        $timeout(function() {
                                            $scope.isShow = false;
                                        }, 2000);
                                      }else{
                                        bridge.callHandler('commonFun', {}, function(response) {})
                                      }
                                    }
                                }else{
                                    $scope.isShow=true;
                                    $scope.content=data.msg;
                                    $timeout(function() {
                                        $scope.isShow = false;
                                    }, 2000);
                                }
                              }
                            }
                        });
                      }
                  };

                  $scope.guanZhu=function(){
                      if(!$scope.userId){
                        bridge.callHandler('NotLogin', {}, function(response) {});
                      }else{
                        $http.post(UrlConstant.url + "/user/attention.do", {json:JSON.stringify({
                            "babyId": $scope.babyId,
                            "userId":$scope.userId,
                            "isAttention":$scope.isAttention
                        })}).success(function(data) {
                           $scope.isAttention=data.data;
                        })
                      }
                  };

                  $scope.baoxiang = function(){
                    if($scope.treatStatus){
                       location.href="order.html?userId="+$scope.userId+'&hasChoose=true' + addT();
                    }else{
                       bridge.callHandler('commonFun', {}, function(response) {})
                    }
                  }
                });
        }])

.directive('resize',
  function ($window) {
    return function (scope, element) {
     var w = angular.element($window);
     var timer=null;
    function changeImg() {
     if(element[0].clientHeight<element[0].clientWidth){
     	 $(element).css({'height':'100%','width':'auto'})
       	var left=(element[0].clientWidth-s/10*3)/2
       	 $(element).css({'margin-left':-left})
      }else{
       	var top=(element[0].clientHeight-element[0].clientWidth)/2
       	$(element).css({'width':'100%','top':0})
      }
     	}
      setTimeout(function(){
   if(element[0].complete){
   		changeImg()
      	}else{

      	 timer=setInterval(function(){
      			if(element[0].complete){
      				changeImg()
      				clearInterval(timer)
      			}
      		},100)
      	}
      })
    }
})

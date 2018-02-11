/*!
 * Name:移动端个性化推荐微课程
 * Date: 2017.2.21
 * Copyright: Copyright (c) 2017 www.etiantian.com
 * @ Author : cc
 * @ Version : 1.00
 */
//获取传过来的参数
var strParam = getQueryStringFromUrl();
var jid = strParam.jid;
var appId = "103";
var pointId = strParam.pointId;
var videoId = strParam.videoId;
//定时器的id
var timeoutId;
//是否需要跳转到上次的播放点
var seekFlag = false;
//上一次的播放点
var lastPoint = 0;
//当前的播放点
var point = 0;
//计时间隔时间
var duration =30;
//定义播放器
var player;
//获取设备类型
var phoneType=getPhoneType();//a:安卓；i:ios
var iPadType=getIPadType();
//记录用户反馈key值
var feedKey=true;
//记录是否为首次播放
var onekey=true;
//判断当前播放状态
var playVal="ready";
//ios回调添加参数
var  DATA_SIGN='';
//获取设备类型
function getPhoneType(){
    var browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if(browser.versions.android) {
        alert("安卓端");
        return "a";
    }else if(browser.versions.ios) {
        alert("IOS端");
        return "i";

    }else{
        alert("其他终端");
        return "h"
    }
}
function getIPadType(){
    var browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if(browser.versions.iPad) {
        alert("ipad");
        return true;
    }else{
        alert("非ipad");
        return false;
    }
}
//将对象转换为指定字符串
function getString(jsObj){
    var a = JSON.stringify(jsObj);
    a=a.replace(/[\}|\{|"]{1}/g, "")
    a=a.replace(/[,]{1}/g, "&")
    a=a.replace(/[:]{1}/g, "=")
    return a;
}
//清楚缓存，记录时间
function clearCacheAndSaveTime(){
    window.localStorage.setItem("point:lastPoint:"+strParam.jid+ videoId,jwplayer().getPosition());
}
//获取指定占位符长度的字符串
function toStrNum(str,num){
    var len=str.length;
    var len2=0;
    var charCode=null;
    var oStr='';
    if(len>num){
        str=str.substr(0,num);
        len=str.length;
        console.log(str);
    };
    for(var i=0;i<len;i++){
        charCode=str.charCodeAt(i);
        if(charCode>255){
            len2++;
        };
        if((i+len2)>num||(i+len2)==num){
            console.log(i);
            console.log(len2);
            str=str.substr(0,i)+"...";
            break
        }
    }
    return str;
}
//**获取加密字符测试方法安卓
function getsign(data1,data2,fn){
    if(phoneType=="a"){
        var sign=null;
        var a=data1.method;
        var b=data1.time;
        var c=data1.appId;
        var d=data1.userId;
        var e=data1.pointId;
        var f=data1.videoId;
        if(e && f){
            sign=window.aixue.getSign(a,b,c,d,e,f);
        }else if(e && (!f)){
            sign=window.aixue.getSign(a,b,c,d,e);
        }else{
            sign=window.aixue.getSign(a,b,c,d);
        }
        data2.sign=sign;
        console.log(data2);
        eval(fn+"(eval("+JSON.stringify(data2)+"))");
    }else if(phoneType=="i"){
        delete data1.time;
        var data3=getString(data1);
        sendMsg2iOS("://getSignCode?"+data3+"&reqFn="+fn+"&returnSignFn=returnSign");
        console.log(data3);
    }else{
        $.ajax({
            type: "POST",
            url: generateSignUrl,
            async:true,
            dataType: "text",
            data:data1,
            success: function (data1) {
                var sign = $.trim(data1);
                data2.sign=sign;
                console.log(data2);
                console.log(fn);
                //fn(data2);
                eval(fn+"(eval("+JSON.stringify(data2)+"))");
            },
            error :function(xhr,status,throwInfo){
                alertToast("获取签名信息失败!");
            }
        });
    }
}
//获取method值
function getmethod(url){
    return url.substring(url.lastIndexOf("/")+1);
};
//记录用户反馈（方法，调用关闭状态）
function feedbackfn(data){
    if(phoneType=="i"){
        var method=getmethod(feedbackUrl);
        data+="&method="+method+DATA_SIGN;
        alertToast(data);
    }
    $.ajax({
        type: "post",
        url: feedbackUrl,
        dataType: "json",
        data:data,
        success: function (data) {
            console.log("记录用户成功");
            feedKey=false;
        },
        error :function(data){
            console.log("记录用户失败");
        }
    });
};
//加载视频（获取加密字符）
loadVideo();
function loadVideo(){
    var method=getmethod(getPlayUrl);
    var time=String(getTime());
    var userId=strParam.jid;
    var data1={
        method:method,
        time:time,
        appId:appId,
        userId:userId,
        pointId:pointId,
        videoId:videoId
    };
    var data2={
        method:method,
        time:time,
        appId:appId,
        userId:userId,
        pointId:pointId,
        videoId:videoId
    };
    //console.log(data1);
    //console.log(data2);
    DATA_SIGN='&pointId='+pointId+'&videoId='+videoId;
    getsign(data1,data2,'getPlayfn');
}
//加载视频（方法）
function getPlayfn(data){
    if(phoneType=="i"){
        var method=getmethod(getPlayUrl);
        data+="&method="+method+DATA_SIGN;
    };
    $.ajax({
        type: "get",
        url: getPlayUrl,
        async:true,
        dataType: "jsonp",
        data:data,
        success:function(data){
            if(data.result==1){
                //console.log(data);
                FastClick.attach(document.body);
                //7.7.1版本
                jwplayer.key="iP+vLYU9H5KyhZeGt5eVuJJIoULUjltoaMeHXg==";
                //69版本
                //jwplayer.key = 'TS4qsaxnmU61G+MTcWh8YKllWcQ=';
                //var videoUrl="http://public.etiantian.com/public/hzxx_index/2017shouye/1m.mp4";
                var videoUrl=data.data.videoUrl;
                var videoThumb=data.data.videoThumb;
                //var videoName="测试测试测试lkdfjalkdsfjalkfdsjlkdfjalkdsfjalkfdsjlkdfjalkdsfjalkfdsj";
                var videoName=data.data.videoName;
                var videoPraiseNum=data.data.videoPraiseNum;
                createPlayerLisSection(videoUrl,videoThumb,videoName,videoPraiseNum);
            }else{
                alertToast(data.msg);
            }
        },
        error:function(data){
            alertToast(data.msg);
        }
    })
}
//调用视频播放器插件
function createPlayerLisSection(videoUrl,videoThumb,videoName,videoPraiseNum){
    //console.log(videoUrl);
    //console.log(videoThumb);
    player= jwplayer('videoDiv');
    player.setup({
        'width': '100%',
        'aspectratio':'16:9',
        'file':videoUrl,
        'image':videoThumb,
        'analytics': {
            'cookies': false,
            'enabled': false
        },
        'primary': "html5",
        'preload': "none",
        'androidhls': "true",
        'abouttext': "Etiantian.com",
        'aboutlink': "http://www.etiantian.com",
       // 'autostart': "true",
        'startparam': "start",
        events: {
            //设置全屏
            setFullscreen:function(obj){
                console.log(phoneType);
                if(phoneType=="a"){
                    obj.fullscreen(true);
                };
            },
            //视频播放中
            onPlay:function(){
                if(phoneType=="a"){
                    window.aixue.setOrientation(0);
                    if(iPadType){
                        $(".test_header_top_text").text(toStrNum(videoName,100));
                    }else{
                        $(".test_header_top_text").text(toStrNum(videoName,50));
                    }

                    console.log($(".test_header_top_text").text())
                };
            },
            //横竖屏变化时调用方法
            onFullscreen: function (obj) {
               /* console.log(phoneType);
                if(phoneType=="a"){
                    if (obj.fullscreen) {
                        console.log("全屏");
                        console.log($("#videoDiv").height());
                        window.aixue.setOrientation(1);
                    } else {
                        console.log("非全屏");
                        console.log($("#videoDiv").height());
                        window.aixue.setOrientation(0);
                    };
                }*/
            },
        }
    });
    //视频准备就绪
    jwplayer().onReady(function () {
        //播放时间一直显示（针对部分机型兼容性操作）
        $(".jw-text-duration").css({"display":"inline-block"});
        $(".jw-text-elapsed").css({"display":"inline-block"});
        //查看播放器横竖屏----
        $(".test_header_top").remove();
        $(".test_open").remove();
        //添加顶部浮层
        var d='<div class="test_header_top jw-background-color">'+
            '<div class="test_header_top_img jw-group jw-controlbar-left-group jw-reset">'+
            '<img class="test_header_top_img_i " src="../../img/student/student_btn_return@2x.png"/>'+
            ' </div>'+
            ' <div class="jw-group jw-controlbar-center-group jw-reset">'+
            ' <span class="jw-text test_header_top_text">'+toStrNum(videoName,34)+'</span>'+
            '</div>'+
            ' <div class="jw-group jw-controlbar-right-group jw-reset">'+
            '<div class="test_header_top_num_icon jw-group jw-icon-inline jw-button-color jw-reset">'+
            ' <img class="test_header_top_num_icon_i " src="../../img/student/student_video_appreciate.png"/>'+
            '</div>'+
            ' <span class="test_header_top_num jw-text ">'+videoPraiseNum+'</span>'+
            ' </div>'+
            ' </div>';
        $(".jw-controlbar-left-group").append(d);
        $("video").attr("poster",videoThumb);
        //$("video").attr("autoplay");
        //添加中心控制按钮
       /* var c='<div class="test_open">'+
            '<img  class="test_open_img" src="../../img/student/student_btn_open.png"/>'+
            ' </div>';*/
        //$(".jw-controlbar-left-group").append(c);
        $(".test_header_top_img").off().on("click",function(){
            console.log(playVal+"playVal");
            if(playVal=="play"){
                var closeTime=jwplayer().getPosition();
                console.log(closeTime+"关闭时间")
            }else{
                closeTime=0;
            };
            if(closeTime){
                window.localStorage.setItem("point:lastPoint:"+strParam.jid+ videoId,closeTime);
                console.log("记录");
                //alertToast(closeTime);
                //alertToast( window.localStorage.getItem("point:lastPoint:"+strParam.jid+ videoId));
            }
            if(phoneType=="a"){
                window.aixue.exit();
            }if(phoneType=="i"){
                goBackNow(-1,false);
            }else{
                window.close();
            }
        })
        //添加的开始按钮功能
        //$(".test_open").on("click",function(){
        //    jwplayer().pause();
        //})
       /* if(phoneType=="i"){
         $(".jw-controlbar").show();
         //微信调用h5 video方法
         //$(".jw-video").attr("webkit-playsinline","true");
         }else if(phoneType=="a"){
         $(".jw-controlbar").show();
         // jwplayer().pause();
         }else {
         //$(".jw-controlbar").show();
         //   $(".jw-controlbar").css({"display":"table"});
         //显示播放栏
         };*/
        $(".jw-controlbar").css({"display":"table"});
        $(".test_open").show();
        //视频点赞功能(获取加密字符)
        $(".test_header_top_num_icon").off().on("click",function(){
            var method=getmethod(praiseVideoUrl);
            var time=String(getTime());
            var data1={
                method:method,
                time:time,
                appId:appId,
                userId:strParam.jid,
                pointId: pointId,
                videoId: videoId,
            };
            var data2={
                method:method,
                time:time,
                appId:appId,
                userId:strParam.jid,
                pointId: pointId,
                videoId:videoId
            };
            DATA_SIGN='&pointId='+pointId+'&videoId='+videoId;
            getsign(data1,data2,'praiseVideofn');
        });
        window.aixue.stopLoading();
    });
    //视频播放中
    jwplayer().onPlay(function(){
        playVal="play";
        //记录用户反馈
        if(onekey==true){
            //断点续播
            setTime();
            onekey=false;
        };
        //记录用户反馈
        if(feedKey==true){
            var method=getmethod(feedbackUrl);
            var time=String(getTime());
            var appId="103";
            var strParam = getQueryStringFromUrl();
            var userId = strParam.jid;
            var pointId= strParam.pointId;
            var videoId = strParam.videoId;
            var data1={
                method:method,
                time:time,
                appId:appId,
                userId:userId,
                pointId:pointId,
                videoId:videoId
            };
            var data2={
                method:method,
                time:time,
                appId:appId,
                userId:userId,
                pointId:pointId,
                videoId:videoId,
                feedbackType:2,
                resourceType:0,
            }
            DATA_SIGN='&pointId='+pointId+'&videoId='+videoId+'&feedbackType='+2+'&resourceType='+0;
            getsign(data1,data2,'feedbackfn');
        }
        //控制控制栏显示隐藏
        var timehide=setTimeout(hidden,5000);
        function hidden(){
            $(".jw-controlbar").removeAttr("style");
            clearTimeout(timehide);
        };
        //记录视频播放log
        timeoutId=window.setInterval(recordLogs,duration*1000);
        console.log('duration'+duration);
        function recordLogs() {
            point = jwplayer().getPosition();
            var method = getmethod(recordLogsUrl);
            var time = parseInt(getTime());
            var strParam = getQueryStringFromUrl();
            var appId = "103";
            var pointId=strParam.pointId;
            var videoId=strParam.videoId;
            if(window.localStorage.getItem("point:lastPoint:"+strParam.jid+ videoId )){
                lastPoint=window.localStorage.getItem("point:lastPoint:"+strParam.jid+ videoId );
            }else{
                lastPoint=0;
            };
            window.localStorage.setItem("point:lastPoint:"+strParam.jid+ videoId,point);
            console.log(point);
            //console.log(strParam);
            var data1 = {
                method: method,
                time: time,
                appId: appId,
                userId: strParam.jid,
                pointId: pointId,
                videoId: videoId,
            };
            var data2 = {
                method: method,
                time: time,
                appId: appId,
                userId: strParam.jid,
                pointId: pointId,
                videoId: videoId,
                duration: duration,
                point: point,
                lastPoint: lastPoint
            };
            window.localStorage.setItem("point:lastPoint:"+strParam.jid+videoId,point);
            DATA_SIGN='&pointId='+pointId+'&videoId='+videoId+'&duration='+duration+'&point='+point+'&lastPoint='+lastPoint;
            getsign(data1, data2,'recordLogsfn');
        }
    });
    //视频暂停事件
    jwplayer().onPause(function () {
        //$("#videoDiv ").html();
        //$(".test_open").hide();
        //清除定时器
        window.clearInterval(timeoutId);
    });
    //视频完成事件
    jwplayer().onComplete(function(){
        playVal="close";
        //$(".jw-controlbar").show();
        window.localStorage.setItem("point:lastPoint:"+strParam.jid+ videoId,0);
        window.localStorage.removeItem("point:lastPoint:"+strParam.jid+ videoId);
        window.clearInterval(timeoutId);
    });
    //视频跳到某一个播放点事件
    //jwplayer().onSeek(function () {

    //});
    //jwplayer().setFullscreen(true);
    //视频加载失败
    jwplayer().onError(function(){
        if(phoneType=="a"){
            window.aixue.exit();
        }if(phoneType=="i"){
            goBackNow(-1,false);
        }else{
            window.close();
        }
    })

}
//视频点赞（方法）
function praiseVideofn(data){
    if(phoneType=="i"){
        var method=getmethod(praiseVideoUrl);
        data+="&method="+method+DATA_SIGN;
    };
    $.ajax({
        type: "get",
        url: praiseVideoUrl,
        async:true,
        dataType: "jsonp",
        data:data,
        success:function(data){
            if(data.result==1){
                var num=$(".test_header_top_num").text();
                $(".test_header_top_num").text(parseInt(num)+1);
            }else{
                alertToast(data.msg);
            }
        },
        error:function(data){
            alertToast(data.msg);
        }
    })
}
//视频播放日志（方法）
function recordLogsfn(data) {
    if(phoneType=="i"){
        var method=getmethod(recordLogsUrl);
        data+="&method="+method+DATA_SIGN;
    };
    $.ajax({
        type: "post",
        url: recordLogsUrl,
        async: true,
        dataType: "jsonp",
        data: data,
        success: function (data) {
            //console.log(data);
        },
        error: function (e) {
            alertToast(data.msg);
        }
    });
}
//断点续播
function setTime(){
    var lastPointSeek = window.localStorage.getItem("point:lastPoint:"+strParam.jid+ videoId );
    console.log(lastPointSeek);
    if(lastPointSeek){
        jwplayer().seek(parseInt(lastPointSeek));
        console.log(lastPointSeek);
        //alertToast(lastPointSeek);
        //alertToast( window.localStorage.getItem("point:lastPoint:"+strParam.jid+ videoId));
    };
}
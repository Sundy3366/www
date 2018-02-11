/**
 * Created by 高波 on 2017/2/24.
 */
//展示body
    $("body").show();
//获取浏览器类型
var phoneType=getPhoneType();//a:安卓；i:ios
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
        //alert("安卓端");
        return "a";
    }else if(browser.versions.ios) {
        //alert("IOS端");
        return "i";
                                
    }else{
        //alert("其他终端");
        return "h";
    }
}
//获取传过来的参数
var strParam = getQueryStringFromUrl();
var jid = strParam.jid;
var pointName=strParam.pointName;
var appId = "103";
var pointId = strParam.pointId;
//**获取method值**
//前端计时器
var timeIndex = 0;
var timelastIndex = 0;
var questionNum=1;
function setTime(){
    var hour = parseInt(timeIndex / 3600);    // 计算时
    var minutes = parseInt((timeIndex % 3600) / 60);    // 计算分
    var seconds = parseInt(timeIndex % 60);    // 计算秒
    hour = hour < 10 ? "0" + hour : hour;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    $(".test_header_top_num").text(minutes + ":" + seconds);
    timeIndex++;
}
var times = setInterval(setTime, 1000);
//左上角关闭当前页
$(".test_header_top_img ").off().on("click",function(){
    if(phoneType=="a"){
        window.aixue.exit();
    }if(phoneType=="i"){
        goBackNow(-1,false);
    }else{
        window.close();
    }
})
//***获取method值***
function getmethod(url){
    return url.substring(url.lastIndexOf("/")+1)
};
//将对象转换为指定字符串
function getString(jsObj){
    var a = JSON.stringify(jsObj);
    a=a.replace(/[\}|\{|"]{1}/g, "")
    a=a.replace(/[,]{1}/g, "&")
    a=a.replace(/[:]{1}/g, "=")
    return a;
}
var DATA_SIGN='';
//**获取加密字符
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
        //delete data1.pointId;
        //delete data1.videoId;
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
                //fn(data2);
                eval(fn+"(eval("+JSON.stringify(data2)+"))");
            },
            error :function(xhr,status,throwInfo){
                alertToast("获取签名信息失败!");
            }
        });
    }
};
//记录用户反馈
if(phoneType){
        var method=getmethod(feedbackUrl);
        var time=String(getTime());
        var appId="103";
        var strParam = getQueryStringFromUrl();
        var userId = strParam.jid;
        var pointId= strParam.pointId;
        var data1={
            method:method,
            time:time,
            appId:appId,
            userId:userId,
            pointId:pointId,
        };
        var data2={
            method:method,
            time:time,
            appId:appId,
            userId:userId,
            pointId:pointId,
            feedbackType:2,
            resourceType:1,
        }
        DATA_SIGN='&pointId='+pointId+'&feedbackType='+2+'&resourceType='+1;
        getsign(data1,data2,'feedbackfn');
}
//记录用户反馈（方法，关闭时调用）
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
        },
        error :function(data){
            console.log("记录用户失败");
        }
    });
};
//获取试题信息
loadgetQuestionfn();
function loadgetQuestionfn(){
    var method=getmethod(getQuestionUrl);
    var time=String(getTime());
    console.log(strParam);
    var data1={
        method:method,
        time:time,
        appId:appId,
        userId:strParam.jid,
        pointId:pointId
    };
    var data2={
        method:method,
        time:time,
        appId:appId,
        userId:strParam.jid,
        pointId:pointId
    };
    DATA_SIGN='&pointId='+pointId;
    getsign(data1,data2,'getQuestionfn');
}

//封装加载试题信息的方法
function getQuestionfn(data){
    console.log(data);
    if(phoneType=="i"){
        var method=getmethod(getQuestionUrl);
        data+="&method="+method+DATA_SIGN;
    };
    $.ajax({
        type: "get",
        url: getQuestionUrl,
        async:true,
        dataType: "jsonp",
        data:data,
        success:function(data){
            console.log(data);
            if(data.result==1){
                //试题序号
                //初始化选项是否可选，key值为1,可选
                $(".test_tests_list").attr("data-can",1);
                //初始化选项key值为0，判断提交时是否已经选中选项
                $(".test_tests_list").attr("data-key",0);
                //显示提交--隐藏继续按钮
                $(".test_continue_go").hide().siblings().show();
                $(".test_analytical").hide();
                $(".test_count").hide();
                //----栏目名称-----
                pointName=decodeURI(pointName);
                $(".test_header_top_text").attr("title",pointName);
                $(".test_header_top_text").html(pointName);
                //---掌握情况顶部---
                $(".test_header_down_grasp_num").text(data.data.ability+"%");
                $(".test_tests_title").html(questionNum+'、'+data.data.questionInfo.title);
                var node=data.data.questionInfo.optionList;
                console.log(node);
                var d='';
                var icon=["A","B","C","D"];
                $(".test_tests_list").empty();
                for(var i=0 ;i<node.length ;i++){
                    //加载方式1
                    var html = node[i].optionInfo;
                    if(html)
                        html = html.replace(/[\r\n]/g, "");
                   var $temp = $('<li class="test_tests_list_li margin_b26 class_'+icon[i]+'" data-id="'+data.data.questionInfo.id+'" data-active="'+node[i].optionNumber+'" data-questionType="'+data.data.questionInfo.questionType+'">'+
                        ' <p class="choose">'+node[i].optionNumber+'</p>'+
                        ' <p class="text tHtml"></p>'+
                        ' <p class="answer fr">√</p>'+
                        ' <p class="error fr">×</p>'+
                        '</li>');
                    $temp.find(".tHtml").html(html);
                    $(".test_tests_list").append($temp);
                    //加载方式2
                   /* d+='<li class="test_tests_list_li margin_b26 class_'+icon[i]+'" data-id="'+data.data.questionInfo.id+'" data-active="'+node[i].optionNumber+'" data-questionType="'+data.data.questionInfo.questionType+'">'+
                        ' <p class="choose">'+node[i].optionNumber+'</p>'+
                        ' <p class="text tHtml">'+'"'+node[i].optionInfo+'"'+'</p>'+
                        ' <p class="answer fr">√</p>'+
                        ' <p class="error fr">×</p>'+
                        '</li>';
                    $(".test_tests_list").html(d);*/
                };
               // $(".test_tests_list").append(
                //$(".test_tests_list").html(d);

                $(".test_tests_list_li").off().on("click",function(){
                    //点击选择答案
                    var can=$(".test_tests_list").attr("data-can");
                    console.log(can);
                    if(can==1){
                        $(this).addClass("active").siblings().removeClass("active");
                        $(".test_tests_list").attr("data-key",1)
                    }
                })
                //点击提交
                $(".test_continue_ok").off().on("click",function(){
                    //获取选项key值，判断是否被选中
                    var key=$(".test_tests_list").attr("data-key");
                    if(key==1){
                        var method=getmethod(submitAnswerUrl);
                        var time=String(getTime());
                        var anson=$(".test_tests_list").children(".active").attr("data-active");//用户选项
                        var oId=$(".test_tests_list").children(".active").attr("data-id");//试题Id
                        var allTime=(timeIndex-timelastIndex);
                        console.log(allTime);
                        var data1={
                            method:method,
                            time:time,
                            appId:appId,
                            userId:strParam.jid,
                            pointId:pointId
                        };
                        var data2={
                            method:method,
                            time:time,
                            appId:appId,
                            userId:strParam.jid,
                            pointId:pointId,//知识点id
                            questionId: oId,//试题ID
                            answer: anson,//学生选择答案
                            duration: allTime,//做题时间
                        };
                        DATA_SIGN='&pointId='+pointId+'&questionId='+oId+'&answer='+anson+'&duration='+allTime;
                        getsign(data1,data2,'submitAnswerfn');
                    }else{
                        //显示提示浮层
                        $(".fload_choose").show();
                        $(".fload_choose_box_text").text("请选择选项后提交");
                        $(".fload_choose_box_icon").off().on("click",function(){
                            $(".fload_choose").hide();
                        })
                    }
                })
            }else if(data.result == -100){
                //显示提示浮层(没有更多试题)
               // times=null;
                clearInterval(times);
                $(".fload_choose").show();
                $(".fload_choose_box_text").text("您已完成本次推荐练习");
                $(".fload_choose_box_icon").off().on("click",function(){
                    $(".fload_choose").hide();
                    if(phoneType=="a"){
                        window.aixue.exit();
                    }if(phoneType=="i"){
                        goBackNow(-1,false);
                    }else{
                        window.close();
                    }
                })
            }else if(data.result == -101){
                //显示提示浮层(该学习目录不存在或已关闭！)
                //times=null;
                clearInterval(times);
                $(".fload_choose").show();
                $(".fload_choose_box_text").text("该学习目录不存在或已关闭！");
                $(".fload_choose_box_icon").off().on("click",function(){
                    $(".fload_choose").hide();
                    if(phoneType=="a"){
                        window.aixue.exit();
                    }if(phoneType=="i"){
                        goBackNow(-1,false);
                    }else{
                        window.close();
                    }
                })
            }else{
                alertToast(data.msg);
            }
        },
        error :function(data){
            alertToast("试题加载失败");
        }
    })
}
//提交试题信息的方法
function submitAnswerfn(data){
    console.log(data);
    if(phoneType=="i"){
        var method=getmethod(submitAnswerUrl);
        data+="&method="+method+DATA_SIGN;
    };
    //添加回调方法
    $.ajax({
        type: "POST",
        url:submitAnswerUrl,
        dataType: "jsonp",
        data: data,
        beforeSend:function(){
            $(".test_continue_ok").css("pointer-events","none");
        },
        success: function (data) {
            $(".test_continue_ok").css("pointer-events","auto");
            questionNum++;
            if (data.result == 1) {
                timelastIndex=timeIndex;
                //列表高度自适应
                $(".test_tests").height("auto");
                //选项不可点击
                $(".test_tests_list").attr("data-can","0");
                console.log( $(".test_tests_list").attr("data-can"))
                //解析
                $(".test_analytical").show();
                $(".test_count").show();
                $(".test_analytical_text").html(data.data.analytics);
                //错误率
                $(".test_count_error_num").html(data.data.errorRate);
                $(".test_count_pic_num").css("left",data.data.errorRate);
                $(".test_count_pic_num").css("width",data.data.errorRate);
                var errorRatenum=parseFloat(data.data.errorRate);
                if(errorRatenum < 8){
                    $(".test_count_error_num").css("left","8%");
                }else if(errorRatenum>92){
                    $(".test_count_error_num").css("left","92%");
                }else{
                    $(".test_count_error_num").css("left",data.data.errorRate);
                };
                console.log(data);
                if(data.data.isRight==1){
                    //做题情况
                    var num=$(".test_header_down_result_right").text();
                    $(".test_header_down_result_right").text(parseInt(num)+1);
                    $(".test_tests_list").children(".active").addClass("test_tests_list_green").removeClass("active");
                }else if(data.data.isRight==0){
                    //做题情况
                    var num=$(".test_header_down_result_error").text();
                    $(".test_header_down_result_error").text(parseInt(num)+1);

                    $(".test_tests_list").children(".class_"+data.data.rightAnswer).addClass("test_tests_list_green");
                    $(".test_tests_list").children(".active").addClass("test_tests_list_red").removeClass("active");
                }
                $(".test_count_error_num").text(data.data.errorRate);
                //隐藏提交按钮显示继续按钮
                $(".test_continue_ok").hide().siblings().show();
                //点击继续按钮刷新题库
                $(".test_continue_go").off().on("click",function(){
                    loadgetQuestionfn();
                })
            } else {
                alertToast(data.msg);
            }
        },
        error: function (data) {
            $(".test_continue_ok").css("pointer-events","auto");
            alertToast("参数错误");
        },
    })
}














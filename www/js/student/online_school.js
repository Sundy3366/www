//网校首页班级信息-
function getNetClassInfo_(data){
	postAjaxJSON(Config.getNetClassInfoUrl(),data,function(data){
		if(data && data.result>0){
			var onlineClassInfo = data.data.onlineClassInfo;
			var realClassInfo = data.data.realClassInfo;
			//在线班
			if(onlineClassInfo){
				//noLesson值为1表示近日无课程安排。值为0则表示近日有课程安排
				if(onlineClassInfo.noLesson == 1){
					var onlineClassStr = '<h2 class="tex_title_16Pix_222_borBottom pb17Pix pt17Pix">在线班</h2>'+
										'<p class="tex_tips_14Pix_999 pb18Pix pt18Pix">近日暂无上课安排</p>';
					document.getElementById("onlineClass").innerHTML = onlineClassStr;
					$("#onlineClass").show();
				}else{
					var subjectList =  onlineClassInfo.subjectList;
					var onlineClassStr2 = '<h2 class="tex_title_16Pix_222_borBottom pb17Pix pt17Pix pr4Per">在线班 <span id="onlineTaskIcon" hidden="hidden" class="entity_class_task_icon"></span></h2>'+
										  '<div class="recent_classes">'+
						 						'<h3>最近上课时间：'+onlineClassInfo.lastStudyTime+'</h3>'+
						 						'<ul class="class_list">';
					if(subjectList){
						for(i=0;i<subjectList.length;i++){
							var sub = "";
							switch(subjectList[i].subjectId){
								case 1: sub = "language";break;
								case 2: sub = "math";break;
								case 3: sub = "english";break;
								case 4: sub = "physics";break;
								case 5: sub = "chemistry";break;
								case 6: sub = "history";break;
								case 7: sub = "biology";break;
								case 8: sub = "geography";break;
								case 9: sub = "politics";break;
								case 10: sub = "science";break;
								case 11: sub = "others";break;
							}
							onlineClassStr2+='<li>'+
								'<span class="'+sub+'"></span>'+
								subjectList[i].timeHint+
								'</li>';
						}
						onlineClassStr2+='</ul>'+
										'</div>';
						document.getElementById("onlineClass").innerHTML = onlineClassStr2;
						$("#onlineClass").show();
					}
				}
			}
			//实体班
			if(realClassInfo){
				//noLesson值为1表示近日无课程安排。值为0则表示近日有课程安排
				if(realClassInfo.noLesson == 1){
					var realClassStr = '<h2 class="tex_title_16Pix_222_borBottom pb17Pix pt17Pix">实体班</h2>'+
										'<p class="tex_tips_14Pix_999 pb18Pix pt18Pix">近日暂无上课安排</p>';
					document.getElementById("realClass").innerHTML = realClassStr;
					$("#realClass").show();
				}else{
					var subjectList =  realClassInfo.subjectList;
					var realClassStr2 = '<h2 class="tex_title_16Pix_222_borBottom pb17Pix pt17Pix pr4Per">实体班 <span id="realTaskIcon" hidden="hidden" class="entity_class_task_icon"></span></h2>'+
										  '<div class="recent_classes">'+
						 						'<h3>最近上课时间：'+realClassInfo.lastStudyTime+'</h3>'+
						 						'<ul class="class_list">';
					if(subjectList){
						for(i=0;i<subjectList.length;i++){
							var sub = "";
							switch(subjectList[i].subjectId){
								case 1: sub = "language";break;
								case 2: sub = "math";break;
								case 3: sub = "english";break;
								case 4: sub = "physics";break;
								case 5: sub = "chemistry";break;
								case 6: sub = "history";break;
								case 7: sub = "biology";break;
								case 8: sub = "geography";break;
								case 9: sub = "politics";break;
								case 10: sub = "science";break;
								case 11: sub = "others";break;
							}
							realClassStr2+='<li>'+
								'<span class="'+sub+'"></span>'+
								subjectList[i].timeHint+
								'</li>';
						}
						realClassStr2+='</ul>'+
										'</div>';
						document.getElementById("realClass").innerHTML = realClassStr2;
						$("#realClass").show();
					}
				}
			}
			//请求参数
			var jid = getLocalStorageItem(webStorageVars[2]);
			//网校首页任务数
			var data1="jid="+jid;
			getSignCode(data1,Config.getNetTaskUnNumUrl().split("?m=")[1],"getNetTaskUnNum_");
			//网校首页为你推荐内容
			var gradeId = getLocalStorageItem(webStorageVars[22]);
			if(gradeId){
				var data2 = "jid="+jid+"&gradeId="+gradeId;
				//getSignCode(data2,Config.getNetVideoInfoUrl(),"getNetVideoInfo_");
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取班级返回结果错误!");
			}
		}
	},function(){
		alertToast("获取班级请求失败!");
	});
}

//获取用户所在学校广场开关控制晒晒栏目的显示隐藏
function getSquareClassCircleConfig_(data) {
    getAjaxJSON2(Config.getSquareClassCircleConfig(),data,function (data) {
		if(data && data.result>0){
			if(data.data.squareFlag==0){
				$(".shaishai").hide()
			}else{
                $(".shaishai").show()
			}
		}
    },function(){
        alertToast("验证失败!!");
    })
}

//获取任务数
function getNetTaskUnNum_(data){
	postAjaxJSON(Config.getNetTaskUnNumUrl(),data,function(data){
		if(data && data.result>0){
			if(data.data.onlineTaskUnNum>0){
				$("#onlineTaskIcon").show();
				document.getElementById("onlineTaskIcon").innerHTML = data.data.onlineTaskUnNum;
			}
			if(data.data.realTaskUnNum>0){
				$("#realTaskIcon").show();
				document.getElementById("realTaskIcon").innerHTML = data.data.realTaskUnNum;
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取任务数返回结果错误!");
			}
		}
	},function(){
		alertToast("获取任务数请求失败!");
	});
}

//获取推荐课
function getNetVideoInfo_(data){
	postAjaxJSON(Config.getNetVideoInfoUrl(),data,function(data){
		if(data && data.result>0){
			var videoItemList = data.data.videoItemList;
			if(videoItemList){
				var videoItemStr = "";
				for(i=0;i<videoItemList.length;i++){
					videoItemStr+='<li  ontouchend="recommendDetail(\''+videoItemList[i].infoUrl+'\');">'+
									'<img src="'+videoItemList[i].videoPic+'"/>'+
									'<div class="con">'+
										'<p>'+videoItemList[i].videoName+'</p>'+
										'<span>'+videoItemList[i].videoHint+'</span>'+
									'</div>'+
								'</li>';
				}
				document.getElementById("recommend").innerHTML = videoItemStr;
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("推荐课程返回结果错误!");
			}
		}
	},function(){
		alertToast("推荐课程请求失败!");
	});
}

//推荐课程详情
function recommendDetail(urlInfo){
	if(!isH5Only){
		window.location.href = urlInfo+'://head?title=[为你推荐,false,,]&rightHandle:[isExist:false]';
	}else{
		window.location.href = urlInfo;
	}
}

//进入在线班
function toOnlineClass(){
	if(!isH5Only){
		document.location.href="://toOnlineClass";
	}
}

//进入实体班
function toRealClass(){
	if(!isH5Only){
		document.location.href="://toRealClass";
	}
}

//进入晒晒
function toShaiShai(){
	if(!isH5Only){
		document.location.href="://toShaiShai";
	}
}

//进入直播课
function toZhiBo(){
	if(!isH5Only){
		document.location.href="://toZhiBo?title=[直播课,false,,]&rightHandle:[isExist:false]";
	}
}

//进入点播课
function toDianBo(){
	if(!isH5Only){
		document.location.href="://toDianBo?title=[点播课,false,,]&rightHandle:[isExist:false]";
	}
}

//进入在线测评
function toCePing(){
	if(!isH5Only){
		document.location.href="://toCePing?title=[在线测评,false,,]&rightHandle:[isExist:false]";
	}
}

//进入互帮互学
function toYuXiWang(){
	document.location.href="://toYuXiWang";
}


//****************************刷新加载信息****************************
//控制关闭浮层
$(".float_cue_box_icon").off().on("click",function(){
	$(".float_cue").hide();
})
//**获取method值**
function getmethod(url){
	return url.substring(url.lastIndexOf("/")+1)
};
//获取设备类型
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
//将对象转换为指定字符串
function getString(jsObj){
	var a = JSON.stringify(jsObj);
	a=a.replace(/[\}|\{|"]{1}/g, "");
	a=a.replace(/[,]{1}/g, "&");
	a=a.replace(/[:]{1}/g, "=");
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
		eval(fn+"(eval("+JSON.stringify(data2)+"))");
	}else if(phoneType=="i"){
		delete data1.time;
		var data3=getString(data1);
		sendMsg2iOS("://getSignCode?"+data3+"&reqFn="+fn+"&returnSignFn=returnSign");
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
				eval(fn+"(eval("+JSON.stringify(data2)+"))");
			},
			error :function(xhr,status,throwInfo){
				alertToast("获取签名信息失败!");
			}
		});
	}
}

//*************************获取加载信息*********************
//以下pc端调试时需放开
//$(".bikanqingdan").show();
//loadgetResource("0");

//当无网络状态下点击换一批页面弹窗
$("#break_info").off().on("click",function(){
	if(navigator.onLine){
		$("#recommend").empty();
		loadgetResource("0");
	}else{
		alertInfo('当前无网络连接')
	}
});
//加载个性化列表信息(获取加密字符)
function loadgetResource(supply){
	$("#recommend").css({"background":"#f2f6f9"});
	var method=getmethod(getResourceUrl);
	var time=String(getTime());
	var appId="103";
	var strParam = getQueryStringFromUrl();
	var userId = strParam.jid;
	if(supply==1){
		var count=1;
	}else if(supply==0){
		var count=3;
	}
	var data1={
			method:method,
			time:time,
			appId:appId,
			userId:userId
		};
	var data2={
		method:method,
		time:time,
		appId:appId,
		userId:userId,
		'count':count,
		'supply':supply
	};
	DATA_SIGN="&count="+count+"&supply="+supply;
	getsign(data1,data2,'getResourcefn');
};
//加载个性化列表信息（方法）
function getResourcefn(data){
	//ios加上method参数
	if(phoneType=="i"){
		var method=getmethod(getResourceUrl);
		data+="&method="+method+DATA_SIGN;
	}
	console.log(data);
	$.ajax({
		type: "get",
		url: getResourceUrl,
		async:true,
		dataType: "jsonp",
		data:data,
		success: function (data) {
			if(data.result==1){
				var node=data.data.resourceList;
				var objectArr=["全科","语文","数学","英语","物理","化学","历史","生物","地理","政治","科学","文综","理综"];
				console.log(node);
				var d='';
				console.log(node.length);
				if(node.length==0){
					if($(".recommend_li").length==0){
						$("#recommend").html('<img class="recommend_nullImg" src="../../img/student/student_not_have.png"><p class="recommend_del">抱歉，今日已无可推荐资源</p>');
						$("#recommend").css({"background":"#fff"});
						alertToast("抱歉，今日已无可推荐资源");
					};
				}else{
					for(var i in node){
						//获取科目
						var num=node[i].subject;
						var object=objectArr[num];
						//获取类型
						var type=node[i].type;
						if(type==0){
							var picUrl=node[i].thumb;
							type="视频";
							var readNum=node[i].videoPlayNum+"次播放";
							var point='';
							var f='<img class="online_exam_recommend_img_i" src="../../img/student/student_online_school_open.png">'
						}else if(type==1){
							var picUrl=BASE_API_URL+node[i].thumb;
							type="试题";
							var readNum=node[i].exerciseNum+"人练习";
							var point='&pointName='+node[i].pointName;
							var f='';
						}
						d='<li class="recommend_li" data-pointName="'+point+'" data-url="'+node[i].pageUrl+'" data-rid="'+node[i].rid+'" data-pointId="'+node[i].pointId+'" data-type="'+node[i].type+'" data-videoId="'+node[i].videoId+'">'+
							'<div class="online_exam_recommend_list_pointer">'+
							'<img class="online_exam_recommend_list_pointer_img" src="../../img/student/student_online_school_pointer.png" data-videoId="'+node[i].videoId+'"/>'+
							'<div class="online_exam_recommend_list_pointer_list hidden" data-statuds="0">'+
							'<p class="online_exam_recommend_list_pointer_list_p" data-choose="1" onclick="feedback(this)">还没学到</p>'+
							'<p class="online_exam_recommend_list_pointer_list_p" data-choose="2" onclick="feedback(this)">已经学过</p>'+
							'<p class="online_exam_recommend_list_pointer_list_p" data-choose="3" onclick="feedback(this)">不感兴趣</p>'+
							'</div>'+
							'</div>'+
							'<img class="online_exam_recommend_img"  src="'+picUrl+'"/>'+
							'<div class="con recommend_li_con">'+
							'<p class="con_text">'+node[i].pointName+'</p>'+
							'<p class="con_btn"><span class="con_btn_1">'+object+'</span><span class="con_btn_2">'+type+'</span><span class="con_btn_r">'+readNum+'</span></p>'+
							'</div>'+
							f+
							'</li>';
						$("#recommend").append(d);
					}

					//点击推荐学习的隐藏图片，弹出下拉列表
					//$(".online_exam_recommend_list_pointer_img").off().on('click',function(event){
					//	$(".float_cen").hide();
					//	$(".online_exam_recommend_list_pointer_list").hide();
					//	$(this).parent().find(".online_exam_recommend_list_pointer_list").show();
					//	$(this).parent().css("z-index","999");
					//	$(".float_cen").show();
					//	console.log("展开");
					//	$(".online_exam_recommend_list_pointer").css({"height":"120px"});
					//	//alertToast("展开");
					//	if(event.stopPropagation){
					//		event.stopPropagation();
					//	}else{
					//		event.cancelBubble = true;
					//	}
					//	//setTimeout(function(){
					//	//	$(".online_exam_recommend_list_pointer_list").hide();
					//	//},6000);
					//	//return false;
					//});
					//////点击其他位置，隐藏下拉列表
					//$(".float_cen").off().on('click',function(event){
					//	$(".online_exam_recommend_list_pointer_list").hide();
					//	$(".online_exam_recommend_list_pointer").css({"height":"36px"});
					//	$(".float_cen").hide();
					//	console.log("隐藏");
					//	//alertToast("隐藏");
					//});
					//点击其他位置全部隐藏
					$(document.body).off().on('click',function(){
						$('.online_exam_recommend_list_pointer_list').hide();
					});
					//点击某处让其显示
					var newTime = null;
					$('.online_exam_recommend_list_pointer_img').off().on('click',function(event){
						//阻止事件冒泡
						event.stopPropagation();
						clearTimeout(newTime);
						var that = $(this);
						$(this).siblings().attr('data-statuds','1');
						$(this).parents().siblings().find('.online_exam_recommend_list_pointer_list').hide();
						var off = $(this).siblings().attr("data-statuds");
						if(off==1){
							$(this).parent().find('.online_exam_recommend_list_pointer_list').show();
							newTime = setTimeout(function(){
								that.parent().find('.online_exam_recommend_list_pointer_list').hide(function(){
									clearTimeout(newTime)
								});
								clearTimeout(newTime)
							},3000);
						}else{
						}
					});
					//点击文本进入实体页面
					$(".recommend_li_con").off().on("click",function(){
						if(navigator.onLine){
							var url=$(this).parent("li").attr("data-url");
							$("#recommend").attr("data-url",url);
							var type=$(this).parent("li").attr("data-type");
							var pointId=$(this).parent("li").attr("data-pointId");
							var videoId=$(this).parent("li").attr("data-videoId");
							var appId="103";
							if(type==0){
								//能否获取视频的播放地址
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
								DATA_SIGN='&pointId='+pointId+'&videoId='+videoId;
								getsign(data1,data2,'getPlayfn');
							}else{
								skipUrl();
							}
						}else{
							setTimeout(function(){
								alertInfo('当前无网络连接')
							},1000)
						}

					});
					//点击图片内容进入到试题或视频页
					$(".online_exam_recommend_img").off().on("click",function(){
						if(navigator.onLine){
							var url=$(this).parent("li").attr("data-url");
							$("#recommend").attr("data-url",url);
							var type=$(this).parent("li").attr("data-type");
							var pointId=$(this).parent("li").attr("data-pointId");
							var videoId=$(this).parent("li").attr("data-videoId");
							var appId="103";
							if(type==0){
								//能否获取视频的播放地址
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
								DATA_SIGN='&pointId='+pointId+'&videoId='+videoId;
								getsign(data1,data2,'getPlayfn');
							}else{
								skipUrl();
							}
						}else{
							setTimeout(function(){
								alertInfo('当前无网络连接')
							},1000)
						}
					});
					//点击视频上的三角按钮进入视频页
					$(".online_exam_recommend_img_i").off().on("click",function(){
						if(navigator.onLine){
							//能否获取视频的播放地址
							console.log("dianjisanjiao");
							var url=$(this).parent("li").attr("data-url");
							$("#recommend").attr("data-url",url);
							var type=$(this).parent("li").attr("data-type");
							var pointId=$(this).parent("li").attr("data-pointId");
							var videoId=$(this).parent("li").attr("data-videoId");
							var appId="103";
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
							DATA_SIGN='&pointId='+pointId+'&videoId='+videoId;
							getsign(data1,data2,'getPlayfn');
						}else{
							setTimeout(function(){
								alertInfo('当前无网络连接')
							},1000)
						}
					});
				}
			}else{
				alertToast(data.msg);
			}
		},
		error :function(data){
			alertToast("数据加载失败");
		}
	});
};
//记录用户反馈（传参调用）
function feedback(dom){
	//公用header
	var method=getmethod(feedbackUrl);
	var time=String(getTime());
	var appId="103";
	var strParam = getQueryStringFromUrl();
	var userId = strParam.jid;
	//知识点id
	var pointId = $(dom).parents("li").attr("data-pointId");//知识点id
	var videoId =$(dom).parents("li").attr("data-videoId");//视频Id
	var feedbackType=1 ;//动作类型关闭打开
	var resourceType= $(dom).parents("li").attr("data-type");//0：微视频 1：试题
	var reasonId = $(dom).attr("data-choose");//123;关闭理由
	$("#recommend").attr("data-pointId",pointId);
	$("#recommend").attr("data-videoId",videoId);
	var num=$(".recommend_li").index($(dom).parents("li"));
	$("#recommend").attr("data-num",num);
	console.log(num);

	//知识点
	if(resourceType==1){
		var data1={
			method:method,
			time:time,
			appId:appId,
			userId:userId,
			pointId:pointId,
		}
		var data2={
			method:method,
			time:time,
			appId:appId,
			userId:userId,
			pointId:pointId,
			feedbackType:feedbackType,
			resourceType:resourceType,
			reasonId:reasonId
		}
		DATA_SIGN='&pointId='+pointId+'&feedbackType='+feedbackType+'&resourceType='+resourceType+'&reasonId='+reasonId;
		//视频
	}else if(resourceType==0){
		var data1={
			method:method,
			time:time,
			appId:appId,
			userId:userId,
			pointId:pointId,
			videoId:videoId
		}
		var data2={
			method:method,
			time:time,
			appId:appId,
			userId:userId,
			pointId:pointId,
			videoId:videoId,
			feedbackType:feedbackType,
			resourceType:resourceType,
			reasonId:reasonId
		}
		DATA_SIGN='&pointId='+pointId+'&videoId='+videoId+'&feedbackType='+feedbackType+'&resourceType='+resourceType+'&reasonId='+reasonId;
	}
	getsign(data1,data2,'feedbackfn');
};
//记录用户反馈（方法，关闭时调用 ）
function feedbackfn(data){
	console.log(data+"jiluyonghufankui");
	console.log(getString(data));
	if(phoneType=="i"){
		var method=getmethod(feedbackUrl);
		data+="&method="+method+DATA_SIGN;
	}
	$.ajax({
		type: "post",
		url: feedbackUrl,
		dataType: "json",
		data:data,
		success: function (data) {
			if(data.result==1){
				var num=$("#recommend").attr("data-num");
				console.log(num+"num");
				$("#recommend").children(".recommend_li").eq(num).remove();
				loadgetResource("1");
			}else{
				alertToast(data.msg);
			}
		},
		error :function(data){
			alertToast("糟糕，反馈未提交成功");
		}
	});
};
//获取视频播放地址
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
			console.log(data);
			if(data.result==1){
				skipUrl();
			}else if(data.result==-60002){
				$(".float_wangxiao").show();
				$(".float_cue_box_icon").off().on("click",function(){
					$(".float_wangxiao").hide();
					$(".online_exam_recommend_list_pointer").show()
				})
			}else if(data.result==-60003){
				$(".float_shuxiao").show();
				$(".float_cue_box_icon").off().on("click",function(){
					$(".float_shuxiao").hide();
					$(".online_exam_recommend_list_pointer").show()
				})
			}else{
				alertToast(data.msg);
			}
		},
		error:function(data){
			alertToast(data.msg);
		}
	})
};
//跳转函数--
function skipUrl(){
	var url=$("#recommend").attr("data-url");
	if(phoneType=="i"){
		window.location.href=url+'://head?title=[,false,,]&rightHandle:[isExist:false]&isShow=false';
	}else{
		window.location.href=url;
	}
};
/*阻止ios拖拽到底部还能继续拖拽*/

var ScrollFix = function(elem) {
	// Variables to track inputs
	var startY, startTopScroll;

	elem = elem || document.querySelector(elem);

	// If there is no element, then do nothing
	if(!elem)
		return;

	// Handle the start of interactions
	elem.addEventListener('touchstart', function(event){
		startY = event.touches[0].pageY;
		startTopScroll = elem.scrollTop;

		if(startTopScroll <= 0)
			elem.scrollTop = 1;

		if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
			elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
	}, false);
};

/*判断设备调用ScrollFix*/

var sUserAgent=navigator.userAgent.toLowerCase();
if(sUserAgent.match(/iphone os/i) == "iphone os"){
	$('.wrapper').addClass('wrapper2');
	ScrollFix($('.wrapper2')[0]);
}

/*阻止用户双击使屏幕上滑*/
var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
var iLastTouch = null;                                //缓存上一次tap的时间
if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0)
{
	document.body.addEventListener('touchend', function(event)
	{
		var iNow = new Date()
			.getTime();
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
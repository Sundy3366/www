function classNoticeList_(data){
	var catchFlag = false;
	postAjaxJSON(Config.getActivityListUrl(),data,function(data){
		if(data && data.result > 0){//&& (data.result==1 || data.result==2)
			var pageNum = data.data.pageNum;
			var activityList = data.data.activityList;
			var classList = data.data.classList;
			if(classList){
				saveLocalStorageItem(webStorageVars[21],classList);
			}
			$(".bottomMoreLoading").attr("status","true");
             if((!activityList || !activityList.length) && !$("#classNoticeList").children().first().children().length){
                 $(".bl_img_div").show();
                 $("#classNoticeList").hide();
                 $(".bottomMoreLoading").attr("status","false");
                 return false;
             }
			if(data.result == 2 || data.result == 3){
				$(".bottomMoreLoading").attr("status","false");
				if(data.result == 3)
					return false;
			}
			
			currPageNum=parseInt(pageNum);
			if(activityList){
				if(touchType == 1)	
					document.getElementById("classNoticeList").children[0].innerHTML="";
				for(i=0;i<activityList.length;i++){
					var activityItem = document.createElement("div");//
					activityItem.setAttribute("class", "swiper-slide");
//					activityItem.setAttribute("onclick",'activityDetail('+activityList[i].activityId+');');
					activityItem.setAttribute("data", activityList[i].activityId);
					touch.on($(activityItem).off(), 'tap', function(ev){
						var ali = $(ev.currentTarget);
						activityDetail(ali.attr("data"));
					});
					activityItem.setAttribute("data",activityList[i].activityId);
					var activityPic = '';
					if(activityList[i].activityPic){
//						activityPic = '<img src="'+activityList[i].activityPic+'"/>';
						activityPic = '<div class="img" style="background:url('+activityList[i].activityPic+') no-repeat center center;background-size:100%;position:relative;"></div>';
					}
					var prevTime = $("#classNoticeList").children().first().find("time[hasContent=true]").last().text();
					var isShowTime = true;
					if(activityList[i].activityTime==prevTime)
						isShowTime = false;
					var activityItemStr = "";
					activityItemStr+=(isShowTime?'<time hasContent="true">'+activityList[i].activityTime+'</time>':'<time style="padding-top:0;"></time>')+
									'<div class="con">'+
										'<p>'+activityList[i].activityTitle+'</p>'+activityPic+
				                 	'<div name="del" data="'+activityList[i].activityId+'"><span></span></div>'+
									'</div>';
					activityItem.innerHTML = activityItemStr;
					document.getElementById("classNoticeList").children[0].appendChild(activityItem);
					touch.on($(activityItem).find("[name=del]").off(), 'tap', function(ev){
						var ali = $(ev.currentTarget);
						activityDel(ali.attr("data"));
					});
				}
				
			}
			touchOutHandle(teacherClassNoticesUpDownHandle);
		}else{
			catchFlag = true;
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("班级通知返回结果错误!");
			}
		}
	},function(){
		catchFlag = true;
		alertToast("班级通知请求失败!");
	});
	if(catchFlag)
		touchOutHandle(teacherClassNoticesUpDownHandle);
}
//保存通知id
var activityId = '';
//删除班级通知（点击删除图标按钮）
function activityDel(activityIdParam){
	//阻止冒泡
	event.stopPropagation();
	activityId = activityIdParam;
	$('.delMemberDiv').show();
}

//删除班级通知（点击确认按钮）
function activityDelSure(){
	$('.delMemberDiv').hide();
	//请求参数
	var jid = getLocalStorageItem(webStorageVars[2]);
	var schoolId = getLocalStorageItem(webStorageVars[5]);
	var belong = 3;
	var objectId = activityId;
	var objectType = 0;
	var type = 4;
	var isBoth = 0;
	var lookType = 0
	var content = "123";//任意填的值 
	var title = "123";//任意填的值 
	var classStr = "123";//任意填的值 
	var data="jid="+jid+"&schoolId="+schoolId+"&belong="+belong+"&objectId="+objectId+
	          "&objectType="+objectType+"&type="+type+"&isBoth="+isBoth+
	          "&content="+content+"&title="+title+"&classStr="+classStr+"&lookType="+lookType;
	getSignCode(data,Config.pushDynamicUrl(),"activityDelSure_");
}

//删除班级通知返回处理
function activityDelSure_(data){
	postAjaxJSON(Config.pushDynamicUrl(),data,function(data){
		if(data && data.result>0){
//			$("#classNoticeList div[data="+activityId+"]").remove();
			document.location.reload();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("删除班级通知返回结果错误!");
			}
		}
	},function(){
		alertToast("删除班级通知请求失败!");
	});
}

//班级通知详情
function activityDetail(activityId){
	//alertInfo(activityId+"dd");
	var href='class_notice_detail.html?activityId='+activityId+'&pageNum='+1;
	if(!isH5Only) {
		href+='://head?title=[通知详情,false,,]&rightHandle:[isExist:false]://keyboard'; 
	}
	window.location.href = href;
}

//班级通知详情展示
function activityDetail_(data){
	var catchFlag = false;
	var param = getParam2Json(data);
	postAjaxJSON(Config.getActivityInfoUrl(),data,function(data){
		if(data && data.result > 0){// && (data.result==1 || data.result==2 || data.result==3)
            $(".class_notice_detail").show();
			if(!touchType && !currMySwiper){
				document.getElementById("activityTitle").innerHTML = data.data.replyTitle;
				if(data.data.replyImg){
					document.getElementById("headImg").src = data.data.replyImg;
					$("#headImg").show();
				}
				document.getElementById("activityContent").innerHTML = data.data.replyContent;
				document.getElementById("talkNum").innerHTML = data.data.replyNum;
			}
			var secondaryReplyList = data.data.secondaryReplyList;
//			var replyListDom = document.getElementById("replyList");
//			var replyListHeight = (document.documentElement.clientHeight - replyListDom.offsetTop);
//			replyListDom.style.height = (replyListHeight<300?300:replyListHeight)+"px";
			$(".bottomMoreLoading").attr("status","true").addClass("visible");
			if(data.result == 2 || data.result == 3){
				$(".bottomMoreLoading").attr("status","false").removeClass("visible");
				if(data.result == 3)
					return false;
			}
			var data = data.data;
			if(!secondaryReplyList.length){
				$(".bl_img_div").show();
				$(".bottomMoreLoading").attr("status","false");
				return false;
			}
			currPageNum=parseInt(param.pageNum);
			if(secondaryReplyList){
  				for(i=0;i<secondaryReplyList.length;i++){
  					var replyName = '';
  					var replySecStr = '';
  					if(secondaryReplyList[i].replyJid){
  						replyName = secondaryReplyList[i].replyName;
  						replySecStr = '<p>回复 <span class="cnd_color">'+replyName+'</span><span name="replyContentSpan" data="'+secondaryReplyList[i].replyContent+'"> '+matchEmoji(secondaryReplyList[i].replyContent)+'</span></p>'
  					}else{
  						replySecStr = '<p><span name="replyContentSpan" data="'+secondaryReplyList[i].replyContent+'">'+matchEmoji(secondaryReplyList[i].replyContent)+'</span></p>';
  					}
					var replyItem = document.createElement("div");
					replyItem.setAttribute("class", "divLi swiper-slide");
					replyItem.setAttribute("replyId",secondaryReplyList[i].replyId);
					replyItem.setAttribute("userId",secondaryReplyList[i].userInfo.userId);
					var replyStr = "";
					replyStr+='<dl>'+
								'<dt><img onclick="gotoPersonInfoPage('+secondaryReplyList[i].userInfo.userId+','+secondaryReplyList[i].userInfo.userType+')" class="'+(secondaryReplyList[i].userInfo.userType==1||secondaryReplyList[i].userInfo.userType==2?"teacher":secondaryReplyList[i].userInfo.userType==6?"parent":"")+
								'" src="'+secondaryReplyList[i].userInfo.userPhoto+'"/></dt>'+
								'<dd>'+
									'<h4><span onclick="gotoPersonInfoPage('+secondaryReplyList[i].userInfo.userId+','+secondaryReplyList[i].userInfo.userType+')">'+secondaryReplyList[i].userInfo.userName+'</span></h4>'+
									'<time>'+secondaryReplyList[i].replyTime+'</time>'+
									replySecStr+
								'</dd>'+
							'</dl>';
					replyItem.innerHTML = replyStr;
					document.getElementById("replyList").children[0].appendChild(replyItem);
  				}
			}
//			$("#replyList .swiper-wrapper").children().off().on("click",function(ev){
			touch.on($("#replyList .divUl p").off(),'click hold',function(ev){
	        		var ali = $(ev.currentTarget).parent().parent().parent();
					var content = ali.find("dd p [name=replyContentSpan]").attr("data");
					var replyId = ali.attr("replyId");
					var userId = ali.attr("userId");
					if(userId == jid){
						$("#editContext [data=del]").show();
					}else{
						$("#editContext [data=del]").hide();
					}
					$("#editContext").show().find("ul li").off().on("click",function(ev){
						var type = $(this).attr("data");
						switch(type){
							case 'reply':
								replySec('reply',replyId);
								break;
							case 'del':
								replySec('del',replyId);
								break;
							case 'copy':
								replyCopy(content);
								break;
						}
						ev.stopImmediatePropagation();
					});
					ev.stopImmediatePropagation();
	        });
			/*
			touch.on($("#replyList .swiper-wrapper").children().off(),'tap',function(ev){//hold
				var ali = $(ev.currentTarget);
				var content = ali.find("dd p").text();
				var replyId = ali.attr("replyId");
				$("#editContext").show().find("ul li").off().on("touchstart",function(){
					var type = $(this).attr("data");
					switch(type){
						case 'reply':
							replySec('reply',replyId);
							break;
						case 'del':
							replySec('del',replyId);
							break;
						case 'copy':
							replyCopy(content);
							break;
					}
				});
				ev.stopImmediatePropagation();
			});
			*/
//			touchOutHandle(classNoticesDetailUpDownHandle);
		}else{
			catchFlag = true;
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("班级通知详情返回结果错误!");
			}
		}
	},function(){
		catchFlag = true;
		alertToast("班级通知详情请求失败!");
	});
//	if(catchFlag)
//		touchOutHandle(classNoticesDetailUpDownHandle);
}
/**
 * 关闭编辑弹出层 
 * @param {Object} t
 */
function closeContextMenuPop(t){
	$(this).off().parent().hide();
}

//新增班级通知（点击右上角加号按钮）
function createClassNotice(){
	var href = "new_notice.html";
	if(!isH5Only){
		href+= '://head?title=[新建通知,false,,]&rightHandle:[isExist:true,type:type2,value:[[下一步,createClassNoticeNext,]]]';
	}
	window.location.href = href;
}

//新增班级通知(点击右上角下一步按钮)
function createClassNoticeNext(){
	var noticeTitle = document.getElementById("noticeTitle").value.trim();
	var noticeContent = document.getElementById("noticeContent").value.trim();
	if(!noticeTitle || !noticeContent){
		alertToast("标题和内容不能为空哦~");
		return;
	}
	//把班级通知的标题和内容存入本地
	saveLocalStorageItem(webStorageVars[19],noticeTitle);
	saveLocalStorageItem(webStorageVars[20],noticeContent);
	var href = "public_notice.html";
	if(!isH5Only){
		href+='://head?title=[发布给,false,,]&rightHandle:[isExist:true,type:type2,value:[[完成,createClassNoticeCommit,]]]';
	}
	window.location.href = href;
}

//选择班级范围
function classSelect(classId){
		if(document.getElementById(classId).classList.contains("hig")){
			document.getElementById(classId).classList.remove("hig");
		}else{
			document.getElementById(classId).classList.add("hig");
		}
}

//新增班级通知(点击右上角完成按钮)
function createClassNoticeCommit(imgUrl){
	//请求参数
	var jid = getLocalStorageItem(webStorageVars[2]);
	var schoolId = getLocalStorageItem(webStorageVars[5]);
	var belong = 3;
	//var objectId = activityId;
	var objectType = 0;
	var isBoth = 0;
	var content = getLocalStorageItem(webStorageVars[20]);
	var title = getLocalStorageItem(webStorageVars[19]);
	var type = 1;
	var lookType = 0;
	var classStr = "";
	$.each($("#classScope a[class=hig]"),function(i,v){
		classStr += $(v).attr("id")+",";
	});
	classStr = classStr?classStr.substring(0,classStr.length-1):"";
	if(!classStr){
        onLoaded();
		alertToast("请选择班级");
		return;
	}
	if(document.getElementById("parentLook").classList.contains("hig") && document.getElementById("studentLook").classList.contains("hig")){
		if(!(document.getElementById("isTalk").classList.contains("hig"))){
			type = 5;
		}
	}else{
		if(document.getElementById("parentLook").classList.contains("hig")){
			lookType = 1;
			if(!(document.getElementById("isTalk").classList.contains("hig"))){
				type = 5;
			}
		}else{
			lookType = 2;
		}
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&belong="+belong+
	          "&objectType="+objectType+"&type="+type+"&isBoth="+isBoth+
	          "&content="+content+"&title="+title+"&classStr="+classStr+"&lookType="+lookType;
	//注意  如果有图片的话，需要上传图片路径,图片路径取http://vw.im.etiantian.net/imfiles/2016/03/28/im_56f8a0366250d_1057955516.jpg imfiles后的路径
	if(imgUrl){
		if(imgUrl.indexOf("http://")==0)
			imgUrl = imgUrl.split("imfiles")[1];
		imgUrl = encodeURIComponent(encodeURIComponent(imgUrl));
	    data+="&resourceUrl="+imgUrl;
    }
    sendMsg2iOS("://loadingStart");
	getSignCode(data,Config.pushDynamicUrl(),"createClassNoticeCommit_");
}

//新增班级通知执行函数（调用后台）
function createClassNoticeCommit_(data){
	postAjaxJSON(Config.pushDynamicUrl(),data,function(data){
         sendMsg2iOS("://loadingEnd");
		if(data && data.result>0){
			if(!isH5Only){
				goBackNow(-2,true);
			}else{
				window.location.href = "class_notice.html";
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("新增班级通知返回结果错误!");
			}
		}
	},function(){
        sendMsg2iOS("://loadingEnd");
		alertToast("新增班级通知请求失败!");
	});
}

//点击回复图标（对当前的通知详情进行回复）
function replyMain(){
	if(!isH5Only){
		sendMsg2iOS("://replyOne?reqFn=replyOne");
	}else{
		//请求参数
//		var jid = getLocalStorageItem(webStorageVars[2]);
//		var schoolId = getLocalStorageItem(webStorageVars[5]);
		var belong = 3;
		var objectId = activityId;
		//表示一级回复
		var objectType = 1;
		var isBoth = 0;
		//这个值通过键盘输入获取到
		var content = '测试一级回复';
		var type = 1;
		var lookType = 0;
		var data="jid="+jid+"&schoolId="+schoolId+"&belong="+belong+
		          "&objectType="+objectType+"&type="+type+"&isBoth="+isBoth+
		          "&content="+content+"&lookType="+lookType+"&objectId="+objectId;
		getSignCode(data,Config.pushDynamicUrl(),"replyMain_");
	}
}

//ios弹出键盘返回数据（一级回复）
function replyOne(replyOneContent){
		//请求参数
		var jid = getLocalStorageItem(webStorageVars[2]);
		var schoolId = getLocalStorageItem(webStorageVars[5]);
		var belong = 3;
		var objectId = activityId;
		//表示一级回复
		var objectType = 1;
		var isBoth = 0;
		//这个值通过键盘输入获取到
		var content = replyOneContent;
		var type = 1;
		var lookType = 0;
		var data="jid="+jid+"&schoolId="+schoolId+"&belong="+belong+
		          "&objectType="+objectType+"&type="+type+"&isBoth="+isBoth+
		          "&content="+content+"&lookType="+lookType+"&objectId="+objectId;
		getSignCode(data,Config.pushDynamicUrl(),"replyMain_");
}

//ios弹出键盘返回数据(二级回复)
function replyTwo(objectId,replyTwoContent){
		//请求参数
		var jid = getLocalStorageItem(webStorageVars[2]);
		var schoolId = getLocalStorageItem(webStorageVars[5]);
		var belong = 3;
		//表示二级回复
		var objectType = 2;
		var isBoth = 0;
		//这个值通过键盘输入获取到
		var content = replyTwoContent;
		var type = 1;
		var lookType = 0;
		var data="jid="+jid+"&schoolId="+schoolId+"&belong="+belong+
		          "&objectType="+objectType+"&type="+type+"&isBoth="+isBoth+
		          "&content="+content+"&lookType="+lookType+"&objectId="+objectId;
		getSignCode(data,Config.pushDynamicUrl(),"replyMain_");
}

//长按弹出回复、删除（对二级通知详情进行操作）
function replySec(flagStr,objectId){
	if(!isH5Only){
		if(flagStr=="reply"){
			$("#editContext").hide();
			sendMsg2iOS("://replyTwo?reqFn=replyTwo&reqFnParam="+objectId);
		}else{
			//请求参数
			var jid = getLocalStorageItem(webStorageVars[2]);
			var schoolId = getLocalStorageItem(webStorageVars[5]);
			var belong = 3;
			var objectId = objectId;
			//表示二级回复
			var objectType = 2;
			var isBoth = 0;
			var content = $("[replyId="+objectId+"] p").text();
			var type = 4;
			var lookType = 0;
			var data="jid="+jid+"&schoolId="+schoolId+"&belong="+belong+
			          "&objectType="+objectType+"&type="+type+"&isBoth="+isBoth+
			          "&content="+content+"&lookType="+lookType+"&objectId="+objectId;
			getSignCode(data,Config.pushDynamicUrl(),"replyDel_");
		}
	}else{
		//请求参数
		var jid = getLocalStorageItem(webStorageVars[2]);
		var schoolId = getLocalStorageItem(webStorageVars[5]);
		var belong = 3;
		var objectId = objectId;
		//表示二级回复
		var objectType = 2;
		var isBoth = 0;
		//这个值通过键盘输入获取到
		var content = '测试第一个二级回复';
		var type = 1;
		if(flagStr=="reply"){
			type = 1;
		}else{
			type = 4;
		}
		var lookType = 0;
		var data="jid="+jid+"&schoolId="+schoolId+"&belong="+belong+
		          "&objectType="+objectType+"&type="+type+"&isBoth="+isBoth+
		          "&content="+content+"&lookType="+lookType+"&objectId="+objectId;
		if(flagStr=="reply"){
			getSignCode(data,Config.pushDynamicUrl(),"replyMain_");
		}else{
			getSignCode(data,Config.pushDynamicUrl(),"replyDel_");
		}
	}
}

//长按弹出复制（对二级通知详情进行操作）
function replyCopy(copyContent){
	if(!isH5Only){
		sendMsg2iOS("://replyPasteBoard?content="+copyContent);
	}
	alertToast("已复制到剪贴板");
	$("#editContext").hide();
}

//长按弹出删除（对二级通知详情进行操作）
function replyDel_(data){
	var param = getParam2Json(data);
	$("#editContext").hide();
	postAjaxJSON(Config.pushDynamicUrl(),data,function(data){
		if(data && data.result>0){
			var id = param.objectId;
			$("[replyId="+id+"]").remove();
			document.getElementById("talkNum").innerHTML = parseInt(document.getElementById("talkNum").innerHTML)-1;
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("删除回复返回结果错误!");
			}
		}
	},function(){
		alertToast("删除回复请求失败!");
	});
}

//
function replyMain_(data){
	$("#editContext").hide();
	postAjaxJSON(Config.pushDynamicUrl(),data,function(data){
		if(data && data.result>0){
	  		var replyName = '';
			var replySecStr = '';
			if(data.data.replyJid){
				replyName = data.data.replyName;
				replySecStr = '<p>回复 <span class="cnd_color">'+replyName+'</span><span name="replyContentSpan" data="'+data.data.replyContent+'"> '+matchEmoji(data.data.replyContent)+'</span></p>'
			}else{
				replySecStr = '<p><span name="replyContentSpan" data="'+data.data.replyContent+'">'+matchEmoji(data.data.replyContent)+'</span></p>';
			}
//			var replyListDom = document.getElementById("replyList");
//			replyListDom.style.height = (document.documentElement.clientHeight - replyListDom.offsetTop)+"px";
			var replyItem = document.createElement("div");
			replyItem.setAttribute("replyId",data.data.replyId);
			replyItem.setAttribute("class", "divLi swiper-slide");
			replyItem.setAttribute("userId",data.data.userInfo.userId);
			var replyStr = "";
			replyStr+='<dl>'+
						'<dt><img  onclick="gotoPersonInfoPage('+data.data.userInfo.userId+','+data.data.userInfo.userType+')"  class="'+(data.data.userInfo.userType==1||data.data.userInfo.userType==2?"teacher":data.data.userInfo.userType==6?"parent":"")+ 
						'" src="'+data.data.userInfo.userPhoto+'"/></dt>'+
						'<dd>'+
							'<h4> <span onclick="gotoPersonInfoPage('+data.data.userInfo.userId+','+data.data.userInfo.userType+')">'+data.data.userInfo.userName+'</span></h4>'+
							'<time>'+data.data.replyTime+'</time>'+
							replySecStr+
						'</dd>'+
					'</dl>';
			replyItem.innerHTML = replyStr;
			document.getElementById("replyList").children[0].appendChild(replyItem);
			document.getElementById("talkNum").innerHTML = parseInt(document.getElementById("talkNum").innerHTML)+1;
//			$("#replyList .swiper-wrapper").children().off().on("click",function(ev){
			touch.on($("#replyList .divUl p").off(),'click hold',function(ev){
	        		var ali = $(ev.currentTarget).parent().parent().parent();
					var content = ali.find("dd p [name=replyContentSpan]").attr("data");
					var replyId = ali.attr("replyId");
					var userId = ali.attr("userId");
					if(userId == jid){
						$("#editContext [data=del]").show();
					}else{
						$("#editContext [data=del]").hide();
					}
					$("#editContext").show().find("ul li").off().on("click",function(ev){
						var type = $(this).attr("data");
						switch(type){
							case 'reply':
								replySec('reply',replyId);
								break;
							case 'del':
								replySec('del',replyId);
								break;
							case 'copy':
								replyCopy(content);
								break;
						}
						ev.stopImmediatePropagation();
					});
					ev.stopImmediatePropagation();
	        });
	        /*
			touch.on($("#replyList .swiper-wrapper").children().off(),'tap',function(ev){//hold
				var ali = $(ev.currentTarget);
				var content = ali.find("dd p").text();
				var replyId = ali.attr("replyId");
				$("#editContext").show().find("ul li").off().on("touchstart",function(){
					var type = $(this).attr("data");
					switch(type){
						case 'reply':
							replySec('reply',replyId);
							break;
						case 'del':
							replySec('del',replyId);
							break;
						case 'copy':
							replyCopy(content);
							break;
					}
					ev.stopImmediatePropagation();
				});
			});
			*/
			if(replySwiper)
				replySwiper.reInit();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("回复返回结果错误!");
			}
		}
	},function(){
		alertToast("回复请求失败!");
	});
}
/**
 * 创建通知 获取照片
 * @param {Object} imgSrcType
 */
function getANoticePic(imgSrcType){
	var targetType = $("#getPicPopDiv").attr("data");
	var targetType = 2;//新建通知目标类型
	sendMsg2iOS("://takeAPic?imgSrcType="+imgSrcType+"&targetType="+targetType+
				"&reqFn=receiveAnoticePicFromiOS");
}
/**
 * 获取创建通知 iOS选择的图片base64 
 * @param {Object} imgData
 */
function receiveAnoticePicFromiOS(imgData){
	if(imgData){
		$("#previewImg").css("background","url("+imgData+"?_="+new Date().getTime()+") no-repeat center")
		.css("background-size","100%").show();
		$("#getPicBtn").hide();
	}
}
/**
 *删除通知图片 
 */
function removeNoticePicToiOS(){
	sendMsg2iOS("://delTempPic?targetType=2");
}
/**
 * 删除通知中的图片
 */
function removeImgForNotice(){
	$("#previewImg").css("background","none").hide();
	$("#getPicBtn").show();
	event.preventDefault();
	event.stopPropagation();
	//通知iOS删除图片
	removeNoticePicToiOS();
}
/**
 * 获取教师班级通知 
 * @param {Object} pageNum
 */
function getTeacherClassNotice(pageNum){
	pageNum = pageNum ? pageNum:1;
	var uType = getLocalStorageItem(webStorageVars[7]);
	var data="jid="+jid+"&schoolId="+schoolId+"&pageNum="+pageNum+"&type="+uType;
	getSignCode(data,Config.getActivityListUrl(),"classNoticeList_");
}
/**
 *  通知列表上拉刷新,下拉加载处理
 */
function teacherClassNoticesUpDownHandle(){
	//下拉刷新,上拉加载
	upAndDownSwiperWrapper('.swiper-container',
  			'.topFlushLoading',function(mySwiper){
  				$('.topFlushLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 1;
  				currMySwiper = mySwiper;
  				getTeacherClassNotice(1);
  			},
  			'.bottomMoreLoading',function(mySwiper){
  				$('.bottomMoreLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 0;
  				currMySwiper = mySwiper;
  				loadingMore4TeacherClassNotice();
  			});
}

/**
 * 加载更多
 */
function loadingMore4TeacherClassNotice(){
	getTeacherClassNotice(currPageNum+1);
}

/**
 *  通知详情回复列表上拉刷新,下拉加载处理
 */
function classNoticesDetailUpDownHandle(){
	//下拉刷新,上拉加载
	replySwiper = upAndDownSwiperWrapper('.swiper-container',
  			'.topFlushLoading',function(mySwiper){
  			},function(mySwiper){
  				touchType = 1;
  				currMySwiper = mySwiper;
  				touchOutHandle();
  			},
  			'.bottomMoreLoading',function(mySwiper){
  				$('.bottomMoreLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 0;
  				currMySwiper = mySwiper;
  				loadingMore4ClassNoticeDetail();
  			});
}

/**
 * 通知详情回复中的更多回复 
 */
function loadingMore4ClassNoticeDetail(){
	getActivityInfo(currPageNum+1);
}
/**
 * 获取班级详情,含回复,回复分页时不处理通知信息 
 * @param {Object} pageNum
 */
function getActivityInfo(pageNum){
	pageNum = pageNum?pageNum:1;
	var data="jid="+jid+"&schoolId="+schoolId+"&pageNum="+pageNum+"&activityId="+activityId;
	getSignCode(data,Config.getActivityInfoUrl(),"activityDetail_");
}

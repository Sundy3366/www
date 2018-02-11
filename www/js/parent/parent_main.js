
function showParentHead(){
	$(".tm_head_img").attr("src",getLocalStorageItem(webStorageVars[3]));
	$(".tm_head_name").text((getLocalStorageItem(webStorageVars[25])?getLocalStorageItem(webStorageVars[25]):getLocalStorageItem(webStorageVars[4]))+"的家长");
}
//初始化家长界面
function parentMainInit(){
	handleByConfigFrom(function () {
		$("#toParentInfoDiv").on("click",function(){
			toPerParentInfo();
		});
	},function(){
		//取消click,并添加设置按钮
		$("#toParentInfoDiv").off().find(".tm_to_config").show().on("click",function(){
			toParentConfigPage();
		});
	});
	handleByConfigFrom(function(){
		//显示右箭头
		$("#parentHeadForwardIcon").css("display","inline-block");
	});

	parentMainInit_();
}
//初始化家长界面
function parentMainInit_(){
	handleByConfigFrom(function () {
		$("#zzxxLi").show();
	});
	var data="jid="+getLocalStorageItem(webStorageVars[2]);
	getSignCode(data,Config.getParentHomePageUrl().split("?m=")[1],"parentMainInitReq");
}

//
function parentMainInitReq(data){
	genericAjaxHasBefore(Config.getParentHomePageUrl(),"POST",data,"json",function(data){
		if(data && data.result>0){
			$(".erro_404").hide();
			//result的值 1：返回成功2：未绑定孩子
			if(data.result==1){
				//isBindChild的值 0未绑定 1绑定
				if(data.data.isBindChild==1){
                    var childName = getLocalStorageItem(webStorageVars[25]);
                     if(data.data.childName && data.data.childName !=childName){
                     sendMsg2iOS("://changeChildName?name="+data.data.childName);
                     $(".tm_head_name").text(data.data.childName+"的家长");
                     }
                    //$(".intermediate_load").show();
//                  $(".intermediate_load_xiaonei").show();
//                  $(".intermediate_load_xiaowai").show();
					$("#childInfoHint").text(data.data.childInfoHint);
					$("#studyReportEntranceDiv").show();
					if(data.data.schUnFinTaskNum!=-501){
						$("#xnxxLi").show();
						$("#schUnFinTaskNumEm").text(data.data.schUnFinTaskNum);
					}else{
						$("#xnxxLi").hide();
					}
					if(data.data.webUnFinTaskNum!=-501){
						handleByConfigFrom(function () {
							$("#kwbLi").show();
						});
						$("#webUnFinTaskNumEm").text(data.data.webUnFinTaskNum);
					}else{
						$("#kwbLi").hide();
					}
					$(".association_children").hide();
				}else{
					handleByConfigFrom(function () {
						$(".association_children").show();
					});
				}
			}else{
				handleByConfigFrom(function () {
					$(".association_children").show();
				});
			}
		}else{
			hideDiv();
			$(".erro_404").show();
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("家长首页返回结果错误!");
			}
		}
	},function(){
		hideDiv();
		$(".erro_404").show();
		alertToast("家长首页请求失败!");
	},function(){},function(){
		$("#loadingDiv_").hide();
		$(".intermediate_load").hide();
	});
}
function hideDiv(){
	$("#xnxxLi").hide();
	$("#kwbLi").hide();
	$("#studyReportEntranceDiv").hide();
	$(".association_children").hide();
}

//关联孩子
function relateChild(){
	var href = "relate_child.html";
	if(!isH5Only){
		href+='://head?title=[关联孩子,false,,]&rightHandle:[isExist:true,type:type2,value:[[确定,relateChildCheck,]]]';
	}
	window.location.href = href;
}

//关联孩子（点击确定按钮）验证绑定
function relateChildCheck(){
	var inviteCode = document.getElementById("inviteCode").value.trim();
	if(inviteCode.length==0){
		alertInfo("请输入邀请码");
		return;
	}
	var jid= getLocalStorageItem(webStorageVars[2]);
	//请求参数
	var data="jid="+jid+"&inviteCode="+inviteCode;
	getSignCode(data,Config.checkBindChildUrl(),"relateChildCheck_");
}

//
function relateChildCheck_(data){
	postAjaxJSON(Config.checkBindChildUrl(),data,function(data){
		if(data && data.result>0){
			//data.result值为1:返回成功2:需提示再次确认绑定
			if(data.result==1){
	            	var jid= getLocalStorageItem(webStorageVars[2]);
	            	var inviteCode = document.getElementById("inviteCode").value.trim();
				//请求参数
				var data1="jid="+jid+"&inviteCode="+inviteCode;
				getSignCode(data1,Config.bindChildUrl(),"relateChildSure_");
			}else if(data.result==2){
				$("#checkSure").show();
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("验证绑定返回结果错误!");
			}
		}
	},function(){
		alertToast("验证绑定请求失败!");
	});
}

//
function relateChildSure_(data){
	postAjaxJSON(Config.bindChildUrl(),data,function(data){
		if(data && data.result==1){
			$("#relateSucc").show();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("绑定孩子返回结果错误!");
			}
		}
	},function(){
		alertToast("绑定孩子请求失败!");
	});
}

//关联成功后返回上一页
function relateSuccReturn(){
		$("#relateSucc").hide();
		if(!isH5Only){
			goBackNow(-1,true);
		}else{
			window.location.href = "parent_main.html";
		}
}

//再次确认绑定
function checkSure(){
		$("#checkSure").hide();
	   	var jid= getLocalStorageItem(webStorageVars[2]);
	    	var inviteCode = document.getElementById("inviteCode").value.trim();
		//请求参数
		var data1="jid="+jid+"&inviteCode="+inviteCode;
		getSignCode(data1,Config.bindChildUrl(),"relateChildSure_");
}

//进入家长班级通知界面
function toParentClassNotice(){
		var href='parent_class_notice.html';
		if(!isH5Only) {
			href+='://head?title=[班级通知,false,,]&rightHandle:[isExist:false]';
		}
		window.location.href = href;
}

function classNoticeList_(data){
	var catchFlag = false;
	postAjaxJSON(Config.getActivityListUrl(),data,function(data){
		if(data ){//&& (data.result==1 || data.result==2)
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

					activityItem.setAttribute("data", activityList[i].activityId);
					touch.on($(activityItem).off(), 'tap', function(ev){
						var ali = $(ev.currentTarget);
						activityDetail(ali.attr("data"));
					});
					var activityPic = '';
					if(activityList[i].activityPic){
						activityPic = '<div class="img" style="background:url('+activityList[i].activityPic+') no-repeat center center;background-size:100%;position:relative;"></div>';
					}
					var activityItemStr = "";
					var prevTime = $("#classNoticeList").children().first().find("time[hasContent=true]").last().text();
					var isShowTime = true;
					if(activityList[i].activityTime==prevTime)
						isShowTime = false;
					activityItemStr+=(isShowTime?'<time hasContent="true">'+activityList[i].activityTime+'</time>':'<time style="padding-top:0;"></time>')+
									'<div class="con">'+
										'<p>'+activityList[i].activityTitle+'</p>'+activityPic+
									'</div>';
					activityItem.innerHTML = activityItemStr;
					document.getElementById("classNoticeList").children[0].appendChild(activityItem);
				}
			}
			touchOutHandle(parentClassNoticesUpDownHandle);
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

//家长班级通知详情
function activityDetail(activityId){
	//alertInfo(activityId+"dd");
	var href='parent_class_notice_detail.html?activityId='+activityId+'&pageNum='+1;
	if(!isH5Only) {
		href+='://head?title=[通知详情,false,,]&rightHandle:[isExist:false]://keyboard'; 
	}
	window.location.href = href;
}
/**
 * 获取通知详情
 * @param {Object} pageNum
 */
function getActivityDeail(pageNum){
	pageNum = pageNum !=undefined ? pageNum : 1;
	var data="jid="+jid+"&schoolId="+schoolId+"&pageNum="+pageNum+"&activityId="+activityId;
	getSignCode(data,Config.getActivityInfoUrl(),"activityDetail_");
}

//家长班级通知详情展示
function activityDetail_(data){
	var catchFlag = false;
	var param = getParam2Json(data);
	postAjaxJSON(Config.getActivityInfoUrl(),data,function(data){
		if(data && (data.result==1 || data.result==2 || data.result==3)){
           $(".class_notice_detail").show();
			var secondaryReplyList = data.data.secondaryReplyList;
			document.getElementById("activityTitle").innerHTML = data.data.replyTitle;
            document.getElementById("activityContent").innerHTML = data.data.replyContent;
                 
			if(data.data.replyImg){
				document.getElementById("headImg").src = data.data.replyImg;
				$("#headImg").show();
			}
			$(".bottomMoreLoading").attr("status","true").addClass("visible");
            if(data.result == 2 || data.result == 3){
				$(".bottomMoreLoading").attr("status","false").removeClass("visible");
//				if(data.result == 3)
//					return false;
			}
            data = data.data;
            if(data.canReply && data.canReply == 1){
                 $("#talkNum").show();
                 $("#replyContent").show();
            }else{
                return ;
            }
			
			currPageNum=parseInt(param.pageNum);



			
			document.getElementById("talkNum").innerHTML = data.replyNum;
			if(secondaryReplyList){
  				for(i=0;i<secondaryReplyList.length;i++){
  					var replyName = '';
  					var replySecStr = '';
  					if(secondaryReplyList[i].replyJid){
  						replyName = secondaryReplyList[i].replyName;
  						replySecStr = '<p>回复 <span class="cnd_color">'+replyName+'</span><span name="replyContentSpan" data="'+secondaryReplyList[i].replyContent+'"> '+matchEmoji(secondaryReplyList[i].replyContent)+'</span></p>'
  					}else{
  						replySecStr = '<p><span name="replyContentSpan" data="'+secondaryReplyList[i].replyContent+'"> '+matchEmoji(secondaryReplyList[i].replyContent)+'</span></p>';
  					}
					var replyItem = document.createElement("div");
					replyItem.setAttribute("class", "divLi swiper-slide");
					replyItem.setAttribute("replyId",secondaryReplyList[i].replyId);
					replyItem.setAttribute("userId",secondaryReplyList[i].userInfo.userId);
					var replyStr = "";
					replyStr+='<dl>'+
								'<dt><img  onclick="gotoPersonInfoPage('+secondaryReplyList[i].userInfo.userId+','+secondaryReplyList[i].userInfo.userType+')"  class="'+(secondaryReplyList[i].userInfo.userType==1||secondaryReplyList[i].userInfo.userType==2?"teacher":secondaryReplyList[i].userInfo.userType==6?"parent":"")+ 
								'" src="'+secondaryReplyList[i].userInfo.userPhoto+'"/></dt>'+
								'<dd>'+
									'<h4> <span onclick="gotoPersonInfoPage('+secondaryReplyList[i].userInfo.userId+','+secondaryReplyList[i].userInfo.userType+')">'+secondaryReplyList[i].userInfo.userName+'</span></h4>'+
									'<time>'+secondaryReplyList[i].replyTime+'</time>'+
									replySecStr+
								'</dd>'+
							'</dl>';
					replyItem.innerHTML = replyStr;
					document.getElementById("replyList").children[0].appendChild(replyItem);
  				}
			}

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
						var ali = $(ev.currentTarget);
						var type = ali.attr("data");
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
  				loadingMore4ClassNoticeDetailReply();
  			});
}
/**
 * 通知详情回复中的更多回复 
 */
function loadingMore4ClassNoticeDetailReply(){
	getActivityDeail(parseInt(currPageNum)+1);
}


//点击回复图标（对当前的通知详情进行回复）
function replyMain(){
	if(!isH5Only){
		sendMsg2iOS("://replyOne?reqFn=replyOne");
	}else{
		//请求参数
		var jid = getLocalStorageItem(webStorageVars[2]);
		var schoolId = getLocalStorageItem(webStorageVars[5]);
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
		sendMsg2iOS("://replyPasteBoard?copyContent="+copyContent);
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
				replySecStr = '<p><span name="replyContentSpan" data="'+data.data.replyContent+'">'+matchEmoji(data.data.replyContent)+'<span></p>';
			}
//			var replyListDom = document.getElementById("replyList");
//			replyListDom.style.height = (document.documentElement.clientHeight - replyListDom.offsetTop)+"px";
			var replyItem = document.createElement("div");
			replyItem.setAttribute("class", "divLi swiper-slide");
			replyItem.setAttribute("replyId",data.data.replyId);
			replyItem.setAttribute("userId",data.data.userInfo.userId);
			var replyStr = "";
			replyStr+='<dl>'+
						'<dt><img  onclick="gotoPersonInfoPage('+data.data.userInfo.userId+','+data.data.userInfo.userType+')" class="'+(data.data.userInfo.userType==1||data.data.userInfo.userType==2?"teacher":data.data.userInfo.userType==6?"parent":"")+
						'" src="'+data.data.userInfo.userPhoto+'"/></dt>'+
						'<dd>'+
							'<h4  onclick="gotoPersonInfoPage('+data.data.userInfo.userId+','+data.data.userInfo.userType+')">'+data.data.userInfo.userName+'</h4>'+
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

//跳转到家长个人信息界面
function toPerParentInfo(){
	document.location.href="://toParentPerInfo";
}

/**
 * 获取家长班级通知 
 * @param {Object} pageNum
 */
function getParentClassNotice(pageNum){
	pageNum = pageNum ? pageNum:1;
	var uType = getLocalStorageItem(webStorageVars[7]);
	var data="jid="+jid+"&schoolId="+schoolId+"&pageNum="+pageNum+"&type="+uType;
	getSignCode(data,Config.getActivityListUrl(),"classNoticeList_");
}
/**
 *  通知列表上拉刷新,下拉加载处理
 */
function parentClassNoticesUpDownHandle(){
	//下拉刷新,上拉加载
	replySwiper = upAndDownSwiperWrapper('.swiper-container',
  			'.topFlushLoading',function(mySwiper){
  				$('.topFlushLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 1;
  				currMySwiper = mySwiper;
  				getParentClassNotice(1);
  			},
  			'.bottomMoreLoading',function(mySwiper){
  				$('.bottomMoreLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 0;
  				currMySwiper = mySwiper;
  				loadingMore4ParentClassNotice();
  			});
}

/**
 * 加载更多
 */
function loadingMore4ParentClassNotice(){
	getParentClassNotice(parseInt(currPageNum)+1);
}
/**
 *  首页下拉刷新
 */
var isSwipe;
function mainUpHandle(){
	var defaultHeight= $(".tm_head_bg").height();
	var defaultHead2PaddingTop = parseFloat($(".tm_head_bg").css("padding-top"));
	var y;
	$(".swiper-container").on({
		touchstart:function(ev){
			y = ev.originalEvent.targetTouches[0].pageY; // anchor point
			ev.stopImmediatePropagation();
			isSwipe = false;
//			$(".swiper-container .swiper-wrapper").css({transitionDuration: '0.3s', transform: 'translate3d(0px, 100px, 0px)'});
		},touchmove:function(ev){
			var change = ev.originalEvent.targetTouches[0].pageY - y;
//          change = Math.min(Math.max(-100, change), 100) // restrict to -100px left, 0px right
			/*
            if(change>=0 && change <= 300)
            	$(".swiper-container").css({transitionDuration: '0', transform: 'translate3d(0px, '+change+'px, 0px)'});
            */
           if(change>=0){
           		isSwipe = true;
           		$(".tm_head_bg").height(defaultHeight+change/8).css("padding-top",(defaultHead2PaddingTop+change)/8);
           		if(change>=100){
           			$("#loadingDiv_").show();
           		}else{
           			$("#loadingDiv_").hide();
           		}
           	}
		},touchend:function(ev){
			if($(".tm_head_bg").height()!=defaultHeight)
				$(".tm_head_bg").animate({"height":defaultHeight,"padding-top":defaultHead2PaddingTop},100);
			/*
			if($("#loadingDiv_").is(":visible")){//$(".tm_head_bg").height()-defaultHeight>=50
					$(".tm_head_bg").height(defaultHeight).css("padding-top",defaultHead2PaddingTop);
           			parentMainInit_();
			}else{
				$(".tm_head_bg").height(defaultHeight).css("padding-top",defaultHead2PaddingTop);
			}
			*/
			if($("#loadingDiv_").is(":visible"))
				parentMainInit_();
			if(isSwipe)
				return false;
//			$("#loadingDiv_").hide();
		}
	});
}

/**
 * 跳转到未完成作业页面
 * @param {Object} belongType
 */
function gotoNoFinishedHomeworkPage(belongType){
	if(isSwipe) return false;
	event.stopImmediatePropagation();
	var queryString = "belongType="+belongType;
	if(!isH5Only)
		queryString += "://head?title=[未完成作业,false,,]&"+
		   				   "rightHandle:[isExist:false]";
	document.location.href="no_finish_homework.html?"+queryString;
}

/**
 * 跳转到校内学习/课外班页面
 * @param {Object} belongType
 */
function gotoStudyReportPage(schoolType){
	event.stopImmediatePropagation();
	if(isSwipe) return false;
	var queryString = "schoolType="+schoolType;
	if(!isH5Only)
		queryString += "://head?title=[,false,,]&"+
					   "rightHandle:[isExist:false]&"+
					   "isShow=false";
	document.location.href="study_report.html?"+queryString;
}
/**
 * 跳转到自主学习 
 */
function gotoIndependenceStudyPage(){
	var queryString = "";
	if(!isH5Only)
		queryString += "://head?title=[,false,,]&"+
					   "rightHandle:[isExist:false]&"+
					   "isShow=false";
	document.location.href="independence_student.html?"+queryString;
}
/**
 * 跳转到家长设置页
 */
function toParentConfigPage() {
	document.location.href= IOS_LISTEN_URL_PREFIXS.TO_PARENT_CONFIG_PAGE;
}
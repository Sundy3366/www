/**
 * @author xuefeng.kang
 */
$(function(){
	/*
	//监听切换班级
	changeClassListen();
	//切换tab页
	changeDetailTabSelectedListen();
	//删除选项
	delMemberOptionSelectListen();
	//教师-编辑岗位,选择是否为本班班主任
	editTeacherPostionOpChooseListen();
	//教师-编辑岗位,选择科目 
	editTeacherPostionSelectSubjectListen();
	//调至弹出框,选择小组
	changeGroup4GroupSelectListen();
	*/
});

//*************manage.html js function start ********************************
/**
 * 获取教师-班级列表
 * //加载班级列表,并校验是否可以创建班级
 */
function getClassList(){
	var data="jid="+jid+"&schoolId="+schoolId;//+"&time="+getTime();
	/*
	var	sign = getSignCode(getParam2Json(data),Config.getClassListUrl());
	data += "&sign="+sign;*/
	getSignCode(data,Config.getClassListUrl(),"getClassList_");
}
/**
 * 获取教师-班级列表请求
 */
function getClassList_(data){
	postAjaxJSON(Config.getClassListUrl(),data,function(data){
		if(data && data.result==1){
			data = data.data;
			if(data.canCreate == 1 || (getLocalStorageItem(webStorageVars[5])==commonSchoolId && getLocalStorageItem(webStorageVars[6])=="0"))
				$("[name=createClass4gradeManage]").show();
			if(data.classList){
				saveLocalStorageItem(webStorageVars[0],data.classList);
				var classListUl = $("[name=classList4gradeManage]");
				var lisHtml = "";
				$.each(data.classList, function(i,v) {
					var queryString = "classId="+v.classId;//+"&className="+v.className+"&classType="+v.classType
					//[/img/teacher/grade/nav_btn_class_invitation_code@2x.png,showGradeInvitationCode,],
					if(!isH5Only)
						queryString+="://head?title=["+v.className+",false,,]&"+//true,changeClassClick,
		  		  			"rightHandle:[isExist:true,type:type1,value:["+
		  		  			"[img/teacher/grade/nav_btn_group_management@2x.png,gotoGroupManager,]]]";
					lisHtml+="<a href='detail.html?"+queryString+"'><li><span></span>"+v.className+"</li></a>";
				});
				classListUl.html(lisHtml);
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("班级列表返回结果错误");
			}
		}
	},function(){
		alertToast("班级列表请求失败");
	});
}

//*************manage.html js function end ********************************
//*************detail.html js function start ********************************
/**
 * 跳转到小组管理页面
 */
function gotoGroupManager(){
	var data="jid="+jid+"&schoolId="+schoolId;
//	getSignCode(data,Config.getTeacherSubjectListUrl().split("?m=")[1],"gotoGroupManager_");
	//TODO title gotoGroupManager_
	getTeacherGradeListSignCode("gotoGroupManager_");
}
/**
 * 初始化科目小组列表 请求
 */
function gotoGroupManager_(data){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	postAjaxJSON(Config.getTeacherSubjectListUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(!data.subjectList || data.subjectList.length<1){
				alertToast("无科目");
				return false;
			}
			var subjectArray = [];
			$.each(data.subjectList, function(i,v) {
				$.each(v.classList, function(j,k) {
					if(classId==k.classId){
						subjectArray.push(v.subjectId);
						return false;
					}
				});
			});
			//{gradeId: 1, materialId: 482599923, classList: Array[7], subjectId: 1}
			var firstSubjectId = subjectArray[0];
			var queryString = 'classId='+getQueryStringFromUrl().classId;
			var isShow = subjectArray.length>1?true:false;
			//	document.location.href='group_manage.html?'+queryString;
			if(!isH5Only)
				queryString += "://head?title=["+subjectsObj[firstSubjectId]+"小组,"+isShow+","+(isShow?"changeClassClick":"")+",]&"+
				  		  "rightHandle:[isExist:true,type:type1,value:[[/img/teacher/grade/nav_btn_add_group@2x.png,gotoAddGroup,]]]";
			document.location.href='group_manage.html?'+queryString;
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取教师科目列表返回结果错误");
			}
		}
	},function(){
		alertToast("获取教师科目列表请求失败");
	});
}

/**
 * 初始化班级详情信息
 * 	初始化header
 *  初始化老师列表,学生列表,家长列表
 *  邀请码
 */
function initDetailInfo(){
	//切换tab页
	changeDetailTabSelectedListen();
	//删除选项
	delMemberOptionSelectListen();
	//初始化header
	var selectedClassId = getQueryStringFromUrl().classId;
	var classList4gradeManage = getLocalStorageItem(webStorageVars[0]);
	if(!classList4gradeManage){
		alertToast("班级列表初始化错误,未获取到班级列表信息");
		return false;
	}
	classList4gradeManage = $.parseJSON(classList4gradeManage);
	var headerTitle = "";
	var chageClassDivLisHtml = "";
	$.each(classList4gradeManage, function(i,v) {
		var hover = "";
		if(v.classId == selectedClassId){
			hover="hover";
			headerTitle = v.className;
		}
		chageClassDivLisHtml+="<li data='"+v.classId+"'><span class='space "+hover+"'></span><span class='f36_2 text'>"+v.className+"</span></li>";
	});
	$("#changeClassDiv ul").html(chageClassDivLisHtml);
	$("#changeClassTitle [name=headerTitle]").text(headerTitle);
	if(classList4gradeManage.length>1){
		$("#changeClassTitle [name=headerTitle]").next().show();
		//监听切换班级
		changeClassListen();
		$("#changeClassDiv ul li").on("click",function(){
			var classId = $(this).attr("data");
			var queryString = "classId="+classId;
			changeClassClick();
			if(!isH5Only)
				queryString+="://head?title=["+$(this).text()+",false,,]&"+//true,changeClassClick
  		  			"rightHandle:[isExist:true,type:type1,value:[[/img/teacher/grade/nav_btn_class_invitation_code@2x.png,showGradeInvitationCode,],"+
  		  			"[img/teacher/grade/nav_btn_group_management@2x.png,gotoGroupManager,]]]";
//			document.location.href="detail.html?classId="+classId;
			document.location.href="detail.html?"+queryString;
			return false;
		});
	}
	getTeacherClassUserList(selectedClassId);
}
/**
 * 获取班级详情
 */
function getTeacherClassUserList(classId){
	var data="jid="+jid+"&schoolId="+schoolId+"&classId="+classId;//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),Config.getTeacherClassUserListUrl());
//	data += "&sign="+sign;
	getSignCode(data,Config.getTeacherClassUserListUrl(),"getTeacherClassUserList_");
}
/**
 * 获取班级详情 请求
 */
function getTeacherClassUserList_(data){
	postAjaxJSON(Config.getTeacherClassUserListUrl(),data,function(data){
		if(data && data.result==1){
			data = data.data;
			//邀请码
			if(data.invitationCode && data.invitationCode>0){
				$(".gradeInvitationCodeDiv .invitationCodeDiv").text(data.invitationCode);
				//班级邀请码处理
				handleByConfigFrom(function () {
					$(".invitationCodeSp").show();
				});
			}else{
				if(!isH5Only)
					sendMsg2iOS("://headRightBtnHandle?hideIndex=0");
			}
			var currUserIdMaster = false;//当前教师是否是班主任
			var hadCurrUser = false;
			//老师列表
			if(data.teacherList){
				$.each(data.teacherList, function(i,v) {
					var teacherListLisHtml="";
					if(jid == v.userId && v.isMaster==1)
						currUserIdMaster = true;
					var isMaster = v.isMaster==1?"<span class='tag'>班主任</span>":"";//1为班主任,0:非班主任
					var subjectNames=subjectIds2Names(v.subjectStr,",");//按,号分割
					var userName = v.userName;
					if(jid == v.userId){
						hadCurrUser = true;
						if(getLocalStorageItem(webStorageVars[24]))
							userName = getLocalStorageItem(webStorageVars[24]);
					} 
					// isReadyUser:1是未开通，0是开通
					teacherListLisHtml=$("<li userId='"+v.userId+"' isReadyUser='"+v.isReadyUser+"' isMaster='"+v.isMaster+"' >"+//1是未开通，0是开通
									    " <img src='"+v.userPhoto+"'/>"+
										"	  <div class='listText'>"+
										"		<span class='name'>"+userName+"</span>"+
										"		<span class='subject'>("+(!v.isReadyUser?subjectNames:"未开通")+")</span>"+
										isMaster+
										"	  </div>"+
										"</li>");
					$("#gradeMemberContent .teacher ul").append(teacherListLisHtml);
					 if(v.isMaster==1)
                       teacherListLisHtml.find(".subject").css("max-width",(teacherListLisHtml.find(".listText").width()-teacherListLisHtml.find(".name").outerWidth()-teacherListLisHtml.find(".tag").outerWidth()-20));
				});
				$("[name=teacherMemberCountSpan]").text("("+data.teacherList.length+")");
//				$("#gradeMemberContent .teacher ul").html(teacherListLisHtml);
			}
			if(!hadCurrUser&&!isH5Only)
				sendMsg2iOS("://headRightBtnHandle?hideIndex=1");
				
			//学生列表
			if(data.studentList){
				if(data.studentList.length>0)
					$(".classMemberSe").show();
				var studentListLisHtml="";
				$("[name=studentMemberCountSpan]").text("("+data.studentList.length+")");
				$.each(data.studentList, function(i,v) {
					var userName = (v.userName?v.userName:v.userId);
					studentListLisHtml+="<li userId='"+v.userId+"' userName='"+userName+"'>"+
									    " <img src='"+v.userPhoto+"'/>"+
										"	  <div class='listText'>"+
										"		<span class='name'>"+userName+"</span>"+
										(v.isReadyUser?"(未开通)":"")+
										"	  </div>"+
										"</li>";
				});
				$("#gradeMemberContent .student ul").html(studentListLisHtml);
			}
			/*
			 * 当前教师为班主任时,左滑出现编辑/删除,非当前用户时老师为编辑和删除,当前用户为编辑
			 * 学生为删除 
			 */
			if(currUserIdMaster){
				//为非班主任老师li添加操作区块(编辑+删除)
				$("#gradeMemberContent .teacher ul li[ismaster=0]").append(//此处ismaster设置时为isMaster,设置后属性名变为小写
					"<span class='rightOp'>"+
					"	<span class='edit' ontouchend=\"editTeacherForDeatil(this)\">编辑</span>"+
					"	<span class='del'  ontouchend='delMemberDialogShow(\"teacher\",this)'>删除</span>"+
					"</span>"
				);
				//为班主任li添加操作区块(删除)
				$("#gradeMemberContent .teacher ul li[ismaster=1]").append(
					"<span class='rightOp'>"+
					"	<span class='edit' ontouchend=\"editTeacherForDeatil(this)\">编辑</span>"+
					"</span>"
				);
				//为学生li添加操作区块(删除)
				$("#gradeMemberContent .student ul li").append(
					"<span class='rightOp'>"+
					"	<span class='del'  ontouchend='delMemberDialogShow(\"student\",this)'>删除</span>"+
					"</span>"
				);
			}
			//东莞环境处理
			handleByConfigFrom(function(){},function () {
				//老师操作处理
				swipeLeftHandle("#gradeMemberContent .teacher ul li","",function(t){
					//教师头像点击,进入聊天页
					//click操作
					if(jid == $(t).attr("userId")){
						//						alertToast("打开自己的主页");
						sendMsg2iOS("://info?jid="+jid);
						return false;
					}
					if($(t).attr("isReadyUser")==1){
						alertToast("该用户尚未开通云账号");
						return false;
					}
					document.location.href="://chat?jid="+jid+"&userId="+$(t).attr("userId")+
						"&userName="+$(t).find("span.name").text();//进入私聊
				});
				//学生操作处理
				swipeLeftHandle("#gradeMemberContent .student ul li","",function(t){
					//学生点击头像,进入聊天页
					//click操作
					if($(t).attr("isReadyUser")==1){
						alertToast("该用户尚未开通云账号");
						return false;
					}
					document.location.href="://chat?jid="+jid+"&userId="+$(t).attr("userId")+
						"&userName="+$(t).find("span.name").text();// 进入私聊
				});
			});
			//非东莞环境处理
			handleByConfigFrom(function () {
				//老师操作处理
				swipeLeftHandle("#gradeMemberContent .teacher ul li",".rightOp",function(t){
					//教师头像点击,进入聊天页
					//click操作
					if(jid == $(t).attr("userId")){
						//						alertToast("打开自己的主页");
						sendMsg2iOS("://info?jid="+jid);
						return false;
					}
					if($(t).attr("isReadyUser")==1){
						alertToast("该用户尚未开通云账号");
						return false;
					}
					document.location.href="://chat?jid="+jid+"&userId="+$(t).attr("userId")+
						"&userName="+$(t).find("span.name").text();//进入私聊
				});
				//学生操作处理
				swipeLeftHandle("#gradeMemberContent .student ul li",".rightOp",function(t){
					//学生点击头像,进入聊天页
					//click操作
					if($(t).attr("isReadyUser")==1){
						alertToast("该用户尚未开通云账号");
						return false;
					}
					document.location.href="://chat?jid="+jid+"&userId="+$(t).attr("userId")+
						"&userName="+$(t).find("span.name").text();// 进入私聊
				});
			});

			//家长列表
			if(data.partentList && data.partentList.length>0){
				var partentListLisHtml="";
				$.each(data.partentList, function(i,v) {
					partentListLisHtml+="<li userId='"+v.userId+"' isReadyUser='"+v.isReadyUser+"'>"+
									    " <img src='"+v.userPhoto+"'/>"+
										"	  <div class='listText'>"+
										"		<span class='name'>"+v.userName+"</span>"+
										"	  </div>"+
										"</li>";
				});
				if(data.partentList.length>0){
					$("#studentParentsContent .studentParents").html("<ul>"+partentListLisHtml+"</ul>");
                    swipeLeftHandle("#studentParentsContent .studentParents li","",function(ev){
                    // $("#studentParentsContent .studentParents li").on("touchstart",function(ev){
						var t = ev.currentTarget;
						if($(t).attr("isReadyUser")==1){
							alertToast("该用户尚未开通云账号");
							return false;
						}
						document.location.href="://chat?jid="+jid+"&userId="+$(t).attr("userId")+
										   "&userName="+$(t).find("span.name").text();// 进入私聊
					});
				}
			}else{
				var zwClass = "studentParentsZW";
				handleByConfigFrom(function () {},function () {
					zwClass = "studentParentsZW2";
				});
				$("#studentParentsContent .studentParents").html("<div class='"+zwClass+"'></div>");
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("班级详情返回结果错误");
			}
		}
	},function(){
		alertToast("班级详情请求失败");
	});
}

/**
 * 编辑教师
 * @param {Object} t 点击时的dom对象
 */
function editTeacherForDeatil(t){
	event.stopPropagation();
	var userId = $(t).parent().parent().attr("userId");
	var isMaster = $(t).parent().parent().attr("isMaster");
	if(!userId){
		alertToast("用户id不能为空");
		return false;
	}
	var classId = getQueryStringFromUrl().classId;
	if(!classId){
		alertToast("classId不能为空");
		return false;
	}
	$("#bodyClass").trigger("touchstart");
	//TODO title
	var queryString = "classId="+classId+"&userId="+userId+"&isMaster="+isMaster;
	if(!isH5Only)
		queryString+="://head?title=[编辑岗位,false,,]"+
		  		  	 "&rightHandle:[isExist:true,type:type2,value:[[完成,manageClassMemeberSubmit,edit]]]";
	document.location.href='edit_teacher_position.html?'+queryString;
}

/**
 * 删除老师/学生
 */
function delMemberDialogShow(type,t){
	event.stopPropagation();
	var userId = $(t).parent().parent().attr("userId");
	if(!userId){
		alertToast("用户id不能为空");
		return false;
	}
	$("#bodyClass").trigger("touchstart");
	$(".delMemberDiv").attr("userId",userId).attr("type",type);
	$(".delMemberDiv").show();
	$(".delMemberDiv [name=submit]").off().on("click",function(){
		manageClassMemeberSubmit("del");
	});
}

/**
 * 关闭删除提示框
 */
function delMemberDialogClose(){
	$(".delMemberDiv").hide();
	$(".delMemberDiv").off();
	$(".delMemberDiv").removeAttr("userId").removeAttr("type");
}

/**
 * 初始化编辑教师岗位
 */
function initEditTeacherPosition(){
	//教师-编辑岗位,选择科目 
	editTeacherPostionSelectSubjectListen();
	var queryStringObj = getQueryStringFromUrl();
	//初始化当前教师的科目
	var userId = queryStringObj.userId;
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	if(!classId){
		alertToast("classId不能为空");
		goBackNow(-1,false);
		return false;
	}
	var data="jid="+userId+"&schoolId="+schoolId;//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),Config.getTeacherSubjectListUrl().split("?m=")[1]);
//	data += "&sign="+sign;
	getSignCode(data,Config.getTeacherSubjectListUrl().split("?m=")[1],"getTeacherSubjectList");
	/*
	getTeacherSubjectList(userId,function(data){
		$.each(data.subjectList, function(i,v) {
			$.each(v.classList, function(j,k) {
				if(classId==k.classId){
					$(".subjectList [data="+v.subjectId+"]").addClass("selected");
					return false;
				}
			});
		});
	});
	*/
}

/**
 * 获取老师科目列表
 * @return resultFn
 */
function getTeacherSubjectList(data){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var subjectArray=[];
	postAjaxJSON(Config.getTeacherSubjectListUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			$.each(data.subjectList, function(i,v) {
				$.each(v.classList, function(j,k) {
					if(classId==k.classId){
						$(".subjectList [data="+v.subjectId+"]").addClass("selected");
						return false;
					}
				});
			});
			var isMaster = getQueryStringFromUrl().isMaster;
			if(isMaster==1){
				$("[name=isMasterInfo]").show();
			}else{
				editTeacherPostionOpChooseListen();
				$("[name=chooseMaster]").show();
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取教师科目列表返回结果错误");
			}
		}
	},function(){
		alertToast("获取教师科目列表请求失败");
	});
}


/**
 * 编辑/删除成员提交
 * @param {String} type value is 'del' or 'edit' 
 * @param {String} confirm 当type=edit时confirm为true(已选择确认)/undefined(弹出确认层)
 */
function manageClassMemeberSubmit(type,confirm){
	var dialog = $(".delMemberDiv");
	var classId = getQueryStringFromUrl().classId;
	if(!classId){
		alertToast("classId不能为空");
		return false;
	}
	var subData = "";
	var userId = "";
	var isDel = 0;//是否删除
	if(type == "del"){//删除
		userId = dialog.attr("userId");
		var enjoinSelect = dialog.find("[name=enjoinSelect].selected");
		if(enjoinSelect.length>0){
			isDel = 2;
		}else{
			isDel = 1;
		}
	}else if(type == "edit"){//编辑
		var subjectStr="";
		var selectedSubs = $(".subjectList .selected");
		userId = getQueryStringFromUrl().userId;
		var isMaster = getQueryStringFromUrl().isMaster;
		if(!selectedSubs.length){
			alertToast("请选择科目");
			return false;
		}
		$.each(selectedSubs, function(i,v) {
			subjectStr+=$(v).attr("data")+",";
		});
		subjectStr=subjectStr.substring(0,subjectStr.length-1);
		if(!confirm && isMaster!=1 && $("[name=chooseMaster] .choosed").length>0){
			$(".delMemberDiv").show();
			$(".delMemberDiv [name=submit]").off().on("click",function(){
				manageClassMemeberSubmit("edit",true);
			});
			return false;
		}
		isMaster = isMaster==1?1:$("[name=chooseMaster] .choosed").length>0?1:0;
		subData+="&subjectStr="+subjectStr+
			     "&isMaster="+isMaster;
	}else{
		return false;
	}
	if(!userId){
		alertToast("userId不能为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+
			 "&classId="+classId+
			 "&changeUid="+userId+
			 "&isDel="+isDel+
			 subData;//+"&time="+getTime();
			 
//	var	sign = getSignCode(getParam2Json(data),Config.managerClassMemberUrl.split("?m=")[1]);
//	data += "&sign="+sign;
	getSignCode(data,Config.managerClassMemberUrl().split("?m=")[1],"manageClassMemeberSubmit_");
}
/**
 * 编辑/删除成员提交
 */
function manageClassMemeberSubmit_(data){
	postAjaxJSON(Config.managerClassMemberUrl(),data,function(data){
		if(data && data.result>0){
			document.location.reload();
		}else{
			delMemberDialogClose();
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("操作班级成员返回结果错误");
			}
		}
	},function(){
		delMemberDialogClose();
		alertToast("操作班级成员请求失败");
	});
}

/**
 * 删除老师/学生选择项点击监听
 */
function delMemberOptionSelectListen(){
	$(".delMemberDiv .options").on("click",function(){
		var selected = $(this).children().first().attr("class");
		if(selected && "selected"==selected){
			$(this).children().first().attr("class","notSelected");
		}else{
			$(this).children().first().attr("class","selected");
		}
	})
}
//*************detail.html js function end ********************************
//*************group_manage.html js function start ********************************
/**
 * 初始化科目小组列表
 */
function initSubjectGroupList(){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	if(!classId){
		alertToast("classId不能为空");
		goBackNow(-1,false);
		return false;
	}
//	var data="jid="+jid+"&schoolId="+schoolId;//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),Config.getTeacherSubjectListUrl().split("?m=")[1]);
//	data += "&sign="+sign;
//	getSignCode(data,Config.getTeacherSubjectListUrl().split("?m=")[1],"initSubjectGroupList_");
	getTeacherGradeListSignCode("initSubjectGroupList_");
}
/**
 * 初始化科目小组列表 请求
 */
function initSubjectGroupList_(data){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	var rbi = queryStringObj.rbi;//返回层数
		rbi = rbi?(parseInt(rbi)+1):1;
		goBack(-rbi,false);
	var subjectArray=[];
	postAjaxJSON(Config.getTeacherSubjectListUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(!data.subjectList || data.subjectList.length<1){
				alertToast("无科目");
//				goBack(-1,false);
				return false;
			}
			var changeClassDivUl = $("#changeClassDiv ul");
			$.each(data.subjectList, function(i,v) {
				$.each(v.classList, function(j,k) {
					if(classId==k.classId){
						subjectArray.push(v.subjectId);
						return false;
					}
				});
			});
			if(subjectArray.length>0){
				if(subjectArray.length>1){
					//显示下箭头
					$("#changeClassTitle > span > div").children().eq(1).show();
					//添加点击监听
					changeClassListen();
				}
				//显示title
				$("#changeClassTitle > span > div").children().first().text(subjectId2Name((subjectId?subjectId:subjectArray[0]))+"小组");
				var hadSubject = false;
				//若无选中的小组,则选中第一个
				if(subjectId && subjectArray.indexOf(parseInt(subjectId))>0)
					hadSubject = true;
				//填充小组列表
				$.each(subjectArray, function(i,v) {
					var queryString = "rbi="+rbi+"&classId="+classId+"&subjectId="+v;
					if(!isH5Only)//TODO title
						queryString += "://head?title=["+subjectId2Name(v)+"小组,true,changeClassClick,]&"+
				  		  			   "rightHandle:[isExist:true,type:type1,value:[[/img/teacher/grade/nav_btn_add_group@2x.png,gotoAddGroup,]]]";
					var liHtml ="	<li subjectId='"+v+"' data = 'group_manage.html?"+queryString+"'>"+
								"		<span class='space "+((hadSubject && subjectId==v)||(!hadSubject && i==0)?"hover":"")+"'></span>"+
								"		<span class='f36_2 text'>"+subjectId2Name(v)+"小组</span>"+
								"	</li>";
					changeClassDivUl.append(liHtml);
				});
				//添加点击事件
				$("#changeClassDiv ul li").on("click",function(){
					changeClassClick();
					var href = $(this).attr("data");
					document.location.href=href;
					return false;
				});
				$(".titleBarHeader .addGroupIcon").on("click",function(){
//					document.location.href = 'add_group.html?classId='+classId+"&subjectId="+(subjectId?subjectId:$("#changeClassDiv ul li .hover").parent().attr("subjectId"));
					gotoAddGroup();
				}).show();
				getClassGroupListBySubject(classId,(subjectId?subjectId:subjectArray[0]));
			}else{
				$(document.body).removeClass("bgcF3F6F8");
				$(".groupManager").children().find(".groupsUl").html("<div class='groupManagerZW'></div>");
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("通过科目获取小组列表返回结果错误");
			}
		}
	},function(){
		alertToast("通过科目获取小组列表请求失败");
	});
}

/**
 * 跳转到新增小组
 */
function gotoAddGroup(){
	var queryStringObj = getQueryStringFromUrl();
	var subjectId = queryStringObj.subjectId;
	var classId = queryStringObj.classId;
	var queryString = 'classId='+classId+"&subjectId="+(subjectId?subjectId:$("#changeClassDiv ul li .hover").parent().attr("subjectId"));
	//TODO title
	if(!isH5Only)
		queryString +="://head?title=[新建小组,false,,]&rightHandle:[isExist:false]";
	document.location.href = 'add_group.html?'+queryString;
}

/**
 * 通过科目获取小组列表
 * @param {Object} classId
 * @param {Object} subjectId
 */
function getClassGroupListBySubject(classId,subjectId){
	if(!classId){
		alertToast("classId不能为空");
		return false;
	}
	if(!subjectId){
		alertToast("subjectId不能为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&classId="+classId+
			 "&subjectId="+subjectId;//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),getClassGroupListUrl.split("?m=")[1]);
//	data += "&sign="+sign;
	getSignCode(data,Config.getClassGroupListUrl().split("?m=")[1],"getClassGroupListBySubject_");
}
/**
 * 通过科目获取小组列表 请求
 * @param {Object} classId
 * @param {Object} subjectId
 */
function getClassGroupListBySubject_(data){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	postAjaxJSON(Config.getClassGroupListUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			var groupsUl = $(".groupManager").children().find(".groupsUl"); 
			if(!data.classGroupList || data.classGroupList.length<1){
				$(document.body).removeClass("bgcF3F6F8");
				groupsUl.html("<div class='groupManagerZW'></div>");
				return false;
			}
			var localCacheInfo = {};
			localCacheInfo[classId]=[];
			$.each(data.classGroupList, function(i,v) {
				var queryString = "classId="+classId+"&groupId="+v.groupId+"&groupName="+encodeURI(v.groupName);
				if(!isH5Only){
					var rightHandle = "[isExist:false]";
					if(data.classGroupList.length>1 && parseInt(v.groupUserNum))
						rightHandle = "[isExist:true,type:type3,value:[[调组,changeGroup4groupDetailShow,,取消,changeGroup4ReturnGroupDetailShow,]]";	
					queryString +="://head?title=["+v.groupName+",false,,]&rightHandle:"+rightHandle;
				}
				var liHtml = "<a groupId='"+v.groupId+"' groupName='"+encodeURI(v.groupName)+"' groupUserNum="+v.groupUserNum+
							" href='group_detail.html?"+queryString+"'>"+
							"	<li>"+
							"			<span class='text'>"+v.groupName+"</span>"+
							"			<span class='floatRight'>"+
							"				<span class='text'>"+v.groupUserNum+"人</span>"+
							"				<span class='rightArrow'></span>"+
							"			</span>"+
							"	</li>"+
							"</a>";
				localCacheInfo[classId].push({groupId:v.groupId,groupName:v.groupName});
				groupsUl.append(liHtml);
			});
			//localStorage中保存小组信息
			saveLocalStorageItem(webStorageVars[1],localCacheInfo);
			touch.on(groupsUl.children().off(), 'hold', function(ev){
				var ali = $(ev.currentTarget);
				/*
				if(ev.type=="tap"){
					//此处不跳转tap
					//document.location.href=$(ev.currentTarget).attr("href");
				}else
				*/
				if(ev.type=="hold"){
					showEditGroupContext(ali.attr("groupId"),ali.attr("groupName"),ali.attr("groupUserNum"));
				}
			});
			/*
			groupsUl.children().on({
		        touchstart: function(e){
		        	touchTime=0;
		        	var ali = $(e.delegateTarget);
		            timeOutEvent = setTimeout(function(){
		            		touchTime=500;
		            		showEditGroupContext(ali.attr("groupId"),ali.attr("groupName"),ali.attr("groupUserNum"));
						},500);
		            e.preventDefault();
		        },
		        touchmove: function(){},
		        touchend: function(e){
		            clearTimeout(timeOutEvent);
		            if(touchTime<500)
		            	document.location.href=$(e.delegateTarget).attr("href");
		            return false; 
		        }
		   });
		   */
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("通过科目获取小组列表返回结果错误");
			}
		}
	},function(){
		alertToast("通过科目获取小组列表请求失败");
	});
}
/**
 * 显示编辑弹出层
 * @param {Object} param
 */
function showEditGroupContext(groupId,groupName,groupUserNum){
	$("#editContext").attr("groupId",groupId).attr("groupName",groupName).attr("groupUserNum",groupUserNum).show();
	$("#editContext .bgo40").off().on("touchstart",function(){
		$("#editContext").removeAttr("groupId").removeAttr("groupName").removeAttr("groupUserNum").hide();	
	});
	$("#editContext .content ul li").off().on({
        touchstart: function(e){
			$(e.delegateTarget).css("background-color","#EDEEEF");
			e.preventDefault();
        },
        touchmove: function(){},
        touchend: function(e){
           var li = $(e.delegateTarget)
           li.css("background-color","#FFFFFF");
           var data = li.attr("data");
           if(data=="edit"){
           		editGroupContextEdit();
           }else if(data=="del"){
           		editGroupContextDel();
           }
           return false; 
        }
   });
}

/**
 * 编辑小组
 */
function editGroupContextEdit(){
	var editContext = $("#editContext");
	var groupId = editContext.attr("groupId");
	var groupName = editContext.attr("groupName");
	if(!groupId){
		alertToast("groupId不能为空");
		return false;
	}
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	if(!classId){
		alertToast("classId不能为空");
		return false;
	}
	var queryString = 'type=edit&classId='+classId+"&subjectId="+(subjectId?subjectId:$("#changeClassDiv ul li .hover").parent().attr("subjectId"))+
					  '&groupId='+groupId+"&groupName="+groupName;
	editContextClose();
	if(!isH5Only)
		queryString += "://head?title=[编辑,false,,]&rightHandle:[isExist:false]";
	document.location.href='add_group.html?'+queryString;
}
/**
 * 删除小组
 */
function editGroupContextDel(){
	var editContext = $("#editContext");
	var groupId = editContext.attr("groupId"); 
	var groupUserNum = editContext.attr("groupUserNum");
	if(groupUserNum>0){
		alertInfo("该小组还有学生，不能删除");
		return false;
	}
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	if(!classId){
		alertToast("classId不能为空");
		return false;
	}
	if(!groupId){
		alertToast("groupId不能为空");
		return false;
	}
	editContextClose();
	var data="jid="+jid+"&schoolId="+schoolId+"&classId="+classId+
			 "&groupId="+groupId;//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),delClassGroupUrl.split("?m=")[1]);
//	data += "&sign="+sign;
	getSignCode(data,Config.delClassGroupUrl().split("?m=")[1],"editGroupContextDel_");
}
/**
 * 删除小组 请求
 */
function editGroupContextDel_(data){
	postAjaxJSON(Config.delClassGroupUrl(),data,function(data){
		if(data && data.result>0){
			document.location.reload();
		}else{
			editContextClose();
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("删除小组错误");
			}
		}
	},function(){
		editContextClose();
		alertToast("删除小组请求失败");
	});
}
/**
 * 关闭弹出context菜单
 */
function editContextClose(){
	$("#editContext").hide();
}

//*************group_manage.html js function end ********************************
//*************add_group.html js function start ********************************
/**
 * 新增小组初始化
 * 新增小组与修改小组为1个页面
 */
function initAddGroup(){
	var queryStringObj = getQueryStringFromUrl();
	var type = queryStringObj.type;
	var groupId = queryStringObj.groupId;
	var groupName = queryStringObj.groupName;
	if("edit" == type){
		if(!groupId){
			alertToast("groupId不能为空");
			return false;
		}
		$("#changeClassTitle > span > div > span").text("编辑");
		$("#groupName").val(decodeURI(groupName));
		$("#submitBtn").removeAttr("onclick").on("click",function(){
			editGroupNameSubmit(groupId);
		});
	}
}
/**
 * 创建分组提交
 */
function addGroupSubmit(){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	var groupName = $("#groupName").val();
	if(!groupName || $.trim(groupName).length<1){
		alertToast("请输入小组名称");
		return false;
	}
	if(!classId){
		alertToast("classId不能为空");
		goBackNow(-1,false);
		return false;
	}
	if(!subjectId){
		alertToast("subjectId不能为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&classId="+classId+
			 "&subjectId="+subjectId+
			 "&groupName="+$.trim(groupName);//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),createClassGroupUrl.split("?m=")[1]);
//	data += "&sign="+sign;
	getSignCode(data,Config.createClassGroupUrl().split("?m=")[1],"addGroupSubmit_");
}
/**
 * 创建分组提交
 */
function addGroupSubmit_(data){
	postAjaxJSON(Config.createClassGroupUrl(),data,function(data){
		if(data && data.result>0){
			goBackNow();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("新建小组错误");
			}
		}
	},function(){
		alertToast("提交新建小组请求失败");
	});
}

/**
 * 修改分组提交
 */
function editGroupNameSubmit(groupId){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	var groupName = $("#groupName").val();
	if(!groupName || $.trim(groupName).length<1){
		alertToast("请输入小组名称");
		return false;
	}
	if(!classId){
		alertToast("classId不能为空");
		goBackNow(-1,false);
		return false;
	}
	if(!subjectId){
		alertToast("subjectId不能为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&classId="+classId+
			 "&subjectId="+subjectId+
			 "&groupId="+groupId+
			 "&groupName="+$.trim(groupName);//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),changeClassGroupName.split("?m=")[1]);
//	data += "&sign="+sign;
	getSignCode(data,Config.changeClassGroupName().split("?m=")[1],"editGroupNameSubmit_");
}

/**
 * 修改分组提交
 */
function editGroupNameSubmit_(data){
	postAjaxJSON(Config.changeClassGroupName(),data,function(data){
			if(data && data.result>0){
				goBackNow();
			}else{
				if(data){
					alertInfo(data.msg);
				}else{
					alertToast("编辑小组错误");
				}
			}
		},function(){
			alertToast("编辑小组请求失败");
	});
}
//*************add_group.html js function end ********************************
//*************group_detail.html js function start ********************************
/**
 * 初始化小组详情信息
 */
function initGroupDetailInfo(){
	var queryStringObj = getQueryStringFromUrl();
	var groupName = queryStringObj.groupName;
	$("#changeClassTitle > div span").text(decodeURI(groupName));
	getClassGroupInfo();
}

/**
 * 获取小组信息
 */
function getClassGroupInfo(){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var groupId = queryStringObj.groupId;
	if(!classId){
		alertToast("classId不能为空");
		history.back();
		return false;
	}
	if(!groupId){
		alertToast("groupId不能为空");
		history.back();
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&classId="+classId+
			 "&groupId="+groupId;//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),Config.getClassGroupInfoUrl().split("?m=")[1]);
//	data += "&sign="+sign;
	getSignCode(data,Config.getClassGroupInfoUrl().split("?m=")[1],"getClassGroupInfo_");
}
/**
 * 获取小组信息 请求
 */
function getClassGroupInfo_(data){
	postAjaxJSON(Config.getClassGroupInfoUrl(),data,function(data){
		if(data && data.result>0){
			var groupDetailDiv = $(".groupDetail .ulParent");
			data = data.data;
			if(!data.userList || data.userList.length < 1){
				groupDetailDiv.html("<div class='noGrpoupMemberZW'>");
				$("#titleRightSpan").hide();
				hideTiaoZuBtn();
				return false;
			}
			var ulHtml = "<ul>"; 
			$.each(data.userList, function(i,v) {
				ulHtml+="<li data='"+v.sxUserId+"'>"+
						"	<img src='"+(v.userPhoto?v.userPhoto:webRoot+"/img/teacher/grade/public-head_img_160@2x.png")+"'/>"+
						"	<div class='listText'>"+
						"		<span class='name'>"+v.userName+"</span>"+
						"	</div>"+
						"</li>";
			});
			ulHtml+="</ul>";
			groupDetailDiv.html(ulHtml);
			hideChangeGroup4groupDetailBtn();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取小组信息错误");
			}
		}
	},function(){
		alertToast("获取小组信息请求失败");
	});
}
/**
 * 隐藏调组按钮
 * 若存在其他组,在会出现"调组"按钮
 */
function hideChangeGroup4groupDetailBtn(){
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	if(!classId){
		alertToast("classId不能为空");
		return false;
	}
	//从localStorage查询其他小组信息
	var groupList4GroupDetail = getLocalStorageItem(webStorageVars[1]);
	if(groupList4GroupDetail)
		groupList4GroupDetail = $.parseJSON(groupList4GroupDetail);
//	if(getJsonLength(groupList4GroupDetail[classId]) > 1)
//		$("[name=changeGroup4groupDetailBtn]").show();
	if(getJsonLength(groupList4GroupDetail[classId])<2)
		hideTiaoZuBtn();
}
/**
 * 隐藏调组按钮
 */
function hideTiaoZuBtn(){
	sendMsg2iOS("://headRightBtnHandle?hideIndex=0");//隐藏调组按钮
}

/**
 * 调至按钮操作
 */
function initGroupList4SwitchGroup(){
	var  selectedNum = $(".groupDetail ul li.selected").length;
	if(!selectedNum){
		alertToast("至少要选择一个学生");
		return false;
	}
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var groupId = queryStringObj.groupId;
	if(!classId){
		alertToast("classId不能为空");
		return false;
	}
	if(!groupId){
		alertToast("groupId不能为空");
		return false;
	}
	//从localStorage查询其他小组信息
	var groupList4GroupDetail = getLocalStorageItem(webStorageVars[1]);
	if(groupList4GroupDetail)
		groupList4GroupDetail = $.parseJSON(groupList4GroupDetail);
	var groupList4ChangeGroupDivUl = $(".groupList4ChangeGroupDiv .groupList ul").html("");
	$.each(groupList4GroupDetail, function(i,v) {
		if(i==classId){
			$.each(v, function(j,k) {
				if(groupId != k.groupId){
					var liHtml = "<li data='"+k.groupId+"'>"+k.groupName+"</li>";
					groupList4ChangeGroupDivUl.append(liHtml);
				}
			});
		}
	});
	$('.groupList4ChangeGroupDiv').show();
	changeGroup4GroupSelectListen();
}

/**
 * 调至操作提交
 */
function switchGroupSubmit(){
	var toGroupLis = $(".groupList4ChangeGroupDiv .groupList li.selected");
	if(toGroupLis.length<1)
		return false;
	var toGroupId = toGroupLis.attr("data");
	var queryStringObj = getQueryStringFromUrl();
	var classId = queryStringObj.classId;
	var fromGroupId = queryStringObj.groupId;
	if(!classId){
		alertToast("classId不能为空");
		return false;
	}
	if(!fromGroupId || !toGroupId ){
		alertToast("groupId不能为空");
		return false;
	}
	var selectedStuLis= $(".groupDetail ul li.selected");
	var userListStr = "";
	$.each(selectedStuLis, function(i,v) {
		userListStr+=$(v).attr("data")+",";
	});
	if(!userListStr){
		alertToast("至少选择一个学生");
		return false;
	}
	userListStr = userListStr.substring(0,userListStr.length-1);
	var data="jid="+jid+"&schoolId="+schoolId+"&classId="+classId+
			 "&fromGroupId="+fromGroupId+
			 "&toGroupId="+toGroupId+
			 "&userListStr="+userListStr;//+"&time="+getTime();
//	var	sign = getSignCode(getParam2Json(data),Config.changeClassGroupUserUrl().split("?m=")[1]);
//	data += "&sign="+sign;
	getSignCode(data,Config.changeClassGroupUserUrl().split("?m=")[1],"switchGroupSubmit_");
}
/**
 * 调至操作提交
 */
function switchGroupSubmit_(data){
	postAjaxJSON(Config.changeClassGroupUserUrl(),data,function(data){
		if(data && data.result>0){
			goBack();
			document.location.reload();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("调组错误");
			}
		}
	},function(){
		alertToast("调组请求失败");
	});
}

//*************group_detail.html js function end ********************************

/**
 * 切换班级成员和学生家长tab页
 */
function changeDetailTabSelectedListen(){
	$("#changeDetailTab ul li").on("click",function(){
		$this = $(this);
		var selected = $this.attr("class");
		if("selected"==selected)
			return false;
		$this.addClass("selected").siblings().removeClass("selected");
		$("#"+$this.attr("data")).show().siblings().hide();
	});
}

/**
 * 显示班级邀请码
 */
function showGradeInvitationCode(){
	$(".gradeInvitationCodeDiv").show();
}

/*
 * 添加事件监听函数
 * obj        要添加监听的对象或元素
 * eventName  事件名
 * fun        监听函数的名称
 * param      给监听函数传的参数，这里就传了一个参数
 *
 */ 
function addEventHandler(obj,eventName,fun,param){
    var fn = fun;
    if(param)
        fn = function(e){
            fun.call(this, param);  //继承监听函数,并传入参数以初始化;
        }
    if(obj.attachEvent){
        obj.attachEvent('on'+eventName,fn);
    }else if(obj.addEventListener){
        obj.addEventListener(eventName,fn,false);
    }else{
        obj["on" + eventName] = fn;
    }
}

/**
 * 教师-编辑岗位,选择是否为本班班主任
 */
function editTeacherPostionOpChooseListen(){
	$(".editPosition .opChoose").on("click",function(){
		var show =$(this).children().first().attr("class");
		if(show && show=="choosed"){
			show = "chooseRight";	
		}else{
			show = "choosed";
		}
		$(this).children().first().attr("class",show);
	});
}

/**
 * 教师-编辑岗位,选择科目 
 */
function editTeacherPostionSelectSubjectListen(){
	$(".editPosition .subjectList li span").on("click",function(){
		if("selected" == $(this).attr("class")){
			$(this).removeAttr("class");
		}else{
			$(this).attr("class","selected");	
		}
	});
}

/**
 * 小组管理显示调组操作
 */
function changeGroup4groupDetailShow(){
	$('[name=changeGroup4groupDetailBtn]').hide();
	$('[name=changeGroup4groupDetailCancelBtn]').show();
	var noSelectedSpan = $("<span name='selectSpan' class='notSelected'></span>");
	$(".groupDetail .ulParent").height("calc( 100% - 50px )");
	$parent =$(".groupDetail"); 
	$(".groupDetail ul li").prepend(noSelectedSpan);
	$(".groupDetail ul li .listText").width("calc(95.5% - 64px)");
	$(".groupDetail ul li").css("cursor","pointer");
	$(".groupDetail ul li").off().on("click",function(){
		if("selected" == $(this).attr("class")){
			$(this).removeAttr("class").find("span[name=selectSpan]").removeClass("selected").addClass("notSelected");
		}else{
			$(this).addClass("selected").find("span[name=selectSpan]").removeClass("notSelected").addClass("selected");
		}
	})
	$(".groupDetail .changeOtherGroupBtn").show();
	$(".groupDetail .listText .rightOp").remove();
}

/**
 * 调至操作后,返回小组详情列表显示
 */
function changeGroup4ReturnGroupDetailShow(){
	$('[name=changeGroup4groupDetailCancelBtn]').hide();
	$("[name=changeGroup4groupDetailBtn]").show();
	$(".groupDetail .changeOtherGroupBtn").hide();
	$(".groupDetail .ulParent").height("calc( 100% )");
	$(".groupDetail ul li").css("cursor","default");
	$(".groupDetail ul li .listText").width("calc(97.3% - 40px )");
	$(".groupDetail li").find("span[name=selectSpan]").remove();
}

/**
 * 调至弹出框,选择小组
 */
function changeGroup4GroupSelectListen(){
	$(".groupList4ChangeGroupDiv .groupList li").off().on("click",function(){
		if("selected" == $(this).attr("class"))
			return false;
		var selectedSpan = $("<span class='selected'></span>");
		$(this).attr("class","selected").append(selectedSpan).siblings().removeAttr("class").find("span").remove();
	});
}


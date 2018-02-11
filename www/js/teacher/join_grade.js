/**
 * 显示选择学科(通过学校加入班级)
 */
function showSelectSubject(classId){
	document.getElementById("classId").innerHTML = classId;
	$(".jpcl_select_div").show();
}
/**
 * 显示选择年级
 */
function showSelectGrade(){
	$(".jpcc_sel_div").show();
}
/**
 * 显示初高中年级
 */
function highClass(t){
	if(t.classList.contains("jpcc_sel_border")){
		return;
	}else{
		t.classList.add("jpcc_sel_border");
		$("#primary")[0].classList.remove("jpcc_sel_border");
		$("#primaryContent")[0].classList.remove("jpcc_display");
		$("#primaryContent")[0].classList.add("jpcc_display_no");
		$("#hignContent")[0].classList.remove("jpcc_display_no");
		$("#hignContent")[0].classList.add("jpcc_display");
	}
}
/**
 * 显示小学年级
 */
function primaryClass(t){
	if(t.classList.contains("jpcc_sel_border")){
		return;
	}else{
		t.classList.add("jpcc_sel_border");
		$("#hign")[0].classList.remove("jpcc_sel_border");
		$("#hignContent")[0].classList.remove("jpcc_display");
		$("#hignContent")[0].classList.add("jpcc_display_no");
		$("#primaryContent")[0].classList.remove("jpcc_display_no");
		$("#primaryContent")[0].classList.add("jpcc_display");
	}
}

//点击完成按钮触发的事件（通过邀请码加入班级界面）
function joinClassInviteCommit(){
	var inviteCode = document.getElementById("inviteCode").value.trim();
	if(inviteCode.length==0){
		alertInfo("请输入邀请码");
		return;
	}
	var selectNum = $(".subjectList ul li").find(".selected").length;
	if(selectNum==0){
		alertInfo("请至少选择一个学科");
		return;
	}
	var selSub = '';
	$.each($(".subjectList ul li").find(".selected"),function(i,v){
		selSub += $(v).attr("data")+",";
	});
	//请求参数
	var data="jid="+jid+"&schoolId="+schoolId+"&invitationCode="+inviteCode
	          +"&subjectStr="+selSub.substr(0,selSub.length-1);
	getSignCode(data,Config.managerClassUrl().split("?m=")[1],"joinClassInviteCommit_");
};

function joinClassInviteCommit_(data){
	postAjaxJSON(Config.managerClassUrl(),data,function(data){
		if(data && data.result==1){
			//如果是否有班级的值为0，说明是从学校界面来的请求，所以得返回两层，否则返回一层
			var backValue = getLocalStorageItem(webStorageVars[6]);
			var backFlag = "";
			if(backValue=="1"){
				backFlag = -1;
			}else{
				backFlag = -2;
			}
			//因为班级可能是第一次加入班级，所以需要把hasClass标识的值改为1
			saveLocalStorageItem(webStorageVars[6],"1");
            sendMsg2iOS("://addClassSucc");
            alertInfo("你已成功加入!",function(){
                goBackNow(backFlag,true);
            });
			
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("加入班级返回结果错误!");
			}
		}
	},function(){
		alertToast("加入班级请求失败!");
	});
}

function showTeacherHead(){
	$(".tm_head_img").attr("src",getLocalStorageItem(webStorageVars[3]));
	$(".tm_head_name").text((getLocalStorageItem(webStorageVars[24])?getLocalStorageItem(webStorageVars[24]):getLocalStorageItem(webStorageVars[4])) +"老师");
}

//初始化教师首页
function teacherMainInit(){
	handleByConfigFrom(function () {
		$("#teaherHeadDiv").on("click",function(){
			toPerInfo();
		});
	},function () {
		//取消click,并添加设置按钮
		$("#teaherHeadDiv").off().find(".tm_to_config").show().on("click",function(){
			toTeacherConfigPage();
		});
	});
	if(getLocalStorageItem(webStorageVars[5])==commonSchoolId && getLocalStorageItem(webStorageVars[6])=="0"){
		$("#generalCourse").show();
		handleByConfigFrom(function () {
			$("#placeholder").show();
		},function () {
			$("#teacherAddClassBtn").hide();
		});

		return;
	}
    //在线班
    if(getLocalStorageItem(webStorageVars[7])=="2" && getLocalStorageItem(webStorageVars[5])=="4983"){
        $("#onlineCourse").show();
        $("#taskList").show();
        //实体班
    }else if(getLocalStorageItem(webStorageVars[7])=="2" && getLocalStorageItem(webStorageVars[5])!="4983"){
        $("#realCourse").show();
        $("#taskList").show();
        //普通班无班级
    }else if(getLocalStorageItem(webStorageVars[7])=="1"){
        $("#generalCourse").show();
    }
	var data="jid="+getLocalStorageItem(webStorageVars[2])+"&schoolId="+getLocalStorageItem(webStorageVars[5]);//+"&time="+getTime();
	getSignCode(data,Config.getTeacherSubjectListUrl().split("?m=")[1],"teacherMainInit_");
}

//初始化教师首页请求
function teacherMainInit_(data){
	var subList = [];
	//请求参数,请求教师年级科目列表
//	var	sign = getSignCode(getParam2Json(data),Config.getTeacherSubjectListUrl().split("?m=")[1]);
//	data += "&sign="+sign;
	postAjaxJSON(Config.getTeacherSubjectListUrl(),data,function(data){
		if(data && data.result>0){
			subList = data.data.subjectList;
			//在线班
			if(getLocalStorageItem(webStorageVars[7])=="2" && getLocalStorageItem(webStorageVars[5])=="4983"){
				$("#onlineCourse").show();
				$("#taskList").show();
		    //实体班
			}else if(getLocalStorageItem(webStorageVars[7])=="2" && getLocalStorageItem(webStorageVars[5])!="4983"){
				$("#realCourse").show();
				$("#taskList").show();
			//普通班无班级
			}else if(getLocalStorageItem(webStorageVars[7])=="1" && subList.length<=0){
				$("#generalCourse").show();
				handleByConfigFrom(function () {
					$("#placeholder").show();
				},function () {
					$("#teacherAddClassBtn").hide();
				});
			//普通班有班级
			}else if(getLocalStorageItem(webStorageVars[7])=="1" && subList.length>0){
				$("#generalCourse").show();
				$("#taskList").show();
				$("#generalMyCourse").show();
			}
			var data="jid="+getLocalStorageItem(webStorageVars[2])+"&schoolId="+getLocalStorageItem(webStorageVars[5]);//+"&time="+getTime();
			getSignCode(data,Config.getTeacherHomePageInfoUrl().split("?m=")[1],"teacherHomePageInfo_");
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("教师年级科目返回结果错误!");
			}
		}
	},function(){
		alertToast("教师年级科目请求失败!");
	});
}

//获取教师首页信息
function teacherHomePageInfo_(data){
	postAjaxJSON(Config.getTeacherHomePageInfoUrl(),data,function(data){
		if(data && data.result==1){
			//alertInfo(data.msg);
			if(data.data.hasNewNotice){
				//$(".tm_menu_red_tip").removeClass("tm_display_no").addClass("tm_display");
				$("#redTip").show();
			}
			var taskList = data.data.lastTaskList;
			if(taskList){
				for(i=0;i<taskList.length;i++){
					var taskItem = document.createElement("li");
					taskItem.setAttribute("class", "tm_task_li");
					taskItem.setAttribute("onclick","lastTaskList("+JSON.stringify(taskList[i])+");");
					//如果从在高亮显示的文字，则需要把需要高亮显示的文字用''代替
					var dateHint = "";
					if(taskList[i].urgentHint!=undefined){
						dateHint = taskList[i].dateHint.replace(taskList[i].urgentHint,'');
					}else{
						dateHint = taskList[i].dateHint;
					}
					var taskItemStr = "";
					taskItemStr+='<div class="tm_float_left">'+
						'<div class="tm_task_name">'+taskList[i].taskName+'</div>'+
						'<div>'+
							'<div class="tm_task_time1">'+dateHint+'</div>'+
							'<div class="tm_task_time2">'+(taskList[i].urgentHint!=undefined?taskList[i].urgentHint:"")+'</div>'+
						'</div>'+
					'</div>';
					if(taskList[i].undeal){
						taskItemStr+='<div class="tm_task_div3">'+
							'<div class="tm_task_div4">待批阅</div>'+
							'<div>'+
								'<div class="tm_task_time1">'+taskList[i].scaleHint+'</div>'+
								'<img class="tm_task_img" src="../../img/teacher/teacherMain/content_default_avatar@2x.png"/>'+
							'</div>'+
						'</div>';
					}else{
						taskItemStr+='<div class="tm_task_div3">'+
							'<div class="tm_margin_top">'+
								'<div class="tm_task_time1">'+taskList[i].scaleHint+'</div>'+
								'<img class="tm_task_img" src="../../img/teacher/teacherMain/content_default_avatar@2x.png"/>'+
							'</div>'+
						'</div>';
					}
					taskItem.innerHTML = taskItemStr;
					document.getElementById("taskListDetail").appendChild(taskItem);
				}
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取教师首页返回结果错误!");
			}
		}
	},function(){
		alertToast("获取教师首页请求失败!");
	});
}

//最近任务详情跳转
function lastTaskList(task){
	currClickTask = task;
	//这四个值根据需要传入到任务详情界面
//	alertInfo(task.undeal);
//	alertInfo(task.taskId);
//	alertInfo(task.taskType);
//	alertInfo(task.taskSubtype);
//	alertInfo(task.jspUrl);
	getClassListByTask(task.taskId,"getClassListByTaskForTeacherMainReq");	
}
/**
 * 通过任务获取班级列表
 */
function getClassListByTask(taskId,returnFn){
	var data="jid="+jid+"&schoolId="+schoolId+"&taskId="+taskId;
	getSignCode(data,Config.getClassListByTaskUrl().split("?m=")[1],returnFn);
}
/**
 * 通过任务获取班级列表 请求
 */
function getClassListByTaskForTeacherMainReq(data){
	postSynoAjaxJSON(Config.getClassListByTaskUrl(),data,function(data){
		if(data && data.result>0){
			classList = data.data.classList;
			if(!currClickTask) return false;
			var taskId=currClickTask.taskId;
			var taskType=currClickTask.taskType;
			var taskSubtype=currClickTask.taskSubType;
			var jspUrl=currClickTask.jspUrl;
			var isDone = currClickTask.undeal;
			jspUrl=jspUrl?encodeURIComponent(encodeURIComponent(encodeURIComponent(jspUrl))):"";
			var classList = JSON.stringify(classList);
			document.location.href="://taskDetail?taskId="+taskId+"&taskType="+taskType+
					"&taskSubtype="+taskSubtype+"&jspUrl="+jspUrl+"&classList="+classList+
					"&isDone="+isDone;
			currClickTask=undefined;
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("通过任务获取班级列表错误");
			}
		}
	},function(){
		alertToast("通过任务获取班级列表请求失败");
	});
}

//判断请求从哪里来,getSchoolListFlag为0，则表示请求来源于创建班级
var getSchoolListFlag = "";
//获取所有学校列表
function getSchoolList(flag){
	getSchoolListFlag = flag;
	//请求参数,获取所有学校
	var data="";
	getSignCode(data,Config.getSchoolListUrl().split("?m=")[1],"getSchoolList_");
}

//
function getSchoolList_(data){
	postAjaxJSON(Config.getSchoolListUrl(),data,function(data){
		if(data && data.result>0){
			var schoolList = data.data.schoolList;
			if(schoolList){
				window.schoolList = schoolList;
				for(i=0;i<schoolList.length;i++){
					var schoolItem = document.createElement("li");
					schoolItem.setAttribute("class", "colorf1 f32_2 jp_height1");
					schoolItem.setAttribute("data", schoolList[i].schoolId);
					//flag为0，则表示请求来源于创建班级
					if(getSchoolListFlag=="0"){
						schoolItem.setAttribute("onclick","createClassHref(this);");
					}else{
						schoolItem.setAttribute("onclick","findClass(this,'0');");
					}
					schoolItem.innerHTML = schoolList[i].schoolName;
					document.getElementById("schoolList").appendChild(schoolItem);
				}
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取所有学校返回结果错误!");
			}
		}
	},function(){
		alertToast("获取所有学校请求失败!");
	});
}

//通过学校查找班级,flag为0，代表请求从选学校页面发起,因为从选择学校发起请求和直接通过学校发起请求获取的学校id和学校名称的方式不同
function findClass(t,flag){
	if(flag=="0"){
		if(!isH5Only){
			window.location.href="join_grade_class.html"+"?schoolId="+t.getAttribute("data")+"&schoolName="+t.innerHTML+"&flag=0"+
			                      "://head?title=[选班级,false,,]&rightHandle:[isExist:false]";
		}else{
			window.location.href="join_grade_class.html"+"?schoolId="+t.getAttribute("data")+"&schoolName="+t.innerHTML+"&flag=0";
		}
	}else{
		if(!isH5Only){
			window.location.href="join_grade_class.html"+"?schoolId="+getLocalStorageItem(webStorageVars[5])+"&schoolName="+getLocalStorageItem(webStorageVars[8])+
			"://head?title=[选班级,false,,]&rightHandle:[isExist:false]";
		}else{
			window.location.href="join_grade_class.html"+"?schoolId="+getLocalStorageItem(webStorageVars[5])+"&schoolName="+getLocalStorageItem(webStorageVars[8]);
		}
	}
}

//通过学校查找班级列表
function findClassList(schoolId){
	//请求参数,获得学校对应年级全部班级
	var data="jid="+getLocalStorageItem(webStorageVars[2])+"&schoolId="+schoolId+"&gradeId=-1";
	getSignCode(data,Config.getClassListBySchoolUrl().split("?m=")[1],"findClassList_");
}

//
function findClassList_(data){
	postAjaxJSON(Config.getClassListBySchoolUrl(),data,function(data){
		if(data && data.result>0){
			var classList = data.data.classList;
			if(classList){
				var gradeListDiv = $("#gradeList");
				$.each(classList, function(i,v) {
					var gradeDiv = gradeListDiv.find("[data="+v.gradeId+"]");
					if(!gradeDiv.length){
						gradeListDiv.append(
							"<div>"+
							"	<div data='"+v.gradeId+"' class='jpcl_level bgcF3F6F8 f28_2 colorf2'>"+
							gradesObj[v.gradeId]+
							"</div>"+
							"<ul class='jp_ul'></ul>");
					}
					gradeDiv = gradeListDiv.find("[data="+v.gradeId+"]");
					var joinSpan = "";
					if(parseInt(v.isJoin)){
						joinSpan="<span class='f28_2 colorf3 jpcl_add jpcl_span1'>已加入</span>";
					}else{
						joinSpan="<span data='"+v.classId+"' class='f28_2 colorc2 jpcl_add jpcl_span2' onclick='showSelectSubject(\""+v.classId+"\")'>"+
								 "<span>+</span>"+
								 "<span>加入</span>"+
								 "</span>";
					}
					var gradeLi = "<li class='colorf1 f32_2 jp_height2'>"+
								  "		<span>"+v.className+"</span>"+
								  joinSpan+
								  "</li>";
					gradeDiv.next().append(gradeLi);
				});
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("学校对应年级全部班级返回结果错误!");
			}
		}
	},function(){
		alertToast("学校对应年级全部班级请求失败!");
	});
}

//通过学校加入班级
function joinClassFromSchool(){
	var selectNum = $(".subjectList ul li").find(".selected").length;
	if(selectNum==0){
		alertInfo("请至少选择一个学科");
		return;
	}
	var selSub = '';
	$.each($(".subjectList ul li").find(".selected"),function(i,v){
		selSub += $(v).attr("data")+",";
	});
	var jid= getLocalStorageItem(webStorageVars[2]);
	var schoolId = document.getElementById("schoolId").innerHTML;
	var classId = document.getElementById("classId").innerHTML;
	//请求参数
	var data="jid="+jid+"&schoolId="+schoolId+"&classId="+classId
	          +"&subjectStr="+selSub.substr(0,selSub.length-1);
	getSignCode(data,Config.managerClassUrl().split("?m=")[1],"joinClassFromSchool_");
}

//
function joinClassFromSchool_(data){
	var param = getParam2Json(data);
	postAjaxJSON(Config.managerClassUrl(),data,function(data){
		if(data && data.result==1){
			//保存学校id,因为学校id以前有可能是公共学校，所以新建班级后，学校id进行了变动，需要重新保存到本地
			saveLocalStorageItem("schoolId",schoolId);
			//因为班级可能是第一次加入班级，所以需要把hasClass标识的值改为1
			saveLocalStorageItem(webStorageVars[6],"1");
            sendMsg2iOS("://addClassSucc");
//			document.location.reload();
			$(".jpcl_select_div").hide();
                 $.each($(".subjectList ul li").find(".selected"),function(i,v){
                        $(v).removeClass("selected");
                        });
			var spanParent = $("[data="+param.classId+"]").parent();
			 $("[data="+param.classId+"]").remove();
			spanParent.append("<span class='f28_2 colorf3 jpcl_add jpcl_span1'>已加入</span>");
            if(!isH5Only){
	            	if(!backNum && hadJoin=="0"){
					backNum = 1;
					goBack(-2,true);
				}
            }
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertInfo("加入班级返回结果错误!");
			}
		}
	},function(){
		alertInfo("加入班级请求失败!");
	});
}

//点击创建班级时，如果教师可以切换学校，则先进入学校选择页，选择了学校后，再进入到新建班级页;
//如果教师不可以切换学校，则直接进入班级信息填写页：
function createClassFlag(){
	if(getLocalStorageItem(webStorageVars[5])==commonSchoolId && getLocalStorageItem(webStorageVars[6])=="0"){
		if(!isH5Only){
			window.location.href="join_grade_school.html?flag=0://head?title=[选学校,false,,]&rightHandle:[isExist:false]";
		}else{
			window.location.href="join_grade_school.html?flag=0";
		}
	}else{
		if(!isH5Only){
			window.location.href="join_grade_create.html?schoolId="+getLocalStorageItem(webStorageVars[5])+
			'://head?title=[新建班级,false,,]&rightHandle:[isExist:true,type:type2,value:[[完成,createClass,]]]';
		}else{
			window.location.href="join_grade_create.html?schoolId="+getLocalStorageItem(webStorageVars[5]);
		}
	}
}

//从选择学校界面调入创建班级界面
function createClassHref(t){
	//跳转到创建班级界面
	if(!isH5Only){
		window.location.href="join_grade_create.html?schoolId="+t.getAttribute("data")+
		'://head?title=[新建班级,false,,]&rightHandle:[isExist:true,type:type2,value:[[完成,createClass,]]]';
	}else{
		window.location.href="join_grade_create.html?schoolId="+t.getAttribute("data");
	}
}

//创建班级（调用后台接口创建班级）
function createClass(){
	var gradeName = document.getElementById("gradeName").value.trim();
	if(gradeName.length==0){
		alertInfo("请输入年级");
		return;
	}
	var className = document.getElementById("className").value.trim();
	if(className.length==0){
		alertInfo("请输入班级名称");
		return;
	}
	var selectNum = $(".subjectList ul li").find(".selected").length;
	if(selectNum==0){
		alertInfo("请至少选择一个学科");
		return;
	}
	var selSub = '';
	$.each($(".subjectList ul li").find(".selected"),function(i,v){
		selSub += $(v).attr("data")+",";
	});
	var jid= getLocalStorageItem(webStorageVars[2]);
	var schoolId = document.getElementById("schoolId").innerHTML;
	var gradeId = $("#allContent .jpcc_sel_selected").attr("data");
	//请求参数
	var data="jid="+jid+"&schoolId="+schoolId+"&gradeId="+gradeId+"&className="+className
	          +"&subjectStr="+selSub.substr(0,selSub.length-1);
	getSignCode(data,Config.createClassUrl().split("?m=")[1],"createClass_");
}

//
function createClass_(data){
	postAjaxJSON(Config.createClassUrl(),data,function(data){
		if(data && data.result==1){
			//alertInfo(data.msg);
			//保存学校id,因为学校id以前有可能是公共学校，所以新建班级后，学校id进行了变动，需要重新保存到本地
			saveLocalStorageItem(webStorageVars[5],schoolId);
			//如果是否有班级的值为0，说明是从学校界面来的请求，所以得返回两层，否则返回一层
			var backValue = getLocalStorageItem(webStorageVars[6]);
			var backFlag = "";
			if(backValue=="1"){
				backFlag = -1;
			}else{
				backFlag = -2;
			}
			//因为班级可能是第一次创建，所以需要把hasClass标识的值改为1
			saveLocalStorageItem(webStorageVars[6],"1");
                 sendMsg2iOS("://addClassSucc");
//			if(!isH5Only){
//				window.location.href = "manage.html://head?title=[班级管理,false,,]&rightHandle:[isExist:false]";
//			}else{
//				window.location.href = "manage.html";
//			}
			goBackNow(backFlag,true);
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("创建班级返回结果错误!");
			}
		}
	},function(){
		alertToast("创建班级请求失败!");
	});
}

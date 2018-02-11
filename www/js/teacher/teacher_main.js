//进入个人信息设置界面
function toPerInfo(){
	document.location.href="://toPerInfo";
}

//进入班级圈界面
function toClassLoop(){
	if(getLocalStorageItem(webStorageVars[6])=="1"){
		document.location.href="://toClassLoop";
	}else{
        handleByConfigFrom(function () {
            $('.delMemberDiv').show();
        });
        handleByConfigFrom(function(){},function () {
            alertToast("您还没有加入班级呢～");
        });
	}
}

/**
 * 跳转到教师设置页
 */
function toTeacherConfigPage(){
	document.location.href= IOS_LISTEN_URL_PREFIXS.TO_TEACHER_CONFIG_PAGE;
}


//进入班级通知界面
function toClassNotice(){
	if(getLocalStorageItem(webStorageVars[6])=="1"){
		//document.location.href="://toClassLoop";
		var href='../classNotice/class_notice.html';
		if(!isH5Only) {
			href+='://head?title=[班级通知,false,,]&rightHandle:[isExist:true,'+
				  'type:type1,value:[[/img/teacher/grade/nav_btn_add_group@2x.png,createClassNotice,]]]';
		}
		window.location.href = href;
	}else{
		handleByConfigFrom(function () {
			$('.delMemberDiv').show();
		});
		handleByConfigFrom(function(){},function () {
			alertToast("您还没有加入班级呢～");
		});
	}
}

//进入校内公告界面
function toSchoolNotice(){
	if(getLocalStorageItem(webStorageVars[6])=="1"){
		$("#redTip").hide();
		var href='bulletin/bulletin_list.html';
		if(!isH5Only) {
			href+='://head?title=[校内公告,false,,]&rightHandle:[isExist:false]'; 
		}
		window.location.href = href;
	}else{
		handleByConfigFrom(function () {
			$('.delMemberDiv').show();
		});
		handleByConfigFrom(function(){},function () {
			alertToast("您还没有加入班级呢～");
		});
	}
}

//跳转到班级管理界面
function toClassManage(){
	var href='grade/manage.html';
	if(!isH5Only) {
		href+='://head?title=[班级管理,false,,]&rightHandle:[isExist:false]'; 
	}
	window.location.href = href;
}

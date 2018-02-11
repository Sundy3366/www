//*************student_courses_list.html js function start ********************************
/**
 * 初始化小组页面
 */
function initMyCourses(){
	getLessonList();
}

/**
 * 获取课程列表
 */
function getLessonList(pageNum){//需要传belongType
	var queryString = getQueryStringFromUrl();
	var subjectId = queryString.subjectId;
	var belongType = queryString.belongType;
	// 所属所属：无:普通1:在线班2:实体班
	if(!belongType)
		belongType = "";
	if(subjectId == undefined){
		alertToast("subjectId为空");
		return false;
	}
	pageNum = pageNum?pageNum:1; 
	var data="jid="+jid+"&schoolId="+schoolId+"&belongType="+belongType+"&subjectId="+subjectId+"&pageNum="+pageNum;
	getSignCode(data,Config.getSubjectInfoUrl().split("?m=")[1],"getLessonList_");
}

/**
 * 获取课程列表 请求
 */
function getLessonList_(data){
	var param = getParam2Json(data);
	var catchFlag = false;
	postAjaxJSON(Config.getSubjectInfoUrl(),data,function(data){
		if(data && data.result>0){
			$(".bottomMoreLoading").attr("status","true");
			if(data.result == 3 || data.result == 2){
				$(".bottomMoreLoading").attr("status","false");
				if(param.pageNum > 1 && data.result == 3){
//					touchOutHandle();
					return false;
				}
			}
			data = data.data;
			var lessonListUl = $("#lessonList");
			lessonListUl.show();
			if(data.topicList.length){
				generateLessonList(data.unfinishedNum,data.topicList,param.pageNum);
			}
			if(touchType==undefined && currMySwiper == undefined)
				lessonListUpDownHandle();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取课程列表 错误");
			}
			catchFlag = true;
		}
	},function(){
		catchFlag = true;
		alertToast("获取课程列表请求失败");
	});
	if(catchFlag)
		touchOutHandle();
}
/**
 *  班级列表上拉刷新,下拉加载处理
 */
function lessonListUpDownHandle(){
	//下拉刷新,上拉加载
	upAndDownSwiperWrapper('.swiper-container',
  			'.topFlushLoading',function(mySwiper){
  				$('.topFlushLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 1;
  				currMySwiper = mySwiper;
  				getLessonList();//该方法内调用 releaseDownFlushWrapper(mySwiper)
  			},
  			'.bottomMoreLoading',function(mySwiper){
  				$('.bottomMoreLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 0;
  				currMySwiper = mySwiper;
  				loadingMore4LessonList();//方法中调用releaseUpFlushWrapper(mySwiper,'.bottomMoreLoading');
  			});
}

/**
 * 加载更多
 */
function loadingMore4LessonList(){
	getLessonList(currPageNum+1);
}

/**
 * 生成课程列表
 */
function generateLessonList(unfinishedNum,lessonList,pageNum){
	currPageNum=parseInt(pageNum);
	var lessonListJq = $("#lessonList");
	var listHtml = "";
	$.each(lessonList, function(i,v) {
			var subDivHead = '<div class="swiper-slide"></div>';
			var subHtml = '<span data="'+v.topicId+'"><a href="javascript:;"><img src="../../img/teacher/course/content_course_card_default@2x.png"><p>'+v.topicName+'</p></a>'+(unfinishedNum?'<div name="redTip" class="tm_menu_red_tip"></div>':"")+'</span>';
			if(lessonListJq.children().length && lessonListJq.children().last().children().length==1){//如果有子元素,且少最后1位
				lessonListJq.children().last().append(subHtml);
				return true;
			}else{
				lessonListJq.append(subDivHead);
			}
			lessonListJq.children().last().append(subHtml);
	});
	lessonListJq.append(listHtml);
	touch.on(lessonListJq.children().children().off(), 'tap', function(ev){
		var ali = $(ev.currentTarget);
		gotoNormalTask(ev.currentTarget);
	});
	touchOutHandle();
}

/**
 * 跳转到一般任务创建
 */
function gotoNormalTask(){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	var lessonId = queryStringObj.lessonId;
	if(gradeId==undefined || subjectId == undefined  || lessonId == undefined){
		alertToast("gradeId,subjectId或lessonId为空");
		return false;
	}
	document.location.href = "://normalTask?gradeId="+gradeId+"&subjectId="+subjectId+"&lessonId="+lessonId;
}

//*************student_courses_list.html js function end ********************************
//*************nofinished_crouses.html js function start ********************************
/**
 * 显示排序选项弹出层
 */
function clickSortOptionsBtn(flag){
	$("[name=sortOptionsPop]").toggle(flag);
}
//*************nofinished_crouses.html js function end ********************************


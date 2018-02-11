/**
 * 我的课程相关js
 * @author xuefeng.kang
 */


//*************courses_list.html js function start ********************************
/**
 * 初始化小组页面
 */
function initMyCourses(){
	if(getLocalStorageItem(webStorageVars[7])=="2" && getLocalStorageItem(webStorageVars[5])=="4983")
		$(".integration").parent().hide();
	getTeacherGradeListSignCode("initGradeSubjectList");
}

/**
 * 获取课程列表
 */
function getLessonList(pageNum){
	var selectGroupSubject = $("#changeClassDiv ul li span.hover").parent();
	if(!selectGroupSubject){
		alertToast("选择年级科目为空");
		return false;
	}
	var gradeId = selectGroupSubject.attr("gradeid");
	var subjectId = selectGroupSubject.attr("subjectid");
	var materialId = selectGroupSubject.attr("materialId");
	// 判断是否已选择教材
	if(!materialId){
		//未选择教材
		$("#placeholder").show().parent().show();
		$(".teacherBoxDiv ").hide();
		return false;
	}
	if(gradeId==undefined || subjectId == undefined){
		alertToast("gradeId或subjectId为空");
		return false;
	}
	$("#lessonList").show();
	getTextBookInfo(gradeId,subjectId,materialId);//缓存教材信息
	pageNum = pageNum?pageNum:1; 
	// 检测缓存是否存在并且是否过期,缓存存在时,检测是否有最新记录,若有则更新缓存,若无则继续使用缓存
	// 当使用缓存时,pageNum>=maxPageNum(缓存字段)时检测是否还有>pageNum数据,如果有则继续缓存
	var currentGradeSubjectOldLessonList = updateLessonListFromWebStory(gradeId,subjectId,materialId,1,pageNum);
	var isNeedReq = true;
	if(currentGradeSubjectOldLessonList){
		if(pageNum<= currentGradeSubjectOldLessonList.maxPageNum){
			$(".bottomMoreLoading").attr("status","true");//show();
			if(pageNum == 1){
				checkIsHadNewPage(1,0);
			}else{
				generateLessonList(currentGradeSubjectOldLessonList[pageNum].lessonList,pageNum);
				if(pageNum == currentGradeSubjectOldLessonList.maxPageNum){
					//检测是否有新一页内容
					checkIsHadNewPage(pageNum+1);
				}
			}
			isNeedReq = false;
		}
	}
	if(isNeedReq){
		var data="jid="+jid+"&schoolId="+schoolId+"&gradeId="+gradeId+"&subjectId="+subjectId+"&pageNum="+pageNum;
		getSignCode(data,Config.getLessonListUrl().split("?m=")[1],"getLessonList_");
	}
}

/**
 * 检测是否有新1页信息,用户查询到缓存的最大页面时
 * @param {Object} pageNum 页数
 * @param {Object} type 类型  0,检查第一页第一条数据是否一致,一致则返回缓存信息,不一致则更新缓存信息,type为0时,pageNum为1
 */
function checkIsHadNewPage(pageNum,type){
	var selectGroupSubject = $("#changeClassDiv ul li span.hover").parent();
	var gradeId = selectGroupSubject.attr("gradeid");
	var subjectId = selectGroupSubject.attr("subjectid");
	var materialId = selectGroupSubject.attr("materialId")
	var data="jid="+jid+"&schoolId="+schoolId+"&gradeId="+gradeId+"&subjectId="+subjectId+"&pageNum="+pageNum;
	getSignCode(data,Config.getLessonListUrl().split("?m=")[1],type==0?"checkFirstPageFirstRecordIsSameReq":"getLessonList_");
}
/**
 * 检查第一页第一条记录是否与缓存的第一页第一条数据一致,若一致则直接从缓存中显示第一页,若不一致则更新缓存来显示
 * @param {Object} data
 */
function checkFirstPageFirstRecordIsSameReq(data){
	postAjaxJSON(Config.getLessonListUrl(),data,function(data){
		if(data && data.result>0){
			if(data.result == 3 || data.result == 2)
				$(".bottomMoreLoading").attr("status","false");//.hide();
			data = data.data;
			if(!data.lessonList){
				//清缓存
				removeLocalStorageItem(webStorageVars[11]);
				return false;
			}
			var selectGroupSubject = $("#changeClassDiv ul li span.hover").parent();
			var gradeId = selectGroupSubject.attr("gradeid");
			var subjectId = selectGroupSubject.attr("subjectid");
			var bookId = selectGroupSubject.attr("materialId")
			var oldLessonList = getLocalStorageItem(webStorageVars[11]);
			if(!oldLessonList)
				return false;
			oldLessonList = oldLessonList?$.parseJSON(oldLessonList):{};
			if(!oldLessonList[bookId])
				oldLessonList[bookId] = {};
			if(!oldLessonList[bookId][gradeId])
				oldLessonList[bookId][gradeId] = {};
			if(!oldLessonList[bookId][gradeId][subjectId])
				oldLessonList[bookId][gradeId][subjectId] = {};
			if(!oldLessonList[bookId][gradeId][subjectId][1])
				oldLessonList[bookId][gradeId][subjectId][1] = {};
			var maxPageNum = oldLessonList[bookId][gradeId][subjectId]['maxPageNum'];
			if(!maxPageNum){
				oldLessonList[bookId][gradeId][subjectId]['maxPageNum'] = 1;
			}else{
				oldLessonList[bookId][gradeId][subjectId]['maxPageNum'] = 1>maxPageNum?1:maxPageNum;
			}
			if(data.lessonList[0].lessonId == oldLessonList[bookId][gradeId][subjectId][1].lessonList[0].lessonId){
				generateLessonList(oldLessonList[bookId][gradeId][subjectId][1].lessonList,1);
			}else{
				oldLessonList[bookId][gradeId][subjectId][1] ={lessonList:data.lessonList,generateTime:new Date().getTime()};
				saveLocalStorageItem(webStorageVars[11],oldLessonList);
				generateLessonList(data.lessonList,1);
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取课程列表 错误");
			}
		}
	},function(){
		alertToast("获取课程列表请求失败");
	});
}
/**
 * 检测是否有新1页信息 请求
 */
function checkIsHadNewPageReq(data){
	postAjaxJSON(Config.getLessonListUrl(),data,function(data){
		if(data && data.result>0){
			if(data.result == 3 || data.result == 2)
				$(".bottomMoreLoading").attr("status","false");//hide();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取课程列表 错误");
			}
		}
	},function(){
		alertToast("获取课程列表请求失败");
	});
}

/**
 * 获取课程列表 请求
 */
function getLessonList_(data){
	var param = getParam2Json(data);
	var catchFlag = false;
	postAjaxJSON(Config.getLessonListUrl(),data,function(data){
		if(data && data.result>0){
			$(".bottomMoreLoading").attr("status","true");//.show();
			if(data.result == 3 || data.result == 2){
				$(".bottomMoreLoading").attr("status","false");//.hide();
				if(param.pageNum > 1 && data.result == 3)
					return false;
			}
			data = data.data;
			var lessonListUl = $("#lessonList");
			var selectGroupSubject = $("#changeClassDiv ul li span.hover").parent();
			if(!selectGroupSubject){
				alertToast("选择年级科目为空");
				return false;
			}
			var gradeId = selectGroupSubject.attr("gradeid");
			var subjectId = selectGroupSubject.attr("subjectid");
			var materialId = selectGroupSubject.attr("materialId");
			if(data.lessonList.length){
				updateLessonListFromWebStory(gradeId,subjectId,materialId,2,data.pageNum,data.lessonList);
				generateLessonList(data.lessonList,data.pageNum);
			}else{
				$(".zwBox").show().parent().show();
				$("#lessonList").parent().height($("#lessonList").children().first().height()).parent().height($("#lessonList").children().first().height());
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
  				checkIsHadNewPage(1,1);//该方法内调用 releaseDownFlushWrapper(mySwiper)
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
 * 更新课程列表缓存
 * 1天更新1次
 * {bookId:{gradeId:{subjectId:{maxPageNum:maxPageNum,pageNum:{lessonList:[{lessonId:lessonId,lessonName:lessonName}}],generateTime:generateTime}}}} 时间为毫秒数
 * @param {int} type 值为1(查询缓存是否过期,第二个参数为null,如果未过期返回缓存信息,已过期或为缓存则返回false)
 * 					 值为2(更新缓存)
 * @param {Object} newLessonList 
 */
function updateLessonListFromWebStory(gradeId,subjectId,bookId,type,pageNum,newLessonList){
	var oldLessonList = getLocalStorageItem(webStorageVars[11]);
	if(type==1){
		if(!oldLessonList ||
		   !oldLessonList[bookId]||
		   !oldLessonList[bookId][gradeId]||
		   !oldLessonList[bookId][gradeId][subjectId])
			return false;
		oldLessonList = $.parseJSON(oldLessonList);
		var isExpires = false,
			isFound = false;
		$.each(oldLessonList, function(i,v) {
			if(bookId == i){
				$.each(v, function(j,k) {
					if(gradeId == j){
						$.each(k, function(m,n) {
							if(subjectId == m){
								var nowTime = new Date().getTime();
								if(nowTime - n.generateTime >= 24*60*60*1000){
									isExpires = true;
								}
								isFound = true;
								return false;
							}
						});
						if(isFound) return false;
					}
				});
				if(isFound) return false;
			}
		});
		if(!isExpires)
			return oldLessonList[bookId][gradeId][subjectId];
		return false;
	}else if(type==2){
		oldLessonList = oldLessonList?$.parseJSON(oldLessonList):{};
		if(!oldLessonList[bookId])
			oldLessonList[bookId] = {};
		if(!oldLessonList[bookId][gradeId])
			oldLessonList[bookId][gradeId] = {};
		if(!oldLessonList[bookId][gradeId][subjectId])
			oldLessonList[bookId][gradeId][subjectId] = {};
		if(!oldLessonList[bookId][gradeId][subjectId][pageNum])
			oldLessonList[bookId][gradeId][subjectId][pageNum] = {};
		var maxPageNum = oldLessonList[bookId][gradeId][subjectId]['maxPageNum'];
		if(!maxPageNum){
			oldLessonList[bookId][gradeId][subjectId]['maxPageNum'] = pageNum;
		}else{
			oldLessonList[bookId][gradeId][subjectId]['maxPageNum'] = pageNum>maxPageNum?pageNum:maxPageNum;
		}
		oldLessonList[bookId][gradeId][subjectId][pageNum] ={lessonList:newLessonList,generateTime:new Date().getTime()};
		saveLocalStorageItem(webStorageVars[11],oldLessonList);
	}
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
function generateLessonList(lessonList,pageNum){
	currPageNum=parseInt(pageNum);
	var lessonListJq = $("#lessonList");
	if(touchType == 1)
		lessonListJq.html('<div class="swiper-slide">'+
	  					  '<span><a href="javascript:;" ontouchstart="gotoCreateLesson();"> <img src="../../../img/teacher/course/content_course_card_add@2x.png" /></a></span>'+
	  					  '</div>');
	var listHtml = "";
	$.each(lessonList, function(i,v) {
			var subHtml = '<span data="'+v.lessonId+'"><a href="javascript:;"><img src="../../../img/teacher/course/content_course_card_default@2x.png"><p>'+$.trim(v.lessonName)+'</p></a></span>';
			var subDivHead = '<div class="swiper-slide">';
			if(i==0)
				if(lessonListJq.children().length && lessonListJq.children().last().children().length==1){//如果有子元素,且少最后1位
					lessonListJq.children().last().append(subHtml);
					listHtml+=subDivHead;
					return true;
				}else{
					listHtml+=subDivHead;
				}
			listHtml+=subHtml;
			if(i!=0 && i%2==0 && i!=lessonList.length-1)
				listHtml+="</div>"+subDivHead;
			if(i==lessonList.length-1)
				listHtml+="</div>";
	});
	lessonListJq.append(listHtml);
	touch.on(lessonListJq.children().children().not(":first").off(), 'tap hold', function(ev){
		var ali = $(ev.currentTarget);
		if(ev.type=="tap"){
			gotoTaskList(ev.currentTarget);
		}else if(ev.type=="hold"){
			delPopForCreateLessonShow(ali.attr("data"));
		}
	});
	touchOutHandle();
	setTimeout(function(){
		//省略号处理
		$("#lessonList").children().children().not(":first").find("p").dotdotdot({watch: 'window'});
	},50);
}
/**
 * 跳转到任务列表
 * @param {Dom} t 点击对象
 * @param {JSON} paramObj ,当t为false,时用该对象获取所需值
 * @param {int} 返回上一页 返回系数
 */
function gotoTaskList(t,paramObj,rbIndex){
	if(!rbIndex)
		rbIndex = -1;
	var gradeId,
		subjectId,
		topicId,
		title;
	if(t){
		var selectGroupSubject = $("#changeClassDiv ul li span.hover").parent();
		if(!selectGroupSubject){
			alertToast("选择年级科目为空");
			return false;
		}
		gradeId = selectGroupSubject.attr("gradeid");
		subjectId = selectGroupSubject.attr("subjectid");
		topicId = $(t).attr("data");
		title = $(t).text().trim();
	}else{
		gradeId = paramObj.gradeId;
		subjectId = paramObj.subjectId;
		topicId = paramObj.topicId;
		title = paramObj.title;
	}
	if(gradeId == undefined && subjectId == undefined && topicId == undefined){
		alertToast("gradeId,subjectId或topicId为空");
		return false;		
	}
	var queryString = "topicId="+topicId+"&gradeId="+gradeId+"&subjectId="+subjectId;
	if(!isH5Only)
		queryString += "://head?title=["+title+",false,,]&"+
					   "rightHandle:[isExist:true,type:type1,value:[[/img/teacher/course/nav_btn_task@2x.png,gotoCreateTaskSelect,],"+
					   "[/img/teacher/course/nav_btn_more@2x.png,textbookChangePopToggle,]]]";
	document.location.href="courses_detail.html?rbi="+rbIndex+"&"+queryString;
	//解决短双(停顿)击,导致触发hold事件,打开弹出层问题
	setTimeout(function(){
   		delPopForCreateLessonClose();
    },999);
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

/**
 * 跳转到测验任务
 */
function gotoTestTask(){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	var lessonId = queryStringObj.lessonId;
	if(gradeId==undefined || subjectId == undefined  || lessonId == undefined){
		alertToast("gradeId,subjectId或lessonId为空");
		return false;
	}
	document.location.href = "://testTask?gradeId="+gradeId+"&subjectId="+subjectId+"&lessonId="+lessonId+
							 "&url="+Config.testTaskUrl();
}

/**
 * 显示是否删除课程弹出层
 */
function delPopForCreateLessonShow(data){
	$(".delMemberDiv").attr("data",data).show();
}
/**
 * 关闭是否删除课程弹出层
 */
function delPopForCreateLessonClose(){
	if($(".delMemberDiv").is(":visible"))
		$(".delMemberDiv").removeAttr("data").hide();
}

/**
 * 删除课程提交
 */
function delLessonSubmit(){
	var lessonId = $(".delMemberDiv").attr("data");
	if(lessonId == undefined){
		alertToast("lessonId为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&lessonId="+lessonId;
	getSignCode(data,Config.detLessonUrl().split("?m=")[1],"delLessonSubmitReq");
}
/**
 * 删除课程提交请求
 * @param {Object} data
 */
function delLessonSubmitReq(data){
	postAjaxJSON(Config.detLessonUrl(),data,function(data){
		if(data && data.result>0){
			delPopForCreateLessonClose();
			document.location.reload();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("删除课程错误");
			}
		}
	},function(){
		alertToast("删除课程请求失败");
	});
}
/**
 * 初始化年级科目列表
 * 取年级下科目的集合e.g.:高一数学
 */
function initGradeSubjectList(data){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	var rbi = queryStringObj.rbi;//返回层数
		rbi = rbi?(parseInt(rbi)+1):1;
		goBack(-rbi,false);
	getTeacherGradeList_(data,function(data){
		var changeClassDivUl = $("#changeClassDiv ul");
		if(data.subjectList.length>0){
			var gradeSubjectArray = {};
			$.each(data.subjectList, function(i,v) {
				if(!gradeSubjectArray[v.gradeId])
					gradeSubjectArray[v.gradeId] = [];
				gradeSubjectArray[v.gradeId].push({subjectId:v.subjectId,materialId:v.materialId});
			});
			saveLocalStorageItem(webStorageVars[10],data.subjectList);
			if(data.subjectList.length>1){
				//显示下箭头
				$("#changeClassTitle > span > div").children().eq(1).show();
				//添加点击监听
				changeClassListen();
			}
			var selectedGroupSubject = "";
			if(gradeId != undefined && subjectId != undefined)
				selectedGroupSubject = gradesObj[gradeId]+subjectsObj[subjectId];
			var firstGroupId="",
				firstGroupSubjectId="";
			var num = 0;
			//填充小组列表
			$.each(gradeSubjectArray, function(j,k) {
				$.each(k, function(i,v) {
					if(num == 0){
						firstGroupId = j;
						firstGroupSubjectId = v.subjectId;
					}
					num++;
					var  currGradeSubject = gradesObj[j]+subjectsObj[v.subjectId];
					var queryString = "rbi="+rbi+"&gradeId="+j+"&subjectId="+v.subjectId;
					if(!isH5Only)
							queryString += "://head?title=["+currGradeSubject+",true,changeClassClick,]&"+
	  		  			   				   "rightHandle:[isExist:true,type:type1,value:[[/img/teacher/course/nav_btn_more@2x.png,textbookChangePopToggle,]]]"; 
					var liHtml ="	<li materialId='"+(v.materialId?v.materialId:"")+"' gradeId='"+j+"' subjectId='"+v.subjectId+"' data = 'courses_list.html?"+queryString+"'>"+
								"		<span class='space "+(selectedGroupSubject==currGradeSubject?"hover":"")+"'></span>"+
								"		<span class='f36_2 text'>"+currGradeSubject+"</span>"+
								"	</li>";
					changeClassDivUl.append(liHtml);
				});
			});
			if(!selectedGroupSubject){
				changeClassDivUl.find("[gradeId="+firstGroupId+"][subjectId="+firstGroupSubjectId+"]")
								.children().first().addClass("hover");
				selectedGroupSubject = gradesObj[firstGroupId]+subjectsObj[firstGroupSubjectId]
			}
			
			//显示title
			$("#changeClassTitle > span > div").children().first().text(selectedGroupSubject);
			//添加点击事件
			$("#changeClassDiv ul li").on("click",function(){
				changeClassClick();
				var href = $(this).attr("data");
				document.location.href=href;
				return false;
			});
			getLessonList();
		}
	});
}

/**
 * 切换教材选择弹出层
 */
function textbookChangePopToggle(){
	if($(".changeClassesSec").is(":visible"))
		$("#changeClassTitle").click();
	var pop = $("[name=textbookChangePop]");
	if("none" == pop.css("display")){
		pop.show();
	}else{
		pop.hide();
	}
//	event.stopImmediatePropagation();
//	event.preventDefault();
}

/**
 * 跳转选教材页面
 */
function gotoSelectTextBook(){
	var selectGroupSubject = $("#changeClassDiv ul li span.hover").parent();
	if(!selectGroupSubject){
		alertToast("选择年级科目为空");
		return false;
	}
	var gradeId = selectGroupSubject.attr("gradeid");
	var subjectId = selectGroupSubject.attr("subjectid");
	if(gradeId==undefined || subjectId == undefined){
		alertToast("gradeId或subjectId为空");
		return false;
	}
	if($("[name=textbookChangePop]").is(":visible"))	
		textbookChangePopToggle();
	//选教材
	var queryString = "gradeId="+gradeId+"&subjectId="+subjectId;
	if(!isH5Only)
		queryString += "://head?title=[选教材,false,,]&"+
					   "rightHandle:[isExist:false]";
	document.location.href="selected_textbooks.html?"+queryString;
}

/**
 * 创建课程
 */
function gotoCreateLesson(){
	var selectGroupSubject = $("#changeClassDiv ul li span.hover").parent();
	if(!selectGroupSubject){
		alertToast("选择年级科目为空");
		return false;
	}
	var gradeId = selectGroupSubject.attr("gradeid");
	var subjectId = selectGroupSubject.attr("subjectid");
	var materialId = selectGroupSubject.attr("materialId");
	if(gradeId==undefined || subjectId == undefined || materialId == undefined){
		alertToast("gradeId,subjectId或materialId为空");
		return false;
	}
	//选教材
	var queryString = "gradeId="+gradeId+"&subjectId="+subjectId+"&materialId="+materialId;
	if(!isH5Only)
		queryString += "://head?title=[1/2,false,,]&"+
					   "rightHandle:[isExist:true,type:type2,value:[[下一步,gotoCreateLessonNext,]]]";
	document.location.href="selected_textbooks_establish.html?"+queryString;
					  		  			   
}
/**
 * 获取教材信息
 * @param {Object} bookId 教材id
 */
function getTextBookInfo(gradeId,subjectId,bookId){
	getOrChooseTextBook(gradeId,subjectId,bookId,"getTextBookInfoReq",2);
}
/**
 * 获取教材课程列表请求,请求成功后将信息保存到localStorage中
 * @param {Object} data
 */
function getTextBookInfoReq(data){
	postAjaxJSON(Config.getBookInfoUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			saveLocalStorageItem(webStorageVars[9],data.lessonList);
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取教材列表 错误");
			}
		}
	},function(){
		alertToast("获取教材列表请求失败");
	});
}

/**
 * 获取分组积分列表信息
 * @param {String} reqFn 返回signCode时执行的方法名
 */
function getPointList(gradeId,subjectId,reqFn){
	var data="jid="+jid+"&schoolId="+schoolId+"&gradeId="+gradeId+"&subjectId="+subjectId;
	getSignCode(data,Config.getPointListUrl().split("?m=")[1],reqFn);//"getPointListReq"
}
/**
 * 获取分组积分列表信息 请求
 */
function getPointListReq(data){
	var param = getParam2Json(data);
	postAjaxJSON(Config.getPointListUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(!data.classList.length){
				alertToast("无班级信息");
				return false;
			}
			saveLocalStorageItem(webStorageVars[12],data.classList);
			var isShowArrow = false;
			if(data.classList.length > 1)
				isShowArrow = true;
			var title = data.classList[0].className;
			var subjectName = subjectsObj[data.classList[0].subjectList[0].subjectId];
			var classId = data.classList[0].classId;
			$("[name=textbookChangePop]").hide();
			//保存分组积分信息为webStoray变量,同时跳转到分组积分信息页
			var queryString = "gradeId="+param.gradeId+"&subjectId="+param.subjectId+"&classId="+classId;
			if(!isH5Only)
				queryString += "://head?title=["+title+" "+subjectName+","+isShowArrow+","+(isShowArrow?"changeClassClick":"")+",]&"+
							   "rightHandle:[isExist:false]";
			document.location.href="subject_integration.html?"+queryString;
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取分组积分列表错误");
			}
		}
	},function(){
		alertToast("获取分组积分列表请求失败");
	});
}

/**
 * 跳转到分组积分
 */
function gotoSubjectPoint(){
	var selectGroupSubject = $("#changeClassDiv ul li span.hover").parent();
	if(!selectGroupSubject){
		alertToast("选择年级科目为空");
		return false;
	}
	var gradeId = selectGroupSubject.attr("gradeid");
	var subjectId = selectGroupSubject.attr("subjectid");
	if(gradeId==undefined || subjectId == undefined){
		alertToast("gradeId或subjectId为空");
		return false;
	}
	textbookChangePopToggle();
	getPointList(gradeId,subjectId,"getPointListReq");
}
//*************courses_list.html js function end ********************************
//*************selected_textbooks.html js function start ********************************
/**
 * 初始化教材列表
 */
function initBookLists(){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	if(gradeId==undefined || subjectId == undefined){
		alertToast("gradeId或subjectId为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&gradeId="+gradeId+"&subjectId="+subjectId;
	getSignCode(data,Config.getBookListUrl().split("?m=")[1],"getBookLists");
}

/**
 * 获取教材列表 请求
 */
function getBookLists(data){
	postAjaxJSON(Config.getBookListUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			var textBookUl = $("[name=textBookUl]");
			$.each(data.bookVersionList, function(i,v) {
				var divHtml="<li class='cursor_pointer'>"+
							"	<div onclick='displayBookListToggle(this)' class='list_con'>"+
							v.bookVersionName+
							"		<span class='btn_close'></span>"+
							"	</div>";
				var olUl = "<ol class='open_con tm_display_no'>";
				$.each(v.bookList, function(j,k) {
					olUl+="<li onclick='chooseTextBook(\""+k.bookId+"\")' data='"+k.bookId+"'>"+k.bookName+"</li>";
				});
				divHtml+=olUl+"</li>";
				textBookUl.append(divHtml);
			});
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取教材列表 错误");
			}
		}
	},function(){
		alertToast("获取教材列表请求失败");
	});
}

/**
 * 切换教材版本展开合并
 * @param {Object} t
 */
function displayBookListToggle(t){
	var $this = $(t).find("span");
	if($this.attr("class")=='btn_close'){
		$this.attr("class","btn_open").parent().next().show();
	}else{
		$this.attr("class","btn_close").parent().next().hide();
	}
}

/**
 * 获取或选择教材
 * @param {Object} bookId 教材Id
 * @param {Object} reqFn 返回执行的方法名
 * @param {int} type 1(选择教材)/2(获取教材信息)
 */
function getOrChooseTextBook(gradeId,subjectId,bookId,reqFn,type){
	if(gradeId==undefined || subjectId == undefined  || bookId == undefined){
		alertToast("gradeId,subjectId或bookId为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&gradeId="+gradeId+"&subjectId="+subjectId+
			 "&bookId="+bookId+"&type="+type;
	getSignCode(data,Config.getBookInfoUrl().split("?m=")[1],reqFn);
}

/**
 * 选择教材
 * @param {DomObject} t 选择的dom对象this
 */
function chooseTextBook(bookId){
	/*
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	if(gradeId==undefined || subjectId == undefined  || bookId == undefined){
		alertToast("gradeId,subjectId或bookId为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&gradeId="+gradeId+"&subjectId="+subjectId+
			 "&bookId="+bookId+"&type=1";
	getSignCode(data,Config.getBookInfoUrl().split("?m=")[1],"chooseTextBookReq");
	*/
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	getOrChooseTextBook(gradeId,subjectId,bookId,"chooseTextBookReq",1)
}
/**
 * 选择教材 请求
 * @param {Object} data
 */
function chooseTextBookReq(data){
	postAjaxJSON(Config.getBookInfoUrl(),data,function(data){
		if(data && data.result>0){
			goBackNow();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("选择教材错误");
			}
		}
	},function(){
		alertToast("选择教材请求失败");
	});
}

//*************selected_textbooks.html js function end ********************************
//*************selected_textbooks_establish.html js function start ********************************
/**
 * 初始化推荐课信息
 * 从localStorage中获取
 */
function initRecommendedInfo(){
	var textBookLessonList = getLocalStorageItem(webStorageVars[9]);
	if(!textBookLessonList || textBookLessonList=="[]")
		return false;
	var recommendUl= $(".establish_recommend").show().find(".recommend_list");
	textBookLessonList = $.parseJSON(textBookLessonList);
	$.each(textBookLessonList, function(i,v) {
		var liHtml = "<li class='cursor_pointer' onclick='gotoCreateLessonNext(\""+v.lessonId+"\")'>"+$.trim(v.lessonName)+"</li><br />";
		recommendUl.append(liHtml);
	});
}

/**
 * 创建课程下一步
 */
function gotoCreateLessonNext(lessonId){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	var materialId = queryStringObj.materialId;
	if(gradeId==undefined || subjectId == undefined || materialId == undefined){
		alertToast("gradeId,subjectId或materialId为空");
		return false;
	}
	//选教材
	var queryString = "gradeId="+gradeId+"&subjectId="+subjectId+"&materialId="+materialId;
	if(lessonId){
		queryString +="&lessonId="+lessonId;
	}else{
		//获取课程名
		var lessonName = $.trim($("#lessonName").val());
		if(!lessonName){
			alertToast("请输入课程名称");
			return false;
		}
		queryString+="&lessonName="+lessonName;
	}
	if(!isH5Only) 
		queryString += "://head?title=[2/2,false,,]&"+
					   "rightHandle:[isExist:true,type:type2,value:[[完成,createLessonSubmit,]]]";
	document.location.href="selected_textbooks_set.html?"+queryString;
}
//*************selected_textbooks_establish.html js function end ********************************
//*************selected_textbooks_set.html js function start ********************************
/**
 * 初始化班级列表
 * 年级科目列表进行匹配,找出该年级下存在该科目的班级
 */
function initClassList4CreateLesson(){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	if(gradeId==undefined || subjectId == undefined){
		alertToast("gradeId或subjectId为空");
		return false;
	}
	var gradeSubjectArray = getLocalStorageItem(webStorageVars[10]);
	if(!gradeSubjectArray || gradeSubjectArray == "{}")
		return false;
	gradeSubjectArray = $.parseJSON(gradeSubjectArray);
	var selectClassDiv = $("#selectClassDiv");
//		<a href="" class="hig">高一(1)班</a>
	$.each(gradeSubjectArray, function(i,v) {
		if(gradeId == v.gradeId && subjectId == v.subjectId)
			$.each(v.classList, function(j,k) {
				selectClassDiv.append("<a href='javascript:;' onclick='selectClassForCreateLessionToggle(this)' "+
									      "data='"+k.classId+"'>"+
										k.className+
									  "</a>");
			});
	});
}

/**
 * 创建课程中选择班级点击切换
 * @param {Object} t
 */
function selectClassForCreateLessionToggle(t){
	if($(t).attr("class")!="hig"){
		$(t).attr("class","hig");
		if($("[name=fenbanSettingBtn]").attr("class")=="open"){
			var startDate = $("[name=allDateSettingStart]").val();
			var endDate = $("[name=allDateSettingEnd]").val();
			$("#fenbanSettingDiv").append(getDateTimeSettingDiv($(t).attr("data"),$(t).text(),startDate,endDate));
		}
	}else{
		$(t).removeAttr("class");
		var fenbanSettingBtn = $("[name=fenbanSettingBtn]");
		if(fenbanSettingBtn.attr("class")=="open"){
			$("#fenbanSettingDiv").find("[data="+$(t).attr("data")+"]").remove();
			if(!$("#selectClassDiv .hig").length)
				fenbanSettingToggle(fenbanSettingBtn[0]);
		}
	}
}

/**
 * 分班设置
 * 启用:open
 */
function fenbanSettingToggle(t){
	var selectedClassList = $("#selectClassDiv .hig");
	if(!selectedClassList.length && $("[name=fenbanSettingBtn]").attr("class")!="open")
		return false;
	var fenbanSettingDiv = $("#fenbanSettingDiv");
	if($(t).attr("class")=="open"){
		$(t).removeAttr("class").text("分班设置");
		$("#allDateSettingDiv").show();
		fenbanSettingDiv.html("");
	}else{
		$(t).attr("class","open").text("取消分班设置");
		$("#allDateSettingDiv").hide();
		var startDate = $("[name=allDateSettingStart]").val();
		var endDate = $("[name=allDateSettingEnd]").val();
		$.each(selectedClassList, function(i,v) {
			fenbanSettingDiv.append(getDateTimeSettingDiv($(v).attr("data"),$(v).text(),startDate,endDate));
		});
	}
}

/**
 * 获取分班设置 div
 * @param {Object} classId
 * @param {Object} className
 * @param {Object} startDateTime
 * @param {Object} endDateTime
 */
function getDateTimeSettingDiv(classId,className,startDateTime,endDateTime,divCssClassName){
	 return '<div data="'+classId+'">'+
							'	<div class="'+(divCssClassName?divCssClassName:'class_con')+'">'+
							'		<h2>'+className+'</h2>'+
							'		<div class="date_set_pub pb18Pix">'+
							'			<span>开始：</span>'+
							'			<div class="date_select">'+
							'				<p>'+formateDateTimeLocal2CN(startDateTime)+'</p>'+
							'				<input name="startDate" type="datetime-local" value="'+startDateTime+'" oninput="dateInputForCreateLesson(this)"/>'+		
							'			</div>'+
							'		</div>'+
							'		<div class="date_set_pub">'+
							'			<span>结束：</span>'+
							'			<div class="date_select">'+
							'				<p>'+formateDateTimeLocal2CN(endDateTime)+'</p>'+
							'				<input name="endDate" type="datetime-local" value="'+endDateTime+'" oninput="dateInputForCreateLesson(this)"/>'+		
							'			</div>'+
							'		</div>	'+
							'	</div>'+
							'</div>';
}

/**
 * 初始化时间设置
 * @param {int} dayNum 几天后的 00:00点,默认为1天后00点
 */
function initAllDateSetting(dayNum){
	var nowDateTime = getDateTimelocalStr();
	var nextDateTime = getNextDayTimeLocalStr();
	dayNum = dayNum?dayNum:1;
	if(dayNum == 7)
		nextDateTime = get7dayNextDayTimeLocalStr();
	$("[name=allDateSettingStart]").val(nowDateTime).prev().text(formateDateTimeLocal2CN(nowDateTime));
	$("[name=allDateSettingEnd]").val(nextDateTime).prev().text(formateDateTimeLocal2CN(nextDateTime));
}
/**
 * 日期输入转换
 * @param {Object} t 日期input对象
 */
function dateInputForCreateLesson(t){
	$(t).prev().text(formateDateTimeLocal2CN($(t).val()));
}

/**
 * 创建班级提交
 */
function createLessonSubmit(){
	var selectedClassList = $("#selectClassDiv .hig");
	if(!selectedClassList.length){
		alertToast("您至少要选择一个班级");
		return false;
	}
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	var lessonId = queryStringObj.lessonId;
	var lessonName = queryStringObj.lessonName;
	if(lessonId==undefined && lessonName == undefined){
		alertToast("请先输入课程名或选择推荐课程");
		return false;
	}
	if(gradeId == undefined || subjectId == undefined){
		alertToast("gradeId或subjectId为空");
		return false;
	}
	if(lessonId == undefined)
		lessonId = "";
	if(lessonName == undefined)
		lessonName = "";
	//组织classList,不参与sign
	var data="schoolId="+schoolId+"&jid="+jid+"&gradeId="+gradeId+"&subjectId="+subjectId+
			 "&lessonName="+lessonName+"&lessonInfo="+$("#lessonInfo").val()+"&lessonId="+lessonId;
			 //"&classList="+JSON.stringify(classList)+
	getSignCode(data,Config.createLessonUrl().split("?m=")[1],"createLessonSubmitReq");
}
/**
 * 创建班级提交 请求
 */
function createLessonSubmitReq(data){
	//组织classList
	var classList = [];
	//是否已选择分班设置
	if($("[name=fenbanSettingBtn]").attr("class")=="open"){
		var fenbanSettingDivChildren = $("#fenbanSettingDiv").children();
		$.each(fenbanSettingDivChildren, function(i,v) {
			classList.push({classId:$(v).attr("data"),startTime:($(v).find("[name=startDate]").val().replace("T"," ")+":00"),
							endTime:($(v).find("[name=endDate]").val().replace("T"," ")+":00")});
		});
	}else{
		var startDate = $("[name=allDateSettingStart]").val();
		var endDate = $("[name=allDateSettingEnd]").val();
		var selectedClassList = $("#selectClassDiv .hig");
		$.each(selectedClassList, function(i,v) {
			classList.push({classId:$(v).attr("data"),startTime:(startDate.replace("T"," ")+":00"),endTime:(endDate.replace("T"," ")+":00")});
		});
	}
	data +="&classList="+JSON.stringify(classList);
	var paramObj = getParam2Json(data);
	postAjaxJSON(Config.createLessonUrl(),paramObj,function(data){
		if(data && data.result>0){
			data = data.data;
			//教师新建课，建完课以后应该直接跳转到课详情页
			//{"result":1,"msg":"操作成功","data":{"topicId":"-2774657284688","topicName":"沁园春长沙"}}
			gotoTaskList(false,{gradeId:paramObj.gradeId,subjectId:paramObj.subjectId,topicId:data.topicId,title:data.topicName},-3);
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("选择教材错误");
			}
		}
	},function(){
		alertToast("选择教材请求失败");
	});
}
//*************selected_textbooks_set.html js function end ********************************
//*************subject_integration.html js function start ********************************
/**
 * 获取分组积分,获取全班信息,从全班信息中获取是否有分组信息
 * @param {int} isGroup 是否是组信息 1是0否（全班）
 */
function getSubjectPointInfo(isGroup){
	isGroup = isGroup==undefined?0:isGroup;
	var queryStringObj = getQueryStringFromUrl();
//	var gradeId = queryStringObj.gradeId;
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	if(classId == undefined || subjectId == undefined){
		alertToast("classId或subjectId为空");
		return false;
	}
	var data="schoolId="+schoolId+"&jid="+jid+"&subjectId="+subjectId+
			 "&classId="+classId+"&isGroup="+isGroup;
	getSignCode(data,Config.getPointInfoUrl().split("?m=")[1],"getSubjectPointInfoReq");
}
/**
 * 获取分组积分 请求
 * 获取全班信息,从全班信息中获取是否有分组信息
 * @param {Object} data
 */
function getSubjectPointInfoReq(data){
	var param = getParam2Json(data);
	postAjaxJSON(Config.getPointInfoUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(param.isGroup == 0){
				if(data.groupNum){//小组数（暂只需0：无小组,1：有小组）
					$("#changeDetailTab").show().find("ul li").off().on("click",function(){
						var divId = $(this).attr("data");
						if($(this).attr("class")=="selected")
							return false;
						$(this).attr("class","selected").siblings().removeClass("selected");
						$("#"+divId).show().siblings().hide();
						if(divId == "groupPointDiv" && !$("#groupPointDiv").children().length)
							getSubjectPointInfo(1);
					});
				}
				if(!data.rankInfoList.length)
					return false;
				var allClassPointUl = $("#allClassPointDiv ul");
				$.each(data.rankInfoList[0].userRankList, function(i,v) {
					var rankClass = "";//class="one"
					if(v.rankNum == 1){
						rankClass = "class=\"one\"";
					}else if(v.rankNum == 2){
						rankClass = "class=\"two\"";
					}else if(v.rankNum == 3){
						rankClass = "class=\"three\"";
					}
					var li = '<li>'+
							'<span '+rankClass+'>'+(!rankClass?v.rankPoint?v.rankNum:"":"")+'</span>'+
							'<div class="poto">'+
							'	<p>'+
							'		<img src="'+(v.photo?v.photo:webRoot+"/img/teacher/grade/public-head_img_160@2x.png")+'"/>'+	
							'	</p>'+
							(rankClass == "class=\"one\""?'	<span class="crown"></span>':"")+
							'</div>'+
							'<p>'+v.userName+'</p>'+
							'<em>'+v.rankPoint+'</em>'+
							'</li>';
					allClassPointUl.append(li);
				});
			}else{
				var groupPointDiv = $("#groupPointDiv");
				$.each(data.rankInfoList, function(j,k) {
					var ul='<h3 class="small-title">'+k.groupName+'</h3>'+
						   '<ul class="ranking_list">';
					$.each(k.userRankList, function(i,v) {
						var rankClass = "";//class="one"
						if(v.rankNum == 1){
							rankClass = "class=\"one\"";
						}else if(v.rankNum == 2){
							rankClass = "class=\"two\"";
						}else if(v.rankNum == 3){
							rankClass = "class=\"three\"";
						}
						var li = '<li>'+
								'<span '+rankClass+'>'+(!rankClass?v.rankPoint?v.rankNum:"":"")+'</span>'+
								'<div class="poto">'+
								'	<p>'+
								'		<img src="'+(v.photo?v.photo:webRoot+"/img/teacher/grade/public-head_img_160@2x.png")+'"/>'+	
								'	</p>'+
								(rankClass == "class=\"one\""?'	<span class="crown"></span>':"")+
								'</div>'+
								'<p>'+v.userName+'</p>'+
								'<em>'+v.rankPoint+'</em>'+
								'</li>';
						ul+=li;
					});
					ul += '</ul>';
					groupPointDiv.append(ul);
				});
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取分组积分错误");
			}
		}
	},function(){
		alertToast("获取分组积分请求失败");
	});
}
/**
 * 初始化分组积分头信息
 * 头信息从webStoray中获取
 */
function initSubjectPointHeader(){
	var pointInfoListForMyLesson = getLocalStorageItem(webStorageVars[12]);
	if(!pointInfoListForMyLesson){
		alertToast("班级列表为空");
		return false;
	}
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	var rbi = queryStringObj.rbi;//返回层数
	rbi = rbi?(parseInt(rbi)+1):1;
	goBack(-rbi,false);
	pointInfoListForMyLesson = $.parseJSON(pointInfoListForMyLesson);
	var ul = $("#changeClassDiv .changeClassesSubject_con");
	$.each(pointInfoListForMyLesson, function(i,v) {
		var li = '<li  data="'+v.classId+'">'+
				 '		<h2>'+v.className+'</h2>'+
				 '		<p>';
		var as="";
		$.each(v.subjectList, function(j,k) {
			var higClass="";
			if(classId == v.classId && subjectId == k.subjectId)
				higClass="class=\"hig\"";
			as+='<a href="javascript:;" data="'+k.subjectId+'" '+higClass+' >'+subjectsObj[k.subjectId]+'</a>';
		});				 
		li += as+'	</p></li>';
		ul.append(li);
	});
	//监听切换班级
	changeClassListen();
	ul.find("li p a").on("click",function(){
		var title = $(this).parent().prev().text();
		var subjectName = $(this).text();
		var subjectId = $(this).attr("data");
		var classId = $(this).parent().parent().attr("data");
		var queryString = "rbi="+rbi+"&gradeId="+gradeId+"&subjectId="+subjectId+"&classId="+classId;
		changeClassClick();
		if(!isH5Only)
			queryString += "://head?title=["+title+" "+subjectName+",true,changeClassClick,]&"+
						   "rightHandle:[isExist:false]";
		document.location.href="subject_integration.html?"+queryString;
	});
}

//*************subject_integration.html js function end ********************************
//*************courses_detail.html js function start ********************************
/**
 * 获取任务列表
 */
function getTaskList(pageNum){
	if(getLocalStorageItem(webStorageVars[7])=="2" && getLocalStorageItem(webStorageVars[5])=="4983")
		$(".integration").parent().hide();
	var queryStringObj = getQueryStringFromUrl();
	var topicId = queryStringObj.topicId;
	var rbi = queryStringObj.rbi;
	rbi = rbi?rbi:-1;
	goBack(rbi);
	if(topicId == undefined){
		alertToast("topicId为空");
		return false;
	}
	pageNum = pageNum?pageNum:1;
	var data="schoolId="+schoolId+"&jid="+jid+"&topicId="+topicId+
			 "&pageNum="+pageNum;
	getSignCode(data,Config.getTeacherTaskListUrl().split("?m=")[1],"getTaskListReq");
}
/**
 * 获取任务列表 请求
 */
function getTaskListReq(data){
	var param = getParam2Json(data);
	var catchFlag = false;
	postAjaxJSON(Config.getTeacherTaskListUrl(),data,function(data){
		if(data && data.result>0){
			$(".bottomMoreLoading").attr("status","true");//.show();
			if(data.result == 2 || data.result == 3){
				$(".bottomMoreLoading").attr("status","false");//.hide();
				if(data.result == 3)
					return false;
			}
			data = data.data;
			var lessonClassGroupList = {};
			lessonClassGroupList[param.topicId] = data.classList;
			saveLocalStorageItem(webStorageVars[14],lessonClassGroupList);//保存教师任务班级小组列表
			var taskListUl = $("#taskList");
			if(param.pageNum == 1 && !data.taskList.length){
				$(".bottomMoreLoading").attr("status","false");//.hide();
				taskListUl.append('<ul class="list_con"><article class="no_taskes_box">'+
								  '<img src="../../../img/teacher/course/new_task_guide_map@2x.png"/>'+
								  '</article></ul>');
				$(".course_detail").height('auto');
				
				return false;
			}
			currPageNum=parseInt(param.pageNum);// + 1;
			/*
			taskListUl = taskListUl.append("<ul class='list_con'></ul>").find("ul");
			$.each(data.taskList, function(i,v) {
				var li = '<li taskId="'+v.taskId+'" taskType="'+v.taskType+'" taskSubType="'+v.taskSubType+'"'+
						'	isDone="'+v.isDone+'" jspUrl="'+v.jspUrl+'" >'+
						'	<dl>'+
						'		<dt class="'+getTaskTypeClass(v.taskType)+'"></dt>'+
						'		<dd>'+
						'			<h3>'+v.taskName+'</h3>'+
						'			<p>'+
						'				<span>'+v.dateHint+'</span>'+
						'				<span>'+v.scaleHint+'</span>'+
						'			</p>'+
						'		</dd>'+
						'	</dl>'+
						'</li>';
				taskListUl.append(li);
			});
			taskListUl.children().off();
			touch.on(taskListUl.children(), 'tap hold', function(ev){
				var ali = $(ev.currentTarget);
				if(ev.type=="tap"){
					gotoTaskInfo(ev.currentTarget);
				}else if(ev.type=="hold"){
					delPopForCreateLessonShow(ali.attr("taskid"));
				}
			});
			*/
			taskListUl = taskListUl.find(".swiper-wrapper");
			if(touchType == 1)
				taskListUl.html("");
			$.each(data.taskList, function(i,v) {
				var slideHtml = '<div class="swiper-slide list_con_li" taskId="'+v.taskId+'" taskType="'+v.taskType+'" taskSubType="'+v.taskSubType+'"'+
							'	isDone="'+v.isDone+'" jspUrl="'+v.jspUrl+'">'+
				  			'	<dl taskId='+v.taskId+'>'+
							'		<dt class="'+getTaskTypeClass(v.taskType)+'"></dt>'+
							'		<dd>'+
							'			<h3>'+v.taskName+'</h3>'+
							'			<p>'+
							'				<span>'+v.dateHint+'</span>'+
							'				<span>'+v.scaleHint+'</span>'+
							'			</p>'+
							'		</dd>'+
							'	</dl>';
				if(v.taskDescribe){
                    slideHtml+= '<div class="t-taskDescribe"  taskId='+v.taskId+'>'+v.taskDescribe+'</div>';
                    slideHtml+= '<span class="courses-details-arrow"></span>';
				}
                slideHtml += '</div>';
				taskListUl.append(slideHtml);
			});
			//点击按钮查看更多
			// var isShow = false;
            $(".t-taskDescribe").each(function (m,n) {
				var coursesDetailBox = $(this);
				var btn = $(this).next();
                //加了延时器为了在数据渲染完毕高度计算准确
                setTimeout(function () {
                    coursesDetailBox.height()>50?coursesDetailBox.addClass('showMore')&&btn.show().addClass("courses-arrow-down"):null;
                },100);
                btn.off().on('tap',function (event) {
                    event.stopPropagation();
                    if($(this).hasClass("courses-arrow-down")){
                    	$(this).removeClass('courses-arrow-down').addClass("courses-arrow-up")
                        coursesDetailBox.removeClass('showMore')
                    	$(this).parents(".swiper-slide ").siblings().find(".t-taskDescribe").addClass('showMore');
                    	// if($(this).parents(".swiper-slide ").siblings().find(".courses-details-arrow"))
                        $(this).parents(".swiper-slide ").siblings().find(".courses-arrow-up").removeClass("courses-arrow-up").addClass('courses-arrow-down');
					}else if($(this).hasClass("courses-arrow-up")){
                        $(this).removeClass('courses-arrow-up').addClass("courses-arrow-down")
                        coursesDetailBox.addClass('showMore');
					}
                })

            })
			taskListUl.children().off();
			touch.on(taskListUl.children().find("dl,.t-taskDescribe").off(), 'tap hold', function(ev){
			// touch.on(taskListUl.children().off(), 'tap hold', function(ev){
				var ali = $(ev.currentTarget);
				if(ev.type=="tap"){
					gotoTaskInfo(ev.currentTarget);
				}else if(ev.type=="hold"){
					delPopForCreateLessonShow(ali.attr("taskid"));
				}
			});
			touchOutHandle(taskListUpDownHandle);
			$("#taskList .swiper-wrapper").width(($(".course_detail").width()-$(".course_detail").width()*0.04)-15);
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取任务列表错误");
			}
			catchFlag = true;
		}
	},function(){
		catchFlag = true;
		alertToast("获取任务列表请求失败");
	});
	if(catchFlag)
		touchOutHandle(taskListUpDownHandle);
}

/**
 *  任务列表上拉刷新,下拉加载处理
 */
function taskListUpDownHandle(){
	//下拉刷新,上拉加载
	upAndDownSwiperWrapper('.swiper-container',
  			'.topFlushLoading',function(mySwiper){
  				$('.topFlushLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 1;
  				currMySwiper = mySwiper;
  				getTaskList(1);
  			},
  			'.bottomMoreLoading',function(mySwiper){
  				$('.bottomMoreLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 0;
  				currMySwiper = mySwiper;
  				loadingMore4TaskList();
  			});
}

/**
 * 加载更多
 */
function loadingMore4TaskList(){
	getTaskList(currPageNum+1);
}
/**
 * 删除任务提交
 */
function delTaskSubmit(){
	var taskId = $(".delMemberDiv").attr("data");
	if(taskId == undefined){
		alertToast("taskId为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&taskId="+taskId;
	getSignCode(data,Config.delTaskUrl().split("?m=")[1],"delTaskSubmitReq");
}
/**
 * 删除任务提交 请求
 */
function delTaskSubmitReq(data){
	postAjaxJSON(Config.delTaskUrl(),data,function(data){
		if(data && data.result>0){
			delPopForCreateLessonClose();
			document.location.reload();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("删除任务错误");
			}
		}
	},function(){
		alertToast("删除任务请求失败");
	});
}
/**
 * 通过taskType获取task图标样式
 */
function getTaskTypeClass(taskType){
	if(taskType == 1)
		return "learningResources";
	if(taskType == 2)
		return "talk";
	if(taskType == 3)
		return "blanks";
	if(taskType == 4)
		return "test";
	if(taskType == 5)
		return "independent_test";
	if(taskType == 6)
		return "micro_class";
	if(taskType == 7)
		return "live_class";
	if(taskType == 8)
		return "task";
}
/**
 * 跳转到任务详情
 * @param {Object} t
 */
function gotoTaskInfo(t){
	var taskId=$(t).attr("taskId");
	console.log(taskId)
	currClickTask = $(t).parents(".list_con_li");
	/*
	var classList = getLocalStorageItem(webStorageVars[14]);
	if(classList && classList!='undefined'){
		classList=$.parseJSON(classList)[lessonId];
	}else{
		classList="";
	}
	classList = JSON.stringify(classList);
	document.location.href="://taskDetail?taskId="+taskId+"&taskType="+taskType+
							"&taskSubtype="+taskSubtype+"&jspUrl="+jspUrl+"&classList="+classList+
							"&isDone="+isDone;
	*/
	getClassListByTask(taskId,"getClassListByTaskForTaskDetailReq");
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
function getClassListByTaskForTaskDetailReq(data){
	postSynoAjaxJSON(Config.getClassListByTaskUrl(),data,function(data){
		if(data && data.result>0){
			classList = data.data.classList;
			console.log(currClickTask)
			if(!currClickTask) return false;
			var queryStringObj = getQueryStringFromUrl();
			var lessonId = queryStringObj.topicId;
			var taskId=currClickTask.attr("taskId");
			var taskType=currClickTask.attr("taskType");
			var taskSubtype=currClickTask.attr("taskSubtype");
			var jspUrl=currClickTask.attr("jspUrl");
			var isDone = currClickTask.attr("isDone");
			jspUrl=jspUrl?encodeURIComponent(encodeURIComponent(encodeURIComponent(jspUrl))):"";
			var classList = JSON.stringify(classList);
			currClickTask = undefined;
			var redirctUrl ="://taskDetail?taskId="+taskId+"&taskType="+taskType+
					"&taskSubtype="+taskSubtype+"&jspUrl="+jspUrl+"&classList="+classList+
					"&isDone="+isDone;
//			document.location.href=redirctUrl;
			sendMsg2iOS(redirctUrl);
			//解决短双(停顿)击,导致触发hold事件,打开弹出层问题
			setTimeout(function(){
               delPopForCreateLessonClose();
            },999);
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

/**
 * 通过任务获取班级列表 请求
 */
function getClassListByTaskReq(data){
	postAjaxJSON(Config.getClassListByTaskUrl(),data,function(data){
		if(data && data.result>0){
			
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

/**
 * 跳转到分享课
 * @param {Object} t
 */
function gotoTaskShare(){
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.topicId;
	if(lessonId == undefined){
		alertToast("lessonId为空");
		return false;
	}
	textbookChangePopToggle();
	var queryString = "lessonId="+lessonId;
	if(!isH5Only)
		queryString += "://head?title=[分享课,false,,]&"+
					   "rightHandle:[isExist:false]";
	document.location.href="share_lesson.html?"+queryString;
}
/**
 * 跳转到创建任务选择列表
 * @param {Object} t
 */
function gotoCreateTaskSelect(){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	var lessonId = queryStringObj.topicId;
	if(gradeId == undefined|| subjectId == undefined ||lessonId == undefined){
		alertToast("gradeId,subjectId或lessonId为空");
		return false;
	}
    var queryString="lessonId="+lessonId+"&gradeId="+gradeId+
			 "&subjectId="+subjectId;
	if(!isH5Only)// title 
		queryString += "://head?title=[选择任务类型,false,,]&"+
					   "rightHandle:[isExist:false]";
	document.location.href="tasks_select.html?"+queryString;
}
/**
 * 跳转到课积分页面
 */
function gotoLessonPointList(){
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.topicId;
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	if(gradeId==undefined || subjectId == undefined || lessonId == undefined){
		alertToast("gradeId,subjectId或lessonId为空");
		return false;
	}
	textbookChangePopToggle();
	var data="jid="+jid+"&schoolId="+schoolId+"&gradeId="+gradeId+"&subjectId="+subjectId+
			 "&lessonId="+lessonId;
	getSignCode(data,Config.getLessonPointListUrl().split("?m=")[1],"getLessonPointListReq");
}
/**
 * 获取课程积分列表请求
 */
function getLessonPointListReq(data){
	var param = getParam2Json(data);
	postAjaxJSON(Config.getLessonPointListUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(!data.classList.length){
				alertToast("无班级信息");
				return false;
			}
			saveLocalStorageItem(webStorageVars[13],data.classList);
			var isShowArrow = false;
			if(data.classList.length > 1)
				isShowArrow = true;
			var title = data.classList[0].className;
			var classId = data.classList[0].classId;
			//保存分组积分信息为webStoray变量,同时跳转到分组积分信息页
			var queryString = "gradeId="+param.gradeId+"&subjectId="+param.subjectId+"&classId="+classId+
							  "&lessonId="+param.lessonId;
			if(!isH5Only)//
				queryString += "://head?title=["+title+","+isShowArrow+","+(isShowArrow?"changeClassClick":"")+",]&"+
							   "rightHandle:[isExist:false]";
			document.location.href="lesson_integration.html?"+queryString;
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取课程积分列表错误");
			}
		}
	},function(){
		alertToast("获取课程积分列表请求失败");
	});
}
//*************courses_detail.html js function end ********************************
//*************share_lesson.html js function start ********************************
/**
 * 初始化分享设置
 */
function initShareSet(){
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
	if(lessonId == undefined){
		alertToast("lessonId为空");
		return false;
	}
	//为分享设置添加点击事件
	$("#shareLessonSetDiv a").on("click",function(){
		shareLessonSubmit($(this).attr("data"));
	});
	var data="jid="+jid+"&schoolId="+schoolId+"&lessonId="+lessonId;
	getSignCode(data,Config.getLessonStateUrl().split("?m=")[1],"initShareSetReq");
}
/**
 * 初始化分享设置请求
 */
function initShareSetReq(data){
	postAjaxJSON(Config.getLessonStateUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			$("#shareLessonSetDiv").find("[data="+data.shareType+"]").addClass("hig");
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取分享设置错误");
			}
		}
	},function(){
		alertToast("获取分享设置请求失败");
	});
}
/**
 * 分享设置
 */
function shareLessonSubmit(shareType){
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
	if(lessonId == undefined || shareType == undefined){
		alertToast("lessonId或shareType为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&lessonId="+lessonId+
			 "&shareType="+shareType;
	getSignCode(data,Config.shareLessonUrl().split("?m=")[1],"shareLessonSubmitReq");
}
/**
 * 分享设置请求
 */
function shareLessonSubmitReq(data){
	postAjaxJSON(Config.shareLessonUrl(),data,function(data){
		if(data && data.result>0){
			document.location.reload();
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("分享设置错误");
			}
		}
	},function(){
		alertToast("分享设置请求失败");
	});
}
//*************share_lesson.html js function end ********************************
//*************lesson_integration.html js function start ********************************
/**
 * 初始化分组积分头信息
 * 头信息从webStoray中获取
 */
function initLessonPointHeader(){
	var pointInfoListForMyLesson = getLocalStorageItem(webStorageVars[13]);
	if(!pointInfoListForMyLesson){
		alertToast("班级列表为空");
		return false;
	}
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	var lessonId = queryStringObj.lessonId;
	var rbi = queryStringObj.rbi;//返回层数
	rbi = rbi?(parseInt(rbi)+1):1;
	goBack(-rbi,false);
	pointInfoListForMyLesson = $.parseJSON(pointInfoListForMyLesson);
	var ul = $("#changeClassDiv ul");
	$.each(pointInfoListForMyLesson, function(i,v) {
		//gradeId="'+gradeId+'" subjectId="'+subjectId+'" lessonId="'+lessonId+'" 
		var li = '<li classId="'+v.classId+'" >'+
				 '	<span class="space '+(classId == v.classId?'hover':"")+'"></span>'+
				 '	<span class="f36_2 text">'+v.className+'</span>'+
				 '</li>';
		ul.append(li);
	});
	//监听切换班级
	changeClassListen();
	ul.find("li").on("click",function(){
		var title = $(this).text();
//		var subjectId = $(this).attr("subjectId");
		var classId = $(this).attr("classId");
		var queryString = "rbi="+rbi+"&gradeId="+gradeId+"&subjectId="+subjectId+"&classId="+classId+
						  "&lessonId="+lessonId;
		changeClassClick();
		if(!isH5Only)//
			queryString += "://head?title=["+title+",true,changeClassClick,]&"+
						   "rightHandle:[isExist:false]";
		document.location.href="lesson_integration.html?"+queryString;
	});
}

/**
 * 获取课积分,获取全班信息,从全班信息中获取是否有分组信息
 * @param {int} isGroup 是否是组信息 1是0否（全班）
 */
function getLessonPointInfo(isGroup){
	isGroup = isGroup==undefined?0:isGroup;
	var queryStringObj = getQueryStringFromUrl();
//	var gradeId = queryStringObj.gradeId;
	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	var lessonId = queryStringObj.lessonId;
	if(classId == undefined || subjectId == undefined || lessonId == undefined){
		alertToast("classId,subjectId或lessonId为空");
		return false;
	}
	var data="schoolId="+schoolId+"&jid="+jid+"&subjectId="+subjectId+
			 "&classId="+classId+"&isGroup="+isGroup+"&lessonId="+lessonId;
	getSignCode(data,Config.getLessonPointInfoUrl().split("?m=")[1],"getLessonPointInfoReq");
}
/**
 * 获取课积分 请求
 * 获取全班信息,从全班信息中获取是否有分组信息
 * @param {Object} data
 */
function getLessonPointInfoReq(data){
	var param = getParam2Json(data);
	postAjaxJSON(Config.getLessonPointInfoUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(!data.rankInfoList.length)
					return false;
			if(!data.groupNum){//小组数（暂只需0：无小组,1：有小组）
				$("#allClassPointDiv").show();
				var allClassPointUl = $("#allClassPointDiv ul");
				$.each(data.rankInfoList[0].userRankList, function(i,v) {
					var rankClass = "";//class="one"
					if(v.rankNum == 1){
						rankClass = "class=\"one\"";
					}else if(v.rankNum == 2){
						rankClass = "class=\"two\"";
					}else if(v.rankNum == 3){
						rankClass = "class=\"three\"";
					}
					var li = '<li>'+
							'<span '+rankClass+'>'+(!rankClass?v.rankPoint?v.rankNum:"":"")+'</span>'+
							'<div class="poto">'+
							'	<p>'+
							'		<img src="'+(v.photo?v.photo:webRoot+"/img/teacher/grade/public-head_img_160@2x.png")+'"/>'+	
							'	</p>'+
							(rankClass == "class=\"one\""?'	<span class="crown"></span>':"")+
							'</div>'+
							'<p>'+v.userName+'</p>'+
							'<em>'+v.rankPoint+'</em>'+
							'</li>';
					allClassPointUl.append(li);
				});
			}else{
				$("#groupPointDiv").show();
				var groupPointDiv = $("#groupPointDiv");
				$.each(data.rankInfoList, function(j,k) {
					var ul='<h3 class="small-title">'+k.groupName+'</h3>'+
						   '<ul class="ranking_list">';
					$.each(k.userRankList, function(i,v) {
						var rankClass = "";//class="one"
						if(v.rankNum == 1){
							rankClass = "class=\"one\"";
						}else if(v.rankNum == 2){
							rankClass = "class=\"two\"";
						}else if(v.rankNum == 3){
							rankClass = "class=\"three\"";
						}
						var li = '<li>'+
								'<span '+rankClass+'>'+(!rankClass?v.rankPoint?v.rankNum:"":"")+'</span>'+
								'<div class="poto">'+
								'	<p>'+
								'		<img src="'+(v.photo?v.photo:webRoot+"/img/teacher/grade/public-head_img_160@2x.png")+'"/>'+	
								'	</p>'+
								(rankClass == "class=\"one\""?'	<span class="crown"></span>':"")+
								'</div>'+
								'<p>'+v.userName+'</p>'+
								'<em>'+v.rankPoint+'</em>'+
								'</li>';
						ul+=li;
					});
					ul += '</ul>';
					groupPointDiv.append(ul);
				});
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取课积分错误");
			}
		}
	},function(){
		alertToast("获取课积分请求失败");
	});
}
//*************lesson_integration.html js function end ********************************
//*************tasks_select.html js function start ********************************
/**
 * 跳转到发布微课程 
 */
function gotoMicroVideoSelectList(){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
//	var classId = queryStringObj.classId;
	var subjectId = queryStringObj.subjectId;
	var lessonId = queryStringObj.lessonId;
	if(gradeId ==undefined || subjectId ==undefined || lessonId ==undefined){
		alertToast("gradeId,subjectId或lessonId为空");
		return false;
	}
	var queryString = "lessonId="+lessonId+"&gradeId="+gradeId+"&subjectId="+subjectId;
	if(!isH5Only)//
		queryString += "://head?title=[选择微视频,false,,]&"+
					   "rightHandle:[isExist:false]";
	document.location.href="tasks_select_video.html?"+queryString;
}
//*************tasks_select.html js function end ********************************
//*************tasks_select_video.html js function start ********************************
/**
 * 获取视频推荐信息
 */
function getVideoTaskRecommendInfo(){
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
    var data="schoolId="+schoolId+"&jid="+jid+
			 "&lessonId="+lessonId;
	getSignCode(data,Config.getVideoTaskRecommendUrl().split("?m=")[1],"getVideoTaskRecommendInfoReq");
}
/**
 * 获取视频推荐信息请求
 */
function getVideoTaskRecommendInfoReq(data){
//	var param = getParam2Json(data);
	postAjaxJSON(Config.getVideoTaskRecommendUrl(),data,function(data){
		if(data && data.result>0){
			$("#gotoSearchDiv").show();
			if(data.result==2)
				return false;
			data = data.data;
			recommendVideoList = data.videoList;
			if(data.videoList && data.videoList.length)
				drowVideoListDiv(data.videoList);
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取视频推荐信息错误");
			}
		}
	},function(){
		alertToast("获取视频推荐信息失败");
	});
}
/**
 * 获取视频搜索信息
 * @param {Boolean} isMore 是否为加载更多请求
 */
function searchTaskVideoList(pageNum,isSearchBtnClick){
	var searchKey = $("#seachKey").val();
	if(!searchKey.trim()){
		//drowVideoListDivForSearch(recommendVideoList);
		return false;
	}
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
	var subjectId = queryStringObj.subjectId;
	var gradeId = queryStringObj.gradeId;
	if(gradeId==undefined || subjectId == undefined  || lessonId == undefined){
		alertToast("gradeId,subjectId或lessonId为空");
		return false;
	}
	pageNum = pageNum?pageNum:1;
    var data="schoolId="+schoolId+"&jid="+jid+"&gradeId="+gradeId+"&subjectId="+subjectId+
    		"&searchKey="+searchKey+"&pageNum="+pageNum;
//			"&lessonId="+lessonId;
	if(isSearchBtnClick){
//		$("#viewListUl .swiper-wrapper").html("").css("transform","translate3d(0px,0px,0px)").parent().attr("style","padding:0!important");
		try{
		if(currMySwiper)
			currMySwiper.destroy();
		}catch(e){};
		setTimeout(function(){
			getSignCode(data,Config.searchTaskVideoUrl().split("?m=")[1],"searchTaskVideoListReq");
		},500);
	}else{
		getSignCode(data,Config.searchTaskVideoUrl().split("?m=")[1],"searchTaskVideoListReq");
	}
}
/**
 * 获取视频搜索信息请求
 */
function searchTaskVideoListReq(data){
	var param = getParam2Json(data);
	var catchFlag = false;
	postAjaxJSON(Config.searchTaskVideoUrl(),data,function(data){
		if(data && data.result>0){
			if(data.result == 3 || data.result == 2){
				$(".bottomMoreLoading").attr("status","false");//.hide();
			}else{
				$(".bottomMoreLoading").attr("status","true");//.show();
			}
			data = data.data;
			currPageNum = parseInt(param.pageNum);
			if(data.videoList && data.videoList.length){
				drowVideoListDivForSearch(data.videoList);
				touchOutHandle(searchVideoListUpDownHandle());
//				setTimeout(function(){$("#viewListUl").removeAttr("style").animate({"padding":"10 4%"})},100);
			}
			if(param.pageNum == 1 && (!data.videoList || !data.videoList.length)){
				if(!$("#noDataTipDiv").length)
					$("#viewListUl .swiper-wrapper").hide().after('<div id="noDataTipDiv" style="text-align: center;color: #666666;font-size: 14px;">没有找到相关记录</div>');
			}else{
				$("#noDataTipDiv").remove();
			}
		}else{
			catchFlag = true;
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取视频推荐信息错误");
			}
		}
	},function(){
		catchFlag = true;
		alertToast("获取视频推荐信息失败");
	});
	if(catchFlag)
		touchOutHandle(searchVideoListUpDownHandle);
}
/**
 *  班级列表上拉刷新,下拉加载处理
 */
function searchVideoListUpDownHandle(onSwiperCreatedFn){
	//下拉刷新,上拉加载
	upAndDownSwiperWrapper('.swiper-container',
  			'.topFlushLoading',function(mySwiper){
  				$('.topFlushLoading').addClass('visible');
  			},function(mySwiper){
				touchType = 1;
				currMySwiper = mySwiper;
//				searchTaskVideoList();
				mySwiper.params.onlyExternal=false;
  			},
  			'.bottomMoreLoading',function(mySwiper){
  				$('.bottomMoreLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 0;
  				currMySwiper = mySwiper;
  				loadingMore4VideoList();//方法中调用releaseUpFlushWrapper(mySwiper,'.bottomMoreLoading');
  			},onSwiperCreatedFn);
}

/**
 * 组织视频列表
 * @param {Array} videoList
 */
function drowVideoListDivForSearch(videoList){
	var viewListUl = $("#viewListUl .swiper-wrapper");
	var subHtml = "";
	if(touchType == 1 && currMySwiper)
		viewListUl.html("");
	$.each(videoList, function(i,v) {
		var divLi = '<div class="divLi" videoId="'+v.videoId+'" >'+//ontouchstart="gotoVideoView(this)"
			  		'		<div class="video_con">'+
					'			<img src="'+v.videoPic+'" style="width: 100%; height: auto;" onload="fixWidthHeight(this)"/>'+
					'		</div>'+
					'		<p>'+v.videoTitle+'</p>'+
		  			'	</div>';
		if(viewListUl.find(".swiper-slide").last().children().length == 0||viewListUl.find(".swiper-slide").last().children().length == 2)
			viewListUl.append('<div class="swiper-slide">');
		viewListUl.find(".swiper-slide").last().append(divLi);
	});
//	var oneImg = $(".swiper-slide img")[0];
//	$(".swiper-slide img").css({"width":oneImg.width(),"height":oneImg.height()});
	touch.on($(".swiper-slide .divLi").off(), 'tap', function(ev){
//		var ali = $(ev.currentTarget);
		gotoVideoView(ev.currentTarget);
	});
}
function fixWidthHeight(t){
	$(t).css({"width":$(t).width(),"height":$(t).height()});
}
/**
 * 组织视频列表
 * @param {Array} videoList
 */
function drowVideoListDiv(videoList){
	var viewListUl = $("#viewListUl");
	$.each(videoList, function(i,v) {
		var liHtml = '<li videoId="'+v.videoId+'">'+//ontouchstart="gotoVideoView(this)"
					 '	<div class="video_con">'+
					 '		<img src="'+v.videoPic+'" style="width: 100%; height: auto;"/>'+
					 '	</div>'+
					 '	<p>'+v.videoTitle+'</p>'+
					 '</li>';
		viewListUl.append(liHtml);
	});
	touch.on($("#viewListUl").children().off(), 'tap', function(ev){
		gotoVideoView(ev.currentTarget);
	});
}

/**
 * 跳转到视频查询页面
 */
function gotoVideoSearch(){
	var queryStringObj = getQueryStringFromUrl();
	var gradeId = queryStringObj.gradeId;
	var subjectId = queryStringObj.subjectId;
	var lessonId = queryStringObj.lessonId;
	if(gradeId ==undefined || subjectId ==undefined || lessonId ==undefined){
		alertToast("gradeId,subjectId或lessonId为空");
		return false;
	}
	var queryString = "lessonId="+lessonId+"&gradeId="+gradeId+"&subjectId="+subjectId;
	if(!isH5Only)//
		queryString += "://head?title=[,false,,]&"+
					   "rightHandle:[isExist:false]&"+
					   "isShow=false";
	document.location.href="tasks_select_video_search.html?"+queryString;
}

/**
 * 加载更多 
 */
function loadingMore4VideoList(){
	searchTaskVideoList(currPageNum+1);
}
/**
 * 跳转到视频预览画面
 */
function gotoVideoView(t){
	var videoId = $(t).attr("videoId");
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
	var subjectId = queryStringObj.subjectId;
	var gradeId = queryStringObj.gradeId;
	if(gradeId==undefined || subjectId == undefined  || lessonId == undefined || videoId == undefined){
		alertToast("gradeId,subjectId,lessonId或videoId为空");
		return false;
	}
	var queryString = "lessonId="+lessonId+"&gradeId="+gradeId+"&subjectId="+subjectId+
					  "&videoId="+videoId;
	if(!isH5Only)//
		queryString += "://head?title=[,false,,]&"+
					   "rightHandle:[isExist:false]&isShow=false";
	document.location.href="tasks_select_video_detail.html?"+queryString;
}
//*************tasks_select_video.html js function end ********************************
//*************tasks_select_video_detail.html js function start ********************************
/**
 * 获取视频信息
 */
function getVideoInfo(data){
	var queryStringObj = getQueryStringFromUrl();
	var videoId = queryStringObj.videoId;
	if(videoId==undefined ){
		alertToast("videoId为空");
		return false;
	}
    var data="schoolId="+schoolId+"&jid="+jid+"&videoId="+videoId;
	getSignCode(data,Config.getTaskVideoUrl().split("?m=")[1],"getVideoInfoReq");
}
/**
 * 获取视频信息请求
 */
function getVideoInfoReq(data){
	var param = getParam2Json(data);
	postAjaxJSON(Config.getTaskVideoUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			$("[name=video]").attr("poster",data.videoPic).attr("src",data.videoUrl);
			$("[name=videoTitle]").text(data.videoTitle);
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取视频信息错误");
			}
		}
	},function(){
		alertToast("获取视频信息请求失败");
	});
}
/**
 * 跳转到视频发布页面
 */
function gotoTaskVidePublish(){
	var video = $("video")[0];
	if(video && !video.paused)
		video.pause();
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
	var subjectId = queryStringObj.subjectId;
	var gradeId = queryStringObj.gradeId;
	var videoId = queryStringObj.videoId;
	if(gradeId==undefined || subjectId == undefined  || lessonId == undefined || videoId == undefined){
		alertToast("gradeId,subjectId,lessonId或videoId为空");
		return false;
	}
	var queryString = "lessonId="+lessonId+"&gradeId="+gradeId+"&subjectId="+subjectId+
					  "&videoId="+videoId;
	if(!isH5Only)//
		queryString += "://head?title=[发布,false,,]&"+
					   "rightHandle:[isExist:true,type:type2,value:[[完成,publishSubmit,1]]]";
	document.location.href="tasks_select_video_publishing.html?"+queryString;
}
//*************tasks_select_video_detail.html js function end ********************************
//*************tasks_select_video_publishing.html js function start ********************************
/**
 * 初始化 班级小组列表
 */
function initClassGroupList(){
	var lessonClassGroupList = getLocalStorageItem(webStorageVars[14]);
	lessonClassGroupList = lessonClassGroupList?$.parseJSON(lessonClassGroupList):undefined;
	if(!lessonClassGroupList)
		return false;
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
	var classGroupList = lessonClassGroupList[lessonId];
	if(!classGroupList)
		return false;
	var classGroupUl = $("#classGroupUl");
	$.each(classGroupList, function(i,v) {
		var liHtml ='<li>'+
					'<div class="class">'+
					'	<span class="hig" selected="selected" classId="'+v.classId+'"></span>'+//class="hig",有成员选中时添加 selected = selected;
					'	<p>'+v.className+'</p>'+
					'</div>';
		if(v.groupList && v.groupList.length){
			var liUl = '<ul class="group">';
			$.each(v.groupList, function(j,k) {
			    var liUlLi='<li>'+
						   '	<span class="hig" groupId="'+k.groupId+'"></span>'+
					       '	<p>'+k.groupName+'</p>'+
						   '</li>';
				liUl+=liUlLi;
			});
			liHtml+=liUl+'</ul>';
		}
		liHtml+='</li>';
		classGroupUl.append(liHtml);
	});
	selectClassGroupToggleListen();
}
/**
 * 选择小组年级操作
 */
function selectClassGroupToggleListen(){
	var classGroupUl = $("#classGroupUl");
	var fenbanSettingBtn = $("[name=fenbanSettingBtn]");
	//年级选择,选择则小组全选,不选择则小组全不选
	classGroupUl.find(".class").on("click",function(){
		var span = $(this).find("span");
		if(span.attr("class")=="hig"){
			span.removeAttr("class").removeAttr("selected").parent().next().find("span").removeAttr("class");
			if(fenbanSettingBtn.attr("class")=="open"){
				$("#fenbanSettingDiv").find("[data="+span.attr("classId")+"]").remove();
				if(!$("#classGroupUl div span[selected=selected]").length)
					fenbanSettingToggle(fenbanSettingBtn[0]);
			}
		}else{
			span.attr("Class","hig").attr("selected","selected").parent().next().find("span").attr("class","hig");
			if($("[name=fenbanSettingBtn]").attr("class")=="open"){
				var startDate = $("[name=allDateSettingStart]").val();
				var endDate = $("[name=allDateSettingEnd]").val();
				$("#fenbanSettingDiv").append(getDateTimeSettingDiv(span.attr("classId"),span.parent().text(),startDate,endDate,"date_set_box"));
			}
		}
	});
	
	//小组选择,全选则年级也选择,非全选则年级不选择
	classGroupUl.find(".group li").on("click",function(){
		var span = $(this).find("span");
		var spParent = span.parent().parent();
		if(span.attr("class")=="hig"){
			span.removeAttr("class");
			spParent.prev().find("span").removeAttr("class");
			if(!spParent.find("span.hig").length)
				spParent.prev().find("span").removeAttr("selected");
			if(fenbanSettingBtn.attr("class")=="open"){
				$("#fenbanSettingDiv").find("[data="+span.attr("data")+"]").remove();
				if(!$("#classGroupUl div span[selected=selected]").length)
					fenbanSettingToggle(fenbanSettingBtn[0]);
			}
		}else{
			span.attr("class","hig");
			spParent.prev().find("span").attr("selected","selected");
			if(spParent.children().length == spParent.find("span.hig").length)
				spParent.prev().find("span").attr("class","hig");
			if(!$("#fenbanSettingDiv [data="+spParent.prev().find("span").attr("classId")+"]").length)
				if($("[name=fenbanSettingBtn]").attr("class")=="open"){
					var startDate = $("[name=allDateSettingStart]").val();
					var endDate = $("[name=allDateSettingEnd]").val();
					$("#fenbanSettingDiv").append(getDateTimeSettingDiv(spParent.prev().find("span").attr("classId"),spParent.prev().text(),startDate,endDate,"date_set_box"));
				}
		}
	});
}
/**
 * 发布任务分班设置
 */
function fenbanSetting4Publish(t){
	var selectedClassList = $("#classGroupUl div span[selected=selected]");
	if(!selectedClassList.length && $("[name=fenbanSettingBtn]").attr("class")!="open")
		return false;
	var fenbanSettingDiv = $("#fenbanSettingDiv");
	if($(t).attr("class")=="open"){
		$(t).removeAttr("class").text("分班设置");
		$("#allDateSettingDiv").show();
		fenbanSettingDiv.html("");
	}else{
		$(t).attr("class","open").text("取消分班设置");
		$("#allDateSettingDiv").hide();
		var startDate = $("[name=allDateSettingStart]").val();
		var endDate = $("[name=allDateSettingEnd]").val();
		$.each(selectedClassList, function(i,v) {
			fenbanSettingDiv.append(getDateTimeSettingDiv($(v).attr("classId"),$(v).parent().text(),startDate,endDate,"date_set_box"));
		});
	}
}
/**
 * 发布提交
 * @param {int} type 1:微视频 2: 3:一般任务
 * @param {String} resourceList {resourceList:[resourceType:resourceType, resourceUrl:resourceUrl,  voiceTime:voiceTime}]
 * 
 */
function publishSubmit(type,title,content,analysisContent,resourceList){
	var selectedClassList = $("#classGroupUl div span[selected=selected]");
	if(!selectedClassList.length){
		alertToast("您至少要选择一个班级");
		reqEnd();
		return false;
	}
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
	var subjectId = queryStringObj.subjectId;
	var gradeId = queryStringObj.gradeId;
	var pagerId = queryStringObj.pagerId;
	
	if(gradeId==undefined || subjectId == undefined  || lessonId == undefined){
		alertToast("gradeId,subjectId或lessonId");
		reqEnd();
		return false;
	}
	if(!type){
		alertToast("发布类型为空");
		reqEnd();
		return false;
	}
    var data="schoolId="+schoolId+"&jid="+jid+"&gradeId="+gradeId+
      		 "&subjectId="+subjectId+"&lessonId="+lessonId+"&type="+type;
    if(type==1){//微视频
    	var videoId = queryStringObj.videoId;
    	if(videoId == undefined){
    		alertToast("videoId为空");
    		reqEnd();
    		return false;
    	}
    	data += "&videoId="+videoId;
    }else if(type==2){//测验
		var paperName = $("#paperName").val();
		if(!paperName){
			alertToast("试卷名称不能为空");
			reqEnd();
			return false;
		}
		var paperUseTime = $("#paperUseTime").val();
    	data += "&pagerId="+pagerId+"&pagerTime="+paperUseTime+"&pagerTitle="+paperName;
    }else if(type==3){//一般任务
    	//同type == 1 
    	//将信息保存到webstorage中 content,analysisContent,resourceList
    	if(!title){
    		alertToast("一般任务标题不能为空");
    		reqEnd();
    		return false;
    	}
    	if(!content && !resourceList){
    		content = "如题";
    	}else if(!content){
    		content = "如下";
    	}else{
    		content = decodeURIComponent(content);
    	}
    	if(analysisContent){
    		analysisContent = decodeURIComponent(analysisContent);
    	}
    	saveLocalStorageItem(webStorageVars[15],{"taskTitle":title,"taskContent":content,"taskAnalytical":analysisContent,"resourceList":resourceList});
    }
	getSignCode(data,Config.pushTaskUrl().split("?m=")[1],"publishSubmitReq");
}
function reqEnd(){
	onLoaded();
	sendMsg2iOS("://loadingEnd");
}
/**
 * 发布提交请求
 */
function publishSubmitReq(data){
	var param = getParam2Json(data);
	//获取选中任务时间列表
	var classList = [];
	if($("[name=fenbanSettingBtn]").attr("class")=="open"){
		var fenbanSettingDivChildren = $("#fenbanSettingDiv").children();
		$.each(fenbanSettingDivChildren, function(i,v) {
			classListHandle($(v).attr("data"),$(v).find("[name=startDate]").val(),$(v).find("[name=endDate]").val());
		});
	}else{
		//groupId	 	String	小组id	否	否	若不为空，则该任务属于小组
		var startDate = $("[name=allDateSettingStart]").val();
		var endDate = $("[name=allDateSettingEnd]").val();
		var selectedClassList = $("#classGroupUl div span[selected=selected]");
		//判断是否有group
		$.each(selectedClassList, function(i,v) {
			//classList.push({classId:$(v).attr("classId"),startTime:(startDate.replace("T"," ")+":00"),endTime:(endDate.replace("T"," ")+":00")});
			classListHandle($(v).attr("classId"),startDate,endDate);
		});
	}
	/**
	 * classList处理
	 */
	function classListHandle(classId,startDate,endDate){
		//判断是否有group
		var selectDiv =  $("#classGroupUl div:has([classId="+classId+"])");
		var selectDivChildren = selectDiv.next().children();
		if(selectDivChildren.length == selectDivChildren.find("span.hig").length){
			classList.push({classId:classId,startTime:(startDate.replace("T"," ")+":00"),
							endTime:(endDate.replace("T"," ")+":00")});
		}else{
			$.each(selectDivChildren.find("span.hig"), function(j,k) {
				classList.push({classId:classId,startTime:(startDate.replace("T"," ")+":00"),
							endTime:(endDate.replace("T"," ")+":00"),
							groupId:$(k).attr("groupId")});
			});
		}
	}
	if(param.type==3){
		var taskInfo= getLocalStorageItem(webStorageVars[15])//{"taskTitle":'',"taskContent":'',"taskAnalysis":'',"resourceList",""}
		if(!taskInfo){
			alertToast("信息错误");
			return false;
		}
		data+="&taskBody="+taskInfo;
	}
	data +="&classList="+JSON.stringify(classList);
	postAjaxJSON(Config.pushTaskUrl(),data,function(data){
		sendMsg2iOS("://loadingEnd");
		if(data && data.result>0){
			removeLocalStorageItem(webStorageVars[15]);
			if(param.type==3){
				goBackNow();
			}else{
				goBackNow(-4);
			}
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("发布错误");
			}
		}
	},function(){
		sendMsg2iOS("://loadingEnd");
		alertToast("发布请求失败");
	});
}
//*************tasks_select_video_publishing.html js function end ********************************
//*************take_poto_subjct.html js function start ********************************
function initPhotoSubjectPage(){
	initQuestionType();
	initQuestionImgInfo();
	initAnswerImgInfo();
	difficultyChangeHandleListen();
	quetionTypeChangeHandleListen();
}
/**
 * 初始化问题图片
 */
function initQuestionImgInfo(){
	var saveInfo = getLocalStorageItem(webStorageVars[16]);
	var addQuestionImg = $("#addQuestionPicSpan");
	if(saveInfo){
		saveInfo = $.parseJSON(saveInfo);
		var imgData = saveInfo["task_0"];
		if(!imgData || !imgData.imgData)
			return false;
		var imgShow = '<div class="subject_poto">'+
						'	<img id="questionImg" src="'+imgData.imgData+'" onload="loadSubjectImgDelBtnHandle(this)"/>'+
						'	<a href="javascript:;" class="del_icon tm_display_no"></a>'+
						'</div>';
		imgShow = $(imgShow);
		imgShow.find(".del_icon").off().on("click",function(){
			removeImg4TakePhoto(this,0);
		});
		addQuestionImg.hide().parent().append(imgShow);
		touch.on($("#questionImg").off(),'tap',function(ev){
			//			onclick="imgViewShow(\''+imgData.imgData+'\')"
			imgViewShow(imgData.imgData);
		});
	}
}
/**
 * 初始化解析图片
 */
function initAnswerImgInfo(){
	var saveInfo = getLocalStorageItem(webStorageVars[16]);
	var answerImg = $("#answerPicSpan");
	if(saveInfo){
		saveInfo = $.parseJSON(saveInfo);
		var imgData = saveInfo["task_1"];
		if(!imgData || !imgData.imgData)
			return false;
		var imgShow = '<div class="subject_poto">'+
						'	<img id="answerImg" src="'+imgData.imgData+'" onload="loadSubjectImgDelBtnHandle(this)"/>'+
						'	<a href="javascript:;" class="del_icon" style="display:none;"></a>'+
						'</div>';
		imgShow = $(imgShow);
		imgShow.find(".del_icon").off().on("click",function(){
			removeImg4TakePhoto(this,1);
		});
		answerImg.show().parent().append(imgShow);
		touch.on($("#answerImg").off(),'tap',function(ev){
			//			onclick="imgViewShow(\''+imgData.imgData+'\')"
			imgViewShow(imgData.imgData);
		});
		$("#jiexiBtn").hide();
	}
}

/**
 * 拍照出题中,图片加载后删除按钮处理
 */
function loadSubjectImgDelBtnHandle(t){
	var $this = $(t);
	if($this.width()<=96){
		$this.next().addClass("smallImg");
	}else if(($this.width()+33) >= $this.parent().width()){
		$this.next().addClass("fullImg");
	}
	$this.next().css("display","inline-block");
}

/**
 * 移除图片
 * targetType : 目标类型 0(题目),1(解析)
 */
function removeImg4TakePhoto(t,targetType){
	$(t).parent().prev().show();
	$(t).parent().remove();
	removeCropImgTempInfo(targetType);
	sendMsg2iOS("://delTempPic?targetType="+targetType);
	if(targetType == 0){
		$("#addQuestionPicSpan").show();
	}else if(targetType == 1){
		$("#answerPicSpan").hide();
		$("#jiexiBtn").show();
	}
}
/**
 * 清除截图缓存
 * @param {Object} targetType
 */
function removeCropImgTempInfo(targetType){
	var saveInfo = getLocalStorageItem(webStorageVars[16]);
	if(saveInfo){
		saveInfo = $.parseJSON(saveInfo);
		//移除task_0或task_1
		if(targetType!=undefined){
			delete saveInfo["task_"+targetType];
			saveLocalStorageItem(webStorageVars[16],saveInfo);
		}
	}
}

/**
 * 移除所有剪切图片缓存信息
 */
function removeAllCropImgTempInfo(){
	removeCropImgTempInfo(0);
	removeCropImgTempInfo(1);
}

/**
 * 初始化题类型
 */
function initQuestionType(){
//	types = {"result":"2000","msg":"操作成功！","data":{"itemTypeList":[{"itemTag":"单选题","itemTypeId":"111","answerType":1},{"itemTag":"填空题","itemTypeId":"112","answerType":3},{"itemTag":"解答题","itemTypeId":"113","answerType":3}]}}
	var types = getLocalStorageItem(webStorageVars[18]);
	if(!types || types == "undefined"){
		alertToast("问题类型为空");
		return false;
	}
	types = $.parseJSON(types);
//	var types = [{"itemTag":"单选题","itemTypeId":"111","answerType":1},{"itemTag":"填空题","itemTypeId":"112","answerType":3},{"itemTag":"解答题","itemTypeId":"113","answerType":3}];
	var quetionTypeChangeUl = $("#quetionTypeChangeUl");
	var lis = "";
	$.each(types, function(i,v) {
		var liHtml = '<li answerType="'+v.answerType+'" itemTypeId="'+v.itemTypeId+'">'+v.itemTag+'</li>';
		lis+=liHtml;
	});
	quetionTypeChangeUl.append(lis);
}
/**
 * 难度切换
 */
function difficultyChangeHandleListen(){
	$("#difficultyChangeUl li").on("click",function(){
		$(this).addClass("hig").siblings().removeClass("hig");
	});
}
/**
 * 问题类型切换
 */
function quetionTypeChangeHandleListen(){
	//int	answerType回答类型1：单选2：多选3：其它
	$("#quetionTypeChangeUl li").on("click",function(){
		$(this).addClass("hig").siblings().removeClass("hig");
		if($(this).attr("answerType")==1||$(this).attr("answerType")==2){
			$("#selectAndAnswerCon").show();
			$("#btnNumBtn").show();
			
			if($(this).attr("answerType")==2){
				$("#multiSelectDt").show().siblings().hide().removeClass("hig");
				//btnNumBtn初始化
				if($("#multiSelectDt span:visible").length>2){
					$("#btnNumBtn [index=1]").removeClass("del_desible");
					if($("#multiSelectDt span:visible").removeClasslength==8){
						$("#btnNumBtn [index=2]").addClass("add_desible");
					}else{
						$("#btnNumBtn [index=2]").removeClass("add_desible");
					}
				}else{
					$("#btnNumBtn [index=1]").addClass("del_desible").siblings().removeClass("add_desible");
				}
			}else{
				$("#singleSelectDt").show().siblings().hide().removeClass("hig");
				//btnNumBtn初始化
				if($("#singleSelectDt span:visible").length>2){
					$("#btnNumBtn [index=1]").removeClass("del_desible");
					if($("#singleSelectDt span:visible").removeClasslength==8){
						$("#btnNumBtn [index=2]").addClass("add_desible");
					}else{
						$("#btnNumBtn [index=2]").removeClass("add_desible");
					}
				}else{
					$("#btnNumBtn [index=1]").addClass("del_desible").siblings().removeClass("add_desible");
				}
			}
		}else{
			$("#selectAndAnswerCon").hide();
		}
	});
	$("#btnNumBtn span").on("touchstart",function(){
		var multiSelectDt = $("#multiSelectDt");
		var singleSelectDt = $("#singleSelectDt");
		var selectQuesType = $("#quetionTypeChangeUl [class=hig]").attr("answerType");
		if($(this).attr("index") == 1){//减
			if($(this).attr("class")=="del_desible")
				return false;
			if($(this).next().attr("class")=="add_desible")
				$(this).next().removeAttr("class");
			if(selectQuesType==1){
				singleSelectDt.find("span:visible").last().hide();
				if(singleSelectDt.find("span:visible").length == 2)
					$(this).addClass("del_desible");
			}else if(selectQuesType==2){
				multiSelectDt.find("span:visible").last().hide();
				if(multiSelectDt.find("span:visible").length == 2)
					$(this).addClass("del_desible");
			}
		}else if($(this).attr("index") == 2){//加
			if($(this).attr("class")=="add_desible")
				return false;
			if($(this).prev().attr("class")=="del_desible")
				$(this).prev().removeAttr("class");
			if(selectQuesType==1){
				singleSelectDt.find("span:hidden").first().show();;
				if(singleSelectDt.find("span:visible").length == singleSelectDt.children().length)
					$(this).addClass("add_desible");
			}else if(selectQuesType==2){
				multiSelectDt.find("span:hidden").first().show();
				if(multiSelectDt.find("span:visible").length == multiSelectDt.children().length)
					$(this).addClass("add_desible");
			}
		}
	});
	$("#singleSelectDt").children().on("click",function(){
		$(this).children().addClass("hig");
		$(this).siblings().children().removeClass("hig");
	});
	$("#multiSelectDt").children().on("click",function(){
		if($(this).children().attr("class")=="hig"){
			$(this).children().removeAttr("class");
		}else{
			$(this).children().addClass("hig");
		}
	});
	
}

/**
 * 拍照出题提交,给iOS发送消息,iOS上传图片后,调用js提交photoSubjectPublishSubmit
 */
function photoSubjectSubmit(){
	return false;
	//sendMsg2iOS("://photoSubjectSubmit");
	//loading();
	var selectedQuestionType = $("#quetionTypeChangeUl .hig");
	if(selectedQuestionType.length !=1 ){
		alertToast("请设置题型");
		onLoaded();
		return false;
	}
	var answerType = selectedQuestionType.attr("answerType");
	var answerRightStr="";//仅在answerType为1、2时存在
	if(answerType == 1){
		answerRightStr = $("#singleSelectDt .hig").attr("data");
		if(!answerRightStr){
			alertToast("请设置正确答案");
			onLoaded();
			return false;
		}
	}else if(answerType == 2){
		var answerRightStrs = $("#multiSelectDt span.hig");
		if(answerRightStrs.length<2){
			if(answerRightStrs.length==0){
				alertToast("请设置正确答案");
			}else{
				alertToast("正确答案多选题的正确选项至少2个");
			}
			onLoaded();
			return false;
		}
	}
	onLoading();
}

/**
 * 拍照出题提交
 */
function photoSubjectPublishSubmit(itemId,questionImg,answerImg,lessonId){
	//拍照发布
	//请为题目上传图片
	//请设置题型
	//拍照出题进入出题筐
	if(!questionImg){
		alertToast("请为题目上传图片");
		onLoaded();
		return false;
	}
//	var queryStringObj = getQueryStringFromUrl();
//	var lessonId = queryStringObj.lessonId;
//	var subjectId = queryStringObj.subjectId;
//	var gradeId = queryStringObj.gradeId;
//	gradeId==undefined || subjectId == undefined  || 
	if(lessonId == undefined){
		alertToast("lessonId为空");
		onLoaded();
		return false;
	}
	var selectedQuestionType = $("#quetionTypeChangeUl .hig");
	if(selectedQuestionType.length !=1 ){
		alertToast("请设置题型");
		onLoaded();
		return false;
	}
	var answerType = selectedQuestionType.attr("answerType");
	var itemTypeId = selectedQuestionType.attr("itemTypeId");
	var answerAllStr = "";//仅在answerType为1、2时存在
	var answerRightStr="";//仅在answerType为1、2时存在
	answerImg = answerImg!='0'?encodeURIComponent(answerImg):"";
	answerImg = encodeURIComponent(answerImg);
	questionImg = questionImg!='0'?encodeURIComponent(questionImg):"";
	questionImg = encodeURIComponent(questionImg);
	var data="jid="+jid+"&courseId="+lessonId+"&itemId="+itemId+
			 "&questionImg="+questionImg+"&answerImg="+answerImg;
	if(answerType == 1){
		var answerAllStrs = $("#singleSelectDt span:visible");
		$.each(answerAllStrs, function(i,v) {
			answerAllStr += $(v).attr("data")
		});
		answerRightStr = $("#singleSelectDt .hig").attr("data");
		if(!answerRightStr){
			alertToast("请设置正确答案");
			onLoaded();
			return false;
		}
	}else if(answerType == 2){
		var answerAllStrs = $("#multiSelectDt span:visible");
		$.each(answerAllStrs, function(i,v) {
			answerAllStr += $(v).attr("data")
		});
		var answerRightStrs = $("#multiSelectDt span.hig");
		if(answerRightStrs.length<2){
			if(answerRightStrs.length==0){
				alertToast("请设置正确答案");
			}else{
				alertToast("正确答案多选题的正确选项至少2个");
			}
			onLoaded();
			return false;
		}
		if(answerRightStrs.length>2 && selectedQuestionType.text().indexOf("双")==0){//双选题,
			alertToast("双选题只能有2个正确选项");
			onLoaded();
			return false;
		}
		
		$.each(answerRightStrs, function(i,v) {
			answerRightStr += $(v).attr("data")
		});
	}
    var answerType = selectedQuestionType.attr("answerType");
	var itemTypeId = selectedQuestionType.attr("itemTypeId");
	var difficultyType = $("#difficultyChangeUl .hig").attr("data");
	data += "&answerType="+answerType+"&difficultyType="+difficultyType+"&itemTypeId="+itemTypeId+
			"&answerAllStr="+answerAllStr+"&answerRightStr="+answerRightStr;
	getSignCode(data,Config.putQuestionUrl().split("?m=")[1],"photoSubjectPublishSubmitReq");
}
/**
 * 拍照出题提交请求
 */
function photoSubjectPublishSubmitReq(data){
	var param = getParam2Json(data);
	postAjaxJSON(Config.putQuestionUrl(),data,function(data){
		if(data && data.result>0){
			onLoaded();
			removeLocalStorageItem(webStorageVars[16]);
			sendMsg2iOS("://photoSubjectSubmitSuccess");
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("发布错误");
			}
		}
	},function(){
		alertToast("发布请求失败");
	});
}
/**
 * 拍照或从相册选取照片
 * imgSrcType : 图片来源 0(摄像头),1(相册)
 */
function takeAPic4TakePhotoSubject(imgSrcType){
	var targetType = $("#getPicPopDiv").attr("data");
	sendMsg2iOS("://takeAPic?imgSrcType="+imgSrcType+"&targetType="+targetType);
}
/**
 * 跳转到图片剪切
 */
function gotoCropImg(){
	var queryStringObj = getQueryStringFromUrl();
	var lessonId = queryStringObj.lessonId;
	var subjectId = queryStringObj.subjectId;
	var gradeId = queryStringObj.gradeId;
	var queryString = "topicId="+topicId+"&gradeId="+gradeId+"&subjectId="+subjectId;
	if(!isH5Only)
		queryString += "://head?title=[,false,,]&"+
					   "rightHandle:[isExist:false]&"+
					   "isShow=false";
	document.location.href="tasks_crop_img.html?"+queryString;
}
/**
 * 剪切确认后，给iOS发送图片信息,iOS收到后,调用js方法,在js方法中做预览处理,删除图片后通知iOS
 * //e.g.:tasks_crop_img.html?targetType=0&imgLocalUrl=/LoveStudy/img/parent/load_fail@2x.png
 * @param {int} targetType : 目标类型 0(题目),1(解析)  
 */
function cropConfirm2TakePhoto(){
	//在URL中需要targetType
	var targetType = getQueryStringFromUrl().targetType;
	var cropResult = cropConfirm();
	if(!cropResult){
		alertToast("图片信息为空");
		return false;
	}
	if(targetType == undefined){
		alertToast("目标类型为空");
		return false;
	}
	//先从localStorage中取出内容,然后再赋值
	var cropImgInfo = getLocalStorageItem(webStorageVars[16]);
	var saveInfo = {};
	if(cropImgInfo)
		saveInfo = $.parseJSON(cropImgInfo);
	saveInfo["task_"+targetType] = {imgData:cropResult};
	saveLocalStorageItem(webStorageVars[16],saveInfo);
	//将图片信息base64保存到webStorage中,使用后删除
	sendMsg2iOS("://cropImg2PicTask?targetType="+targetType+"&returnFn=reviceImgInfoFromiOS&returnFnParam="+targetType+
			"&imgData="+cropResult);
}
/**
 * 截取图片后,给iOS传完图片后,iOS调用该方法,该方法中做相关处理
 * @param {int} targetType : 目标类型 0(题目),1(解析)  
 */
function reviceImgInfoFromiOS(targetType){
	//判断是否已经在拍照发布页面,若不是则先跳转,若是则直接处理显示
	var localHref = document.location.href;
	if(localHref.indexOf("take_poto_subjct.html")== -1)
		document.location.href="take_poto_subjct.html?_=://head";
	//从缓存中获取图片信息
	/*
	if(targetType==0){
		initQuestionImgInfo();
	}else{
		initAnswerImgInfo();
	}
	*/
}
/**
 * 剪切取消,返回
 */
function cropCancle2TaskPhoto(){
	closepop();
	var targetType = getQueryStringFromUrl().targetType;
	removeCropImgTempInfo(targetType);
	goBackNow();
}
//*************take_ poto_subjct.html js function end ********************************
//*************statistics.html js function start ********************************
/*
 * 单选题 多选题 填空题统计 测验统计(有分组,无分组) 试卷中单选统计
 * 1.单个实体类任务:
 * 	a. 单选统计  圆环图  头部有班级选择
 *     正确A 选B...
 * 	         未完成学生
 *  b. 多选统计   圆环图  头部有班级选择
 * 	         正确ABC 选A 选B...
 * 	         未完成学生
 *  c.填空题统计
 *		完全同学资源类任务的统计页面
 *  d.问答统计
 * 	   	完全同学资源类任务的统计页面
 * 2.测验:
 * 	a. 试卷中单选统计 无圆圈图
 *    与1.a相比 没有任务完成情况
 * 			 没有班级切换,统计多一项(交卷但未答此题)的人数及名单
 * 			头为当前头
 *  b. 试卷中多选统计 无圆圈图
 * 		与1.a相比 没有任务完成情况
 * 			 没有班级切换,统计多一项(交卷但未答此题)的人数及名单
 * 			头为当前头
 *  c.试卷中填空题统计 无圆圈图
 *		与试卷中选择题的统计项不同：每个得分的人数及人员列表
 *		头为当前头
 *  d.试卷中问答统计 无圆圈图
 *		点击进入统计页与试卷中填空题的统计项一致
 * 		头为当前头
 *  e.测验统计-有小组/无小组 
 * 		此页标题栏含有班级切换，统计部分含：
	（1）任务完成与未完成率+催交作业功能同资源部分（催交按钮同资源的处理方式，但全部完成时依旧用统计图）
	（2）学生得分的分数段柱状图，按照PC端的百分制柱状图
	（3）第三部分作答学生的成绩排名：所有学生均返回，有分数的（降序返回，含0分）、待批改的（分数处返回“待批改”）、未交卷的（分数处显示“未交卷”）
	如果本班有分组，则分全班排名和小组排名，默认为全班排名；每个小组内学生的排名还是班级的排名，前三名依旧使用勋章，顺序上按班级排名升序排。
	如果没有分组，则直接是全班排名，见
关于催交按钮：
部分完成且任务没有结束时页面标题处有【催交作业】点击出提示框【一键通知本班所有未完成作业的学生交作业，继续？+取消+确定】，确定后给学生发交作业消息；
任务已结束且学生没有全部完成，则正常显示统计内容，无【催交作业】按钮。学生全部做完了作业（不管任务结束与否）：没有催交按
   3. 自测
   		自主测试直接进入任务统计页，同测验的【T6.4.5.2】/【T6.4.5.3】
   4.微课程
   		即本微课程中试卷的统计，同测验任务的统计页测验的【T6.4.5.2】/【T6.4.5.3】。只是里面的学生完成情况指此微课程的完成情况。
   5.直播课
   		第一部分的完成情况+催交作业，同资源学习（催交按钮同资源的处理方式，但全部完成时依旧用统计图）。第二学生进入课堂的时间列表，按进入时间的正序排。
   6.讨论的统计
	与学资源的统计完全一致
 */

/**
 * 跳转到任务统计
 * @param {int} taskType 任务类型 
 *  	taskType	int 	任务类型： 
		1、资源学习
		2、互动交流 
		3、试题 
		4、成卷测试 
		5、自主测试 
		6、微课程学习 
		7、直播课
		8、一般任务
 * @param {int} taskSubType 任务子类型
 * taskSubtype	int 	任务子类型
		1 资源学习类 包括（文档类任务，声音类任务，图片类，视频类/远程高清类）
		2 互动交流
		3 webview试题（单选题，多选题，填空题，主观题，知识导学）
		4 成卷测试
		5 自主测试
		6 微课
		7 一般任务之语音：形式同资源学习类语音任务。
		8 一般任务之图片：9宫格显示图片，4张的形式较特殊需注意。
		9 一般任务之文字：同资源学习类任务。
		10 直播课
 * 
 * @param {int} pageNum,-1为外层,非-1为内层
 */
function gotoStatistics(taskId,taskType,taskSubType,pageNum){
	/*
	var queryStringObj = getQueryStringFromUrl();
	var taskId = queryStringObj.taskId;
	var taskType = queryStringObj.taskType;
	var taskSubType = queryStringObj.taskSubType;

	var taskId = "-1966880841816";
	var taskType = 1;
	var taskSubType = 4;
	*/
	//获取任务统计信息,保存到webStorary中
	var statisticInfo = {};
	statisticInfo[taskId]={taskType:taskType,taskSubType:taskSubType,pageNum:pageNum};
	saveLocalStorageItem(webStorageVars[17],statisticInfo);
	getTaskStatistics2(taskId);
}

/**
 * 获取统计信息
 */
function getTaskStatistics2(taskId){
	var data="jid="+jid+"&schoolId="+schoolId+"&taskId="+taskId+"&belongType=2";
	getSignCode(data,Config.getTaskStatistics2Url().split("?m=")[1],"getTaskStatistics2Req");
}
/**
 * 获取统计信息请求
 */
function getTaskStatistics2Req(data){
	var param = getParam2Json(data);
	var location = document.location.href.split("/pages/")[0]+"/pages/teacher/course/";
	postAjaxJSON(Config.getTaskStatistics2Url(),data,function(data){
		if(data && data.result>0){
			statisticInfo = getLocalStorageItem(webStorageVars[17]);
			if(statisticInfo)
				statisticInfo = $.parseJSON(statisticInfo);
			if(!statisticInfo[param.taskId]){
				alertToast("统计信息获取错误,请重试");
				return false;
			}
//			data = {"result":1,"msg":"操作成功","data":{"classList":[{"finishedNum":0,"classId":998010,"scoreBNum":0,"rankInfoList":[{"groupId":-1,"userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"潘雪景学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"im_stu6","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"111111","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"瓜娃子","photo":"http://attach.etiantian.com/ett20/study/common/upload/2092222_31821256.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"学渣","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"卢学生2"},{"rankNum":0,"rankPoint":"未交卷","userName":"student125","photo":"http://attach.etiantian.com/ett20/study/common/upload/2700397_74961662.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"0裂魂者0_1","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"大雁子","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"zhaa","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"高叁001","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"祁海石学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"哈错错","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"}]},{"groupId":-6186363797616,"groupName":"1","userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"潘雪景学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"im_stu6","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"111111","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"瓜娃子","photo":"http://attach.etiantian.com/ett20/study/common/upload/2092222_31821256.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"学渣","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"卢学生2"},{"rankNum":0,"rankPoint":"未交卷","userName":"student125","photo":"http://attach.etiantian.com/ett20/study/common/upload/2700397_74961662.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"0裂魂者0_1","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"大雁子","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"zhaa","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"高叁001","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"祁海石学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"哈错错","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"}]}],"isOver":0,"isJspTxt":0,"scoreENum":0,"testScoreList":[{"scoreGroupList":[{"groupName":"小组名","userList":[{"userName":"用户名"},{"userName":"用户名"},{"userName":"用户名"},{"userName":"用户名"},{"userName":"用户名"},{"userName":"用户名"},{"userName":"用户名"}]},{"groupName":"小组名","userList":[{"userName":"用户名"}]},{"groupName":"小组名","userList":[{"userName":"用户名"}]},{"groupName":"小组名","userList":[{"userName":"用户名"}]},{"groupName":"小组名","userList":[{"userName":"用户名"}]},{"groupName":"小组名","userList":[{"userName":"用户名"}]},{"groupName":"小组名","userList":[{"userName":"用户名"}]}]},{"scoreGroupList":[{"groupName":"小组名"},{"userList":[{"userName":"用户名"}]}]},{"scoreGroupList":[{"groupName":"小组名"},{"userList":[{"userName":"用户名"}]}]}],"noFinishedNum":15,"scoreANum":0,"scoreDNum":0,"isFinished":0,"className":"高三1班","notFinGroupList":[{"userList":[{"userName":"用户名"}],"groupName":"groupName"},{"userList":[{"userName":"用户名"}],"groupName":"groupName"},{"userList":[{"userName":"用户名"}],"groupName":"groupName"}],"scoreCNum":0,"studyTimeGroup":[{"userName":"用户名","timeHint":"2016年3月11日 09:21:30"},{"userName":"用户名","timeHint":"2016年3月11日 09:21:30"},{"userName":"用户名","timeHint":"2016年3月11日 09:21:30"}]}]}};
			data = data.data;
			var title = "";
			var hasArrow = false;//是否有箭头
			var classId = "";
			var taskType = statisticInfo[param.taskId].taskType;
			var taskSubType = statisticInfo[param.taskId].taskSubType;
			if(data.classList && data.classList.length>0){
				title = data.classList[0].className;
				classId = data.classList[0].classId;
				if(data.classList.length>1){
					hasArrow = true;
				}
				statisticInfo[param.taskId].classList = data.classList;
				saveLocalStorageItem(webStorageVars[17],statisticInfo);
			}
			var queryString ="taskId="+param.taskId+"&classId="+classId;
			//获取任务统计信息,保存到webStorary中
			if(!isH5Only)//
				queryString += "://statisticHead?title=["+title+","+hasArrow+",,]&"+//有右侧按钮,在页面加载完成后去除又测按钮
							   "rightHandle:[isExist:true,type:type1,value=[[/img/teacher/course/nav_btn_countdown_default@2x.png,remindHomeWorkPopShow,]]]";
			document.location.href=location+"statistics.html?"+queryString;
		}else{
			var errMsg;
			if(data){
				errMsg = data.msg;
				alertInfo(data.msg);
			}else{
				errMsg = "获取统计信息错误"
				alertToast("获取统计信息错误");
			}
			document.location.href=location+"statistics.html?://error?errMsg="+errMsg;
		}
	},function(){
		alertToast("获取统计信息请求失败");
		document.location.href=location+"statistics.html?://error?errMsg=获取统计信息请求失败";
	});
}
/**
 * 初始化统计信息
 */
function initStatisticsInfo(){
	var taskId = getQueryStringFromUrl().taskId;
	if(taskId.search(/:\/\//ig)!=-1)
		taskId = taskId.split("://")[0];
	if(!taskId) return false;
	statisticInfo = getLocalStorageItem(webStorageVars[17]);
	if(statisticInfo)
		statisticInfo = $.parseJSON(statisticInfo);
	if(!statisticInfo[taskId]){
		alertToast("统计信息获取错误,请重试");
		return false;
	}
	var taskType = statisticInfo[taskId].taskType;
	var taskSubType = statisticInfo[taskId].taskSubType;
	var currClassId = getQueryStringFromUrl().classId;
	if(currClassId.search(/:\/\//ig)!=-1)
		currClassId = currClassId.split("://")[0];
   	//初始化班级列表
	var classList = statisticInfo[taskId].classList;
	var currClassInfo = initClassList(currClassId,classList);
	/*
	if(!currClassInfo){
		alertToast("班级信息为空");asd
		return false;
	}*/
	// && currClassInfo.isOver ==0 
	if(!currClassInfo || (currClassInfo.isFinished== 0 && currClassInfo.finishedNum == 0)){
		$("#noAnswerZW").show().nextAll().hide();//无学生回答占位图
		$(document.body).css("backgroundColor","#fff");
		return false;
	}
    if(currClassInfo.isFinished== 1){
        //成卷测试显示与任务进行中统计保持一致
        if(taskSubType != 4){
            $("#allAnswerZW").show().nextAll().hide();//任务全部完成占位图
        }
        $(document.body).css("backgroundColor","#fff");
        sendMsg2iOS("://headRightBtnHandle?hideIndex=0");//隐藏提醒按钮
    }
	if(!currClassInfo.noFinishedNum || (currClassInfo.isFinished== 0 && currClassInfo.isOver == 1 ) )
		sendMsg2iOS("://headRightBtnHandle?hideIndex=0");//隐藏提醒按钮
	if( taskSubType == 1 || taskSubType == 2 ||
   		taskSubType == 7 ||taskSubType == 8 ||taskSubType == 9 ||(taskSubType == 3 && currClassInfo.isJspTxt ==1)
   		||taskSubType == 11||taskSubType == 12){
   		//显示饼图+未完成学生列表(noFinGroupList)
   		//圆圈图
		initCircleChart(currClassInfo.finishedNum,currClassInfo.noFinishedNum);
		//未完成学生列表
		drowUserList4Statistics($("#noFinUserListSec"),currClassInfo.notFinGroupList);
   	}else if( taskSubType == 3 && currClassInfo.isJspTxt ==0){
   		/*
   		 * isJspTxt :区分是否为填空题 1是0否
		   1:填空题
			显示饼图+未完成学生列表(noFinGroupList)
		   0:选择题
			显示饼图
			+ 各选项学生列表(testScoreList-scoreGroupList)
			+未完成学生列表(noFinGroupList)
   		 */
   		//圆圈图
		initCircleChart(currClassInfo.finishedNum,currClassInfo.noFinishedNum);
		//各选项学生列表(testScoreList-scoreGroupList)
		if(currClassInfo.testScoreList && currClassInfo.testScoreList.length)
			drowUserList4Statistics($("#userListSec"),currClassInfo.testScoreList[0].scoreGroupList);
		//未完成学生列表
		drowUserList4Statistics($("#noFinUserListSec"),currClassInfo.notFinGroupList);
   	}else if( taskSubType == 10){
   		//显示饼图+学习时间(studyTimeGroup)
   		//圆圈图
		initCircleChart(currClassInfo.finishedNum,currClassInfo.noFinishedNum);
		//学习时间
		var userListSec = $("#studyTimeSec").show();
		var subHtml = '<h2>学习时间</h2>'+
					  '<table cellspacing="0" cellpadding="0" class="answerList studyTime">';
		$.each(currClassInfo.studyTimeGroup,function(i,v){
			subHtml+='<tr><td>'+(displayNameHandle4Statistic(v.userName))
			+'</td><td>'+v.timeHint+'</td></tr>';
		});
		subHtml += '</table>';
		userListSec.append(subHtml);
		if(($(document.body).height() - $("#studyTimeSec").offset().top)>$("#studyTimeSec").height())
			$("#studyTimeSec").height(($(document.body).height() - $("#studyTimeSec").offset().top));
   	}else if( taskSubType == 4 || taskSubType == 5 ||
   		taskSubType == 6){
   		var pageNum = statisticInfo[taskId].pageNum;
   		if( !pageNum || parseInt(pageNum)==0) pageNum = -1;
   		/*
   		外层进入:
		显示饼图+柱图+等级列表(rankInfoList)
	   	内层进入:
		显示各选项学生列表(testScoreList-scoreGroupList)
		*/
		if(pageNum == -1){
			//显示饼图+柱图+等级列表(rankInfoList)
			initCircleChart(currClassInfo.finishedNum,currClassInfo.noFinishedNum);
			initBarChart(currClassInfo.scoreANum,currClassInfo.scoreBNum,currClassInfo.scoreCNum,
			currClassInfo.scoreDNum,currClassInfo.scoreENum);
			drowRankList4Statistics(currClassInfo.rankInfoList);
		}else{
			//显示各选项学生列表(testScoreList-scoreGroupList)
			if(currClassInfo.testScoreList && currClassInfo.testScoreList.length)
				drowUserList4Statistics($("#userListSec"),currClassInfo.testScoreList[pageNum-1].scoreGroupList);
		}
   	}
}
/**
 * 排行列表
 */
function drowRankList4Statistics(data){
	if(!data)
		return false;
	var rankList = $("#rankList").show();
	var chooseClassTabIsShow = false;
	var allClassRankList = $("#allClassRankList ul");
	var groupClassRankList = $("#groupClassRankList");
	$.each(data, function(j,k) {
		if(k.groupId == -1){
			$.each(k.userRankList, function(i,v) {
				var rankClass = "";//class="one"
				if(v.rankNum == 1){
					rankClass = "class=\"one\"";
				}else if(v.rankNum == 2){
					rankClass = "class=\"two\"";
				}else if(v.rankNum == 3){
					rankClass = "class=\"three\"";
				}
				var liHtml = '<li>'+
						'<span '+rankClass+'>'+(!rankClass?v.rankNum?v.rankNum:"":"")+'</span>'+
						'<div class="poto">'+
						'	<p>'+
						'		<img src="'+(v.photo?v.photo:webRoot+"/img/teacher/grade/public-head_img_160@2x.png")+'"/>'+	
						'	</p>'+
						(rankClass == "class=\"one\""?'	<span class="crown"></span>':"")+
						'</div>'+
						'<p>'+v.userName+'</p>'+
						'<em>'+v.rankPoint+'</em>'+
						'</li>';
				allClassRankList.append(liHtml);
			});
		}else{
			if(!chooseClassTabIsShow)
				chooseClassTabIsShow = true;
			var ul='<h3 class="small-title">'+k.groupName+'</h3>'+
						   '<ul class="ranking_list">';
					$.each(k.userRankList, function(i,v) {
						var rankClass = "";//class="one"
						if(v.rankNum == 1){
							rankClass = "class=\"one\"";
						}else if(v.rankNum == 2){
							rankClass = "class=\"two\"";
						}else if(v.rankNum == 3){
							rankClass = "class=\"three\"";
						}
						var li = '<li>'+
								'<span '+rankClass+'>'+(!rankClass?v.rankNum?v.rankNum:"":"")+'</span>'+
								'<div class="poto">'+
								'	<p>'+
								'		<img src="'+(v.photo?v.photo:webRoot+"/img/teacher/grade/public-head_img_160@2x.png")+'"/>'+	
								'	</p>'+
								(rankClass == "class=\"one\""?'	<span class="crown"></span>':"")+
								'</div>'+
								'<p>'+v.userName+'</p>'+
								'<em>'+v.rankPoint+'</em>'+
								'</li>';
						ul+=li;
					});
				ul += '</ul>';
			groupClassRankList.append(ul);
		}
	});
	if(chooseClassTabIsShow){
		rankList.children().first().show().find("li").on("click",function(){
			if($(this).attr("class")=="hig")
				return false;
			if($(this).attr("data")=="all"){
				$("#allClassRankList").show().siblings().hide();
			}else if($(this).attr("data")=="group"){
				$("#groupClassRankList").show().siblings().hide();
			}
			$(this).attr("class","hig").siblings().removeAttr("class");
		});
	}
}
/**
 * 处理用户列表
 * @param {Object} containerSelector 容器的对象
 */
function drowUserList4Statistics(containerJqueryObj,data){
	var userListSec = containerJqueryObj.show();//$("#userListSec").show();
	$.each(data,function(i,v){
		var subHtml = '<h2>'+v.groupName+'</h2>'+
						'<table index="'+i+'" cellspacing="0" cellpadding="0" class="answerList">';
		$.each(v.userList, function(j,k) {
			if(j==0)
				subHtml += "<tr>";
			if(j!=0 && j%5 == 0 )
				subHtml += "</tr><tr>";
			subHtml+='<td>'+(displayNameHandle4Statistic(k.userName))+'</td>';
			if(j == v.userList.length)
				subHtml += "</tr>";
		});
		subHtml += '</table>';
		userListSec.append(subHtml);
		if(v.userList.length<5)
			userListSec.find('table[index='+i+']').width(containerJqueryObj.width()/5*v.userList.length);
	});
}

/**
 * 初始化圆圈图
 * @param {Object} finishedNum 完成数
 * @param {Object} noFinishedNum 未完成数
 */
var circleChart ;
function initCircleChart(finishedNum,noFinishedNum){
 	var  radius = ['60%', '80%'],//: ['60%', '80%'],//[内半径,外半径]
		 center = [100, '50%'],//: [130, '50%'],//圆心坐标130
		 titleX = 70//x: 100,
	if($(document.body).width()<350){//5s 横宽320
		center[0] = 70;
		titleX = 43;
	}
	var count = finishedNum+noFinishedNum;
	var finishPercent = count?Math.round(finishedNum/count*100):0;
	var hadFinished = '  已完成'+finishPercent+"%  ("+finishedNum+"人)";
	var hadNoFinished = '  未完成'+(!finishPercent&&!noFinishedNum?0:(100-finishPercent))+"%  ("+noFinishedNum+"人)";
	$("#circleChartSec").show().after('<div class="h10"></div>');
	require([
	        'echarts',
	        'echarts/chart/pie'   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
	        ],
	        function(ec){
				circleChart = ec.init(document.getElementById('circleChartSec'));
				circleChart.showLoading({
				    text: 'loading...',    //loading话术
				});
				var option = {
					title:{
						 text: '作答统计',
				         x: titleX,//100,
				         y: 'center',
				         textStyle : {
				              color:'#666666',
                              fontSize : 14
				        }
					},
					backgroundColor:'#fff',
				    legend: {
				        orient : 'vertical',
				        x : '50%',
				        y:'center',
				        itemWidth: 10,             // 图例图形宽度
        				itemHeight: 12,            // 图例图形高度
				        itemGap:39,
				        selectedMode:false,
				        data:[{name:hadFinished,icon:'bar'},
				        	  {name:hadNoFinished,icon:'bar'}],
				        textStyle:{
				            color: "#222222",
				            fontSize:14
				        }
				    },
				    // 默认标志图形类型列表
				    symbolList : [
				      'circle'
				    ],
				    series : [
				        {
				            name:'作答统计',
				            type:'pie',
				            radius :radius,//: ['60%', '80%'],//[内半径,外半径]
				            center : center,//[130, '50%'],//圆心坐标130
				            clickable:false,
				            legendHoverLink:false,
				            clockWise:true,
				            itemStyle : {
				                normal : {
				                    label : {
				                        show : false
				                    },
				                    labelLine : {
				                        show : false
				                    },
				                }
				            },
				            data:[
				            /*
				               {value:0, name:'作答统计',
				                itemStyle:{
				                	normal : {
				                      color:'#55ed51',
				                      label : {
				                          show : true,
				                          position : 'center',
				                          textStyle : {
				                              color:'#666666',
				                              fontSize : 14
				                          }
				                      }
				                 }
				               }
				              },*/
				                {value:finishedNum, name:hadFinished,
				        		  itemStyle:{
				                      normal : {
				                          color:'#55ed51'
				                      }
				                	}            //自定义特殊itemStyle，仅对该item有效，详见itemStyle
				                },
				                {value:noFinishedNum, name:hadNoFinished,
				                	itemStyle:{
				                      normal : {
				                          color:'#ffaf24'
				                      }
				                	}    
				                }
				            ]
				        }
				    ]
				};
				if(!finishedNum && !noFinishedNum)
					option.series[0].data.push({value:1,
	                	itemStyle:{
	                      normal : {
	                          color:'#f2f6f9'
	                      }
	                	}
	                });
				circleChart.on("hover",function(e){
					if($("[data-zr-dom-id=_zrender_hover_]").length)
						$("[data-zr-dom-id=_zrender_hover_]").remove();
				});
				circleChart.hideLoading();
				circleChart.setOption(option,true);
				circleChart.refresh();
	        });
}
/**
 * 初始化柱状图
 */
var barChart;
function initBarChart(scoreANum,scoreBNum,scoreCNum,scoreDNum,scoreENum){
	if(scoreANum == undefined) scoreANum = 0;
	if(scoreBNum == undefined) scoreBNum = 0;
	if(scoreCNum == undefined) scoreCNum = 0;
	if(scoreDNum == undefined) scoreDNum = 0;
	if(scoreENum == undefined) scoreENum = 0;
	$("#barChartSec").show().after('<div class="h10"></div>');
	require([
	        'echarts',
	        'echarts/chart/bar'   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
	        ],
	        function(ec){
				barChart = ec.init(document.getElementById('barChartSec'));
				barChart.showLoading({
				    text: 'loading...',    //loading话术
				});
				var option = {
				    xAxis : [
				        {
				            type : 'category',
				            axisLine:{
						    	lineStyle: {
						    		color:'#b3b3b3'
						    	}
					    	},
					    	axisTick: {
					    		show:false
					    	},
					    	splitLine:{
					           	show: false
				            },
				            data : ['90~100','80~89','70~89','60~69','0~59']
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            show :false
				        }
				    ],
				     grid:{//直角坐标系内绘图网格
					    	x:0,
					    	y:30,
					    	x2:0,
					    	y2:30,
					    	backgroundColor:'rgba(0,0,0,0)',
					    	borderWidth:0
					},
					backgroundColor:'#fff',
				    series : [
				        {
				            name:'finishedCount',
				            type:'bar',
				            barWidth:45,
				            legendHoverLink:false,
				            itemStyle: {
				                normal: {
				                	barBorderRadius: 0,
				                	barBorderWidth: 0,
				                	label: {
				                		show: true,
				                		position: 'insideTop',
				                        textStyle:{
				                        	color:'#ffffff'
				                        },
				                        formatter:"{c} 人"
				                   },
				                }
				                },
				            data:[{value:scoreANum,
				        		  itemStyle:{
				                      normal : {
				                      	label: {
					                		position: scoreANum?"insideTop":"top",
					                		textStyle:{
					                			color:scoreANum?"#fff":"#818be1"
											}
					                      },
				                          color:'#818be1'
				                      }
				                	}            //自定义特殊itemStyle，仅对该item有效，详见itemStyle
				                  },
				                  {value:scoreBNum,
				        		  	itemStyle:{
				                      normal : {
					                      label: {
					                		position: scoreBNum?"insideTop":"top",
					                		textStyle:{
					                			color:scoreBNum?"#fff":"#56cffc"
					                		}
					                      },
				                          color:'#56cffc'
				                      }
				                	}            
				                  },
				                  {value:scoreCNum,
				        		  	itemStyle:{
				                      	normal : {
				                      		label: {
						                		position: scoreCNum?"insideTop":"top",
						                		textStyle:{
						                			color:scoreCNum?"#fff":"#81d758"
						                		}
					                    	},
				                          color:'#81d758'
				                      	}
				                	}            
				                  },
				                  {value:scoreDNum,
				        		  	itemStyle:{
					                    normal : {
					                    	label: {
						                		position: scoreDNum?"insideTop":"top",
						                		textStyle:{
						                			color:scoreDNum?"#fff":"#ffb461"
						                		}
						                    },
					                        color:'#ffb461'
					                    }
				                	}            
				                  },
				                  {value:scoreENum,
				        		  	itemStyle:{
					                    normal : {
					                    	label: {
						                		position: scoreENum?"insideTop":"top",
						                		textStyle:{
						                			color:scoreENum?"#fff":"#fa8875"
						                		}
						                    },
					                        color:'#fa8875'
					                    }
				                	}            
				                  }
				            ]
				          
				        }
				    ]
				};
				barChart.on("hover",function(e){
					if($("[data-zr-dom-id=_zrender_hover_]").length)
						$("[data-zr-dom-id=_zrender_hover_]").remove();
				});
				barChart.hideLoading();
				barChart.setOption(option,true);
				barChart.refresh();
	        });
}
/**
 * 初始化班级列表
 * @param {Object} currClassId
 * @param {Object} classList
 */
function initClassList(currClassId,classList){
	if(!classList) return false;
	var currClassInfo;
	var ul = $("#changeClassDiv ul");
	$.each(classList, function(i,v) {
		var isHover = "";
		if(currClassId == v.classId){
			currClassInfo = v;
			isHover = "hover";
		}
		var li = '<li classId="'+v.classId+'" >'+
				 '	<span class="space '+isHover+'"></span>'+
				 '	<span class="f36_2 text">'+v.className+'</span>'+
				 '</li>';
		ul.append(li);
	});
	//监听切换班级
	changeClassListen();
	return currClassInfo;
}
/**
 * 催交作业弹出层显示
 */
function remindHomeWorkPopShow(){
	alertConfirm("一键通知本班所有未完成作业的学生交作业，继续？","remindHomeWork");
}
/**
 * 催交作业
 */  
function remindHomeWork(){
	$("#alertConfirmPop").remove();
	var taskId = getQueryStringFromUrl().taskId;
	if(!taskId){
		alertToast("taskId为空");
		return false;
	}
	var data="jid="+jid+"&schoolId="+schoolId+"&taskId="+taskId+"&uType=";
	if(getLocalStorageItem(webStorageVars[7]))
		data += getLocalStorageItem(webStorageVars[7]);
	getSignCode(data,Config.remindHomeWorkUrl(),"remindHomeWorkReq");
}
/**
 * 提醒 请求
 */  
function remindHomeWorkReq(data){
	postAjaxJSON(Config.remindHomeWorkUrl(),data,function(data){
		if(data && data.result>0){
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("催交作业错误");
			}
		}
		$("#alertConfirmPop").remove();
	},function(){
		alertToast("催交作业请求失败");
	});
	
}
/**
 * 统计名字显示
 */
function displayNameHandle4Statistic(val){
	if(!val) return "";
	if(/[\u2E80-\u9FFF]/g.test(val)){
		if(val.length>4)
			return val.substring(0,3)+"...";
		return val;
	}else{
		if(val.length>6)
			return val.substring(0,6)+"...";
		return val;
	}
}
//*************statistics.html js function end ********************************

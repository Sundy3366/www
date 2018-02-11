//*************study_report.html js function start ********************************

//*************study_report.html js function end ********************************
/**
 * 周/月 tab切换
 */
function changeTabClickListen() {
	$("[name=reportTab]").children().off().on("touchstart", function() {
		$this = $(this);
		if ($this.attr("class") && $this.attr("class").indexOf("hig") != -1)
			return false;
		$this.addClass("hig").siblings().removeClass("hig");
		if ($this.attr("idx") == "0") {
			$this.parent().prev().addClass("hig").siblings().removeClass("hig");
		} else {
			$this.parent().next().addClass("hig").siblings().removeClass("hig");
		}
		eval($this.attr("fn"));
	});
}
/**
 * 日期范围滑动
 */
function pieSlideListen() {
	var x, transform;
	var position = ""; //value is 'left' or 'right' 'up' or 'down' 
	$(".pieSlideArt>div").on('touchstart', function(e) {
		x = e.originalEvent.targetTouches[0].pageX // anchor point
		transform = $(".pieSlideArt>div").css("transform");
		if (transform && transform != "none") {
			transform = parseFloat(transform.substring(0, transform.length - 1).split("(")[1].split(",")[4]);
		} else {
			transform = 0;
		}
	}).on('touchmove', function(e) {
		var currentObj = $(e.currentTarget);
		var changeA = e.originalEvent.targetTouches[0].pageX - x;
		if (changeA > 0) {
			position = "right";
		} else {
			position = "left";
		}
		console.log(transform + "," + changeA);
		$(".pieSlideArt>div").css("transform", "translate3d(" + (transform + changeA) + "px, 0px, 0px)");
		if (position == "left") {} else {

		}
	}).on('touchend', function(e) {
		var currentObj = $(e.currentTarget);
		if (position == "left") {} else if (position == "right") {}
		position = "";
		transform = 0;
	});
}

/**
 * 初始化任务饼图
 * @param {Object} i 循环下标
 * @param {Object} data
 */
function initTaskStatisticPieArt(i,data) {
	var radius = ['57.6%', '90%'], //: ['57.6%', '100%'],//[内半径,外半径]
		center = ['50%', '50%'], //: [130, '50%'],//圆心坐标130
		titleX = 'center';
	//设置共 后数字
	var totalNumber = 0,//3
	    studyResourceVal = 0,//4
	    liveLessonVal = 0,//5
	    microLessonVal = 0,//6
	    discussVal = 0,//7
	    normalTaskVal = 0,//8
	    doQuestionsVal = 0,//9
	    testTaskVal = 0,//11
	    selfTestVal = 0;//10
	$("#reportBoxChildren"+i+" .subjectTitle").text("");//标题2
	$("#totalNumber"+i).remove();
	$.each(data, function(j,v) {
		switch(v.id){
			case 2:
				$("#reportBoxChildren"+i+" .subjectTitle").text(v.strValue);
			break;
			case 3:
				totalNumber = v.intValue;
			break;
			case 4:
				studyResourceVal = v.intValue;
			break;
			case 5:
				liveLessonVal = v.intValue;
			break;
			case 6:
				microLessonVal = v.intValue;
			break;
			case 7:
				discussVal = v.intValue;
			break;
			case 8:
				normalTaskVal = v.intValue;
			break;
			case 9:
				doQuestionsVal = v.intValue;
			break;
			case 10:
				selfTestVal = v.intValue;
			break;
			case 11:
				testTaskVal = v.intValue;
			break;
		}
	});
	$("#reportBoxChildren"+i+" .pieChartArt").show();
	var pieChartDiv = $("#pieChartDiv"+i).show().html("");
	require([
			'echarts',
			'echarts/chart/pie' // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
		],
		function(ec) {
			var circleChart = ec.init(document.getElementById('pieChartDiv'+i));
			circleChart.showLoading({
				text: 'loading...', //loading话术
			});
			var option = {
				title: {
					text: '',//共
					x: titleX, //100,
					y: 'center',
					textStyle: {
						color: '#999999',
						fontSize: 14
					}
				},
				backgroundColor: '#fff',
				legend: {
					show: false,
					orient: 'vertical',
					x: 'center',
					y: 'center',
					itemWidth: 10, // 图例图形宽度
					itemHeight: 12, // 图例图形高度
					itemGap: 39,
					selectedMode: false,
					data: []
				},
				series: [{
					name: '任务统计',
					type: 'pie',
					radius: radius, //: ['60%', '80%'],//[内半径,外半径]
					center: center, //[130, '50%'],//圆心坐标130
					clickable: false,
					legendHoverLink: false,
					clockWise: true,
					itemStyle: {
						normal: {
							label: {
								show: true,
								position: 'inner',
								formatter: "{c}",
								textStyle: {
									color: '#ffffff',
									fontSize: 11
								}
							},
							labelLine: {
								show: false
							},
						}
					},
					data: [{
						value: studyResourceVal,
						name: '学资源',
						itemStyle: {
							normal: {
								color: '#fa8874'
							}
						}
					}, {
						value: liveLessonVal,
						name: '直播课',
						itemStyle: {
							normal: {
								color: '#F9A574'
							}
						} //自定义特殊itemStyle，仅对该item有效，详见itemStyle
					}, {
						value: microLessonVal,
						name: '微课程',
						itemStyle: {
							normal: {
								color: '#F3D357'
							}
						} //自定义特殊itemStyle，仅对该item有效，详见itemStyle
					}, {
						value: discussVal,
						name: '讨论',
						itemStyle: {
							normal: {
								color: '#5FD86A'
							}
						} //自定义特殊itemStyle，仅对该item有效，详见itemStyle
					}, {
						value: normalTaskVal,
						name: '一般任务',
						itemStyle: {
							normal: {
								color: '#73D4FA'
							}
						} //自定义特殊itemStyle，仅对该item有效，详见itemStyle
					}, {
						value: doQuestionsVal,
						name: '做题',
						itemStyle: {
							normal: {
								color: '#74ABF9'
							}
						} //自定义特殊itemStyle，仅对该item有效，详见itemStyle
					}, {
						value: testTaskVal,
						name: '测验',
						itemStyle: {
							normal: {
								color: '#AFB0FB'
							}
						} //自定义特殊itemStyle，仅对该item有效，详见itemStyle
					}, {
						value: selfTestVal,
						name: '自测',
						itemStyle: {
							normal: {
								color: '#AC76F8'
							}
						} //自定义特殊itemStyle，仅对该item有效，详见itemStyle
					}]
				}]
			};
			if(!studyResourceVal &&
			    !liveLessonVal &&
			    !microLessonVal &&
			    !discussVal &&
			    !normalTaskVal &&
			    !doQuestionsVal &&
			    !testTaskVal &&
			    !selfTestVal)
				option.series[0].data.push({value:1,
                	itemStyle:{
                      normal : {
                          color:'#f2f6f9'
                      }
                	}
                });
			circleChart.on("hover", function(e) {
				if ($("[data-zr-dom-id=_zrender_hover_]").length)
					$("[data-zr-dom-id=_zrender_hover_]").remove();
			});
			circleChart.hideLoading();
			circleChart.setOption(option, true);
			circleChart.refresh();
			var totalNumLeft = parseFloat(pieChartDiv.width() / 2);
			var totalNumberSpan = "<div id='totalNumber"+i+"' class='totalNumberDiv' style='left:" + totalNumLeft + "px;'>共<span class='totalNumber'>" + (totalNumber?totalNumber:0) + "</span></div>";
			totalNumberSpan = $(totalNumberSpan);
			//设置共 后数字
			pieChartDiv.append(totalNumberSpan);
			totalNumberSpan.css("left",(totalNumLeft-(parseInt(totalNumberSpan.find(".totalNumber").width())+14)/2));
		});
}

/**
 * 初始化 试卷统计折线图
 * @param {Object} i 循环下标
 * @param {Object} data
 */
function initQuestionStatisticLineChart(i,data) {
	$("#reportBoxChildren"+i+" .lineChartArt").hide();
	var scoreDataArr = [],//[, 11, 11, 15, 13, 12, 13, 10, 10, ],[, 0, 0, 0, 0, 0, 0, 0, 0, ];//得分 12
		avgScoreDataArr = [],//[, 1, 0, 2, 5, 3, 2, 0, 10, ];//平均分 13
		xAxisData = [];//
	var isGeted12 = false,//是否已获取12
		isGeted13 = false;//是否已获取13
	$.each(data, function(j,v) {
		if(isGeted12 && isGeted13)
			return false;
		if(v.id==12){
			isGeted12 = true;
			if(v.strValue){
				scoreDataArr = v.strValue.split(",");
				scoreDataArr.unshift(undefined);
				scoreDataArr.push(undefined);
			}
		}else if(v.id==13){
			isGeted13 = true;
			if(v.strValue){
				avgScoreDataArr = v.strValue.split(",");
				avgScoreDataArr.unshift(undefined);
				avgScoreDataArr.push(undefined);
			}
		}
	});
	if(!scoreDataArr.length && !avgScoreDataArr.length)
		return false;
	for(var j=0;j<scoreDataArr.length;j++){
		xAxisData[j]="";
	}
	$("#reportBoxChildren"+i+" .lineChartArt").show();
	$("#lineChartDiv"+i).show().html("");
	require(
		[
			'echarts',
			'echarts/chart/line' // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
		],
		function(ec) {
			var lineChart = ec.init(document.getElementById('lineChartDiv'+i));
			lineChart.showLoading({
				text: 'loading...', //loading话术
			});
			var option = {
				legend: {
					show: false,
					data: ['得分', '平均分']
				},
				xAxis: [{
					type: 'category',
					axisLine: {
						lineStyle: {
							width: 0
						}
					},
					splitLine: {
						show: false,
						lineStyle: {
							color: '#909090',
							width: 1,
							type: 'dotted'
						}
					},
					axisTick: {
						show: true,
						inside: true,
						lineStyle: {
							color: '#DCDCDC',
							width: 1,
							type: 'solid'
						}
					},
					boundaryGap: false,
					data: xAxisData,
					splitNumber:xAxisData.length
				}],
				yAxis: [{
					type: 'value',
					axisLine: {
						lineStyle: {
							width: 1,
							color: '#DCDCDC',
							height: 500
						}
					},
					splitLine: {
						lineStyle: {
							color: '#DCDCDC',
							width: 1,
							type: 'solid'
						}
					},
					axisLabel: {
						margin: 15,
						textStyle: {
							color: '#999999',
							fontSize: 11
						},
					},
					min: 0,
					max:100,
					splitNumber:5
				}],
				grid: { //直角坐标系内绘图网格
					x: 45,
					y: 30,
					x2: 30,
					y2: 30,
					borderWidth: 0
				},
				series: [{
					name: '得分',
					type: 'line',
					symbol: 'circle',
					itemStyle: {
						normal: {
							lineStyle: {
								color: '#FA8C06'
							}
						}
					},
					data: scoreDataArr
				}, {
					name: '平均分',
					type: 'line',
					symbol: 'circle',
					itemStyle: {
						normal: {
							lineStyle: {
								color: '#C6E5F5'
							}
						}
					},
					data: avgScoreDataArr
				}]
			};
			lineChart.on("hover", function(e) {
				if ($("[data-zr-dom-id=_zrender_hover_]").length)
					$("[data-zr-dom-id=_zrender_hover_]").remove();
			});
			lineChart.hideLoading();
			lineChart.setOption(option, true);
			lineChart.refresh();
			//
			$("#reportBoxChildren"+i+" .line_Legend_span").remove();
			$("#reportBoxChildren"+i+" .yAxis_ext_line").remove();
			//新增ledgen
			$("#lineChartDiv"+i).before("<div class='line_Legend_span'><span><hr class='cFA8C06'>得分</span><span><hr class='cC6E5F5'>平均分</span></div>");
			//新增Y轴延长线
			$("#lineChartDiv"+i).append("<span class='yAxis_ext_line'></span>");
		}
	);
}
/**
 * 初始化实体统计信息 
 * @param {Object} i 循环下标
 * @param {Object} data
 */
function initShitiTongjiArt(i,data){
	$("#reportBoxChildren"+i+" .shitiTongjiArt").show();
	var p14,p15,p16,
		p17,p18,p19,p20,p21,p22;
	//客观题总数 14
	//客观题完成数 15
	//客观题正确率 16
	//主观题总数 17
	//主观题完成数 18
	//主观题批改数 19
	//主观题正确率 20
	//累计积分 21
	//排名 22
	$.each(data, function(j,v) {
		switch(v.id){
			case 14: p14 = v.intValue;
			break;
			case 15: p15 = v.intValue;
			break;
			case 16: p16 = v.strValue;
			break;
			case 17: p17 = v.intValue;
			break;
			case 18: p18 = v.intValue;
			break;
			case 19: p19 = v.intValue;
			break;
			case 20: p20 = v.strValue;
			break;
			case 21: p21 = v.intValue;
			break;
			case 22: p22 = v.strValue;
			break;
		}
	});
	resetShitiTongjiArtInfo(p14,p15,p16,
				p17,p18,p19,p20,p21,p22,i);
}
/**
 * //客观题总数 14
	//客观题完成数 15
	//客观题正确率 16
	//主观题总数 17
	//主观题完成数 18
	//主观题批改数 19
	//主观题正确率 20
	//累计积分 21
	//排名 22
	i 循环下标
 */
function resetShitiTongjiArtInfo(p14,p15,p16,
				p17,p18,p19,p20,p21,p22,i){
	$("#kgtDiv"+i).hide();
	$("#zgtDiv"+i).hide();
	$("#reportBoxChildren"+i+" .shitiTongjiArt").hide();
	if(!p14){
		p14 = 0;
	}else{
		$("#kgtDiv"+i).show();
		$("#reportBoxChildren"+i+" .shitiTongjiArt").show();
	}
	if(!p15) p15 = 0;
	if(!p16) p16 = 0;
	if(!p17){ 
		p17 = 0;
	}else{
		$("#zgtDiv"+i).show();
		$("#reportBoxChildren"+i+" .shitiTongjiArt").show();
	}
	if(!p18) p18 = 0;
	if(!p19) p19 = 0;
	if(!p20) p20 = 0;
	if(!p21) p21 = 0;
	if(!p22) p22 = 0;
	
	$("#kgtTotalBlueBar"+i).css("width",(p14?"calc(100% - 120px)":"0px"));
	$("#kgtHadCompleteBlueBar"+i).css("width",(p14&&p15?$("#kgtTotalBlueBar"+i).width()*(p15/p14):"0px"));
	$("#kgtTotalSpan"+i).text(p14);
	$("#kgtHadCompleteSpan"+i).text(p15);
	$("#kgtZQL"+i).text(p16);
	
	$("#zgtTotalBlueBar"+i).css("width",(p17?"calc(100% - 120px)":"0px"));
	$("#zgtHadCompleteBlueBar"+i).css("width",(p17&&p18?$("#zgtTotalBlueBar"+i).width()*(p18/p17):"0px"));
	$("#zgtHadHanleBlueBar"+i).css("width",(p17&&p19?$("#zgtTotalBlueBar"+i).width()*(p19/p17):"0px"));
	$("#zgtTotalSpan"+i).text(p17);
	$("#zgtHadCompleteSpan"+i).text(p18);
	$("#zgtHadHandleSpan"+i).text(p19);
	$("#zgtZQL"+i).text(p20);
	$("#totalScoreSpan"+i).text(p21);
	$("#rankSpan"+i).text(p22);
}
/**
 * 根据屏幕大小初始化 圆圈滑块显示数量 
 */
function initSlidesPreViewNum(){
	var slidesPerView = 4;
	if(screen.width<=320){
		slidesPerView = 3;
	}else{
		if(screen.width<=414){
			slidesPerView = 4;
		}else{
			slidesPerView = 5;
		}
	}
	var redundantSlidesNum = slidesPerView<3?1:2;//多余的补充slide
	return {slidesPerView:slidesPerView,redundantSlidesNum:redundantSlidesNum};
}
/**
 * 滑动处理 
 * @param {Object} touchEndFn 滑动结束后执行的方法名
 */
function swiperHandle(touchEndFn,slidesPerView,redundantSlidesNum) {
	var initialSlide = $(".swiper-container .swiper-wrapper").children().length - redundantSlidesNum -1;
	var currSlider, defaultTranstformX, position,touchStartTime;
	$(".swiper-container").show();
//	var slidesPerView = 5;
	if(mySwiper)
		mySwiper.destroy();
	mySwiper = new Swiper(".swiper-container", {
		mode: 'horizontal',
		loop: false,
		slidesPerView: slidesPerView,
		centeredSlides: true,
		initialSlide: initialSlide,
		shortSwipes:false,
		onTouchStart: function(s) {
			currSlider = $(".swiper-slide-active");
			defaultTranstformX = $(".swiper-wrapper").css("transform");
			if (!defaultTranstformX || defaultTranstformX == "none") {
				defaultTranstformX = 0;
			} else {
				defaultTranstformX = parseFloat(defaultTranstformX.substring(0, defaultTranstformX.length - 1).split("(")[1].split(",")[4]);
			}
			position = s.touches.current;
			touchStartTime = new Date().getTime();
		},
		onTouchMove: function(e) {
		},
		onTouchEnd: function(e) {
			if(showSlideAlert(e,position,redundantSlidesNum,initialSlide)) return false;
			setTimeout(function() {
				$(".usBox").children().removeAttr("style");//swiper-slide
				var currActive = $(".swiper-slide-active");
				if (currSlider.is(currActive))
					return false;
				var hig = "";
				currActive.children().first().removeAttr("class").addClass("slipe_center");
				var a = currActive.prev().children().first().removeAttr("class").addClass("slipe_middle");//上一个
					a.attr("isEmpty")&&!parseInt(a.attr("isEmpty"))?a.addClass("hig"):"";
				var b = currActive.prev().prev().children().first().removeAttr("class").addClass("slipe_mini");//上上一个
					b.attr("isEmpty")&&!parseInt(b.attr("isEmpty"))?b.addClass("hig"):"";
					b.parent().prevAll().children().removeAttr("class").addClass("slipe_mini");
				var c = currActive.next().children().first().removeAttr("class").addClass("slipe_middle");//下一个
					c.attr("isEmpty")&&!parseInt(c.attr("isEmpty"))?c.addClass("hig"):"";
				var d = currActive.next().next().children().first().removeAttr("class").addClass("slipe_mini");//下下一个
					d.attr("isEmpty")&&!parseInt(d.attr("isEmpty"))?d.addClass("hig"):"";
					d.parent().nextAll().children().removeAttr("class").addClass("slipe_mini");
				$(".swiper-wrapper > :not(.swiper-slide-visible) > :not(.slipe_mini)").removeAttr("class").addClass("slipe_mini"+hig);//other
				if(!($(".slipe_center").parent().nextAll().length-redundantSlidesNum)){
					$(".slipe_center").children().first().css("margin-top","30px");
				}else if($(".slipe_center").parent().nextAll().length-redundantSlidesNum==1){
					$(".slipe_center").parent().next().children().find("div").css("margin-top","30px");
				}else if($(".slipe_center").parent().nextAll().length-redundantSlidesNum>=2){
					var slides = $(".slipe_center").parent().parent().children();
					slides.eq((slides.length-redundantSlidesNum-1)).find("div").css("margin-top","18px");
				}
				if(typeof eval(touchEndFn) === "function")
					eval(touchEndFn+'('+$("[name=reportTab] .hig").attr("data")+',"'+currActive.children().first().attr("tag")+'")');
			}, 300);//touchEnd 后会有0.3s滑动
		},onResistanceAfter:function(s,p){
			//如果当前为最后一个
//			if(!($(".slipe_center").parent().next().length-1) && Math.abs(Math.round(p))>(screen.width/4)){
//				alertToast("已经是最后的啦");
//				mySwiper.swipeTo(initialSlide);
//			}
		},onResistanceBefore:function(s,p){
//			//如果当前为第一个
//			if(!$(".slipe_center").parent().prev().length && Math.abs(Math.round(p))>(screen.width/4))
//				alertToast("已经是最早的啦");
		}
	});
	return mySwiper;
}

/**
 * 显示 已经是最早的啦和已经是最后啦的提示 
 * @param {Object} e
 * @param {Object} position
 * @param {Object} redundantSlidesNum
 * @param {Object} initialSlide
 */
function showSlideAlert(e,position,redundantSlidesNum,initialSlide){
	var isShow = false;;
	var endPosition = e.touches.current;
	var p = endPosition - position;
	//如果当前为最后一个
	if(p < 0){
		if(e.activeIndex > initialSlide ){// || (!($(".slipe_center").parent().next().length-redundantSlidesNum)) && Math.abs(Math.round(p))>100
			mySwiper.swipeTo(initialSlide);
			if($(".slipe_center").parent().nextAll().length-redundantSlidesNum <= 0){
				alertToast("已经是最后的啦");
				isShow = true;
			}
		}
	}else if(p > 0){//最早的
		if(e.activeIndex < redundantSlidesNum){
			mySwiper.swipeTo(redundantSlidesNum);
			if($(".slipe_center").parent().prevAll().length-redundantSlidesNum <= 0){
				alertToast("已经是最早的啦");
				isShow = true;
			}
		}
	}
	return isShow;
}

/**	
 * 未完成任务列表 初始化
 */
function initNoFinishedHomework(){
	var param = getQueryStringFromUrl();
	var belongType = param.belongType;
	if(!belongType){
		alertToast("belongType不能为空")
		return false;
	}
	//int	所属：1:校内2:课外班
	var data="jid="+jid+"&schoolId="+schoolId+"&belongType="+belongType;
	getSignCode(data,Config.getUnFinTaskListBySubUrl().split("?m=")[1],"noFinishedHomeworkReq");
}
/**
 * 未完成任务列表 请求 
 * @param {Object} data
 */
function noFinishedHomeworkReq(data){
	postAjaxJSON(Config.getUnFinTaskListBySubUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			var noFinishedList = $("#noFinishedList");
			$.each(data.subTaskList, function(i,v) {
				var subHtml = '<div class="no_finish_homeword_box">'+
							  '<div class="title">'+v.subName+
							  '<p>（共<span>'+v.taskList.length+'</span>项）</p>'+
							  '</div>';
				subHtml+='<ul class="list_box">';
				$.each(v.taskList,function(j,k){
					var liHtml = '<li>'+
							'<div class="name">'+k.taskName+'</div>'+
							'<div class="bottom">'+
							'	<p class="time_tongji">剩余<span class="time '+(k.isUrgent?'colorf5':'')+'">'+k.dateHint+'</span></p>'+
					 		'	<div class="num_box">'+k.scaleHint+'</div>'+
							'</div>'+
							'</li>';
					subHtml+=liHtml;
				});
				subHtml+='</ul></div>';
				noFinishedList.append(subHtml);
			});
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取未完成任务列表返回结果错误!");
			}
		}
	},function(){
		alertToast("获取未完成任务列表请求失败!");
	});
}

/**
 * 初始化 校内学习/课外班 
 * @param dataType 1:周报2:月报
 */
function initStudyReport(dateType,tag){
	var param = getQueryStringFromUrl();
	var schoolType = param.schoolType;
	//int	所属：1:校内2:课外班
	if(!schoolType){
		alertToast("schoolType不能为空")
		return false;
	}
	var data="jid="+jid+"&schoolType="+schoolType+"&dateType="+dateType;
	if(tag)
		data+="&tag="+tag;
	getSignCode(data,Config.getChildStudyStateUrl().split("?m=")[1],"studyReportReq");
}
/**
 * 校内学习/课外班请求
 * @param {Object} data
 */
function studyReportReq(data){
	var param = getParam2Json(data);
	var studyReportBox = $("#studyReportBox").hide();
	$("#totalNumber").remove();
	$(".pieChartArt").hide();
	$(".lineChartArt").hide();
	$(".shitiTongjiArt").hide();
	$("#errorZW").hide();
	$("#noStudyZW").hide();
	$("#noDataZW").hide();
	if(!param.tag) $(".pieSlideArt").hide();
	if(param.tag == "undefined") return false;
	postAjaxJSON(Config.getChildStudyStateUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(!param.tag){//默认时
				var pieSliderList = $("#pieSliderList").html("");
				var isNotAllEmpty = false;
				var lastTag = '';
				$.each(data.dateStrList, function(i,v) {
					var sliderClass = '',dateStr="";
					if(data.dateStrList.length - i == 2){
						sliderClass = 'slipe_middle';
					}else if(data.dateStrList.length - i == 1){
						sliderClass = 'slipe_center';
					}else{
						sliderClass = 'slipe_mini';
					}
					if(data.dateStrList.length - i == 1){
						dateStr = '<div style="margin-top:30px;">'+v.dateStr1+'</div>';
						lastTag = v.tag; 
					}else{
						dateStr = '<div>'+v.dateStr1+'<p>~</p>'+v.dateStr2+'</div>';
					}
					if(!v.isEmpty){//1是0否
						if(data.dateStrList.length - i != 1)
							sliderClass+=' hig';
						if(!isNotAllEmpty)isNotAllEmpty = true;
					}
					var subHtml = '<div class="usBox unitBox swiper-slide"><span tag="'+v.tag+'" isEmpty="'+v.isEmpty+'"  class="'+sliderClass+'">'+dateStr +'</span></div>';
					pieSliderList.append(subHtml);
				});
				if(!isNotAllEmpty){
					$("#noDataZW").show();
					return false;
				}
				$(".pieSlideArt").show();
				var preViewNum = initSlidesPreViewNum();
				var classStr = ["slipe_middle","slipe_mini"];
				var classStrBefor = classStr[1]; 
				for(var i=0;i<preViewNum.redundantSlidesNum;i++){
					//补充空白圆
					pieSliderList.append('<div class="usBox unitBox swiper-slide"><span class="'+classStr[i]+'"></span></div>');
					pieSliderList.prepend('<div class="usBox unitBox swiper-slide"><span class="'+classStrBefor+'"></span></div>');
				}
				swiperHandle("initStudyReport",preViewNum.slidesPerView,preViewNum.redundantSlidesNum);
				initStudyReport($("[name=reportTab] .hig").attr("data"),lastTag);
			}else{//tag不为空时
				$(".pieSlideArt").show();
				var currIsEmpty = $(".slipe_center").attr("isEmpty");//1是 0否
				if(parseInt(currIsEmpty)){
					$("#noStudyZW").show();
					return false;
				}
				studyReportBox.html("").show();
				$.each(data.stateInfoList, function(i,v) {
					drowStudyReportBoxChildren(studyReportBox,i,data.stateInfoList.length);
					initTaskStatisticPieArt(i,v.valueInfoList);
					initQuestionStatisticLineChart(i,v.valueInfoList);
					initShitiTongjiArt(i,v.valueInfoList);
					$("#studyReportBox").animate({"scrollTop":0},50);
				});
			}
		}else{
			if(!param.tag)//默认时
				$(".pieSlideArt").hide();
			$("#errorZW").show();
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取信息返回结果错误!");
			}
		}
	},function(){
		if(!param.tag)//默认时
				$(".pieSlideArt").hide();
		$("#errorZW").show();
		alertToast("获取信息请求失败!");
	});
}

/**
 * 填充 reportBox内容
 * @param {Object} reportBox
 * @param {Object} i 循环下标
 */
function drowStudyReportBoxChildren(reportBox,i,maxLength){
	var subHtml='<div id="reportBoxChildren'+i+'">'+
				'<article class="subjectTitle"></article>'+
				'<article class="pieChartArt">'+
				'	<div class="report_sub_title">'+
				'		任务统计'+
				'	</div>'+
				'	<div id="pieChartDiv'+i+'" style="height:300px;width: 100%;">'+
				'	</div>'+
				'	<div class="legend_div">'+
				'		<ul>'+
				'			<li><span class="bgcFA8874"></span>学资源</li>'+
				'			<li><span class="bgc73D4FA"></span>一般任务</li>'+
				'			<li><span class="bgcF9A574"></span>直播课</li>'+
				'			<li><span class="bgc74ABF9"></span>做题</li>'+
				'			<li><span class="bgcF3D357"></span>微课程</li>'+
				'			<li><span class="bgcAFB0FB"></span>测验</li>'+
				'			<li><span class="bgc5FD86A"></span>讨论</li>'+
				'			<li><span class="bgcAC76F8"></span>自测</li>'+
				'		</ul>'+
				'	</div>'+
				'</article>'+
				'<article class="lineChartArt">'+
				'	<div class="report_sub_title">'+
				'		试卷统计'+
				'	</div>'+
				'	<div id="lineChartDiv'+i+'" style="height:250px;width: 100%;position: relative;">'+
				'	</div>'+
				'</article>'+
				'<article class="shitiTongjiArt">'+
				'	<div class="report_sub_title">'+
				'		试题统计'+
				'	</div>'+
				'	<div class="tongji_container">'+
				'		<div id="kgtDiv'+i+'">'+
				'			<div class="subtitle">客观题</div>'+
				'			<div class="tongji_block">'+
				'				<div>总题数<span id="kgtTotalBlueBar'+i+'" class="blueBar" style="width: 1px;"></span><span id="kgtTotalSpan'+i+'">0</span>道</div>'+
				'				<div>已完成<span id="kgtHadCompleteBlueBar'+i+'" class="blueBar75" style="width: 1px;"></span><span id="kgtHadCompleteSpan'+i+'">0</span>道</div>'+
				'			</div>'+
				'			<div class="zql">正确率 <span id="kgtZQL'+i+'">0%</span></div>'+
				'		</div>'+
				'		<div id="zgtDiv'+i+'">'+
				'			<div class="subtitle">主观题</div>'+
				'			<div class="tongji_block">'+
				'				<div>总题数<span id="zgtTotalBlueBar'+i+'" class="blueBar" style="width: 1px;"></span> <span id="zgtTotalSpan'+i+'">0</span>道</div>'+
				'				<div>已完成<span id="zgtHadCompleteBlueBar'+i+'" class="blueBar75" style="width: 1px;"></span> <span id="zgtHadCompleteSpan'+i+'">0</span>道</div>'+
				'				<div>已批改<span id="zgtHadHanleBlueBar'+i+'" class="blueBar60" style="width: 1px;"></span> <span id="zgtHadHandleSpan'+i+'">0</span>道</div>'+
				'			</div>'+
				'			<div class="zql">得分率 <span id="zgtZQL'+i+'">0%</span></div>'+
				'		</div>'+
				'	</div>'+
				'</article>'+
				'<div class="tongji_container" style="clear: both;">'+
				'	<hr style="margin: 0 30px;border: 0.5px solid #DCDCDC;border-top: 1px solid #DCDCDC;border-bottom: 0;">'+
				'	<div class="zonghe">'+
				'		<div class="content">'+
				'			累计积分 <span id="totalScoreSpan'+i+'">0</span>,'+
				'			排名 <span id="rankSpan'+i+'">0/0</span>'+
				'		</div>'+
				'	</div>'+
				'</div>'+
				(i==maxLength-1?'':'<div class="h10"></div>')+
				'</div>';
		reportBox.append(subHtml);
}

/**
 * 自主学习
 * @param dateType 1:周报2:月报
 */
function initIndependenceStudy(dateType,tag){
	var param = getQueryStringFromUrl();
	if(!dateType)
		dateType = 1;
	var data="jid="+jid+"&dateType="+dateType;
	if(tag)
		data+="&tag="+tag
	getSignCode(data,Config.getChildStudySelfStateUrl(),"independenceStudyReq");
}
/**
 * 自主学习请求 
 * @param {Object} data
 */
function independenceStudyReq(data){
	var param = getParam2Json(data);
	$("#errorZW").hide();
	$("#noStudyZW").hide();
	$("#noDataZW").hide();
	var independentStudentBox = $("#independentStudentBox").hide();
	if(!param.tag) $(".pieSlideArt").hide();
	if(param.tag == "undefined") return false;
	postAjaxJSON(Config.getChildStudySelfStateUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(!param.tag){//默认时
				var pieSliderList = $("#pieSliderList").html("");
				var isNotAllEmpty = false;
				var lastTag = '';
				$.each(data.dateStrList, function(i,v) {
					var sliderClass = '',dateStr="";
					if(data.dateStrList.length - i == 2){
						sliderClass = 'slipe_middle';
					}else if(data.dateStrList.length - i == 1){
						sliderClass = 'slipe_center';
					}else{
						sliderClass = 'slipe_mini';
					}
					if(data.dateStrList.length - i == 1){
						dateStr = '<div style="margin-top:30px;">'+v.dateStr1+'</div>';
						lastTag = v.tag; 
					}else{
						dateStr = '<div>'+v.dateStr1+'<p>~</p>'+v.dateStr2+'</div>';
					}
					if(!v.isEmpty){//1是0否
						if(data.dateStrList.length - i != 1)
							sliderClass+=' hig';
						if(!isNotAllEmpty)isNotAllEmpty = true;
					}
					var subHtml = '<div class="unitBox swiper-slide"><span tag="'+v.tag+'" isEmpty="'+v.isEmpty+'"  class="'+sliderClass+'">'+dateStr +'</span></div>';
					pieSliderList.append(subHtml);
				});
				if(!isNotAllEmpty){
					$("#noDataZW").show();
					return false;
				}
				$(".pieSlideArt").show();
				var preViewNum = initSlidesPreViewNum();
				var classStr = ["slipe_middle","slipe_mini"];
				var classStrBefor = classStr[1]; 
				for(var i=0;i<preViewNum.redundantSlidesNum;i++){
					//补充空白圆
					pieSliderList.append('<div class="usBox unitBox swiper-slide"><span class="'+classStr[i]+'"></span></div>');
					pieSliderList.prepend('<div class="usBox unitBox swiper-slide"><span class="'+classStrBefor+'"></span></div>');
				}
				swiperHandle("initIndependenceStudy",preViewNum.slidesPerView,preViewNum.redundantSlidesNum);
				initIndependenceStudy($("[name=reportTab] .hig").attr("data"),lastTag);
			}else{//tag不为空时
				$(".pieSlideArt").show();
				var isNoData = true;
				if(!data.valueInfoList || !data.valueInfoList.length){
					$("#noStudyZW").show();
					return false;
				}
				
				$.each(data.valueInfoList,function(i,v){
					var intValue = parseInt(v.intValue);
					/*
					if(v.id==1 && parseInt(v.intValue)==0){
						$("#noStudyZW").show();
						isNoData = true;
						return false;
					}else
					*/
					if(v.id==2){//在线班学习
						if(intValue!=-1){
							$("#valueInfo"+v.id).parents("li").show();
							if(intValue)
								isNoData = false;
						}
					}else if(v.id==5){//测验n次,共测试题数
						noJoinStyleHandle((intValue==0),v.id);
					}else if(v.id==22){
						if(intValue!=-1 && intValue)
							isNoData = false;
					}else{						
						if(intValue) isNoData = false;
					}
					$("#valueInfo"+v.id).text(intValue);
				});
				if(isNoData){
					$("#noStudyZW").show();
					return false;
				} 
				//直播课 未参与处理
				noJoinStyleHandle((!parseInt($("#valueInfo10").text()) &&
								   !parseInt($("#valueInfo11").text()) &&
								   !parseInt($("#valueInfo12").text())),
								 10);
				//高清课堂 未参与处理
				noJoinStyleHandle((!parseInt($("#valueInfo8").text())),
								 8);
				//知识导学 未参与处理
				noJoinStyleHandle((!parseInt($("#valueInfo9").text())),
								 9);
				//互帮互学 未参与处理
				noJoinStyleHandle((!parseInt($("#valueInfo13").text()) &&
								   !parseInt($("#valueInfo14").text())),
								 13);
				//学习战队 未参与处理
				if(!parseInt($("#valueInfo22").text()) || parseInt($("#valueInfo22").text())==-1){
					$("#valueInfo22").parent().hide().parents("li").removeAttr("class").addClass("desible");
					var desc= "未参与";
					if(parseInt($("#valueInfo22").text())==-1) desc = "还没加入战队";
					if($("#noJoin_valueInfo22").length){//未参与
						$("#noJoin_valueInfo22").text(desc).show();
					}else{
						$("#valueInfo22").parent().parent().append('<p id="noJoin_valueInfo22">'+desc+'</p>');
					}
				}else{
					$("#valueInfo22").show().parents("li").removeAttr("class");
					if($("#noJoin_valueInfo22").length)//未参与
						$("#noJoin_valueInfo22").hide();
				}
				
				//天天单词  未参与处理
				noJoinStyleHandle((!parseInt($("#valueInfo15").text())  &&
									!parseInt($("#valueInfo16").text()) &&
									!parseInt($("#valueInfo17").text()) &&
									!parseInt($("#valueInfo18").text())),
								 15);
				//作文天地  未参与处理
				noJoinStyleHandle((!parseInt($("#valueInfo19").text())  &&
									!parseInt($("#valueInfo20").text()) &&
									!parseInt($("#valueInfo21").text())),
								 19);
				independentStudentBox.show();
			}
		}else{
			$("#errorZW").show();
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取自主学习返回结果错误!");
			}
		}
	},function(){
		$("#errorZW").show();
		alertToast("获取自主学习请求失败!");
	});
}
/**
 * 未参与样式处理 
 * @param {Object} condition 条件
 * @param {Object} id v.id
 * 
 */
function noJoinStyleHandle(condition,id){
	if(condition){
		$("#valueInfo"+id).parent().hide().parents("li").removeAttr("class").addClass("desible");
		if($("#noJoin_valueInfo"+id).length){//未参与
			$("#noJoin_valueInfo"+id).show();
		}else{
			$("#valueInfo"+id).parent().parent().append('<p  id="noJoin_valueInfo'+id+'">未参与</p>');
		}
	}else{
		$("#valueInfo"+id).parent().show().parents("li").removeAttr("class");
		if($("#noJoin_valueInfo"+id).length)//未参与
			$("#noJoin_valueInfo"+id).hide();
	}
}

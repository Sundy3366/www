function getBulletList(pageNum){
	pageNum = pageNum!=undefined ? pageNum:1;
	var data="jid="+jid+"&schoolId="+schoolId+"&pageNum="+pageNum;
	getSignCode(data,Config.getNoticeListUrl().split("?m=")[1],"bulletList_");
}
function bulletList_(data){
	var catchFlag = false;
	postAjaxJSON(Config.getNoticeListUrl(),data,function(data){
		if(data && data.result > 0){
			//&& (data.result==1 || data.result==2)
			var pageNum = data.data.pageNum;
			var noticeList = data.data.noticeList;
			$(".bottomMoreLoading").attr("status","true");
             if((!noticeList || !noticeList.length) && !$("#noticeList").children().first().children().length){
                 $(".bl_img_div").show().prev().hide();
                 $(".bottomMoreLoading").attr("status","false");
                 return false;
             }
			if(data.result == 2 || data.result == 3){
				$(".bottomMoreLoading").attr("status","false");
				if(data.result == 3){
					if(!$("#noticeList .swiper-wrapper").children().length){
						$(".bl_img_div").show().prev().hide();
						$(".bottomMoreLoading").attr("status","false");
						
					}
					return false;
				}
			}
			
			currPageNum=parseInt(pageNum);
			if(noticeList&& noticeList.length){
				if(touchType == 1)	
					document.getElementById("noticeList").children[0].innerHTML="";
				for(i=0;i<noticeList.length;i++){
					/*
					var noticeItem = document.createElement("li");
					noticeItem.setAttribute("class", "mt17Pix");
					noticeItem.setAttribute("onclick","noticeDetail(\'"+noticeList[i].noticeUrl+"\');");
					var noticeItemStr = "";
					noticeItemStr+='<div class="con">'+noticeList[i].noticeTitle+
						'<div class="msg_box"><label class="publisher_i">发布者：</label><label class="pr8Pix w_30Pix tex_ellipsis fl">'+noticeList[i].userName+'</label>  <label>'+noticeList[i].noticeTime+'</label></div>'+
					'</div>';
					noticeItem.innerHTML = noticeItemStr;
					document.getElementById("noticeList").appendChild(noticeItem);					
					*/
					var noticeItem = document.createElement("div");
					noticeItem.setAttribute("class", "swiper-slide");
                    noticeItem.setAttribute("data", noticeList[i].noticeUrl);
//					noticeItem.setAttribute("ontouchend","noticeDetail(\'"+noticeList[i].noticeUrl+"\');");
					var noticeItemStr = "";
					noticeItemStr+='<time style="padding:8.5px 0;"></time><div class="con">'+noticeList[i].noticeTitle+
						'<div class="msg_box" style="width: auto; bottom: 0;line-height: 3.5;"><label class="publisher_i">发布者：</label><label class="pr8Pix w_30Pix tex_ellipsis fl">'+noticeList[i].userName+'</label>  <label>'+noticeList[i].noticeTime+'</label></div>'+
					'</div>';
					noticeItem.innerHTML = noticeItemStr;
                    touch.on($(noticeItem).off(),'tap',function(ev){
                        var ali = $(ev.currentTarget);
                        noticeDetail(ali.attr("data"));
                    });
					document.getElementById("noticeList").children[0].appendChild(noticeItem);
				}
				touchOutHandle(bulletinListUpDownHandle);
			}
		}else{
			if(data){
//				alertInfo(data.msg);
				$(".bl_img_div").show();
			}else{
				alertToast("校内公告返回结果错误!");
			}
			catchFlag = true;
		}
	},function(){
		catchFlag = true;
		alertToast("校内公告请求失败!");
	});
	if(catchFlag)
		touchOutHandle(bulletinListUpDownHandle);
}

function noticeDetail(url){
	if(!isH5Only){
		window.location.href = url+'://schoolNotice?title=[公告详情,false,,]&rightHandle:[isExist:false]';
	}else{
		window.location.href = "bulletin_detail.html?noticeDetailUrl="+url;
	}
}

/**
 *  通知列表上拉刷新,下拉加载处理
 */
function bulletinListUpDownHandle(){
	//下拉刷新,上拉加载
	upAndDownSwiperWrapper('.swiper-container',
  			'.topFlushLoading',function(mySwiper){
  				$('.topFlushLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 1;
  				currMySwiper = mySwiper;
  				getBulletList(1);
  			},
  			'.bottomMoreLoading',function(mySwiper){
  				$('.bottomMoreLoading').addClass('visible');
  			},function(mySwiper){
  				touchType = 0;
  				currMySwiper = mySwiper;
  				loadingMore4BulletinList();
  			});
}

/**
 * 加载更多
 */
function loadingMore4BulletinList(){
	getBulletList(currPageNum+1);
}
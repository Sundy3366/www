/**
 * 公共js
 */
//***********************common var start*******************************
//测试临时变量,为true时不与iOS交互
var isH5Only = false;
//测试地址:测试A或测试C,值为A/C
var testServerFlag="C";


/**
 * 配置来源
 * 0:云端,1:城域网
 * @date 2017-07-07 15:12:36
 * @author kangxuefeng@etiantian.com
 */
var CONFIG_FROM = {
	CLOUD:0,
	DONG_GUA:1
}
/**
 * 公共配置对象
 * @date 2017-07-07 15:12:36
 * @author kangxuefeng@etiantian.com
 */
var Config = {
	/**
	 * 配置文件,选择是否是城域网
	 * @type {number} 0:云端,1:城域网
	 */
	CONFIG_FROM: CONFIG_FROM.CLOUD,//TODO 默认为CLOUD
	/**
	 * 网校爱学域名地址（study-im-service-2.0及app-common-service）
	 * 测试A
	 */
	IM_SERVICE_DOMAIN: "http://i2.m.etiantian.com:48081/",
	/**
	 * 数校爱学域名地址
	 * 测试A
	 */
	AIXUE_DOMAIN: "http://school.etiantian.com/",
	/**
	 * 爱学项目名
	 */
	SX_AIXUE_PROJECT_NAME :"dl910ta"

};
/**
 * 与iOS交互的url前最定义
 */
var IOS_LISTEN_URL_PREFIXS = {
	/**
	 * 教师设置页面
	 */
	TO_TEACHER_CONFIG_PAGE: "://toTeacherConfigPage",
	/**
	 * 家长设置页
	 */
	TO_PARENT_CONFIG_PAGE: "://toParentConfigPage"
};

//个性化推荐链接 公用路径(测试)
var BASE_API_URL = "http://gw1.bj.etiantian.net:15981/recommendation-service";
var getResourceUrl=BASE_API_URL +'/api/recommendation/getResource.do';
var feedbackUrl=BASE_API_URL +'/api/feedback/feedback.do';
var getQuestionUrl=BASE_API_URL +'/api/recommendation/getQuestion.do';
var submitAnswerUrl=BASE_API_URL +'/api/recommendation/submitAnswer.do';
var getPlaySourceUrl=BASE_API_URL +'/api/microVideo/getPlaySource.do';
var recordLogsUrl=BASE_API_URL +'/api/feedback/recordLogs.do';
var recordStudentLogsUrl=BASE_API_URL +'/api/logs/recordStudentLogs.do';
var recordStudentStudyLogsUrl=BASE_API_URL +'/api/logs/recordStudentStudyLogs.do';
var getPlayUrl=BASE_API_URL +'/api/microVideo/getPlayUrl.do';
var changeHdLineUrl=BASE_API_URL +'/api/microVideo/changeHdLine.do';
var getAccessTokenUrl=BASE_API_URL +'/api/recommendation/getAccessToken.do';
var praiseVideoUrl=BASE_API_URL +'/api/microVideo/praiseVideo.do';

/*
 * 网校Config.baseUrl 测试A
 */
Config.baseUrl = function(){return Config.IM_SERVICE_DOMAIN + "study-im-service-2.0/"};

/**
 * 公共项目接口 测试A
 */
Config.commonBaseUrl = function(){return Config.IM_SERVICE_DOMAIN + "app-common-service"};
/**
 * 晒晒接口地址 测试A
 */
Config.shaishaiBaseUrl = function(){return Config.IM_SERVICE_DOMAIN + "shaishai_2_0_0"};
/**
 * 数校爱学项目地址
 */
Config.SX_AIXUE_PROJECT_URL = function(){return Config.AIXUE_DOMAIN + Config.SX_AIXUE_PROJECT_NAME};
/**
 * 数校 测试A sc910ta需改为dl910ta(修改时间:2016年3月22日 12:00:14)
 */
Config.shuxiaoBaseUrl =      function(){return Config.SX_AIXUE_PROJECT_URL()+"/im2.0.1"};
Config.shuxiaoBaseUrl2_0 =   function(){return Config.SX_AIXUE_PROJECT_URL()+"/im2.0"};
Config.shuxiaoBaseUrl2_0_3 = function(){return Config.SX_AIXUE_PROJECT_URL()+"/im2.0.3"};
Config.shuxiaoBaseUrl2_0_4 = function(){return Config.SX_AIXUE_PROJECT_URL()+"/im2.0.4"};
Config.shuxiaoBaseUrl2_0_5 = function(){return Config.SX_AIXUE_PROJECT_URL()+"/im2.0.5"};
Config.shuxiaoBaseUrl2_2_2 = function(){return Config.SX_AIXUE_PROJECT_URL()+"/im2.2.2"};
Config.testTaskUrl = function(){return Config.shuxiaoBaseUrl2_0_4() + "?m=imGenderPaperTest"};

/**
 * 测试C
 */
if(testServerFlag=="C"){
	Config.IM_SERVICE_DOMAIN = "http://i.im.etiantian.net/";
	Config.SX_AIXUE_PROJECT_NAME = "aixue21";
}

/**
 * @description
 *  生成加密签名Url
 *  请求类型:POST
 *  输入参数:JSON Object,请求字段json对象
 *  输出参数:$.trim(data)
 *  @author xuefeng.kang
 */
var generateSignUrl = "http://school.etiantian.com/sc910ta/_ImTest/_manager/GenderCourseRecordSign.jsp";

/**
 * @description
 * IM-WEB119-V2 班级列表
 * 教师--班级详情页
 * 	请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称	 	 			数据类型	参数说明	必填	非空
			jid	 	 			String	用户jid	是	是
			schoolId			String	学校id	是	是
			time	 			long	当前时间毫秒数	是	是
			sign	 			String	加密签名	是	是
 *  输出参数
 * 			result	 			int		1：返回成功
										<= 0：失败	是	是
			msg	 	 			String	提示信息	是	是
			data		Object					是	是
						canCreate int	是否可以创建班级
											1是0否	是	是
					 	classList ArrayObject	 	 	 
				 	 	classId	  String	班级id	是	是
				 	 	className String	班级名		是	是
				 	 	classType int		班级类型	是	是
 * @author xuefeng.kang
 */
Config.getClassListUrl = function(){return Config.baseUrl()+"/user/getClassList.do"};

/**
 * @description
 * IM-WEB120-V2 班级详情
 * 教师--班级详情页
 * 	请求类型:GET
 *  输出格式:JSON
 *  输入参数:参数名称	 	 			数据类型	参数说明	必填	非空
 * 			jid	 	 			String	用户jid	是	是
			schoolId			String	学校id	是	是
			classId	 			String	通知id	是	是
			time	 			long	当前时间毫秒数	是	是
			sign	 			String	加密签名	是	是
*  输出参数
			result	 			int		1：返回成功
										<= 0：失败	是
			msg	 	 			String	提示信息	是
			data	 			Object	 	是
					invitationCode int	邀请码
					teacherList	 Object
						userId	 String	jid 
				 	 	userName String	名字 
				 	 	userPhoto String 照片
				 	 	userType  int	 3=学生
										 4=学生（演示账号）
										 1=教师（教师版用户）
										 2=教师（后台管理员）
										 6=家长
			 	 		subjectStr	String	科目type拼接，逗号隔开	否
			 	 		isMaster	int	班主任为1，默认为0 
					 	studentList	同上 	 	 
					 	partentList	同上
 * @author xuefeng.kang					 	
 */
Config.getTeacherClassUserListUrl = function(){return Config.baseUrl()+"/user/getTeacherClassUserList.do"};


/**
 * @description
 * IM-WEB123-V2.编辑班级成员
 * 教师---班级管理---班级列表+新建班+创建班
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
		   	jid				String	用户jid	是	是
			schoolId		String	学校ID	是	是
			classId			String	班级id	是	是
			changeUid		String	要删除人的id	是	是
			subjectStr 		String	科目type拼接，逗号隔开	否	 
			isMaster		int		1是，0否 班主任	否	 
			isDel			int		1是，0否，2是并且禁止再加入	是	 
			time			long	当前时间毫秒数	是	是
			sign			String	加密签名	是	是
 *  输出参数
 * 			result			int		1：返回成功
									<= 0：失败	是	是
			msg				String	提示信息	是	是
			data			Object	 		是	是

 * @author xuefeng.kang 
 */
Config.managerClassMemberUrl=function(){return Config.shuxiaoBaseUrl()+"?m=managerClassMember.do"};
/**
 * @description
 * IM-SCH1-V2.0.1 教师班级内小组列表
 * 教师---班级管理---班级列表---班级详情---小组
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
		  jid	 	 		String	用户jid	是	是
		  schoolId	 	 	String	实验班的数校id	是	是
		  classId	 	 	String	班id		是	是
		  subjectId	 	 	int		科目id	是	是
		  time	 	 		long	当前时间毫秒数	是	是
		  sign	 	 		String	加密签名	是	是
 *  输出参数
		 result	 	 		int		> 0：返回成功
									<= 0：失败	是	是	　	　	 	　
		 msg	 	 		String	提示信息	是	是	正常情况下只有result小于0才进行前台显示	　	 	请参照需求要求
		 data	 	 		Object	 		是	否	必需返回，允许为空
		 		classGroupList 	ObjectArray	班级内小组合集列表	否	是	 	 	 	 
		 	 	groupId		String	小组id	是	是	 	 	 	 
		 	 	groupName	String	小组名	是	是	 	 	 	 
		 	 	groupUserNum int	小组成员数	否	否	
									>=0

 * 			
 * @author xuefeng.kang 
 */
Config.getClassGroupListUrl = function(){return Config.shuxiaoBaseUrl()+"?m=getClassGroupList.do"};
/**
 * @description
 * IM-WEB201-V2.0.5 教师年级科目列表
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
		 jid	 	 	 	String	用户jid	是	是
		 schoolId	 	 	String	学校id	 	 
		 time	 	 	 	long	当前时间毫秒数	是	是
		 sign	 	 	 	String	加密签名	是	是
 *  输出参数
	　	result	 	 	 	int	> 0：返回成功
								<= 0：失败		是	是	　
	　	msg	 	 	 		String	提示信息	是	是	　
	　	data	 	 		Object	 		是	是	 
	 	 	subjectList		ArrayObject	 	 	 	 
 	 	 	subjectId		int	科目id		是	是	 
 	 	 	gradeId	 		int	年级id		是	是	 
 	 	 	materialId 	 	String	教材id	否	否	 
 	 	 	classList	 	ArrayObject	 	 	 	 
 	 	 	 	classId		String	班级id	是	是	 
	 	 	 	className	String	班级名		是	是	 
 * 			
 * @author xuefeng.kang 
 */
Config.getTeacherSubjectListUrl = function(){return Config.shuxiaoBaseUrl()+"?m=getTeacherSubjectList.do"};
/**
 * @description
 * IM-SCH2-V2.0.1 教师班级内新建小组
 * 教师---班级管理---班级列表---班级详情---小组---新建小组
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid				String	用户jid	是	是	 
			schoolId		String	实验班的数校id	是	是	 
			classId			String	班id	是	是	 
			subjectId		int	科目id	是	是	 
			groupName		String	小组名	是	是	 
			time			long	当前时间毫秒数	是	是	　
			sign			String	加密签名	是	是	　

 *  输出参数
		　	result			int		> 0：返回成功
									<= 0：失败	是	是	　
			msg				String	提示信息	是	是	正常情况下 只有result小于0才进行前台显示
			data			Object	 	是	否	 
 * 			
 * @author xuefeng.kang 
 */
Config.createClassGroupUrl = function(){return Config.shuxiaoBaseUrl()+"?m=createClassGroup.do"};

/**
 * @description
 * IM-WEB122-V2 加入班级
 * 教师---班级管理---班级列表+新建班+创建班
 * @author baoan.li
 */
Config.managerClassUrl = function(){return Config.shuxiaoBaseUrl()+"?m=managerClass.do"};

/**
 * @description
 * IM-SCH200-V2.0.5 获得教师主页信息
 * @author baoan.li
 */
Config.getTeacherHomePageInfoUrl = function(){return Config.shuxiaoBaseUrl2_0_5()+"?m=getTeacherHomePageInfo.do"};
/**
 * @description
 * IM-WEB201-V2.0.5 教师年级科目列表
 * @author baoan.li
 */
Config.getTeacherSubjectListUrl = function(){return Config.shuxiaoBaseUrl()+"?m=getTeacherSubjectList.do"};

/**
 * @description
 * IM-WEB86-V2.获得全部学校接口
 * @author baoan.li
 */
Config.getSchoolListUrl = function(){return Config.shuxiaoBaseUrl()+"?m=getSchoolList.do"};

/**
 * @description
 * IM-WEB87-V2.获得学校对应年级全部班级接口
 * @author baoan.li
 */
Config.getClassListBySchoolUrl = function(){return Config.shuxiaoBaseUrl()+"?m=getClassListBySchool.do"};

/**
 * @description
 * IM-WEB121-V2 班级创建
 * @author baoan.li
 */
Config.createClassUrl = function(){return Config.shuxiaoBaseUrl()+"?m=createClass.do"};


/**
 * @description
 * IM-SCH2-V2.0.1 教师班级内新建小组
 * 教师---班级管理---班级列表---班级详情---小组---新建小组
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid				String	用户jid	是	是	 
			schoolId		String	实验班的数校id	是	是	 
			classId	 	 	String	班id	是	是
			groupId	 	 	String	小组id	是	是
			time	 	 	long	当前时间毫秒数	是	是
			sign	 	 	String	加密签名	是	是	　
 *  输出参数
		　	result			int		> 0：返回成功
									<= 0：失败	是	是	　
			msg				String	提示信息	是	是	正常情况下 只有result小于0才进行前台显示
			data	 	 	Object	 	是	否	 	　	 	必需返回，允许为空
		 	   userList	 	ObjectArray	小组成员列表	否	是	 	 	 	 
		 	 	userId		String	用户jid	是	是	 	 	 	 
		 	 	sxUserId	String	数校用户id	是	是	 	 	 	 
		 	 	userName	String	用户名	是	是	 	 	 	 
		 	 	userPhoto	String	用户头像	是	是	 	 	 	 
 * 			
 * @author xuefeng.kang 
 */
Config.getClassGroupInfoUrl = function(){return Config.shuxiaoBaseUrl()+"?m=getClassGroupInfo.do"};
/**
 * @description
 * IM-SCH3-V2.0.1 教师班级内删除小组
 * 教师---班级管理---班级列表---班级详情---小组---删除小组
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid				String	用户jid	是	是	 
			schoolId		String	实验班的数校id	是	是	 
			classId	 	 	String	班id	是	是
			groupId	 	 	String	小组id	是	是
			time	 	 	long	当前时间毫秒数	是	是
			sign	 	 	String	加密签名	是	是	　
 *  输出参数
		　	result			int		> 0：返回成功
									<= 0：失败	是	是	　
			msg				String	提示信息	是	是	正常情况下 只有result小于0才进行前台显示
			data	 	 	Object	 	是	否	 	　	 	必需返回，允许为空
 * 			
 * @author xuefeng.kang 
 */
Config.delClassGroupUrl = function(){return Config.shuxiaoBaseUrl()+"?m=delClassGroup.do"};
/**
 * @description
 * IM-SCH4-V2.0.1 教师班级内小组改名
 * 教师---班级管理---班级列表---班级详情---小组---编辑
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid				String	用户jid	是	是	 
			schoolId		String	实验班的数校id	是	是	 
			classId	 	 	String	班id	是	是
			groupId	 	 	String	小组id	是	是
			groupName		String	小组名	是	是
			time	 	 	long	当前时间毫秒数	是	是
			sign	 	 	String	加密签名	是	是	　
 *  输出参数
		　	result			int		> 0：返回成功
									<= 0：失败	是	是	　
			msg				String	提示信息	是	是	正常情况下 只有result小于0才进行前台显示
			data	 	 	Object	 	是	否	 	　	 	必需返回，允许为空
 * 			
 * @author xuefeng.kang 
 */
Config.changeClassGroupName = function(){return Config.shuxiaoBaseUrl()+"?m=changeClassGroupName.do"};
/**
 * @description
 * IM-SCH4-V2.0.1 教师班级内小组改名
 * 教师---班级管理---班级列表---班级详情---小组---调至
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid				String	用户jid			是	是	 
			schoolId		String	实验班的数校id	是	是	 
			classId	 	 	String	班id				是	是
			fromGroupId		String	原小组id			是	是
			toGroupId		String	新小组id			是	是
			userListStr		String	调动人员数校id字符串以逗号分割：id1,id2	是	是
			time			long	当前时间毫秒数	是	是
			sign			String	加密签名			是	是
 *  输出参数
		　	result			int		> 0：返回成功
									<= 0：失败		是	是	　
			msg				String	提示信息			是	是	正常情况下 只有result小于0才进行前台显示
			data	 	 	Object	 				是	否	 	　	 	必需返回，允许为空
 * @author xuefeng.kang 
 */
Config.changeClassGroupUserUrl = function(){return Config.shuxiaoBaseUrl()+"?m=changeClassGroupUser.do"};
/**
 * @description
 * IM-SCH4-V2.0.1 教师班级内小组改名
 * 教师---班级管理---班级列表---班级详情---编辑教师岗位/删除教师/删除学生
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid				String	用户jid			是	是	 
			schoolId		String	实验班的数校id	是	是	 
			classId	 	 	String	班id				是	是
			changeUid		String	要删除人的id	是	是
			subjectStr 		String	科目type拼接，逗号隔开	否	 
			isMaster		int		1是，0否 班主任	否	 
			isDel			int		1是，0否，2是并且禁止再加入	是	 
			time			long	当前时间毫秒数	是	是
			sign			String	加密签名		是	是
 *  输出参数
		　	result			int		> 0：返回成功
									<= 0：失败		是	是	　
			msg				String	提示信息			是	是	正常情况下 只有result小于0才进行前台显示
			data	 	 	Object	 				是	否	必需返回，允许为空
 * @author xuefeng.kang 
 */
Config.managerClassMemberUrl= function(){return Config.shuxiaoBaseUrl()+"?m=managerClassMember.do"};
/**
 * @description
 * IM-WEB109.1-V2.教材列表
 * 教师---我的课程--教材列表
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid					String	用户jid	是	是	 
			schoolId		String	实验班的数校id	是	是
			gradeId	 	 	 	int		年级id	是	是	 	 	 	传年级id，用学段来查
			subjectId	 	 	int		科目id	是	是	 	 	 	 
			time				long	当前时间毫秒数	是	是
			sign				String	加密签名	是	是
 *  输出参数
		　	result			int		> 0：返回成功
									<= 0：失败		是	是	　
			msg				String	提示信息			是	是	正常情况下 只有result小于0才进行前台显示
			data	 	 	Object	 				是	否	必需返回，允许为空
				bookVersionList	 	 	 	 	 	 
				 	bookVersionName	String	版本名	 	 
				 	bookList	 	ArrayObject	 	 	 
				 	 	bookId 		String	教材id	是	是
				 	 	bookName	String	教材名	是	是

 * @author xuefeng.kang 
 */
Config.getBookListUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getBookList.do'};
/**
 * @description
 * IM-WEB113-V2.课列表
 * 教师---我的课程--课程列表
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid					String	用户jid	是	是	 
			schoolId		String	实验班的数校id	是	是
			gradeId	 	 	 	int		年级id	是	是	 	 	 	传年级id，用学段来查
			subjectId	 	 	int		科目id	是	是	 	 	
			pageNum	 	 		int		页码		是	是
			time				long	当前时间毫秒数	是	是
			sign				String	加密签名	是	是
 *  输出参数
		　	result	 	 		int		1：返回成功
										2：已经是最后一页
										3：页码超过页数
										<= 0：失败	是	是	　
			msg	 	 			String	提示信息	是	是	　
			data	 	 		Object	 	是	是	 
			 	pageNum	 		int	当前页码	是	是	 
			 	lessonList	 	ArrayObject	 	 	 	 
			 	 	lessonId	String	课目id	是	是	 
			 	 	lessonName	String	课目名	是	是	 


 * @author xuefeng.kang 
 */
Config.getLessonListUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getLessonList.do'};
/**
 * @description
 * IM-WEB109.2-V2.教材详情
 * 教师---我的课程--选教材--选择教材
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid					String	用户jid	是	是	 
			schoolId		String	实验班的数校id	是	是
			gradeId	 	 	 	int		年级id	是	是	 	 	 	传年级id，用学段来查
			subjectId	 	 	int		科目id	是	是	 	 	
			bookId	 	 		int	教材id	是	是
			type	 	 		int		1:保存教材
										2:仅获得教材	是	是
			time				long	当前时间毫秒数	是	是
			sign				String	加密签名	是	是
 *  输出参数
		　	result	 	 		int		1：返回成功
										2：已经是最后一页
										3：页码超过页数
										<= 0：失败	是	是	　
			msg	 	 			String	提示信息	是	是	　
			data	 	 		Object	 	是	是	 
			 	lessonList	 	ArrayObject	 	 	 
				 	lessonName	String	课目名	是	是
				 	lessonId	String	课目id	是	是
				 	testNum		int	试题数	是	是
				 	testPagerNum	int	试卷数	是	是
 * @author xuefeng.kang 
 */
Config.getBookInfoUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getBookInfo.do'};
/**
 * @description
 * IM-WEB112-V2.创建课
 * 教师---我的课程--课程列表--创建课程
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			gradeId	 	 	 		int		年级id	是	是	 	 	 	传年级id，用学段来查
			subjectId	 	 		int		科目id	是	是	 	 	
			classList	 			ArrayObject	 	是	是	 	 	 	 
			 	classId				String	班级id	是	是	 	 	 	 
			 	startTime			String	开始时间	是	是	格式：2014-08-29 00:00:00	 	 	 
			 	endTime				String	结束时间	是	是	格式：2014-08-29 00:00:00	 	 	 
			lessonName	 			String	课目名称	否	否	 	 	 	不能与lessonId同时为空
			lessonInfo	 			String	课目简介	否	否	 	 	 	 
			lessonId	 			String	教材课目id	否	否	 	 	 	 
			time				long	当前时间毫秒数	是	是
			sign				String	加密签名	是	是
 *  输出参数
		　	result	 	 		int		1：返回成功
										2：已经是最后一页
										3：页码超过页数
										<= 0：失败	是	是	　
			msg	 	 			String	提示信息	是	是	　
			data	 	 		Object	 	是	是	 
			 	lessonList	 	ArrayObject	 	 	 
				 	lessonName	String	课目名	是	是
				 	lessonId	String	课目id	是	是
				 	testNum		int	试题数	是	是
				 	testPagerNum	int	试卷数	是	是
 * @author xuefeng.kang 
 */
Config.createLessonUrl = function(){return Config.shuxiaoBaseUrl2_0()+"?m=createLesson.do"};
/**
 * @description
 * IM-WEB114-V2.课删除
 * 教师---我的课程--课程列表--课删除
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			lessonId				int		课目id	是	是	 	 	 
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
		　	result	 	 		int		1：返回成功
										2：已经是最后一页
										3：页码超过页数
										<= 0：失败	是	是	　
			msg	 	 			String	提示信息	是	是	　
			data	 	 		Object	 	是	是	 
			 	lessonList	 	ArrayObject	 	 	 
				 	lessonName	String	课目名	是	是
				 	lessonId	String	课目id	是	是
				 	testNum		int	试题数	是	是
				 	testPagerNum	int	试卷数	是	是
 * @author xuefeng.kang 
 */
Config.detLessonUrl = function(){return Config.shuxiaoBaseUrl()+'?m=detLesson.do'};
/**
 * @description
 * IM-SCH15-V2.0.1 学科积分-类别
 * 教师---我的课程--课程列表--学科积分
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			subjectId	 	 	 	String	科目id	是	是
			gradeId	 	 	 		String	年级Id	是	是
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
		　	result	 	 		int		1：返回成功
										2：已经是最后一页
										3：页码超过页数
										<= 0：失败	是	是	　
			msg	 	 			String	提示信息	是	是	　
			data	 	 		Object	 	是	是	 
		 	classList	 	 	ArrayObject	 	 	 
		 	 	classId 	 	String	班级id	是	是
		 	 	className	 	String	班级名	是	是
		 	 	subjectList	 	ArrayObject	 	 	 
		 	 	 	subjectId	String	科目id	是	是
		 	rankInfoList	 	 	ObjectArray	（第一个班级传入科目的全班排名）	 	 
		 	 	groupId	 	int	组id（全班为-1）	 	 
		 	 	groupName	 	String	组名	 	 
		 	 	groupNum	 	int	小组数（暂只需0：无小组,1：有小组）	是	是
		 	 	userRankList	 	ArrayObject	 	是	是
		 	 	 	rankNum	int	排名	是	是
		 	 	 	userName	String	用户名	是	是
		 	 	 	rankPoint	String	排名得分	是	是
		 	 	 	photo	String	头像	 	 
 * @author xuefeng.kang 
 */
Config.getPointListUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getPointList.do'};
/**
 * @description
 * IM-SCH16-V2.0.1 学科积分-详情
 * 教师---我的课程--课程列表--学科积分
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			subjectId	 	 	 	String	科目id	是	是
			classId	 	 	 	int	班级id	是	是
			isGroup	 	 	 	int	是否是组信息 1是0否（全班）	是	是
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
		　	result	 	 		int		1：返回成功
										2：已经是最后一页
										3：页码超过页数
										<= 0：失败	是	是	　
			msg	 	 			String	提示信息	是	是	　
			data	 	 		Object	 	是	是	 
			 	groupNum	 	 	int	小组数（暂只需0：无小组,1：有小组）	是	是
				rankInfoList	 	 	ArrayObject	 	是	是 
				 	groupId	 	String	组id（全班为-1）	是	是
				 	groupName	 	String	组名	否	否
				 	userRankList	 	ArrayObject	 	是	是
				 	 	rankNum	int	排名	是	是
				 	 	userName	String	用户名	是	是
				 	 	rankPoint	String	排名得分	是	是
				 	 	photo	String	头像	 	 

 * @author xuefeng.kang 
 */
Config.getPointInfoUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getPointInfo.do'};
/**
 * @description
 * IM-WEB127-V2 教师删除任务
 *  教师---我的课程--课程列表--课程详情任务列表--删除任务
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			taskId				String	任务id	是	是
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
		　	result	 	 		int		1：返回成功
										2：已经是最后一页
										3：页码超过页数
										<= 0：失败	是	是	　
			msg	 	 			String	提示信息	是	是	　
			data	 	 		Object	 	是	是	 
 * @author xuefeng.kang 
 */
Config.delTaskUrl = function(){return Config.shuxiaoBaseUrl()+'?m=delTask.do'};
/**
 * @description
 *  IM-WEB128-V2. 教师任务列表接口
 *  教师---我的课程--课程列表--课程详情任务列表
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			topicId	 	 	 		int	专题id(课id)	是	是
			pageNum	 	 	 		int	页码，初始为0	是	是
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
								2：已经是最后一页
								3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 	String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是	 	　
			 	taskList	 	 	ObjectArray	 	 	 	 	 
			 	 	taskIcon	 	String	任务icon的Url	 	 	 	 
			 	 	taskId 	 	String	任务id	是	是	 	 
			 	 	taskName	 	String 	任务名 	是	是	 	 
			 	 	taskType	 	int 	任务类型： 
												1、资源学习
												2、互动交流 
												3、试题 
												4、成卷测试 
												5、自主测试 
												6、微课程学习 
												7、直播课
												8、一般任务	是	是 	 	 
												 	 	taskSubtype	 	int 	任务子类型
												1 资源学习类 包括（文档类任务，声音类任务，图片类，视频类/远程高清类）
												2 互动交流
												3 webview试题（单选题，多选题，填空题，主观题，知识导学）
												4 成卷测试
												5 自主测试
												6 微课
												7 一般任务之语音：形式同资源学习类语音任务。
												8 一般任务之图片：9宫格显示图片，4张的形式较特殊需注意。
												9 一般任务之文字：同资源学习类任务。
												10 直播课	是	是	 	 
			 	 	isDone	 		int 	是否可以操作 1是0否	否	否	 	 
			 	 	dateHint		String 	如果任务未结束，显示还有多少时间结束 
			 								如果已结束，显示“已结束” 是	是	 	 
			 	 	scaleHint	 	String 	已完成人数与总数的提示，例如“1/20”	是	是	 	 
			 	 	jspUrl	 		String 	taskSubtype 2、3、4、11、12 类型任务，需返回该值	否	否	 	 
			 	classList	 	 	ObjectArray	 	 	 	 	 
			 	 	classId	 		String	班级id	 	 	 	 
			 	 	className	 	String	班级名	 	 	 	 
			 	 	groupList	 	ObjectArray	 	 	 	 	 
			 	 	 	groupId		String	小组id	 	 	 	 
			 	 	 	groupName	String	小组名	 	 	 	 

 * @author xuefeng.kang 
 */
Config.getTeacherTaskListUrl = function(){return Config.shuxiaoBaseUrl2_0()+'?m=getTeacherTaskList.do'};
/**
 * @description
 *  IM-WEB115-V2.课分享
 *  教师---我的课程--课程列表--课程--任务列表--课分享
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			lessonId			int	课目id	是	是
			shareType			int	1：公开
										2：仅校内
										3：仅自己	是	是
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
								2：已经是最后一页
								3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 	String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是	 	　

 * @author xuefeng.kang 
 */
Config.shareLessonUrl = function(){return Config.shuxiaoBaseUrl()+'?m=shareLesson.do'};
/**
 * @description
 *  IM-WEB115.2-V2.获得课分享状态
 *  教师---我的课程--课程列表--课程--任务列表--获得课分享状态
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			lessonId			int	课目id	是	是
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
					shareType	int	1：公开
									2：仅校内
									3：仅自己	是	是
 * @author xuefeng.kang 
 */
Config.getLessonStateUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getLessonState.do'};
/**
 *  @description
 *  IM-SCH17-V2.0.1 课积分-类别
 *  教师---我的课程--课程列表--课程--任务列表--课积分
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			lessonId	 	 	 	String	课id	否	否
			subjectId	 	 	 	String	科目id	是	是
			gradeId	 	 	 	String	年级Id	是	是
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
				classList	 	 	ArrayObject	 	 	 	 
				 	classId 	 	String	班级id	是	是	 
				 	className	 	String	班级名	是	是	 
				rankInfoList	 	 	ObjectArray	（第一个班级传入科目的全班排名）	 	 	 
				 	groupId	 	int	组id（全班为-1）	 	 	 
				 	groupName	 	String	组名	 	 	 
				 	groupNum	 	int	小组数（暂只需0：无小组,1：有小组）	是	是	 
				 	userRankList	 	ArrayObject	 	是	是	 
				 	 	rankNum	int	排名	是	是	 
				 	 	userName	String	用户名	是	是	 
				 	 	rankPoint	String	排名得分	是	是	 
				 	 	photo	String	头像	 	 	 

 * @author xuefeng.kang 
 */
Config.getLessonPointListUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getLessonPointList.do'};
/**
 *  @description
 *  IM-SCH18-V2.0.1 课积分-详情
 *  教师---我的课程--课程列表--课程--任务列表--课积分
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			subjectId	 	 	 	String	科目id	是	是
			lessonId	 	 	 	String	课id	否	否
			classId	 	 	 	int	班级id	是	是
			isGroup	 	 	 	int	是否是组信息 1是0否（全班）	是	是

			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
				groupNum	 	 	int	小组数（暂只需0：无小组,1：有小组）	是	是
				rankInfoList	 	 	ArrayObject	 	是	是 
				 	groupId	 	String	组id（全班为-1）	是	是
				 	groupName	 	String	组名	否	否
				 	userRankList	 	ArrayObject	 	是	是
				 	 	rankNum	int	排名	是	是
				 	 	userName	String	用户名	是	是
				 	 	rankPoint	String	排名得分	是	是
				 	 	photo	String	头像	 	 
 
 * @author xuefeng.kang 
 */
Config.getLessonPointInfoUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getLessonPointInfo.do'};
/**
 *  @description
 *  IM-S4-WEB2-V2.发任务时微视频推荐
 *  教师---我的课程--课程列表--课程--发任务--微视频
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			lessonId	 	 	 	String	课id	否	否
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	=1：返回成功
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
				videoList	 	ObjectArray	 	 	 	 
			 	videoId	int	视频id	是	是	 
			 	videoTitle	String	视频名	是	是	 
			 	videoPic	String	视频图片	是	是	 
 * @author xuefeng.kang 
 */
Config.getVideoTaskRecommendUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getVideoTaskRecommend.do'};
/**
 *  @description
 *  IM-S4-WEB3-V2.发任务时微视频搜索
 *  教师---我的课程--课程列表--课程--发任务--微视频
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			subjectId	 	 	int	学科id	是	是	 	 	 	 
			gradeId	 	 	int	年级id	是	是	 	 	 	学段
			searchKey	 	 	String	搜索关键字	是	是	 	 	 	 
			pageNum	 	 	int	页码 从1开始	是	是	 	 	 	 
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
				videoList	 	ObjectArray	 	 	 	 
			 	videoId	int	视频id	是	是	 
			 	videoTitle	String	视频名	是	是	 
			 	videoPic	String	视频图片	是	是	 
 * @author xuefeng.kang 
 */
Config.searchTaskVideoUrl = function(){return Config.shuxiaoBaseUrl()+'?m=searchTaskVideo.do'};
/**
 *  @description
 *  IM-S4-WEB4-V2.发任务时微视频预览
 *  教师---我的课程--课程列表--课程--发任务--微视频
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			videoId	 				int	视频id	是	是	 	 	 	 
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
				videoList	 	ObjectArray	 	 	 	 
			 	videoId	int	视频id	是	是	 
			 	videoTitle	String	视频名	是	是	 
			 	videoPic	String	视频图片	是	是	 
 * @author xuefeng.kang 
 */
Config.getTaskVideoUrl = function(){return Config.shuxiaoBaseUrl()+'?m=getTaskVideo.do'};
/**
 *  @description
 *  IM-S4-WEB5-V2.发任务
 *  教师---我的课程--课程列表--课程--发任务--微视频-->发任务
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			schoolId				String	实验班的数校id	是	是
			gradeId	 	 			int	年级id	否	否	type=2时是必填参数	 	 
			subjectId	 	 		int	学科id	否	否	type=2时是必填参数	 	 
			lessonId	 	 		String	课id	是	是	 	 	 
			type	 	 			int	1:微视频
										2:测验
										3:一般任务	是	是	 	 	 
			classList	 	 	ObjectArray	 	是	是 	 	 	 
			 	classId	 	String	班级id	是	是	 	 	 
			 	groupId	 	String	小组id	否	否	若不为空，则该任务属于小组	 	 
			 	startTime	 	String	开始时间	是	是	格式：2014-08-29 00:00:00	 	 
			 	endTime	 	String	结束时间	是	是	格式：2014-08-29 00:00:00	 	 
			videoId	 	 	String	视频id	否	否	 	 	 
			pagerTime	 	 	int	作答时间限制（分钟）	否	否	 	 	 
			pagerTitle	 	 	String	试卷题目	否	否	 	 	 
			pagerId	 	 	String	试卷id	否	否	 	 	 
			taskBody	 	 	Object	 	否	否	 	 	 
			 	taskTitle	 	String	一般任务题目	是	是	 	 	 
			 	taskContent	 	String	一般任务内容	是	是	 	 	 
			 	taskAnalytical	 	String	一般任务解析	否	否	 	 	 
			 	resourceList	 	ObjectArray	 	否	否	 	 	 
			 	 	resourceType	int	资源类型
									1：音频
									2：图片	是	是	 	 	 
			 	 	resourceUrl	String	资源url	是	是	 	 	 
			 	 	voiceTime	int	语音时长	否	否	 	 	 
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
 * @author xuefeng.kang 
 */
Config.pushTaskUrl = function(){return Config.shuxiaoBaseUrl()+'?m=pushTask.do'};
/**
 *  @description
 *  IM-SCH2-V2.0.4  向服务器输送题目
 *  教师---我的课程--课程列表--课程--发任务-- 测验
 *  请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid						String	用户jid	是	是	 
			//schoolId				String	实验班的数校id	是	是
			courseId			String	课id
			itemId				String	题目id
			questionImg			String	问题图片地址
			answerImg			String	解析图片地址
			answerType			int	参见IM-SCH1-JS-V2.0.4中同名参数
										1：单选
										2：多选
										3：其它
			difficultyType		int	难度类型代号
									1：简单
									2：中
									3：难
			itemTypeId			String	卷面题型id
			answerAllStr		String	仅在answerType为1、2时存在
										为所有选项小写集合，例如：abcd
			answerRightStr		String	仅在answerType为1、2时存在
										为正确选项小写集合，例如：ab
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
 * @author xuefeng.kang 
 */
Config.putQuestionUrl = function(){return Config.shuxiaoBaseUrl2_0_4()+'?m=putQuestion.do'};

/**
 * @description
 * IM-SCH14-V2.0.1 获得任务统计
 * 教师--我的课程--课程详情--统计
 * 请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid					String	用户jid	是	是	 
			schoolId			String	实验班的数校id	是	是
			taskId	 	 	 	String	任务id	是	是	 
			belongType	 	 	int	所属：可赋值0
										否:普通
										1:在线班,在线办不做任务统计
										2:实体班	否	否	 
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
					classList 	ObjectArray	 
				 	classId	 	 	 	String	班级id	是	是	 	 	 	 
				 	className	 	 	 	String	班级名	是	是	 	 	 	 
				 	 	 	 	 	 	 	 	 	 	 	 	资源学习／一般任务只有这些
				 	isJspTxt	 	 	 	String	是否是试题填空题 1是0否	是	是	 	 	 	 
				 	isOver	 	 	 	int	是否已结束 1是0否	是	是	 	 	 	 
				 	isFinished	 	 	 	int	是否已全部完成 1是0否	是	是	 	 	 	 
				 	noFinishedNum	 	 	 	int	未完成人数	是	是	 	 	 	 
				 	finishedNum	 	 	 	int	完成人数	是	是	 	 	 	 
				 	 	 	 	 	 	 	 	 	 	 	 	除小题以外均可能有
				 	notFinGroupList	 	 	 	ObjectArray	未完成人员列表	否	是	 	 	 	 
				 	 	groupName	 	 	String	组标示	 	 	 	 	 	 
				 	 	userList	 	 	ObjectArray	 	 	 	 	 	 	 
				 	 	 	userName	 	String	用户名	 	 	 	 	 	 
				 	 	 	 	 	 	 	 	 	 	 	 	试题、试卷类
				 	testScoreList	 	 	 	ObjectArray	小题统计（试题类只有一题）	否	否	 	 	 	 
				 	 	scoreGroupList	 	 	ObjectArray	小题分组统计	是	是	 	 	 	 
				 	 	 	groupName	 	String	组标示	是	是	 	 	 	 
				 	 	 	userList	 	ObjectArray	 	 	 	 	 	 	 
				 	 	 	 	userName	String	用户名	是	是	 	 	 	 
				 	 	 	 	 	 	 	 	 	 	 	 	试卷类
				 	scoreANum	 	 	 	int	A等级人数：90－100	 	 	 	 	 	 
				 	scoreBNum	 	 	 	int	B等级人数：80-89	 	 	 	 	 	 
				 	scoreCNum	 	 	 	int	C等级人数：70-79	 	 	 	 	 	 
				 	scoreDNum	 	 	 	int	D等级人数：60-69	 	 	 	 	 	 
				 	scoreENum	 	 	 	int	E等级人数：0-59	 	 	 	 	 	 
				 	 	 	 	 	 	 	 	 	 	 	 	 
				 	rankInfoList	 	 	 	ObjectArray	 	 	 	 	 	 	 
				 	 	 	groupId	 	int	组id（全班为-1）	 	 	 	 	 	 
				 	 	 	groupName	 	String	组名	 	 	 	 	 	 
				 	 	 	userRankList	 	ArrayObject	 	 	 	 	 	 	 
				 	 	 	 	rankNum	int	排名	 	 	 	 	 	 
				 	 	 	 	userName	String	用户名	 	 	 	 	 	 
				 	 	 	 	rankPoint	String	排名得分	 	 	 	 	 	 
				 	 	 	 	photo	String	头像
				 	 	 	 	 	 	 	 	 	 	 	 	直播课独有
				 	studyTimeGroup	 	 	 	 	 	 	 	 	 	 	 
				 	 	 	userName	 	String	用户名	 	 	 	 	 	 
				 	 	 	timeHint	 	String	时间提示，格式咨询需求	 	 	 	 	 	 

 * @author xuefeng.kang 
 */
Config.getTaskStatistics2Url = function(){return Config.shuxiaoBaseUrl()+"?m=getTaskStatistics2.do"};

/**
 * @description
 * IM-WEB116-V2.校内公告列表
 * 教师---校内公告
 * @author baoan.li
 */
Config.getNoticeListUrl = function(){return Config.shuxiaoBaseUrl()+"?m=getNoticeList.do"};


/**
 * @description
 * IM-WEB117-V2班级通知列表
 * 教师---班级通知列表
 * @author baoan.li
 */
Config.getActivityListUrl = function(){return Config.shaishaiBaseUrl()+"/shaiDynamic/getActivityList.do"};

/**
 * @description
 * IM-WEB118-V2班级通知详情
 * 教师---班级通知详情
 * @author baoan.li
 */
Config.getActivityInfoUrl = function(){return Config.shaishaiBaseUrl()+"/shaiDynamic/getActivityInfo.do"};

/**
 * @description
 * IM-WEB96-V2.针对动态发布一级动态/二级回复/赞/取消赞/删除
 * 教师---班级通知编辑
 * @author baoan.li
 */
Config.pushDynamicUrl = function(){return Config.shaishaiBaseUrl()+"/shaiDynamic/pushDynamic.do"};
/**
 * @description
 * IM-xxxx  获取用户所在学校广场班级圈晒晒配置
 *
 * @author chenxi.wang
 */
Config.getSquareClassCircleConfig = function(){return Config.shuxiaoBaseUrl2_2_2()+"?m=getSquareClassCircleConfig.do"};
/**
 * @description
 * IM-S4-WEB1.1-V2.网校首页1班级
 * 学生---网校首页班级
 * @author baoan.li
 */
Config.getNetClassInfoUrl = function(){return Config.shuxiaoBaseUrl2_0()+"?m=getNetClassInfo.do"};

/**
 * @description
 * IM-S4-WEB1.2-V2.网校首页2任务数
 * 学生---网校首页任务数
 * @author baoan.li
 */
Config.getNetTaskUnNumUrl = function(){return Config.shuxiaoBaseUrl2_0()+"?m=getNetTaskUnNum.do"};

/**
 * @description
 * IM-S4-WEB1.3-V2.网校首页3推荐
 * 学生---网校首页推荐
 * @author baoan.li
 */
Config.getNetVideoInfoUrl =function(){return  Config.baseUrl()+"/getNetVideoInfo.do"};

/**
 * @description
 * IM-SCH1-V2.0.3 家长首页信息
 * 家长---首页信息
 * @author baoan.li
 */
Config.getParentHomePageUrl =function(){return  Config.shuxiaoBaseUrl2_0_3()+"?m=getParentHomePage.do"};

/**
 * @description
 * IM-S4-WEB13-V1.家长绑定孩子验证
 * 家长---绑定孩子验证
 * @author baoan.li
 */
Config.checkBindChildUrl =function(){return  Config.baseUrl()+"/user/checkBindChild.do"};

/**
 * @description
 * IM-S4-WEB14-V1.家长绑定孩子
 * 家长---绑定孩子
 * @author baoan.li
 */
Config.bindChildUrl =function(){return  Config.baseUrl()+"/user/bindChild.do"};

/**
 * @description
 * IM-SCH14-V2.0.1 获得任务统计
 * 教师--我的课程--课程详情--统计
 * 请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid					String	用户jid	是	是	 
			schoolId			String	实验班的数校id	是	是
			taskId	 	 	 	String	任务id	是	是	 
			uType				int	用户类型	是	是
//			classId				String	班级id	否	 
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是

 * @author xuefeng.kang 
 */
Config.remindHomeWorkUrl = function(){return Config.baseUrl()+"/remindHomeWork.do"};

/**
 * @description
 * IM-S4-WEB20-V2.教师任务班级列表接口
 * 教师--我的课程--课程详情
 * 请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid					String	用户jid	是	是	 
			schoolId			String	实验班的数校id	是	是
			taskId	 	 	 	String	任务id	是	是	 
			schoolId	 	 	int	数校id	是	是	 
			time					long	当前时间毫秒数	是	是
			sign					String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
					classList	 	ObjectArray	 	 
							 	classId	String	班级id	 
							 	className	String	班级名	 
 * @author xuefeng.kang 
 */
Config.getClassListByTaskUrl = function(){return Config.shuxiaoBaseUrl()+"?m=getClassListByTask.do"};
/**
 * @description
 * IM-S4-WEB20-V2.教师任务班级列表接口
 * 教师--我的课程--课程详情
 * 请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			jid 	 	 		int	用户jid	是	是	 
			schoolId	 	 	int	数校id	是	是	 
			belongType	 	 	int	所属：
									无:普通
									1:在线班
									2:实体班	否	否	 
			subjectId	 	 	int	科目id	是	是	 
			pageNum	 	 		int	页码，初始为1	是	是	 
			time	　	 		long	当前时间毫秒数	是	是	　
			sign	　	 		String	加密签名	是	是
 *  输出参数
			result	 	　	 	int	1：返回成功
									2：已经是最后一页
									3：页码超过页数
								<= 0：失败	是	是	　	　
			msg	 	　	 		String	提示信息	是	是	　	　
			data	 	　	 	Object	 	是	是
					unfinishedNum int	未完成任务数目	是	是
					topicList	  ObjectArray	 	是	是
					 	topicId	  int	专题id	是	是
					 	topicName String	专题名	是	是
					 	isUnfinished int	是否有未完成任务  1：有 0：无	是	是
	 
 * @author xuefeng.kang 
 */
Config.getSubjectInfoUrl = function(){return Config.shuxiaoBaseUrl() + "?m=getSubjectInfo.do"};
/**
 * @description
 * IM-S4-WEB20-V2.教师任务班级列表接口
 * 教师--我的课程--课程详情
 * 请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
		 jid 	 	 	 		int		用户jid	是	是
		belongType	 	 	 	int		所属：
										1:校内
										2:课外班	否	否
		schoolId	 	 	 	int		数校id	是	是
		time	 	 	　		long	当前时间毫秒数	是	是
		sign	 	 	　		String	加密签名	是	是

 * @author xuefeng.kang 
 */
Config.getUnFinTaskListBySubUrl = function(){return Config.shuxiaoBaseUrl2_0_3() + "?m=getUnFinTaskListBySub.do"};
/**
 * @description
 * IM-SCH2-V2.0.3 获得孩子学习报表
 * 
 * 请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			 jid	 	 	 	String	用户jid	是	是
			schoolType	 	 	int		学校类型
										1:校内
										2:课外班	是	是
			dateType	 	 	int		查寻类型
										1:周报
										2:月报	是	是
			tag	 	 	 		String	数据标示	否	是
			time	 	 	 	long	当前时间毫秒数	是	是
			sign	 	 	 	String	加密签名	是	是
 * @author xuefeng.kang 
 */
Config.getChildStudyStateUrl = function(){return Config.shuxiaoBaseUrl2_0_3() + "?m=getChildStudyState.do"};
/**
 * @description
 * IM-WEB3-V2.0.3 获得孩子自主学习报表
 *
 * 请求类型:POST
 *  输出格式:JSON
 *  输入参数:参数名称 	 			数据类型	参数说明	必填	非空
			 jid	 	 			String	用户jid
			dateType	 	 		int	查寻类型
										1:周报
										2:月报
			tag	 	 				String	当前标示
			time	 	 			long	当前时间毫秒数
			sign	 	 			String	加密签名
 * @author xuefeng.kang
 */
Config.getChildStudySelfStateUrl = function(){return Config.baseUrl() + "user/getChildStudySelfState.do"};


//TODO
//*****************webStorage var start******
/*
 * set:webStorageVars[3] = "jid";
 * get:webStorageVars[3];
 */
var webStorageVars = {0:"classList4GradeManage",//教师-班级列表[{"classId":1001656,"classType":1,"className":"高三测试创建班级"}]
					  1:"groupList4GroupDetail",//教师-小组详情{classId:[{groupId:1,groupName:'组名'},{groupId:1,groupName:'组名'}]}
					  2:"jid",//用户id
					  3:"photo",//用户头像地址
					  4:"userName",//用户名
					  5:"schoolId",//学校id
					  6:"hasClass",//是否有班级
					  7:"uType",//用户类型
					  8:"schoolName",//学校名称
					  9:"textBookLessonList",//教材课程列表
					  10:"gradeSubjectArray",//年级科目集合
					  11:"bookLessonList",//教材课程列表//{bookId:{gradeId:{subjectId:{maxPageNum:maxPageNum,pageNum:{lessonList:[{lessonId:lessonId,lessonName:lessonName}}],generateTime:generateTime}}}} 时间为毫秒数
					  /*我的课程中 学科积分班级列表{"rankInfoList":[{"groupId":-1,"userRankList":[{"rankNum":0,"rankPoint":0,"userName":"111111","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"im_stu6","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"潘雪景学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"哈错错","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"未开通"},{"rankNum":0,"rankPoint":0,"userName":"祁海石学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"高叁001","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"1"},{"rankNum":0,"rankPoint":0,"userName":"zhaa","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"大雁子","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"im_stu7真名","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"student125","photo":"http://attach.etiantian.com/ett20/study/common/upload/2700397_74961662.jpg"},{"rankNum":0,"rankPoint":0,"userName":"卢学生2"},{"rankNum":0,"rankPoint":0,"userName":"学渣","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":0,"userName":"瓜娃子","photo":"http://attach.etiantian.com/ett20/study/common/upload/2092222_31661417.jpg"}],"groupNum":1}],"classList":[{"classId":998010,"className":"高三1班","subjectList":[{"subjectId":1}]},{"classId":998011,"className":"高三2班","subjectList":[{"subjectId":1}]},{"classId":998043,"className":"高三2","subjectList":[{"subjectId":1}]},{"classId":998047,"className":"高三360班","subjectList":[{"subjectId":1}]},{"classId":998063,"className":"高三280班","subjectList":[{"subjectId":1}]},{"classId":1001656,"className":"高三测试创建班级","subjectList":[{"subjectId":1},{"subjectId":2},{"subjectId":3},{"subjectId":5},{"subjectId":6}]},{"classId":1001657,"className":"高三测试创建班级2","subjectList":[{"subjectId":1},{"subjectId":2},{"subjectId":3}]},{"classId":1001658,"className":"高三饿","subjectList":[{"subjectId":1},{"subjectId":2}]},{"classId":1001663,"className":"高三哦地上","subjectList":[{"subjectId":1},{"subjectId":2},{"subjectId":6}]},{"classId":1001660,"className":"高三饿哦","subjectList":[{"subjectId":2},{"subjectId":3}]},{"classId":1001661,"className":"高三噢噢噢哦哦","subjectList":[{"subjectId":2},{"subjectId":3}]},{"classId":1001659,"className":"高三哦","subjectList":[{"subjectId":3}]}]}
					  	rankInfoList	 	 	ObjectArray	（第一个班级传入科目的全班排名）
 						groupId	 	int	组id（全班为-1）
					 	groupName	 	String	组名
					 	groupNum	 	int	小组数（暂只需0：无小组,1：有小组）
					   */
					  12:"subjectPointInfoClassListForMyLesson",
					  13:"lessonPointInfoClassListForTask",//课积分班级列表 ,参数同 12[{"classId":998043,"className":"高三2"},{"classId":1001656,"className":"高三测试创建班级"},{"classId":1001657,"className":"高三测试创建班级2"}]
					  14:"lessonClassGroupList",//教师任务班级小组列表{lessonId:[]}
					  15:"nomalTaskPublishInfo_temp",//保存一般任务发布信息
					  16:"crop_img_4_task_temp",//任务截取图片 {"task_"[0|1]:{imgData:base64}}
					  17:"taskStatistics_temp",//任务信息{"-1985539666410":{"taskSubType":"00","classList":[{"finishedNum":0,"classId":998010,"scoreBNum":0,"rankInfoList":[{"groupId":-1,"userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"瓜娃子","photo":"http://attach.etiantian.com/ett20/study/common/upload/2092222_31661417.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"学渣","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"卢学生2"},{"rankNum":0,"rankPoint":"未交卷","userName":"student125","photo":"http://attach.etiantian.com/ett20/study/common/upload/2700397_74961662.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"im_stu7真名","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"大雁子","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"zhaa","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"高叁001","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"祁海石学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"哈错错","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"潘雪景学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"im_stu6","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"111111","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"}]},{"groupId":-6186363797616,"groupName":"1","userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"瓜娃子","photo":"http://attach.etiantian.com/ett20/study/common/upload/2092222_31661417.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"学渣","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"卢学生2"},{"rankNum":0,"rankPoint":"未交卷","userName":"student125","photo":"http://attach.etiantian.com/ett20/study/common/upload/2700397_74961662.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"im_stu7真名","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"大雁子","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"zhaa","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"高叁001","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"祁海石学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"哈错错","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"潘雪景学生","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"im_stu6","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"111111","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"}]}],"isOver":0,"isJspTxt":0,"scoreENum":0,"testScoreList":[{"scoreGroupList":[]}],"noFinishedNum":15,"scoreANum":0,"scoreDNum":0,"isFinished":0,"className":"高三1班","scoreCNum":0},{"finishedNum":0,"classId":998011,"scoreBNum":0,"rankInfoList":[{"groupId":-1,"userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"student123","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"}]}],"isOver":0,"isJspTxt":0,"scoreENum":0,"testScoreList":[{"scoreGroupList":[]}],"noFinishedNum":1,"scoreANum":0,"scoreDNum":0,"isFinished":0,"className":"高三2班","scoreCNum":0},{"finishedNum":0,"classId":998043,"scoreBNum":0,"isOver":0,"isJspTxt":0,"scoreENum":0,"testScoreList":[{"scoreGroupList":[]}],"noFinishedNum":0,"scoreANum":0,"scoreDNum":0,"isFinished":0,"className":"高三2","scoreCNum":0},{"finishedNum":0,"classId":998047,"scoreBNum":0,"rankInfoList":[{"groupId":-1,"userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"stu129","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"}]}],"isOver":0,"isJspTxt":0,"scoreENum":0,"testScoreList":[{"scoreGroupList":[]}],"noFinishedNum":1,"scoreANum":0,"scoreDNum":0,"isFinished":0,"className":"高三360班","scoreCNum":0},{"finishedNum":0,"classId":998063,"scoreBNum":0,"rankInfoList":[{"groupId":-1,"userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"stu130","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"},{"rankNum":0,"rankPoint":"未交卷","userName":"student126","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"}]}],"isOver":0,"isJspTxt":0,"scoreENum":0,"testScoreList":[{"scoreGroupList":[]}],"noFinishedNum":2,"scoreANum":0,"scoreDNum":0,"isFinished":0,"className":"高三280班","scoreCNum":0},{"finishedNum":0,"classId":1001656,"scoreBNum":0,"rankInfoList":[{"groupId":-1,"userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"???"},{"rankNum":0,"rankPoint":"未交卷","userName":"???"}]},{"groupId":-7412881082726,"groupName":"Jack拉粑粑啊","userRankList":[{"rankNum":0,"rankPoint":"未交卷","userName":"???"},{"rankNum":0,"rankPoint":"未交卷","userName":"???"}]}],"isOver":0,"isJspTxt":0,"scoreENum":0,"testScoreList":[{"scoreGroupList":[]}],"noFinishedNum":3,"scoreANum":0,"scoreDNum":0,"isFinished":0,"className":"高三测试创建班级","scoreCNum":0},{"finishedNum":1,"classId":1001657,"scoreBNum":0,"rankInfoList":[{"groupId":-1,"userRankList":[{"rankNum":1,"rankPoint":"0","userName":"啊啊啊","photo":"http://attach.etiantian.com/ett20/study/common/upload/default_head.jpg"}]}],"isOver":0,"isJspTxt":0,"scoreENum":1,"testScoreList":[{"scoreGroupList":[{"groupName":"选A:1人","userList":[{"userName":"啊啊啊"}]}]}],"noFinishedNum":0,"scoreANum":0,"scoreDNum":0,"isFinished":1,"className":"高三测试创建班级2","scoreCNum":0}]}}
					  18:"questionType4TakePhotoSubject",//拍照出题中问题类型
					  19:"classNoticeTitle",//班级通知标题
					  20:"classNoticeContent",//班级通知内容
					  21:"classNoticeClassList",//班级通知中的班级列表
					  22:"gradeId",//年级id,(学生用户用到)
					  23:"classNoticeFlag",//{"jid":true(有通知)};无该字段为无通知
					  24:"realName",//真实姓名,不存在为未填
					  25:"childName",//孩子姓名,不存在为未绑定
					  "CONFIG":"_CONFIG_"};
//*****************webStorage var end******
var subjectsObj = {1:"语文", 2:"数学", 3:"英语", 4:"物理", 5:"化学", 6:"历史", 7:"生物", 8:"地理", 9:"政治", 10:"科学", 11:"其他"};

//年级对应关系
var gradesObj = {0:"其他",1:"高三", 2:"高二", 3:"高一", 4:"初三", 5:"初二", 6:"初一", 7:"小六", 8:"小五", 9:"小四", 10:"小三", 11:"小二",12:"小一"};

var commonSchoolId = "51005";//公共学校id
//***********************common var end*******************************

//***********************common js function start*******************************
/**
 * 跳转到我的课程列表
 */
function gotoCourseList(){
	getTeacherGradeListSignCode("gotoCourseList_");
}
/**
 * 跳转到我的课程列表 请求
 */
function gotoCourseList_(data){
	var queryString = "";
	getTeacherGradeList_(data,function(data){
		var changeClassDivUl = $("#changeClassDiv ul");
		if(data.subjectList.length>0){
			var  currGradeSubject = gradesObj[data.subjectList[0].gradeId]+subjectsObj[data.subjectList[0].subjectId];
			if(!isH5Only)
				queryString += "://head?title=["+currGradeSubject+",true,changeClassClick,]&"+
					  		  			   "rightHandle:[isExist:true,type:type1,value:[[/img/teacher/course/nav_btn_more@2x.png,textbookChangePopToggle,]]]";
			document.location.href = "course/courses_list.html?"+queryString;
		}
	});
}

/**
 * 获取小组列表
 * returnFn中参数为data,ajax访问返回的数据
 */
function getTeacherGradeListSignCode(returnFn){
	var data="jid="+jid+"&schoolId="+schoolId;//+"&time="+getTime();
	getSignCode(data,Config.getTeacherSubjectListUrl().split("?m=")[1],returnFn);
}
/**
 * 获取小组列表,并处理返回信息
 * 该方法与 getTeacherGradeListSignCode(returnFn) 配合使用
 * 如:
 * 	getTeacherGradeListSignCode("returnFn")
 *  function returnFn(data){ 
 * 	 getTeacherGradeList_(data,function(data){
 *		//do some things 
 * 	 });
 *  }
 * @param {Object} data
 */
function getTeacherGradeList_(data,handleFn){
	postAjaxJSON(Config.getTeacherSubjectListUrl(),data,function(data){
		if(data && data.result>0){
			data = data.data;
			if(!data.subjectList || data.subjectList.length<1){
				alertToast("无科目!");
				history.back();
				return false;
			}
			handleFn(data);
			/*
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
					var queryString = "classId="+classId+"&subjectId="+v;
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
					var href = $(this).attr("data");
					document.location.href=href;
					return false;
				});
				$(".titleBarHeader .addGroupIcon").on("click",function(){
//					document.location.href = 'add_group.html?classId='+classId+"&subjectId="+(subjectId?subjectId:$("#changeClassDiv ul li .hover").parent().attr("subjectId"));
					gotoAddGroup();
				}).show();
				getClassGroupListBySubject(classId,(subjectId?subjectId:subjectArray[0]));
			}
			*/
		}else{
			if(data){
				alertInfo(data.msg);
			}else{
				alertToast("获取教师科目列表返回结果错误!");
			}
		}
	},function(){
		alertToast("获取教师科目列表请求失败!");
	});		
}

/**
 * 切换班级选择
 */
function changeClassListen(){
	$("#changeClassTitle").on("click",function(){
		changeClassClick();
		return false;
	});
}
/**
 * 切换class点击
 */
function changeClassClick(){
	if($("[name=textbookChangePop]").is(":visible"))
			$("[name=textbookChangePop]").hide();
	var display = $("#changeClassDiv").css("display");
	var show = "none";
	var arrowClass= "arrowDown";
	if(!display || (display && "none"==display.toLowerCase())){
		show = "block";
		arrowClass="arrowUp";
	}
	$("#changeClassTitle").first().children().children().eq(1).attr('class',arrowClass);
	$("#changeClassDiv").css("display",show);
	$(".bgo40").on("click",function(){
		$("#changeClassTitle").click();
		sendMsg2iOS("://headArrowToggle");
	});
}

/**
 * 将datetime-local值转换为年月日
 * @param {String} t
 */
function formateDateTimeLocal2CN(t){
	if(t){
		var dateTime = t.split("T");
		var date = dateTime[0].split("-");
		var time = dateTime[1].split(":");
//		return date[0]+"年"+date[1]+"月"+date[2]+"日"+time[0]+"时"+time[1]+"分";
		return date[0]+"-"+date[1]+"-"+date[2]+" "+time[0]+":"+time[1];
	}
}

/**
 * 获取 dateTime 当前时间,不含s
 * 格式:2016-01-01T11:12
 */
function getDateTimelocalStr(){
	var date = new Date();
	var year = date.getFullYear();//年
	var month = date.getMonth()+1;//月份
		month = month < 10?"0"+month:month;
	var day = date.getDate();//日
		day = day < 10?"0"+day:day;
	var hours = date.getHours();//小时
		hours = hours < 10?"0"+hours:hours;
	var minutes = date.getMinutes();//分
		minutes = minutes < 10?"0"+minutes:minutes;
	return year+"-"+month+"-"+day+"T"+hours+":"+minutes;
//  	   this.getSeconds()+"."+,                 //秒   
//  	   this.getMilliseconds()             //毫秒   
}
/**
 * 获取第二天dateTime 00:00点
 * e.g.:当前 2-15-02-23 18:00
 * 返回: 2016-02-24 00：00
 */
function getNextDayTimeLocalStr(){
	var date = new Date(new Date().getTime()+24*60*60*1000);
	var year = date.getFullYear();//年
	var month = date.getMonth()+1;//月份
		month = month < 10?"0"+month:month;
	var day = date.getDate();//日
		day = day < 10?"0"+day:day;
	return year+"-"+month+"-"+day+"T"+"00:00";
}
/**
 * 获取7天后 dateTime, 00:00点
 * e.g.:当前 2-15-02-23 18:00
 * 返回: 2016-02-24 00：00
 */
function get7dayNextDayTimeLocalStr(){
	var date = new Date(new Date().getTime()+24*60*60*1000*8);
	var year = date.getFullYear();//年
	var month = date.getMonth()+1;//月份
		month = month < 10?"0"+month:month;
	var day = date.getDate();//日
		day = day < 10?"0"+day:day;
	return year+"-"+month+"-"+day+"T"+"00:00";
}

/**
 * 获取指定时间点 dateTime, 00:00点
 * e.g.:当前 2-15-02-23 18:00
 * 返回: 2016-02-24 00：00
 */
function getDayTimeLocalStr(aa){

    var date = new Date(Number(aa));
    var year = date.getFullYear();//年
    var month = date.getMonth()+1;//月份
    month = month < 10?"0"+month:month;
    var day = date.getDate();//日
	var hours = date.getHours();//时
	var minutes = date.getMinutes();//分
    day = day < 10?"0"+day:day;
	hours = hours < 10?"0"+hours:hours;
    minutes = minutes < 10?"0"+minutes:minutes;
    return year+"-"+month+"-"+day+"T"+hours+":"+minutes;
}
/**
 * 返回上一层/返回上2层，该返回是ios头点击返回的时候调用的js方法
 * @param {Object} type -1(上一层),-2(上2层) 默认-1
 * @param {Boolean} isRefresh 返回后是否刷新  默认刷新
 */
function goBack(type,isRefresh){
	if(!type)
		type = -1;
	if(isH5Only){
//	  history.go(type);
	}else{
		if(isRefresh == undefined)
			isRefresh = true;
		var msg = "://return?type="+type+"&isRefresh="+isRefresh;
		sendMsg2iOS(msg);
	}
}

//该返回是h5界面主动调用js方法进行返回的
function goBackNow(type,isRefresh){
	if(!type)
		type = -1;
	if(isH5Only){
	  history.go(type);
	}else{
		if(isRefresh == undefined)
			isRefresh = true;
		var msg = "://returnNow?type="+type+"&isRefresh="+isRefresh;
		sendMsg2iOS(msg);
	}
}

/**
 * 左滑操作
 * @param {Object} jQueryObj 监听左滑的dom对象
 * @param {Object} optionsJqObj 滑出的操作dom的查询方法如'#id','.class'
 * @param {Object} clickFn(t) click执行的方法,需调用时重写 t为点击时的dom对象
 * //TODO 可优化
 *   在 touchMove和touchEnd中对结果进行处理
 */
function swipeLeftHandle_(jQueryObj,optionAttr,clickFn){
	jQueryObj.css({"position":"relative","overflow-x":"hidden"});
	function prevent_default(e) {
        e.preventDefault();
    }
    function disable_scroll() {
        $(document).on('touchmove', prevent_default);
    }
    function enable_scroll() {
        $(document).unbind('touchmove', prevent_default);
    }
    var x,y;
    var position = "";//value is 'left' or 'right' 'up' or 'down' 
    jQueryObj.on('touchstart', function(e) {
            x = e.originalEvent.targetTouches[0].pageX // anchor point
            y = e.originalEvent.targetTouches[0].pageY // anchor point
        }).on('touchmove', function(e) {
        	var currentObj = $(e.currentTarget);
        	var optionsJqObj = $(e.currentTarget).find(optionAttr);
            var changeA = e.originalEvent.targetTouches[0].pageX - x;
            var changeY = e.originalEvent.targetTouches[0].pageY - y;
            if(changeY!=0){
            	return false;
            }
            
            var change = changeA;
			if(changeA > 0){
				position = "right";
			}else{
				position = "left";
			}
			change = Math.abs(change) - optionsJqObj.width();
			change = Math.min(Math.max(-(optionsJqObj.width()), change), 0);
			if(changeA<0 && (currentObj.attr("class") && currentObj.attr("class").indexOf("open")!=-1))
				return false;
				
            if(position == "left"){
            	if(change == 0){
            		currentObj.addClass("open");
            		addBodyClass(optionsJqObj);
            	}
            }else{
            	if(change == parseInt("-"+jQueryObj.width()))
            		currentObj.removeClass("open");
				if(change < parseInt("-"+jQueryObj.width()))
					return false;
				if(!parseInt(optionsJqObj.css("right")) || Math.abs(parseInt(optionsJqObj.css("right"))) ==  optionsJqObj.width())
					return false;
            }
            optionsJqObj.show().css({right:change});
            if (change < -0.3*optionsJqObj.width()) disable_scroll(); // disable scroll once we hit 10px horizontal slide
        }).on('touchend', function(e) {
            /*
             * 如果right>50%的 optionAttr 宽度,则显示optionAttr,反之隐藏
             * 显示时在li中加入.open  
             */
            var currentObj = $(e.currentTarget);
            var optionsJqObj = $(e.currentTarget).find(optionAttr);
            if(position == "left"){
            	if(!jQueryObj.attr("class") || jQueryObj.attr("class").indexOf("open")==-1 ){
		            if((parseInt(optionsJqObj.css("right"))> -0.3*optionsJqObj.width()) ||
		            	Math.abs(parseInt(optionsJqObj.css("right"))) > 0.3*optionsJqObj.width()){
		            	optionsJqObj.animate({right: 0}, 200)
		            	currentObj.addClass("open");
		            	addBodyClass(optionsJqObj);
		            }else {
		            	optionsJqObj.animate({right:parseInt("-"+optionsJqObj.width())},200);
		            	currentObj.removeClass("open");
		            }
	            }
            }else if(position == "right"){
            	optionsJqObj.animate({right:parseInt("-"+optionsJqObj.width())},200);
            	jQueryObj.removeClass("open");
            }else{
	            clickFn(e.currentTarget);
            }
            position = "";
            enable_scroll();
        });
        /**
         * 添加透明图层
         * @param {Object} optionsJqObj,选项块jQuery对象
         */
        function addBodyClass(optionsJqObj){
        	if(!$("#bodyClass").length){
	        	$(document.body).append("<div id='bodyClass' style='position: fixed;width:100%;height:100%;top: 0;'></div>");
	        	$("#bodyClass").off().on("touchstart",function(){
	        		removeBodyClass();
	        		optionsJqObj.animate({right:parseInt("-"+optionsJqObj.width())},200);
	        		optionsJqObj.parent().removeClass("open");
	        	});
        	}
        }
        function removeBodyClass(){
        	$("#bodyClass").remove();
        }
}
/**
 * 左滑/右滑/点击操作
 * @param {Object} jQueryObj 监听左滑的dom对象
 * @param {Object} optionsJqObj 滑出的操作dom的查询方法如'#id','.class'
 * @param {Object} clickFn(t) click执行的方法,需调用时重写 t为点击时的dom对象
 * 使用touch.js
 */
function swipeLeftHandle(jQueryObj,optionAttr,clickFn){
		$(jQueryObj).css({"position":"relative","overflow-x":"hidden"});
		touch.on(jQueryObj, 'tap swipeleft swiperight', function(ev){
			var currentObj = $(ev.currentTarget);
	        var optionsJqObj = $(ev.currentTarget).find(optionAttr);
			if(ev.type=="tap"){
				clickFn(ev.currentTarget);
			}else if(ev.type=="swipeleft"){
				if(!currentObj.attr("class") || currentObj.attr("class").indexOf("open")==-1){
					optionsJqObj.show().animate({right: 0}, 200);
		        	currentObj.addClass("open");
		        	addBodyClass(optionsJqObj);
	        	}
			}else if(ev.type=="swiperight"){
				if(!currentObj.attr("class") || currentObj.attr("class").indexOf("open")!=-1){
					optionsJqObj.animate({right:parseInt("-"+optionsJqObj.width())},200);
		        	currentObj.removeClass("open");
	       		}
			}
		});
        /**
         * 添加透明图层
         * @param {Object} optionsJqObj,选项块jQuery对象
         */
        function addBodyClass(optionsJqObj){
        	if(!$("#bodyClass").length){
	        	$(document.body).append("<div id='bodyClass' style='position: fixed;width:100%;height:100%;top: 0;'></div>");
	        	$("#bodyClass").off().on("touchstart",function(){
	        		removeBodyClass();
	        		optionsJqObj.animate({right:parseInt("-"+optionsJqObj.width())},200);
	        		optionsJqObj.parent().removeClass("open");
	        	});
        	}
        }
        function removeBodyClass(){
        	$("#bodyClass").remove();
        }
}

/**
 * 获取JSON对象长度
 * @param {Object} jsonObj
 */
function getJsonLength(jsonObj){
	if(!jsonObj) return 0;
	var length = 0;
    for (var item in jsonObj) {
      length++;
    }
    return length;
}

/**
 * subjectId转换为科目名称
 * @param {Object} subjectId
 */
function subjectId2Name(subjectId){
	var name = '';
	$.each(subjectsObj, function(j,k) {
			if(subjectId==j){
				name = k;
				return false;
			}
	});
	return name;
}

/**
 * 将subjectId转换为subjectName
 * @param {String} subjectIds e.g.:1,2,3
 * @param {String} spliter e.g.:,;默认&nbsp;
 * @return 语,数,英
 */
function subjectIds2Names(subjectIds,spliter){
	if(!spliter)
		spliter = "&nbsp;";
	var names = "";
	$.each(subjectIds.split(","), function(i,v) {
		$.each(subjectsObj, function(j,k) {
			if(v==j){
				names+=k.substring(0,1)+spliter;
				return false;
			}
		});
	});
	return names.length>0?names.substring(0,names.length-spliter.length):"";
}


/**
 * 从url中获取传入参数 
 */
function getQueryStringFromUrl(){
	var url = document.location.href;
	var queryString = url.substring(url.indexOf("?")+1);
	return getParam2Json(queryString);
}

//***********************web storage function start********
/**
 * 保存信息到localStorage中
 * @param {String} key
 * @author xuefeng.kang
 */
function saveLocalStorageItem(key,value){
	if(typeof value == "object")
		value = JSON.stringify(value);
	if(!value)
		value="";
	window.localStorage.removeItem(key);
	window.localStorage.setItem(key,decodeURIComponent(value));
}
/**
 * 从localStorage中获取数据
 * @param {Object} key
 * @author xuefeng.kang 
 */
function getLocalStorageItem(key){
	return window.localStorage.getItem(key);
}
/**
 * 从localStorage中删除数据
 * @param {Object} key
 * @author xuefeng.kang 
 */
function removeLocalStorageItem(key){
	window.localStorage.removeItem(key);
}
/**
 * 保存信息到sessionStorage中
 * @param {String} key
 * @author xuefeng.kang 
 */
function setSessionStorageItem(key,value){
	if(typeof value == "object")
		value = JSON.stringify(value);
	window.sessionStorage.removeItem(key);
	window.sessionStorage.setItem(key,value);
}
/**
 * 从sessionStorage中获取数据
 * @param {Object} key
 * @author xuefeng.kang 
 */
function getSessionStorageItem(key){
	return window.sessionStorage.getItem(key);
}

//***********************web storage function end********

/**
 * get 方式的参数转为json串
 * @param {String} getStr e.g.:data=a&data2=b	若参数中存在url地址,并且url地址中有&符,则需要将该url做encodeURIComponent
 * 输出参数 jsonObject
 * @author xuefeng.kang 
 */
function getParam2Json(getStr){
	var jsonObj = {};
	$.each(getStr.split("&"), function(i,v) {
		var equToIndex = v.indexOf("=");
		jsonObj[v.substring(0,equToIndex)]=v.substring(equToIndex+1);
	});
	return jsonObj;
}

/**
 * 获取当前毫秒数
 * @author xuefeng.kang 
 */
function getTime(){
	return new Date().getTime();
}

/**
 * 获取签名字符串
 * @param {Object} data JSON Object,请求字段json对象
 * @param {String} url 进行签名的访问地址
 * 输出参数:$.trim(data)
 * @author xuefeng.kang 
 */
function getSignCode_(data,url,reqFn){
	if(url)
//		data.method = url.substring(url.lastIndexOf("/")+1);
//		data += (data?"&":"") + "method="+url.substring(url.lastIndexOf("/")+1);
	console.log(data);
		data+="&time="+getTime();
	var sign = "";
	postSynoAjaxText(generateSignUrl,data,function(data){
		sign = $.trim(data);
	},function(xhr,status,throwInfo){
		alertToast("获取签名信息失败!");
	});
	//	return sign;
	//"jid="+jid+"&schoolId="+schoolId+"&classId="+classId - //"&time="+getTime();
	//	document.location.href="://getSignCode?"+data+"&method="+url+"&reqFn=reqFn&returnSignFn=returnSign"
	data = data.replace(/&method=(\w*.\w*)/g,"");
	returnSign(reqFn,data,sign);
}
/**
 * 获取签名字符串
 * @param {String} data queryString,请求字段 a=b&c=d
 * @param {String} url 进行签名的访问地址
 * @param {String} reqFn 请求签名后调用的方法名
 * @author xuefeng.kang 
 */
function getSignCode(data,url,reqFn){
	if(url)
		data += (data?"&":"") + "method="+url.substring(url.lastIndexOf("/")+1);
    if(isH5Only){
		getSignCode_(data,url,reqFn);
	}else{
		sendMsg2iOS("://getSignCode?"+data+
                            "&reqFn="+reqFn+"&returnSignFn=returnSign");
    }
}

/**
 * 获取签名后调用的方法
 * @param {String} reqFn 请求签名后调用的方法名
 * @param {String} data 请求签名时传入的data,需去除&reqFn=reqFn&returnSignFn=reqFn
 * @param {String} sign 签名串
 */
function returnSign(reqFn,data,sign){
	$("#reqSignIframe").remove()
	data+="&sign="+sign;
	eval(reqFn+"('"+data+"')");
}

/**
 * 给iOS发送消息,纯消息无跳转
 * @param {Object} url ,发送的Url
 */
function sendMsg2iOS(url){
	if($("#reqSignIframe").length)
		$("#reqSignIframe").remove();
	$(document.body).append("<iframe style='display:none;' id='reqSignIframe' src='"+url+"'/>");			
}

/**
 * post Ajax请求,返回JSON
 * @param {Object} urlName
 * @param {Object} data	:json对象
 * @param {Object} successFn
 * @param {Object} errorFn
 * @author xuefeng.kang 
 */
function postSynoAjaxText(urlName,data,successFn,errorFn,completeFn){
//	urlName = urlName+".do";
	genericAjax(urlName,"POST",data,"text",successFn,errorFn,completeFn,false);
}
/**
 * post Ajax请求,返回JSON
 * @param {Object} urlName
 * @param {Object} data	:json对象
 * @param {Object} successFn
 * @param {Object} errorFn
 * @author xuefeng.kang 
 */
function postSynoAjaxJSON(urlName,data,successFn,errorFn,completeFn){
//	urlName = urlName+".do";
	genericAjax(urlName,"POST",data,"json",successFn,errorFn,completeFn,false);
}


/**
 * post Ajax请求,返回JSON
 * @param {Object} urlName
 * @param {Object} data	:json对象
 * @param {Object} successFn
 * @param {Object} errorFn
 * @author xuefeng.kang 
 */
function postAjaxJSON(urlName,data,successFn,errorFn,completeFn){
//	urlName = urlName+".do";
	genericAjax(urlName,"POST",data,"json",successFn,errorFn,completeFn);
}

/**
 * get Ajax请求,返回JSON
 * @param {Object} urlName
 * @param {Object} data :查询字符串,e.g.:queryString1=1&queryString2=2,若无则传入""
 * @param {Object} successFn
 * @param {Object} errorFn
 * @author xuefeng.kang 
 */
function getAjaxJSON(urlName,data,successFn,errorFn,completeFn){
//	urlName = urlName+".do?"+data;
	urlName = data?urlName+"?"+data:urlName;
	genericAjax(urlName,"POST",data,"json",successFn,errorFn,completeFn);
}
//gaobo 20170223
function getAjaxJSON2(urlName,data,successFn,errorFn,completeFn){
//	urlName = urlName+".do?"+data;
//	urlName = data?urlName+"?"+data:urlName;
	genericAjax(urlName,"get",data,"json",successFn,errorFn,completeFn);
}
/**
 * 公共ajax方法
 * @param {Object} urlName
 * @param {Object} type
 * @param {Object} data
 * @param {Object} successFn
 * @param {Object} errorFn
 * @param {Object} completeFn
 * @param {Boolean} async
 * @author xuefeng.kang 
 */
function genericAjax(url,type,data,dataType,successFn,errorFn,completeFn,async){
//	console.log("postAjax url="+url);
	async = typeof async == "undefined" || async === true?true:false;
	console.log(data);
	$.ajax({
		url:url,
		type:type,
//		headers:{
//			"Access-Control-Allow-Origin":"*",
//          "Access-Control-Allow-Headers":"X-Requested-With"
//		},
		async:async,
		data:data,
		dataType:dataType,
		success:successFn,
		error:errorFn,
		complete:completeFn
	});
}
/**
 * 公共ajax方法
 * @param {Object} urlName
 * @param {Object} type
 * @param {Object} data
 * @param {Object} successFn
 * @param {Object} errorFn
 * @param {Object} completeFn
 * @param {Boolean} async
 * @author xuefeng.kang 
 */
function genericAjaxHasBefore(url,type,data,dataType,successFn,errorFn,beforeFn,completeFn,async){
//	console.log("postAjax url="+url);
	async = typeof async == "undefined" || async === true?true:false;
	$.ajax({
		url:url,
		type:type,
//		headers:{
//			"Access-Control-Allow-Origin":"*",
//          "Access-Control-Allow-Headers":"X-Requested-With"
//		},
		async:async,
		data:data,
		dataType:dataType,
		beforeSend:beforeFn,
		success:successFn,
		error:errorFn,
		complete:completeFn
	});
}

/**
 * alert弹出框
 * @param {String} info 需要展示的信息
 * @param {Function} callback 点击确定执行的回调函数 
 */
function alertInfo(msg,callback){
	/*
	<div name="alertInfoDiv" style="top: 0;position: fixed;width: 100%;height: 100%;z-index: 999;background-color: rgba(0,0,0,0.4);">
			<div style="top:35%;position: relative;margin: 0 auto;width: 450px;background-color: #fff;font-size: 18px;text-align: center;">
				<div style="padding:20px 10px;overflow-y: auto;height: 100px;border-bottom: 1px solid #CFCFCF;cursor: default;">
					这是一个弹出层
				</div>
				<div name="configBtn" style="padding: 10px 0;color: #4AACEE;cursor:pointer;">
					确定
				</div>
			</div>
		</div>
	*/
	msg = msg!=undefined?msg.toString().replace(/\n/g,"<br/>"):"";
	var alertDiv = $('<div name="alertInfoDiv" style="top: 0;position: fixed;width: 100%;height: 100%;z-index: 999;background-color: rgba(0,0,0,0.4);">'+
				   '	<div style="top:35%;position: relative;margin: 0 auto;width: 70%;background-color: #fff;font-size: 18px;text-align: center;">'+
				   '		<div style="height:20px;width:100%;"></div>'+
				   '		<div style="padding:0 10px 20px 10px;max-height: 100px;overflow-y: auto;border-bottom: 1px solid #CFCFCF;cursor: default;word-wrap: break-word;">'+
				   msg+
				   '		</div>'+
				   '		<div name="configBtn"style="padding: 10px 0;color: #4AACEE;cursor:pointer;">'+
				   '		确定'+
				   '		</div>'+
				   '	</div>'+
				   '</div>');
	alertDiv.find("[name=configBtn]").on("click",function(){
		alertDiv.remove();
		if(callback)
			callback();
	});
	$(document.body).append(alertDiv);
}

/**
 * toast弹出层,支持换行 使用\n(或<br/>)换行
 * e.g.:
 * <div style="position: fixed; z-index: 9999; bottom: 50px; width: 100%; transition: opacity 0.8s; opacity: 0;">
 * 		<div style="font-size: 14px;width: 270px;margin: 5px auto;padding: 5px;text-align: center;color: #000;border-radius: 7px;background-color: #d8d8d8;">
 * 			哈哈
 * 		</div>
 * </div>
 */
function alertToast(msg){
	var containerStyle = "position: fixed;z-index: 9999;bottom: 60px;width: 100%;"+
						 "-webkit-transition: opacity .8s;transition: opacity .8s;opacity: 0;";
	var toastMsgStyle = "font-size: 14px;max-width: 270px;margin: 5px auto;padding: 5px;"+
					 "text-align: center;color: #000;border-radius: 7px;word-wrap: break-word;background-color: rgba(0,0,0,0.7);color:#FFF;";
	msg = msg!=undefined?msg + "":"";
	toastMsgStyle+="width:"+(msg.length*14>=270?270:msg.length!=0?msg.length*14:20)+"px;";
	var showStyle = "opacity: 1;";
	var d = document.createElement("div");
    d.setAttribute("style",containerStyle);
    d.setAttribute("id","alertToast");
    msg = msg?msg.replace(/\n/g,"<br/>"):"&nbsp;";
    d.innerHTML = '<div style="'+toastMsgStyle+'">' + msg + "</div>",
    d.addEventListener("webkitTransitionEnd", function() {
        d.style.opacity=="1" || d.parentNode.removeChild(d);
    });
    if(document.getElementById("alertToast"))
    	document.getElementById("alertToast").remove();
    document.body.appendChild(d);
    d.style.opacity=1;
    setTimeout(function() {
          d.style.opacity=0;
    },2e3);
}
/**
 * 弹出确认提示框
 */
function alertConfirm(msg,confirmFn,confirmFnParam){
	msg = msg!=undefined?msg + "":"";
	var body = $(document.body);
	var popHtml ='<div id="alertConfirmPop" class="delMemberDiv">'+
				 '	<div class="bgo40" onclick="$(\'#alertConfirmPop\').remove()"></div>'+
				 '	<div class="content">'+
				 '		<div class="info">'+
				'	<header>'+msg+'</header>'+
				'	<div class="options">'+
				'	</div>'+
				'</div>'+
				'<div class="operate">'+
				'	<span name="submit" onclick='+confirmFn+'('+confirmFnParam+')>确定</span>'+
				'	<span onclick="$(\'#alertConfirmPop\').remove()">取消</span>'+
				'</div>'+
				'</div>'+
				'</div>'; 
	body.append($(popHtml).show());
}
/**
 * 正在加载圈
 */
function onLoading(){
	if(!$("#loadingDiv").length){
		var loadingDiv = "<div id='loadingDiv'>"+
						 "	<div class='loading'></div>"+
						 "<div>";
		$(document.body).append(loadingDiv);
	}
}
/**
 * 关闭正在加载
 */
function onLoaded(){
	if($("#loadingDiv").length)
		$("#loadingDiv").remove();
}

  /**
   * 封装 上拉下拉刷新方法,需要在请求数据完成后加载
   * container 下需要有一级结构
   * wrapper 内容变化后需要调用mySwiper.reInit(),重新初始化
   * @description
   *    文档结构 swiper-slide:在内容容器上加
   *    <div class="preloader"> Loading... </div>
		<div class="swiper-container">
		  <div class="swiper-wrapper">
		    <div class="swiper-slide red-slide">
		      <div class="title">Slide 1</div>
		    </div>
		   </div>
		</div>
	  <div class="bottomloader"> Bottom Loading... </div>
   * 
   * @param {String} containerSelector	容器选择器,.#...
   * @param {String} preLoaderSelector  下拉加载选择器 ,.#...
   * @param {Function} preLoaderClassHandleFn 下拉加载样式处理
   * @param {Function} preLoaderHandleFn 下拉加载处理,处理成功后需处理 下拉的样式
   * 					  mySwiper.prependSlide('<div class="title">www.internetke.com '+slideNumber+'</div>', 'swiper-slide '+color+'-slide');
   * 					  mySwiper.setWrapperTranslate(0,0,0)
					      mySwiper.params.onlyExternal=false;
					      //Update active slide
					      mySwiper.updateActiveSlide(0)
					      //Hide loader
					      $('.preloader').removeClass('visible');
   * @param {String} bottomLoaderSelector 上拉加载处理
   * @param {Function} bottomLoaderClassHandleFn 上拉加载样式处理
   * @param {Function} bottomLoaderHandleFn 上拉加载处理,处理成功后需处理 上拉的样式
   * 					mySwiper.appendSlide('<div class="title">www.internetke.com '+(slideNumber++)+'</div>', 'swiper-slide '+color+'-slide');
						 if( swiper_wrapperHeight <= $(document.body).height())
							//垂直移动到页面顶端
							mySwiper.setWrapperTranslate(0,0,0);
						 else
							//垂直移动到页面底端
							mySwiper.setWrapperTranslate(0, ($(document.body).height() - $(".swiper-wrapper").height()) ,0);
						 mySwiper.params.onlyExternal=false;
						 setTimeout(function(){
							mySwiper.updateActiveSlide();
						 },100);
						 //Hide loader
						 $('.bottomloader').removeClass('visible');
						 swiper_wrapper.css("bottom",0);
   */
  function upAndDownSwiperWrapper(containerSelector,
  			preLoaderSelector,preLoaderClassHandleFn,preLoaderHandleFn,
  			bottomLoaderSelector,bottomLoaderClassHandleFn,bottomLoaderHandleFn,onSwiperCreatedFn){
	 	var holdPosition = 0;
	 	var position ;
	  	var mySwiper = new Swiper(containerSelector,{
		    slidesPerView:'auto',
		    mode:'vertical',
//		    loop:false,
		    freeMode:true,
		    freeModeFluid:true,//若为真，释放滑块之后仍会滑动一小会
		    scrollContainer:true,//设置为真时，让Swiper看上去像滑动区（scrollable area）
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
		    //momentumBounce:false,
		    watchActiveIndex: true,
		    onTouchStart: function() {
		      holdPosition = 0;
		    },onTouchMove:function(e){
		    	if(holdPosition==0)
		    		return false;
		    	if(holdPosition>50){
		    		if(position=="down"){
			    		$('.topFlushLoading').addClass('visible');
			    		$(".topFlushLoading").text("下拉加载更多");
			    		if(holdPosition>=100)
			    			$(".topFlushLoading").text("释放后加载");
		    		}
		    	}else{
		    		if($('.bottomMoreLoading').attr("status")!="true")
		    			return false;
		    		if(position=="up"){
			    		$(document.body).scrollTop($(document.body).height());
				  		$('.bottomMoreLoading').addClass('visible');
			    		$(".bottomMoreLoading").text("上拉加载更多");
			    		if(holdPosition<=-100)
		    				$(".bottomMoreLoading").text("释放后加载");
		    		}
		    	}
		    },
		    onResistanceBefore: function(s, pos){
		      position = 'down';
		      holdPosition = pos;
		    },
			onResistanceAfter:function(s,pos){
			  position = 'up';
			  holdPosition = parseInt("-"+pos);
			},
		    onTouchEnd: function(e){
	    	  position = undefined;
		      if (holdPosition >= 100) {//TODO 需修改为0&& $(".swiper-wrapper").offset().top==44
		      		$(".topFlushLoading").text("正在加载");
					mySwiper.setWrapperTranslate(0,$(preLoaderSelector).height(),0);
					mySwiper.params.onlyExternal=true;
					preLoaderClassHandleFn(mySwiper);
					preLoaderHandleFn(mySwiper);
					/**
					 * setTimeout(function(){
				      //Prepend new slide
				      var colors = ['blue','red','green','orange','pink'];
				      var color = colors[Math.floor(Math.random()*colors.length)];
				      mySwiper.prependSlide('<div class="title">www.internetke.com '+slideNumber+'</div>', 'swiper-slide '+color+'-slide');
				      //Release interactions and set wrapper
				      mySwiper.setWrapperTranslate(0,0,0)
				      mySwiper.params.onlyExternal=false;
				      //Update active slide
				      mySwiper.updateActiveSlide(0)
				      //Hide loader
				      $('.preloader').removeClass('visible');
				    },1000);
					 */
		      }else if (holdPosition!=0 && holdPosition <= - 100) {//(Math.abs($(".swiper-wrapper").offset().top) - $(".swiper-wrapper").height- $(document.body).height()>0)  && 
					if($('.bottomMoreLoading').attr("status")!="true"){
	  					releaseUpFlushWrapper(mySwiper);
	  					return false;
  					}
					$(".bottomMoreLoading").text("正在加载");
					var swiper_wrapper = $(containerSelector).children().first();
					mySwiper.params.onlyExternal=true;
					bottomLoaderClassHandleFn(mySwiper);
					swiper_wrapper.css("bottom",$(bottomLoaderSelector).height());
					mySwiper.params.onlyExternal=true;
					bottomLoaderHandleFn(mySwiper);
					/*
					setTimeout(function(){
						 if( swiper_wrapperHeight <= $(document.body).height())
							//垂直移动到页面顶端
							mySwiper.setWrapperTranslate(0,0,0);
						 else
							//垂直移动到页面底端
							mySwiper.setWrapperTranslate(0, ($(document.body).height() - $(".swiper-wrapper").height()) ,0);
						 mySwiper.params.onlyExternal=false;
						 setTimeout(function(){
							mySwiper.updateActiveSlide();
						 },100);
						 //Hide loader
						 swiper_wrapper.css("bottom",0);
					},1000);
					*/
			  }else{
			  	$('.topFlushLoading').removeClass('visible');
			  	$('.bottomMoreLoading').removeClass('visible');
			  }
		    }
		  ,onSwiperCreated:function(s){
		  	if(onSwiperCreatedFn)
		  		onSwiperCreatedFn();
		  }});
		currMySwiper = mySwiper;
		return mySwiper;
  }
/**
 * 清空swiper相关信息
 */
function clearSwiperInfo(){
	if(typeof touchType != 'undefined') touchType = undefined;
	if(typeof currMySwiper != 'undefined') currMySwiper = undefined;
}
/**
 * 重置下拉刷新wrapper配置
 */
function releaseDownFlushWrapper(mySwiper){
	 $('.topFlushLoading').removeClass('visible');
	 //Release interactions and set wrapper
      mySwiper.setWrapperTranslate(0,0,0)
      mySwiper.params.onlyExternal=false;
      //Update active slide
      mySwiper.updateActiveSlide(0)
      clearSwiperInfo();
}
/**
 * 重置上拉拉加载wrapper配置
 */
function releaseUpFlushWrapper(mySwiper,bottomLoadingContainer){
	var swiper_wrapper = $(".swiper-wrapper");
	/*
	swiper_wrapper.css("bottom",$(bottomLoadingContainer).height());
	var swiper_wrapperHeight = swiper_wrapper.height();
	 if( swiper_wrapperHeight <= $(document.body).height())
		//垂直移动到页面顶端
		mySwiper.setWrapperTranslate(0,0,0);
	 else
		//垂直移动到页面底端
		mySwiper.setWrapperTranslate(0, ($(document.body).height() - $(".swiper-wrapper").height()) ,0);
	*/
	$('.bottomMoreLoading').removeClass('visible');
	 mySwiper.params.onlyExternal=false;
	 setTimeout(function(){
		mySwiper.updateActiveSlide();
	 },100);
	 swiper_wrapper.css("bottom",0);
	 clearSwiperInfo();
};
/**
 * 数据加载后处理
 */
function touchOutHandle(handleFn){
	if(touchType!=undefined && currMySwiper)
		currMySwiper.reInit();
	if(touchType == 0){
		releaseUpFlushWrapper(currMySwiper);
	}else if(touchType == 1){
		releaseDownFlushWrapper(currMySwiper);
	}
	if(touchType==undefined && currMySwiper == undefined)
		if(handleFn) handleFn();
}
/**
 * 拍照弹出层打开
 * imgSrcType : 图片来源 0(摄像头),1(相册)
 * targetType : 目标类型 0(题目),1(解析)
 */
function getPicPopShow(imgSrcType){
	$("#getPicPopDiv").attr("data",imgSrcType).show();
}
/**
 * 拍照弹出层关闭
 */
function getPicPopClose(){
	$("#getPicPopDiv").removeAttr("data").hide();
}

/**
 * 
 * 接收iOS推送 班级通知
 * @param {Object} pushInfo,推送信息
 */
function receiveiOSPushInfoForClassNotice(pushInfo){
	//保存是否存在班级通知
	var flag = {};
	flag[jid]=true;
	saveLocalStorageItem(webStorageVars[23],flag);
}

/**
 * 图片预览
 * @param {Object} imgSrc
 */
function imgViewShow(imgSrc){
	if(!imgSrc)
		return false;
	var location = document.location.href.split("/pages/");
	if(!location[0])
		return false;
	location =location[0]+"/pages/common/img_view.html?imgSrc="+encodeURIComponent(encodeURIComponent(imgSrc));
	document.location.href=location+"://head?title=[,false,,]&"+
					   "rightHandle:[isExist:false]&"+
					   "isShow=false";
}
/**
 * 通过iOS调用更新教师头像
 * @param {Object} imgSrc
 */
function updateHeadImgFromiOS(imgSrc){
	if(imgSrc){
		saveLocalStorageItem(webStorageVars[3],imgSrc);
		$(".tm_head_img").attr("src",imgSrc+"?_="+new Date().getTime());
	}
}
/**
 * 跳转到个人信息页
 * @param {Object} jid
 * @param {Object} type 用户类型
 */
function gotoPersonInfoPage(jid,type){
	sendMsg2iOS("://info?jid="+jid);
	event.stopImmediatePropagation();
}
//***********************common js function end*******************************
var jid,//用户id
	schoolId;//用户所属学校id
/**
 * 双击页面上移处理
 */
function pageMoveHandleListen(){
	var list = document.getElementsByClassName("swiper-container");
    for(var i=0;i<list.length;i++){
    	list[i].parentElement.ontouchstart=function(){return false;};
    }
}
$(function(){
	with (document.body){
		onselectstart=function(){return false};
        onbeforecopy=function(){return false};
        onselect=function(){
        	if(document.selection)
        		document.selection.empty();
        };
        oncontextmenu=function(){return false;};
        //ontouchstart = function(){return false;};
        ondblclick = function(){
        	event.preventDefault();
        	event.stopImmediatePropagation();
        	event.stopPropagation();
        	return false;
        };
	}
    with(document.documentElement.style){
    	webkitTouchCallout='none';
    	webkitUserSelect='none';
    }
	pageMoveHandleListen();
	$.ajaxSetup({
	  beforeSend :function(xhr){
	  	xhr.setRequestHeader("X-Requested-with","XMLHttpRequest");
	  	onLoading();
	  },
	  complete:function(){
	  	onLoaded();
	  }
	});
	//若只有H5,则显示header
	if(isH5Only)
		$(".titleBarHeader").show();
	
	jid = getLocalStorageItem(webStorageVars[2]);
	schoolId = getLocalStorageItem(webStorageVars[5]);
	//获取配置信息
	getLocalConfig();
//	jid = "2704470";
//	schoolId= "50040";
});

//***********************test start*******************************
/*
getAjaxJSON(Config.getClassListUrl,"",function(data){
					console.log(data.result);
					console.log(data.msg);
					console.log(JSON.stringify(data));
				},function(){
					alert("error");
				});
*/
//***********************test end*******************************
//**************** V 2.1 版本新增信息 start************************************
/**
 * 将配置从localStorage读取并赋值
 */
function getLocalConfig(){
	var config = getLocalStorageItem(webStorageVars.CONFIG);
	if(config){
		varTempConfig = $.parseJSON(config);
		Config.CONFIG_FROM = varTempConfig.CONFIG_FROM;
		Config.IM_SERVICE_DOMAIN = varTempConfig.IM_SERVICE_DOMAIN;
		Config.AIXUE_DOMAIN = varTempConfig.AIXUE_DOMAIN;
	}
}
/**
 * 获取接口配置信息,页面加载完成后原生调用该方法
 *
 * @param data 为通过getConfig.do 返回的item 字符串信息{itemId:,itemDesc:,config:[}}
 * @date 2017-07-07 15:12:36
 * @author kangxuefeng@etiantian.com
 */
function setConfigToJs(data){
	removeLocalStorageItem(webStorageVars.CONFIG);
	if(data) {
		data = JSON.parse(data);
		Config.CONFIG_FROM = data.itemId?data.itemId:0;
		Config.IM_SERVICE_DOMAIN = data.config.imServiceDomain;
		Config.AIXUE_DOMAIN = data.config.aixueDomain;
		saveLocalStorageItem(webStorageVars.CONFIG,JSON.stringify(Config));
	}else{
		alertToast("配置信息获取为空");
	}
	getLocalConfig();
}
/**
 * 判断ConfigFrom的处理
 * @param fn 不校验ConfigFrom的处理
 * @param configFromHadleFn 校验ConfigFrom后的处理 ,若该字符段为空时,标标识非DongGuan环境下执行fn
 * @date 2017-07-07 15:12:36
 * @author kangxuefeng@etiantian.com
 */
function handleByConfigFrom(fn,configFromHadleFn){
	var isFn = false;
	var isDG = false;

	if(Config.CONFIG_FROM == CONFIG_FROM.DONG_GUA){
		isDG = true;
	}

	if(fn && typeof fn === "function")
		isFn = true;

	if(isFn && isDG){
		//城域网环境处理
		if(configFromHadleFn && typeof configFromHadleFn ==="function"){
			fn();
			configFromHadleFn();
		}
	}else if(isFn && !isDG ){
		fn();
	}
}
//**************** V 2.1 版本新增信息 end************************************

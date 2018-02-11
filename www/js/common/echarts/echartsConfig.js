/**
 * 调用echarts配置信息
 */
//如果你把引用echarts的script标签放置head内在IE8-的浏览器中会出现报错，解决的办法就是把标签移动到body内（后）
// Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
require.config({
    paths: {
        echarts: webRoot+'/js/common/echarts/'
    }
});
    /*!
 * Name: 大语文-亲自端 seajs配置模块
 * Date: 2017.2.9
 * Copyright: Copyright (c) 2017 www.etiantian.com
 * @ Author : 徐嫣
 * @ Version : 1.00
 */

seajs.config({

    base: "../../js/common",
    alias: {
        'jquery' : 'jquery-1.9.1.min',
        'fastclick' : 'fastclick',
        'jwplayer' : 'jwplayer-7.7.1/jwplayer',
        'common':'common'
    },

    preload: ['jquery', 'fastclick' ,'jwplayer69','common'],

    debug: true,

    charset: 'utf-8'
});

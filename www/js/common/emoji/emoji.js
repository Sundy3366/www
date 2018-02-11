var emojiNames= ['傲慢','呲牙','大哭','大笑','嘚瑟','调皮','害羞','汗','坏笑','剪刀手','囧','纠结','可爱','酷','卖萌','难受','祈祷','强','亲亲','色','委屈','兴奋','疑问','再见','眨眼','折磨','OK'];
var imgScale='@2x';
var webRoot = document.location.href.split("/pages/")[0]+"/js/common/emoji/";
/**
 * 匹配str中的emoji表情为图片
 * [emojiName]转换为<img src='src'/>
 * @param {Object} str
 * @return {String} 转换后的字符串
 */
function matchEmoji(str){
	if(str == undefined)
		str = "";
	//格式匹配,匹配存在[1-3个字],e.g.:[哈哈],[哈哈2]
	var matchFormatStrs = str.match(/\[(ok|OK|[\u2E80-\u9FFF]{1,3})\]/img);
	if(matchFormatStrs){
		var hadHandle = [];//已处理数组
		for(var i=0;i<matchFormatStrs.length;i++){
			var matchWord= matchFormatStrs[i].substring(1,matchFormatStrs[i].length-1);
			if(isArrayContains(matchWord,hadHandle))
				continue;
			hadHandle.push(matchWord);
			if(isArrayContains(matchWord,emojiNames))
				str = str.replace(eval("/\\["+matchWord+"\\]/img"),"<img style='width: 28px;height: auto;' src='"+(webRoot+"/face/"+matchWord+".imageset/"+matchWord+imgScale+".png")+"'/>");
		}
	}
	return str;
}

/**
 * 在array中查找needle，bool为布尔量，如果为true则返回needle在array中的位置
 * @param {Object} needle
 * @param {Object} bool
 */
function isArrayContains(needle,array,bool){
    if(typeof needle=="string"||typeof needle=="number"){
        for(var i in array){
            if(needle===array[i]){
                if(bool){
                    return i;    
                }
                return true;    
            }
        }
        return false;    
    }
}
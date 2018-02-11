function cutImg(path) {
	$("#showEdit").fadeIn();
	//背景图片用canvas画出来
	var canvas = fixCanvas(document.getElementById('readyimg'));
	var showEdit = document.getElementById('showEdit');
	canvas.width = showEdit.clientWidth;
	canvas.height = showEdit.clientHeight;
	var context = canvas.getContext('2d');
	var img = new Image();
	var base64 = null;
	img.src = path;
	img.onload = function() {
		var that = this;
		EXIF.getData(img, function() {
			EXIF.getAllTags(img);
			rotateImage(img, context, EXIF.getTag(img, 'Orientation'), showEdit);
			var $image = $('#report > canvas');
			$image.cropper({
				checkImageOrigin: true,//默认情况下，插件会检测图片的源，如果是跨域图片，图片元素会被添加crossOrigin class
				aspectRatio: 1 / 1,//设置剪裁容器的比例
				autoCropArea: 0.3,//0-1之间的数值，定义自动剪裁区域的大小。
				//zoom: -0.2,
				background:false,//是否在容器上显示网格背景
				//modal:false,//是否在剪裁框上显示黑色的模态窗口
				guides:false,//是否在剪裁框上显示虚线
				highlight:false,//类型：Boolean，默认值true。是否在剪裁框上显示白色的模态窗口
				zoomable:true,//是否允许放大缩小图片。
				movable:false,//是否允许移动剪裁框
				dragMode:'move',
				toggleDragModeOnDblclick:false,
				resizable:false//是否允许改变剪裁框的大小
			});
		});
	}
}
//确认照片，展示效果,将照片旋转为正确显示
function rotateImage(img, context, type, showEdit) {
	var scale = img.width / img.height;
	var scalecanvas = showEdit.clientHeight / showEdit.clientWidth;
	var startx, starty, height, width;
	switch (type) {
		case 8:
			// 90 rotate left
			context.rotate(-0.5 * Math.PI);
			if (scale > scalecanvas) {
				height = showEdit.clientHeight;
				width = height / scale;
				startx = 0 - height;
				starty = (showEdit.clientWidth - width) / 2;
			} else {
				width = showEdit.clientWidth;
				height = width * scale;
				startx = (showEdit.clientHeight - height) / 2 - showEdit.clientHeight;
				starty = 0;
			}
			context.drawImage(img, 0, 0, img.width, img.height, parseInt(startx), parseInt(starty), parseInt(height), parseInt(width));
			break;
		case 3:
			//180向左旋转
			if (scale > scalecanvas) {
				height = showEdit.clientHeight;
				width = height / scale;
				startx = (showEdit.clientWidth - width) / 2 - showEdit.clientWidth;
				starty = 0 - height;
			} else {
				width = showEdit.clientWidth;
				height = width / scale;
				startx = 0 - width;
				starty = (showEdit.clientHeight - height) / 2 - showEdit.clientHeight;
			}
			context.rotate(Math.PI);
			context.drawImage(img, 0, 0, img.width, img.height, parseInt(startx), parseInt(starty), parseInt(width), parseInt(height));
			break;
		case 6:
			//90 rotate right 需要向右旋转90度
			if (scale > scalecanvas) {
				height = showEdit.clientHeight;
				width = height / scale;
				startx = 0;
				starty = (showEdit.clientWidth - width) / 2 - showEdit.clientWidth;
			} else {
				width = showEdit.clientWidth;
				height = width * scale;
				startx = (showEdit.clientHeight - height) / 2;
				starty = 0 - width;
			}
			context.rotate(0.5 * Math.PI);
			context.drawImage(img, 0, 0, img.width, img.height, parseInt(startx), parseInt(starty), parseInt(height), parseInt(width));
			break;
		case 1:
			if (1 / scale >= scalecanvas) {
				height = showEdit.clientHeight;
				width = height * scale;
				startx = (showEdit.clientWidth - width) / 2;
				starty = 0;
			} else {
				width = showEdit.clientWidth;
				height = width / scale;
				startx = 0;
				starty = (showEdit.clientHeight - height) / 2;
			}
			context.drawImage(img, 0, 0, img.width, img.height, parseInt(startx), parseInt(starty), parseInt(width), parseInt(height));
			break;
		default:
			if (1 / scale >= scalecanvas) {
				height = showEdit.clientHeight;
				width = height * scale;
				startx = (showEdit.clientWidth - width) / 2;
				starty = 0;
			} else {
				width = showEdit.clientWidth;
				height = width / scale;
				startx = 0;
				starty = (showEdit.clientHeight - height) / 2;
			}
			context.drawImage(img, 0, 0, img.width, img.height, parseInt(startx), parseInt(starty), parseInt(width), parseInt(height));
	}
}

var imgUrl = '';

function cropConfirm() {
	$("#showEdit").fadeOut();
	var $image = $('#report > canvas');
	var dataURL = $image.cropper("getCroppedCanvas");
	imgUrl = dataURL.toDataURL("image/png", 1.0);
	$("#selfImage").attr("src", imgUrl);
	$image.cropper('destroy');
	return imgUrl;
}

function rotateimg() {
	$("#readyimg").cropper('rotate', 90);
}

function rotateimgleft() {
	$("#readyimg").cropper('rotate', -90);
}

function closepop() {
	$("#showEdit").fadeOut();
	var $image = $('#report > canvas');
	$image.cropper('destroy');
}

/**
 * fixed canvas
 * 
 */
// For reusing canvas instance of detectVerticalSquash
var canvas;
/**
 * 'Fixes' single canvas instances. 
 * Leaving the canvas html detection.
 */
function fixCanvas(canvas)
{
    var ctx = canvas.getContext('2d');
    var drawImage = ctx.drawImage;
    ctx.drawImage = function(img, sx, sy, sw, sh, dx, dy, dw, dh)
    {
        var vertSquashRatio = 1;
        // Detect if img param is indeed image
        if (!!img && img.nodeName == 'IMG')
        {
            vertSquashRatio = detectVerticalSquash(img);
            sw || (sw = img.naturalWidth);
            sh || (sh = img.naturalHeight);
        }
        
        // Execute several cases (Firefox does not handle undefined as no param)
        // by call (apply is bad performance)
        if (arguments.length == 9)
            drawImage.call(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        else if (typeof sw != 'undefined')
            drawImage.call(ctx, img, sx, sy, sw, sh / vertSquashRatio);
        else
            drawImage.call(ctx, img, sx, sy);
    };
    return canvas;
}

/**
 * Detecting vertical squash in loaded image.
 * Fixes a bug which squash image vertically while drawing into canvas for some images.
 * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
 * 
 */
function detectVerticalSquash(img) {
    var ih = img.naturalHeight;
    canvas = canvas || document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    try {
        // Prevent cross origin error
        var data = ctx.getImageData(0, 0, 1, ih).data;
    } catch (err) {
        // hopeless, assume the image is well and good.
        console.log("Cannot check verticalSquash: CORS?");
        return 1;
    }
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
            ey = py;
        } else {
            sy = py;
        }
        py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
}

// Test
function testURL(url)
{
    var canvasEl = fixCanvas(document.createElement('canvas'));
    document.body.appendChild(canvasEl);
    
    var imgEl = document.createElement('img');
    imgEl.onload = function()
    {
        var ctx = canvasEl.getContext('2d');
        ctx.drawImage(this, 0, 0, 300, 150);
    };
    imgEl.src = url;
}
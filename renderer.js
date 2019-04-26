// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let $ = require("jquery");
var sizeOf = require('image-size');

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


let percentageForValidation = 20;
let global_imageList = null;
let global_imgInfo = [];
let currentImgSize = null;
let currentImageID = null;

let global_imgArea = [];


initDraw();
function initDraw() {

    this.element = document.createElement('canvas');
    this.ctx = this.element.getContext("2d");

    $(this.element)
       .attr('id', 'canvas')
       .text('unsupported browser')
       .appendTo('.image-viewer')
       .css({'background':'transparent'});




    function setMousePosition(e) {
        var offset = $('#canvas').offset();
        var mouse_mx = parseInt(e.pageX - offset.left);
        var mouse_my = parseInt(e.pageY - offset.top);

        //console.log(mouse_mx, mouse_my);
        
        ctx.beginPath();
        ctx.arc(mouse_mx, mouse_my, 10, 0, 2 * Math.PI);
        ctx.stroke();
    }




    canvas.onmousemove = function (e) {
        setMousePosition(e);
    }



    let global_rectangle_start = null;
    let global_rectangle_end = null;

    canvas.onclick = function (e) {

    	let img_height = $('.image-viewer img').height();
        let img_width = $('.image-viewer img').width();

        let difRatio = img_width / currentImgSize.width;

        var offset = $('#canvas').offset();
        var mouse_mx = parseInt(e.pageX - offset.left);
        var mouse_my = parseInt(e.pageY - offset.top);






        if(global_rectangle_start == null) {
        	global_rectangle_start = { x:mouse_mx, y:mouse_my };
        } else {
        	global_rectangle_end = { x:mouse_mx, y:mouse_my };

        	

        	console.log(difRatio);

        	let absolute_area_width = global_rectangle_end.x - global_rectangle_start.x;
	        let absolute_area_height = global_rectangle_end.y - global_rectangle_start.y;

	        let area_width = parseFloat(((absolute_area_width / currentImgSize.width ) / difRatio).toFixed(6));
	        let area_height = parseFloat(((absolute_area_height / currentImgSize.height ) / difRatio).toFixed(6));

	        let yolo_x = parseFloat((( (global_rectangle_start.x - (absolute_area_width / 2) ) / currentImgSize.width) / difRatio).toFixed(6));
	        let yolo_y = parseFloat((( (global_rectangle_start.y - (absolute_area_height / 2) ) / currentImgSize.height) / difRatio).toFixed(6));

	        console.log(0, yolo_x, yolo_y, area_width, area_height);



        	global_imgArea.push({
        		'label': 'noname',
        		'x': yolo_x,
        		'y': yolo_y,
        		'width': area_width,
        		'height': area_height,
        		'imgID': currentImageID
        	})


        	//CLEAR VAR
        	global_rectangle_start = null;
    		global_rectangle_end = null;
        }
    }


    setInterval(function(){

        let img_height = $('.image-viewer img').height();
        let img_width = $('.image-viewer img').width();

        ctx.canvas.height = img_height;
        ctx.canvas.width = img_width;
        ctx.strokeStyle = "rgb(0, 255, 0)";

        for(k in global_imgArea) {
        	
        	if(global_imgArea[k].imgID == currentImageID) {
        		//console.log(global_imgArea[k].p1, global_imgArea[k].p2)

        		x = global_imgArea[k].x * img_width;
        		y = global_imgArea[k].y * img_height;

        		width = global_imgArea[k].width * img_width;
        		height = global_imgArea[k].height * img_height;

        		ctx.rect( (x + (width/2) ) , (y + (height/2)), width, height);	
        	} else {
        		console.log('NOOO');
        	}

        	
        }

        ctx.stroke();

    }, 100);

}


// EVENT CHANGE PERCENTAGE OF TRAINING/VALIDATION
$('#train-validation-percentage').on("change mousemove", function(e) {
	percentageForValidation = $(this).val();
	$('.percentageForValidation-show').html(percentageForValidation+'%');
});


$("#input_load-img").change(function () {
    // reset
    global_imageList = null;
    $('.panel_filelist').html(' ');


    let files = $(this).prop("files")
    let imgCount = 0;
    let filesList = $.map(files, function (val) { 
    	imgCount++;
    	let imgID = makeid(10) + '_' + imgCount;
    	return { 'path': val.path, 'name': val.name, 'imgID': imgID }; 
    });
    for (k in filesList) {
    	global_imgInfo[filesList[k].imgID] = { 'name':filesList[k].name, 'path':filesList[k].path, 'state':0 };
    	$('.panel_filelist').append('<li id="' + filesList[k].imgID + '"> <span class="dot gray"></span> ' + filesList[k].name + '</li>');
    }
});


// LOAD IMAGES
$(document).on("click", '#btn-load-img', function(event) { 
	$( "#input_load-img" ).trigger( "click" );
});

// SELECT IMG IN LIST
$(document).on("click", '.panel_filelist li', function(event) { 
	let imgID = $( this ).attr( "id" );
	let img = global_imgInfo[imgID];
	$('.right-panel .image-viewer img').attr("src" , img.path);

	var dimensions = sizeOf(img.path);
	currentImgSize = { width: dimensions.width, height: dimensions.height }

	currentImageID = imgID;
});
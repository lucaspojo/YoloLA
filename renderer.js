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
let currentLabelID = null;
let global_labelList = [];
let lastLabel = null;

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
        
        ctx.beginPath();
        ctx.arc(mouse_mx, mouse_my, 10, 0, 2 * Math.PI);
        ctx.stroke();
    }




    canvas.onmousemove = function (e) {
        setMousePosition(e);
    }



    let global_rectangle_start = null;
    let global_rectangle_end = null;



    // CANCEL 
	document.addEventListener("keydown", event => {
		if(event.key == "Escape") {

			global_rectangle_start = null;
    		global_rectangle_end = null;
    		$('.help-msg').html("CLICK FIRST POINT");
    		$('.label_input_box').hide();
    		$('.hider').hide();

    		$('#y-line').show();
    		$('#x-line').show();

    		for(k in global_imgArea) {
	        	
	        	if(global_imgArea[k].labelID == currentLabelID) {
	        		console.log('REMOVE');
	        		global_imgArea[k] = null;
	        		delete global_imgArea[k];
	        	}

	        }

		}
	});



    canvas.onclick = function (e) {

    	let img_height = $('.image-viewer img').height();
        let img_width = $('.image-viewer img').width();

        let difRatio = img_width / currentImgSize.width;

        var offset = $('#canvas').offset();
        var mouse_mx = parseInt(e.pageX - offset.left);
        var mouse_my = parseInt(e.pageY - offset.top);

        if(global_rectangle_start == null) {
        	global_rectangle_start = { x:mouse_mx, y:mouse_my };
        	$('.help-msg').html("CLICK SECOND POINT");
        } else {

        	global_rectangle_end = { x:mouse_mx, y:mouse_my };

        	let absolute_area_width = global_rectangle_end.x - global_rectangle_start.x;
	        let absolute_area_height = global_rectangle_end.y - global_rectangle_start.y;

	        let area_width = parseFloat(((absolute_area_width / currentImgSize.width ) / difRatio).toFixed(6));
	        let area_height = parseFloat(((absolute_area_height / currentImgSize.height ) / difRatio).toFixed(6));

	        let yolo_x = parseFloat((( (global_rectangle_start.x - (absolute_area_width / 2) ) / currentImgSize.width) / difRatio).toFixed(6));
	        let yolo_y = parseFloat((( (global_rectangle_start.y - (absolute_area_height / 2) ) / currentImgSize.height) / difRatio).toFixed(6));

	        currentLabelID = makeid(20); 


        	global_imgArea.push({
        		'label': 'noname',
        		'x': yolo_x,
        		'y': yolo_y,
        		'width': area_width,
        		'height': area_height,
        		'imgID': currentImageID,
        		'labelID': currentLabelID
        	})

        	// SHOW LABEL INPUT BOX
    		$('.label_input_box').show();
    		$('.label_input_box input').focus();
    		$('.label_input_box input').select();

    		// BLOCK ANY OTHER CLICK IN IMG VIEWER
    		$('.hider').show();

    		// HIDE CROSS
    		$('#y-line').hide();
    		$('#x-line').hide();


        	//CLEAR VAR
        	global_rectangle_start = null;
    		global_rectangle_end = null;
        }
    }

    // DRAW RECTANGLES
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

        		let letterLiength = global_imgArea[k].label.length;


        		ctx.rect( (x + (width/2) ) , (y + (height/2)), width, height);	




        		ctx.fillStyle = "rgb(0, 255, 0)";
        		ctx.fillRect( (x + (width/2)) , (y + (height/2)) - 30, (letterLiength * 13) + 10, 30);	


        		ctx.font = "18px monospace";
        		ctx.fillStyle = "black";
				ctx.fillText(global_imgArea[k].label, (x + (width/2)) + 10 , (y + (height/2)) - 8 );
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


// SET LABEL 
$(document).on('keypress',function(e) {
    if(e.which == 13) {

        let labelName = $('.label_input_box input').val();
        lastLabel = labelName;
        
        if(global_labelList[0] != null) {

        	let present = false;

	        for(k in global_labelList) {
	        	if(global_labelList[k] == labelName) {
	        		present = true;
	        	}
	        }

	        if(present == false) {
	        	global_labelList.push(labelName);
	        }

	    } else {
	    	global_labelList.push(labelName);
	    }


        for(k in global_imgArea) {
        	if(global_imgArea[k].labelID == currentLabelID) {
        		global_imgArea[k].label = labelName;
        	}
        }

        $('.label_input_box input').val(labelName);
        $('.label_input_box').hide();
        $('.hider').hide();
        $('#x-line').show();
        $('#y-line').show();

    }
});


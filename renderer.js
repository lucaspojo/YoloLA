// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let $ = require("jquery");

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
       .css({'background':'red'});




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
        var offset = $('#canvas').offset();
        var mouse_mx = parseInt(e.pageX - offset.left);
        var mouse_my = parseInt(e.pageY - offset.top);

        if(global_rectangle_start == null) {
        	global_rectangle_start = { x:mouse_mx, y:mouse_my };
        } else {
        	global_rectangle_end = { x:mouse_mx, y:mouse_my };



        	global_imgArea.push({
        		'p1': global_rectangle_start,
        		'p2': global_rectangle_end,
        		'imgID': currentImageID
        	})


        	//DO SOMTHING
        	console.log('DRAW RECTANGLE, ', global_rectangle_start, global_rectangle_end);


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

        for(k in global_imgArea) {
        	
        	if(global_imgArea[k].imgID == currentImageID) {
        		console.log(global_imgArea[k].p1, global_imgArea[k].p2)
        		ctx.rect(global_imgArea[k].p1.x, global_imgArea[k].p1.y, 150, 100);	
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

	currentImgSize = { width:$('.right-panel .image-viewer img').width(), height:$('.right-panel .image-viewer img').height() }

	currentImageID = imgID;
});
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
	console.log(img.path);
});
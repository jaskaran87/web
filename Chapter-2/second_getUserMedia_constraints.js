// Define local variables associated with video resolution selection
// buttons in the HTML page
var vgaButton = document.querySelector("button#vga");
var qvgaButton = document.querySelector("button#qvga");
var hdButton = document.querySelector("button#hd");

// Video element in the HTML5 page
var video = document.querySelector("video");

// The local MediaStream to play with
var stream;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function successCallback(gotStream) {
    // Make the stream available to the console for introspection
    window.stream = gotStream;

    // Attach the returned stream to the <video> element in the HTML page
    video.src = window.URL.createObjectURL(stream);

    //Start playing Video
    video.play();
}

function errorCallback(error){
    console.log('navigator.getUserMedia error:', error);
}

// Constraints object for low resolution video
var qvgaConstraints = {
    video: { width: 320, height: 320 } 
};

// Constraints object for standard resolution video
var vgaConstraints = {
    video: { width: 640, height: 480 } 
};

// Constraints object for high resolution video
var hdConstraints = {
    video: { width: 1280, height: 960 }  
};

qvgaButton.onclick  =   function(){
                            getMedia(qvgaConstraints)
                        };

vgaButton.onclick   =   function(){
                            getMedia(vgaConstraints)
                        };

hdButton.onclick    =   function(){
                            getMedia(hdConstraints)
                        };

function getMedia(constraints) {
    if (!!stream) {
        video.src = null;
        stream.stop();
    }
    navigator.getUserMedia(constraints, successCallback, errorCallback);
}
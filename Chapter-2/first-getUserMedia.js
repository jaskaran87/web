// Look after different browser vendors' ways of calling the getUserMedia()
// API method:
// Opera --> getUserMedia
// Chrome --> webkitGetUserMedia
// Firefox --> mozGetUserMedia
// navigator is current browser object

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

//use constraints to ask for a video only mediaStream:
var constraints = {audio: false, video: true};
var video = document.querySelector("video");

// Callback to be called in case of success..
function successCallback(stream) {
	console.log(stream);
	//Node: make the returned stream available to console for inspection
	window.stream = stream;
	if (window.URL) {
		// Chrome case : URL. createObjectURL() converts a MediaStream to a Blob object URL
		video.src = window.URL.createObjectURL(stream);
	} else {
		// Firefox and Opera: the srce of the video can be set directly from the stream
		video.src = stream;
	}
	// We're all set. Let's just play the video out!
	video.play();
}

//Callback to be called in case of failures..
function errorCallback(error){
	console.log("navigator.getUserMedia error: ", error);
}

//Main action: Just call getUserMedia() on the navigator object 
navigator.getUserMedia(constraints, successCallback, errorCallback);
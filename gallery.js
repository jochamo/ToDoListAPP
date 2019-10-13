function onLoad() {
    getDelay().addEventListener("ionChange", init);
    window.addEventListener('resize', init);
    getTabs().addEventListener("ionTabsWillChange", pause);
    init();

    //Camara
    document.addEventListener("deviceready", onDeviceReady, false);
}
function getDelay() {
    return(document.querySelector('ion-range'));
}
function getTabs() {
    return(document.querySelector('ion-tabs'));
}
function getSlides() {
    return(document.querySelectorAll('ion-slides'));
}
function init() {
    getSlides().forEach(function(s) {
        s.options = {
            width: window.innerWidth,
            autoplay: {
                delay: 5000 - getDelay().value
            }
        };
    });
}
function play() {
	vibrar();
    getTabs().getSelected().then(function(tab) {
        document.getElementById(tab).startAutoplay();
    });
}
function pause() {
	vibrar();
    getSlides().forEach(function(s) {
        s.stopAutoplay();
    });
}
function previous() {
	vibrar();
    getTabs().getSelected().then(function(tab) {
        document.getElementById(tab).slidePrev();
    });
}
function next() {
	vibrar();
    getTabs().getSelected().then(function(tab) {
        document.getElementById(tab).slideNext();
    });
}
function vibrar(){
	navigator.vibrate(150);
}
//https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html#module_camera.getPicture

 	var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

    // Wait for device API libraries to load
    //
    

    // device APIs are available
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64-encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    //
    function onFail(message) {
      alert('Failed because: ' + message);
    }
	
/*
function hacerFoto(){
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });
}
function onSuccess(imageURI) {
    var image = document.getElementById('myImage');
    image.src = imageURI;
}
function onFail(message) {
    alert('Failed because: ' + message);
    presentAlertIonic();
}

function onDeviceReady() {
    console.log(navigator.camera);
}

function recuperarFoto(){
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);
    var func = createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        // Do something

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}
*/

//Mostrar alerta
function presentAlertIonic() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Alert';
    alert.subHeader = 'Subtitle';
    alert.message = 'This is an alert message.';
    alert.buttons = ['OK'];
  
    document.body.appendChild(alert);
    return alert.present();
}
  
//Salir de la aplicacion
function salir(){
	navigator.app.exitApp();
}
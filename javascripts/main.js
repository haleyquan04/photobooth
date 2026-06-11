const elements = {
    video: document.getElementById("live-cam"),
    photostrip: document.getElementById("photostrip"),
    photostripCxt: document.getElementById("photostrip").getContext('2d'),
    picture: document.getElementById("current-picture"),
    pictureCxt: document.getElementById("current-picture").getContext('2d'),
    timerDisplay: document.getElementById("timer-display")
};
const cameraDimensions = {};
let grayscaleOn = false;
let picturesTaken = 0;

function initializeCamera() {
    const {video} = elements;
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
            video.srcObject = stream;
            })
            .catch(function (err0r) {
            console.log("Something went wrong!");
            });
        }
}

function findCameraDimensions() {
    const {video} = elements;
    let ratio = (video.videoWidth / video.videoHeight);
    if (ratio > 1.5) {
        cameraDimensions.width = Math.ceil(1.5 * video.videoHeight);
        cameraDimensions.height = video.videoHeight;
        cameraDimensions.startX = Math.ceil((video.videoWidth - cameraDimensions.width) / 2);
        cameraDimensions.startY = 0;
    } else if (ratio < 1.5) {
        cameraDimensions.width = video.videoWidth;
        cameraDimensions.height = Math.ceil(video.videoWidth / 1.5);
        cameraDimensions.startX = 0;
        cameraDimensions.startY = Math.ceil((video.videoHeight - cameraDimensions.height) / 2);
    }
}

function template() {
    const photoCanvasContext = elements.photostripCxt;
    photoCanvasContext.fillStyle = "black";
    photoCanvasContext.fillRect(0, 0, 440, 1250);
    photoCanvasContext.fillStyle = "white";
    for (let i = 0; i < 4; i++) {
        photoCanvasContext.fillRect(40, 40 + i * 270, 360, 240);
    }
}

function grayscaleMode() {
    const {video} = elements;
    video.style.filter = "grayscale(100%) contrast(150%) brightness(75%)";
    grayscaleOn = true;
}

function colorMode() {
    const {video} = elements;
    video.style.filter = "contrast(150%) brightness(75%)";
    grayscaleOn = false;
}

function takePicture() {
    const {timerDisplay, video, photostripCxt, picture, pictureCxt} = elements;

    let yCoor = picturesTaken * 270 + 40;
    if (Object.keys(cameraDimensions).length == 0) findCameraDimensions(); // can this be part of initialization stage?
    
    let seconds = 4;
    const timer = setInterval(() => {
        seconds--;
        if (seconds > 0) timerDisplay.textContent = seconds;
        else {
            clearInterval(timer);
            timerDisplay.textContent = '!*!';
            if (grayscaleOn) pictureCxt.filter = "grayscale(100%) contrast(150%) brightness(75%)";
            else pictureCxt.filter= "contrast(150%) brightness(75%)";

            pictureCxt.drawImage(video, cameraDimensions.startX, cameraDimensions.startY, cameraDimensions.width, cameraDimensions.height, 0, 0, 360, 240);
            photostripCxt.drawImage(picture, 40, yCoor, 360, 240);
            picturesTaken++;
        }

        if (picturesTaken >= 4) {
            endPage();
        }
    }, 1000);
}

function endPage() {
    const {photostrip} = elements;
    sessionStorage.setItem('finishedPhotostrip', photostrip.toDataURL('image/png'));
    setTimeout(() => window.location.href = 'download.html', 500);
}

initializeCamera();
template();

// index page:
// just the camera, the grayscale button, the timer button, and the camera button
// disable buttons while camera is going
// image display?

// taking a picture freezes the webcam for a second
// next screen displays canvas
// write a message
// use promises or something instead of timer stacking
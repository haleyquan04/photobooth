const elements = {
    timerDisplay: document.getElementById("timer-display"),
    video: document.getElementById("live-cam"),
    picture: document.getElementById("current-picture"),
    pictureCxt: document.getElementById("current-picture").getContext('2d'),
    displayBox: document.getElementById("test-box"),
    grayButton: document.getElementById("gray-button"),
    colorButton: document.getElementById('color-button'),
    photostrip: document.getElementById("photostrip"),
    photostripCxt: document.getElementById("photostrip").getContext('2d')
};
const cameraDimensions = {};
let picturesTaken = 0;

function initializeCamera() {
    const {video} = elements;
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then ((stream) => {video.srcObject = stream; })
            .catch((error) => {alert('Something went wrong! ' + error);})
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

// function template() {
//     const photoCanvasContext = elements.photostripCxt;
//     photoCanvasContext.fillStyle = "black";
//     photoCanvasContext.fillRect(0, 0, 440, 1250);
//     photoCanvasContext.fillStyle = "white";
//     for (let i = 0; i < 4; i++) {
//         photoCanvasContext.fillRect(40, 40 + i * 270, 360, 240);
//     }
// }

function loadFrame() {
    const {photostripCxt} = elements;
    const image = new Image()
    image.src = 'assets/empty-photostrip.png';
    image.onload = () => photostripCxt.drawImage(image, 0, 0, 440, 1250);
}

function grayscaleMode() {
    const {video, grayButton, colorButton, picture, photostrip} = elements;
    video.classList = "grayscale-filter";
    picture.classList = "grayscale-filter";
    photostrip.classList = 'grayscale-filter';
    grayButton.classList = "selected-button";
    colorButton.classList = '';
}

function colorMode() {
    const {video, grayButton, colorButton, picture} = elements;
    video.classList = "color-filter";
    picture.classList = "color-filter";
    grayButton.classList = '';
    colorButton.classList = "selected-button";
}

function takePicture() {
    const {timerDisplay, video, photostripCxt, picture, pictureCxt, displayBox} = elements;

    let yCoor = picturesTaken * 270 + 40;
    if (Object.keys(cameraDimensions).length == 0) findCameraDimensions();
    
    let seconds = 4;
    const timer = setInterval(() => {
        seconds--;
        if (seconds > 0) timerDisplay.textContent = seconds;
        else {
            clearInterval(timer);
            timerDisplay.textContent = '*';
            pictureCxt.drawImage(video, cameraDimensions.startX, cameraDimensions.startY, cameraDimensions.width, cameraDimensions.height, 0, 0, 360, 240);
            photostripCxt.drawImage(picture, 40, yCoor, 360, 240);
            video.style.display = 'none';
            picture.style.display = 'inline'
            setTimeout(() => {
                video.style.display = 'inline';
                picture.style.display = 'none';
            }, 500);
            picturesTaken++;
        }

        if (picturesTaken >= 4) endPage();
    }, 1000);
}

function endPage() {
    setTimeout(() => {
        const outerBox = document.getElementById('outer-box');
        outerBox.style.display = 'none';
        const buttonContainer = document.getElementById('button-container');
        buttonContainer.style.display = 'none';
        const secondBox = document.getElementById('second-stage');
        secondBox.style.display = 'flex';
    }, 1000);
}

// function saveImage() {
//     canvas.toBlob((blob) => {
//         const url = URL.createObjectURL(blob)
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'canvas-image.jpeg';
//         link.click();
//         URL.revokeObjectURL(url);
//     }, 'image/jpeg');
// }

initializeCamera();
loadFrame();

// index page:
// disable buttons while camera is going
// fix b&w mode
// get rid of outer box??
// fix stretching and shrinking browser
// disable grayscale vs color

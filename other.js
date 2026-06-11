const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const finalImage = new Image()
const dataURL = sessionStorage.getItem("finishedPhotostrip");

if (dataURL) {
  finalImage.src = dataURL;
  ctx.drawImage(finalImage, 0, 0, 440, 1250);
  sessionStorage.removeItem('finishedPhotostrip');
} else alert("No photo found!");

function saveImage() {
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a');
        link.href = url;
        link.download = 'canvas-image.jpeg';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/jpeg');
}
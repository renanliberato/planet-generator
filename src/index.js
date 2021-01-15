const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const { generatePlanet } = require('./helpers/generatePlanet');
const { saveAs } = require('file-saver');

require('./helpers/LZWEncoder');
require('./helpers/NeuQuant');
require('./helpers/GIFEncoder');

const submitbtn = document.getElementById('submit-btn');
const previewcanvas = document.getElementById('preview-canvas');
const intensityinput = document.getElementsByName('intensity')[0];
const cloudsinput = document.getElementsByName('clouds')[0];
const cloudstresholdinput = document.getElementsByName('cloudstreshold')[0];
const color1input = document.getElementsByName('color1')[0];
const color2input = document.getElementsByName('color2')[0];
const color3input = document.getElementsByName('color3')[0];
const color4input = document.getElementsByName('color4')[0];
const cloudcolorinput = document.getElementsByName('cloudcolor')[0];
const seedinput = document.getElementsByName('seed')[0];
const adjustcolorsinput = document.getElementsByName('adjustcolors')[0];
const createhillsinput = document.getElementsByName('createhills')[0];
var cloudstresholdoutput = document.getElementById("cloudstreshold-value");
var seedoutput = document.getElementById("seed-value");
var intensityoutput = document.getElementById("intensity-value");
var previewInterval;

cloudstresholdoutput.innerHTML = cloudstresholdinput.value;
seedoutput.innerHTML = seedinput.value;
intensityoutput.innerHTML = intensityinput.value;

function resetPreview() {
    if (previewInterval)
        clearInterval(previewInterval);

    const canvas = previewcanvas;
    const context = canvas.getContext('2d');
    const size = 256;
    const frames = 100;
    const angleStep = Math.PI * 2 / frames;
    var angle = 0;

    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size;
    canvas.style.height = size;

    previewInterval = setInterval(() => {
        angle += angleStep;
        const seed = parseFloat(seedinput.value);
        const intensity = parseFloat(intensityinput.value);
        const colors = [color1input.value, color2input.value, color3input.value, color4input.value];
        generatePlanet(context, seed, size / 2 - 5, angle, intensity, colors, adjustcolorsinput.checked, createhillsinput.checked, cloudsinput.checked, parseFloat(cloudstresholdinput.value), cloudcolorinput.value);
    }, 100);
}

resetPreview();

cloudstresholdinput.addEventListener('input', () => {
    cloudstresholdoutput.innerHTML = cloudstresholdinput.value;
});

intensityinput.addEventListener('input', () => {
    intensityoutput.innerHTML = intensityinput.value;
});

seedinput.addEventListener('input', () => {
    seedoutput.innerHTML = seedinput.value;
});

submitbtn.addEventListener('click', (e) => {
    submitbtn.setAttribute("disabled", true);
    submitbtn.innerHTML = `Generating...`;

    var encoder = new GIFEncoder();
    encoder.setRepeat(0);
    encoder.setDelay(100);

    encoder.start();
    var frames = 0;
    var renderingInterval = setInterval(() => {
        encoder.addFrame(previewcanvas.getContext('2d'));
        if (++frames >= 10) {
            clearInterval(renderingInterval);
            encoder.finish();
            const blob = new Blob([new Uint8Array(encoder.stream().bin)], { type: "image/gif" });

            if (!isMobile) {
                saveAs(blob, `planet.gif`);
            } else {
                const file = new File([blob], 'planet.gif', { type: blob.type });

                navigator.share({
                    title: 'Look what I made!',
                    text: 'Create your planet on https://renanliberato.com.br/planetgenerator',
                    files: [file]
                });
            }

            submitbtn.removeAttribute("disabled");
            submitbtn.innerHTML = 'Share';
        }
    }, 100);
});
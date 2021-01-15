const { generatePlanet } = require("./src/helpers/generatePlanet");
const fs = require('fs')
const { createCanvas } = require('canvas')

const width = 512;
const height = width;
const planetRadius = width / 2;

Array.from(Array(15).keys()).map(k => {
    const seed = k;

    var angle = 0;

    const canvas = createCanvas(width + 5, height);
    const context = canvas.getContext('2d');
    generatePlanet(context, seed, planetRadius, angle, Math.max(1, k / 10), ['#5b6ee1', '#6bbe30', '#d9ccad']);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./src/images/planet${k + 1}.png`, buffer);
});

Array.from(Array(15).keys()).map(k => {
    const seed = k;

    var angle = 0;

    const canvas = createCanvas(width + 3, height);
    const context = canvas.getContext('2d');
    generatePlanet(context, seed, planetRadius, angle, Math.max(1, k / 10), ['#cf6527', '#cfa227', '#c7cf27']);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./src/images/planet${k + 16}.png`, buffer);
});

Array.from(Array(15).keys()).map(k => {
    const seed = k;

    var angle = 0;

    const canvas = createCanvas(width + 3, height);
    const context = canvas.getContext('2d');
    generatePlanet(context, seed, planetRadius, angle, Math.max(1, (k + 20) / 10), ['#cf6527', '#cfa227', '#cf6527']);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./src/images/planet${k + 31}.png`, buffer);
});

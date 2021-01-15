const { noise } = require('./noise');
const { pSBC } = require('./colors');
const { map } = require('./index');

function generatePlanet(context, seed = 0, circleRadius = 256, angle = 0, intensity = 1, colors = ['blue', 'gray', 'green', 'gray'], adjustColors, createHills, withclouds, cloudtreshold, cloudcolor) {
    noise.seed(seed);
    cloudtreshold = map(cloudtreshold, 0, 1, 1, -1);
    var boxSize = circleRadius / 15;
    var angleStep = 0.01;

    angle = angle + angleStep % 360;
    context.clearRect(0, 0, circleRadius * 3, circleRadius * 3);

    context.translate(circleRadius, circleRadius);

    const getColor = !adjustColors ? (c) => c : (c, f) => f();
    const getOffset = createHills ? (f) => f() : () => 0;
    const getModifiedSize = createHills ? (f) => f() : () => boxSize;

    function renderPlanet(n, alpha, start) { //  example: n=500, alpha=2
        var b = Math.round(alpha * Math.sqrt(n));      // number of boundary points
        var phi = (Math.sqrt(5) + 1) / 2;           // golden ratio
        var r;
        for (var k = 1; k < n; k++) {
            r = radius(k, n, b);
            var theta = 2 * Math.PI * k / phi ^ 2;
            var x = r * Math.cos(theta);
            var y = r * Math.sin(theta);
            var value = noise.simplex2(x * intensity - angle, y * intensity);
            var color;
            var offsetMultiplier;
            
            if (value >= 0.7) {
                color = getColor(colors[3], () => pSBC(map(value, 0.7, 1, 0, 0.5), colors[3]));
                // color = pSBC(map(value, 0.7, 1, 0, 0.5), colors[2]);
                offsetMultiplier = 2;
            } else if (value >= 0.2) {
                color = getColor(colors[2], () => pSBC(map(value, -0.3, 0.7, -0.2, 0), colors[2]));
                offsetMultiplier = 1.75;
            } else if (value >= 0.1) {
                color = getColor(colors[1], () => pSBC(map(value, -0.3, 0.7, -0.2, 0), colors[1]));
                offsetMultiplier = 1.25;
            } else if (value >= -1) {
                color = getColor(colors[0], () => pSBC(map(value, -1, -0.3, -0.7, 0), colors[0]));
                offsetMultiplier = 1;
            }
            context.fillStyle = color;
            const modifiedSize = getModifiedSize(() => boxSize + boxSize * 0.5 * offsetMultiplier * value);
            const offsetX = getOffset(() => map(x, -1, 1, - modifiedSize, modifiedSize / 2));
            const offsetY = getOffset(() => map(y, -1, 1, - modifiedSize, modifiedSize / 2));

            context.fillRect(start * x + offsetX, start * y + offsetY, modifiedSize, modifiedSize);
            
        }
    }

    function renderClouds(n, alpha, start) { //  example: n=500, alpha=2
        var b = Math.round(alpha * Math.sqrt(n));      // number of boundary points
        var phi = (Math.sqrt(5) + 1) / 2;           // golden ratio
        var r;
        for (var k = 1; k < n; k++) {
            r = radius(k, n, b);
            var theta = 2 * Math.PI * k / phi ^ 2;
            var x = r * Math.cos(theta);
            var y = r * Math.sin(theta);
            
            var value = noise.simplex2(x - angle, y * 3);

            var offsetMultiplier = createHills ? 2.5 : 2;
            const modifiedSize = boxSize + boxSize * 0.5 * offsetMultiplier;
            const offsetX = map(x, -1, 1, - modifiedSize, modifiedSize / 2);
            const offsetY = map(y, -1, 1, - modifiedSize, modifiedSize / 2);
            
            context.fillStyle = cloudcolor;
            // if ((value >= -0.9 && value <= -0.8) || (value >= -0.6 && value <= -0.5) || (value >= -0.3 && value <= -0.2) || (value >= -0.1 && value <= 0) || (value >= 0.1 && value <= 0.2) || (value >= 0.3 && value <= 0.4) || (value >= 0.5 && value <= 0.6) || (value >= 0.7 && value <= 0.8)) {
            if (value >= cloudtreshold) {
                context.fillRect(start * x + offsetX, start * y + offsetY, modifiedSize, boxSize);
            }
        }
    }

    function radius(k, n, b) {
        if (k > n - b) {
            return 1;            // put on the boundary
        } else {
            return Math.sqrt(k - 1 / 2) / Math.sqrt(n - (b + 1) / 2);     // apply square root
        }
    }

    renderPlanet(circleRadius * 40, 0, circleRadius * 0.8);
    withclouds && renderClouds(circleRadius * 40, 0, circleRadius * 0.8);
    context.translate(-circleRadius, -circleRadius);
}

module.exports = {
    generatePlanet
};
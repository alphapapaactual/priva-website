function setup() {
    let cnv = createCanvas(400, 400);
    cnv.parent("canvas-container"); // Placera canvasen i div-container
}

a = (x, y, d = mag(k = (4 + sin(y * 2 - t) * 3) * cos(x / 29), e = y / 8 - 13)) => 
    point(
        (q = 3 * sin(k * 2) + .3 / k + sin(y / 25) * k * (9 + 4 * sin(e * 9 - d * 3 + t * 2))) + 30 * cos(c = d - t) + 200,
        q * sin(c) + d * 39 - 220
    );

t = 0;

function draw() {
    background(0); // Svart bakgrund
    stroke(255); // Vita linjer och punkter
    strokeWeight(2); // Gör punkterna tjockare

    for (t += PI / 240, i = 1e4; i--; ) {
        a(i, i / 235);
    }
}

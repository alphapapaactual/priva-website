/* ==========================================================================
   Säkerhetsbanner (DevTools Console)
   ========================================================================== */
console.log(
    `%c PRIVA INNOVATION %c Zero-Trust & Digital Identity\n` +
    `%c[!] Inspekterar du trafiken?\n` +
    `Vi tillämpar klientside-kryptering via OpenPGP (RFC 4880 / RFC 9580) och lösenordslös Managed Identity via Microsoft Graph.\n` +
    `PGP Fingerprint: AE32 B178 AAB0 1919 0C80 5B4E 3EB6 78C9 EB2E C9CC\n` +
    `Säkerhetsrapporter: /.well-known/security.txt`,
    "background: #0f172a; color: #38bdf8; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 3px 0 0 3px;",
    "background: #1e293b; color: #94a3b8; font-size: 14px; padding: 4px 8px; border-radius: 0 3px 3px 0;",
    "color: #10b981; font-family: monospace; font-size: 11px; margin-top: 5px;"
);

/* ==========================================================================
   Canvas-animation (p5.js) - Kvantflux-reaktor
   ========================================================================== */
let t = 0;

function setup() {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    // Något kompaktare format (340x340 px istället för 400x400 px)
    const cnv = createCanvas(340, 340);
    cnv.parent(container);
}

const a = (x, y, d = mag(k = (4 + sin(y * 2 - t) * 3) * cos(x / 29), e = y / 8 - 13)) =>
    point(
        (q = 3 * sin(k * 2) + 0.3 / k + sin(y / 25) * k * (9 + 4 * sin(e * 9 - d * 3 + t * 2))) + 30 * cos(c = d - t) + 200,
        q * sin(c) + d * 39 - 220
    );

function draw() {
    if (!document.getElementById("canvas-container")) return;

    background(0);
    push();
    // Skalar ned koordinaterna proportionerligt så centrum förblir orört
    scale(340 / 400);
    stroke(255);
    strokeWeight(2);

    for (t += PI / 240, i = 1e4; i--;) {
        a(i, i / 235);
    }
    pop();
}

/* ==========================================================================
   Logotyp-fallback (Ersätter inline onerror)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const logos = document.querySelectorAll('.brand-logo, .logo-container img');
    logos.forEach(img => {
        img.addEventListener('error', function () {
            if (!this.dataset.fallback) {
                this.dataset.fallback = 'true';
                this.src = 'logo.png';
            } else {
                this.style.display = 'none';
                const svgLogo = document.getElementById('cyber-svg-logo');
                if (svgLogo) svgLogo.style.display = 'block';
            }
        });
    });
});
/* ==========================================================================
   Mobilmeny (Hamburgarmeny)
   ========================================================================== */
function setupMobileMenu() {
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    if (!menuBtn || !nav) return;

    menuBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        menuBtn.classList.toggle('is-active');
        nav.classList.toggle('nav-open');
    };

    // Stäng menyn automatiskt om besökaren klickar utanför
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
            nav.classList.remove('nav-open');
            menuBtn.classList.remove('is-active');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileMenu);
} else {
    setupMobileMenu();
}
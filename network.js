(function () {
    const canvas = document.getElementById('cyber-canvas') || document.getElementById('network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.closest('.hero') || canvas.closest('.hero-section') || document.getElementById('hero-banner');
    if (!container) return;

    const isLight = document.querySelector('link[href*="style-light"]') !== null;

    let width, height;
    let nodes = [];
    const mouse = { x: null, y: null, radius: 140 };

    function resize() {
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;
    }

    window.addEventListener('resize', () => {
        resize();
        initNodes();
    });

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    container.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.65;
            this.vy = (Math.random() - 0.5) * 0.65;
            this.radius = Math.random() > 0.8 ? 2.4 : 1.5;
            this.isCore = Math.random() > 0.8;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            if (isLight) {
                ctx.fillStyle = this.isCore ? 'rgba(77, 208, 225, 0.9)' : 'rgba(179, 157, 219, 0.85)';
            } else {
                ctx.fillStyle = this.isCore ? '#00f0ff' : 'rgba(157, 78, 221, 0.85)';
                ctx.shadowBlur = this.isCore ? 6 : 2;
                ctx.shadowColor = this.isCore ? '#00f0ff' : '#9d4edd';
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initNodes() {
        nodes = [];
        const count = Math.floor((width * height) / 11000);
        for (let i = 0; i < Math.min(count, 65); i++) {
            nodes.push(new Node());
        }
    }

    function renderConnections() {
        const maxDist = 120;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * (isLight ? 0.35 : 0.22);
                    ctx.strokeStyle = isLight
                        ? `rgba(179, 157, 219, ${alpha})`
                        : `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }

            if (mouse.x !== null && mouse.y !== null) {
                const mdx = nodes[i].x - mouse.x;
                const mdy = nodes[i].y - mouse.y;
                const mdist = Math.hypot(mdx, mdy);

                if (mdist < mouse.radius) {
                    const alpha = (1 - mdist / mouse.radius) * 0.75;
                    ctx.strokeStyle = isLight
                        ? `rgba(77, 208, 225, ${alpha})`
                        : `rgba(0, 255, 102, ${alpha})`;
                    ctx.lineWidth = 1.3;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);
        nodes.forEach(n => {
            n.update();
            n.draw();
        });
        renderConnections();
        requestAnimationFrame(loop);
    }

    resize();
    initNodes();
    loop();
})();
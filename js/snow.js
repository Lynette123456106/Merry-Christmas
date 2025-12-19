// Canvas雪花系统

class SnowSystem {
    constructor(canvas, count = 100, style = 'round') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.count = count;
        this.style = style;
        this.snowflakes = [];
        this.animationId = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.init();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.snowflakes = [];
        for (let i = 0; i < this.count; i++) {
            this.snowflakes.push(this.createSnowflake());
        }
    }
    
    createSnowflake() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 3 + 1,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.01 + 0.005
        };
    }
    
    update() {
        this.snowflakes.forEach(flake => {
            // 更新位置
            flake.y += flake.speedY;
            flake.swing += flake.swingSpeed;
            flake.x += Math.sin(flake.swing) * 0.5 + flake.speedX;
            
            // 边界检查
            if (flake.y > this.canvas.height) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }
            
            if (flake.x > this.canvas.width) {
                flake.x = 0;
            } else if (flake.x < 0) {
                flake.x = this.canvas.width;
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.snowflakes.forEach(flake => {
            this.ctx.save();
            this.ctx.globalAlpha = flake.opacity;
            this.ctx.fillStyle = '#ffffff';
            
            if (this.style === 'round') {
                // 圆形雪花
                this.ctx.beginPath();
                this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (this.style === 'star') {
                // 星形雪花
                this.drawStar(flake.x, flake.y, flake.radius);
            }
            
            this.ctx.restore();
        });
    }
    
    drawStar(x, y, radius) {
        const spikes = 6;
        const outerRadius = radius;
        const innerRadius = radius / 2;
        
        this.ctx.beginPath();
        
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (Math.PI / spikes) * i;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        this.animate();
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    setCount(count) {
        this.count = count;
        this.init();
    }
    
    setStyle(style) {
        this.style = style;
    }
}


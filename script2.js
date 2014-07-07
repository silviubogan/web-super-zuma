document.addEventListener("DOMContentLoaded", function () {
	function randomElement(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
	var p = new Processing(document.getElementById("game"), function (p) {  
		var balls = [], mainPath = [[-50, 50]],
			zuma, paused = false;
		var colors = {
			zuma: {
				fill: p.color(255, 255, 0),
				stroke: p.color(255, 127, 0)
			},
			bullet: {
				fill: p.color(0),
				stroke: p.color(150, 75, 0)
			},
			ball: {
				fill: [p.color(255, 0, 0), p.color(255, 255, 0), p.color(0, 0, 255)],
				stroke: p.color(255)
			},
			background: p.color(212, 255, 255)
		}
		
		p.setup = function () {
			p.size(600, 450);
			p.frameRate(30);
			new Ball(mainPath);
			zuma = new Zuma(p.width / 2);
		}
		p.draw = function () {
			p.background(colors.background);
			
			for (var i in balls) {
				balls[i].update();
			}
			if (p.frameCount % 15 == 0) {
				new Ball(mainPath);
			}
			
			zuma.update();
		}
		p.mouseMoved = function () {
			if (p.mouseX != p.pmouseX) {
				zuma.x = p.mouseX;
			}
		}
		p.mouseClicked = function () {
			zuma.shoot();
		}
		p.keyPressed = function () {
			if (!paused) p.noLoop();
			else p.loop();
			paused = !paused;
		}
		
		function Bullet (x) {
			this.x = x;
			this.y = p.height;
			
			zuma.bullets.push(this);
		}
		Bullet.prototype = {
			color: "black",
			update: function () {
				p.fill(colors.bullet.fill);
				p.stroke(colors.bullet.stroke);
				p.ellipse(this.x, this.y, 20, 20);
				this.y -= 7;
				if (this.y <= -20) delete zuma.bullets[zuma.bullets.indexOf(this)];
			}
		}
		
		function Zuma (x) {
			this.x = x;
		}
		Zuma.prototype = {
			bullets: [],
			update: function () {
				p.fill(colors.zuma.fill);
				p.stroke(colors.zuma.stroke);
				p.ellipse(this.x, p.height, 75, 50);
				for (var i in this.bullets) {
					this.bullets[i].update();
				}
			},
			shoot: function () {
				new Bullet(this.x);
			}
		}
		function Ball (path) {
			this.path = path;
			this.fillColor = randomElement(colors.ball.fill);
			this.pathIndex = 0;
			this.pos = {
				x: this.path[this.pathIndex][0],
				y: this.path[this.pathIndex][1]
			};
			
			balls.push(this);
		}
		Ball.prototype = {
			update: function () {
				p.fill(this.fillColor);
				p.stroke(colors.ball.stroke);
				p.ellipse(this.pos.x, this.pos.y, 50, 50);
				this.pos.x += 3;
				if (this.x >= p.width + 50) delete balls[balls.indexOf(this)];
				
				for (var i in zuma.bullets) {
					var d = Math.sqrt(Math.pow(zuma.bullets[i].y - this.pos.y, 2) +
						Math.pow(zuma.bullets[i].x - this.pos.x, 2));
					if (50 + 20 >= d) {
						delete zuma.bullets[i]
						delete balls[balls.indexOf(this)];
					}
				}
			}
		};
	});
}, true);

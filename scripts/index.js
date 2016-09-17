var KEY_UP = 38,
    KEY_DOWN = 40,
    KEY_LEFT = 37,
    KEY_RIGHT = 39,
    KEY_W = 87,
    KEY_S = 83,
    KEY_A = 65,
    KEY_D = 68;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function Scene() {
    this.objects = [];
    this.lastMouseX = 0;
    this.lastMouseY = 0;
}

Scene.prototype.add = function (object) {
    this.objects.push(object);
};

Scene.prototype.draw = function (context) {
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].draw(context);
    }
};

Scene.prototype.onMouseDown = function (x, y) {
    for (var i = 0; i < this.objects.length; i++) {
        if (this.objects[i].isHit(x, y)) {
            this.objects[i].onMouseDown();
            break;
        }
    }
};

Scene.prototype.onMouseUp = function (x, y) {
    for (var i = 0; i < this.objects.length; i++) {
        //if (this.objects[i].isHit(x, y)) this.objects[i].onMouseUp(x, y);
        this.objects[i].onMouseUp(x, y);
    }
};

Scene.prototype.onMouseMove = function (x, y) {
    var dx = x - this.lastMouseX;
    var dy = y - this.lastMouseY;
    for (var i = 0; i < this.objects.length; i++) {
        if( this.objects[i].onMouseMove) this.objects[i].onMouseMove(dx, dy);

    }
    this.lastMouseX = x;
    this.lastMouseY = y;
};

Scene.prototype.onRenderFrame = function (dt) {
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].onRenderFrame(dt);
    }
}

Scene.prototype.onKeyDown = function (keyCode) {
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].onKeyDown(keyCode);
    }
}

function Snake(params) {
    this.segments = [];

    params = params || {};

    this.vx = 1;
    this.vy = 0;

    this.timePassed = 0;

    var length = params.length || 7;
    this.radius = params.radius || 10;
    this.x = params.x || 0;
    this.y = params.y || 0;
    for (var i = 0; i < length; i++) {
        this.segments.push(new Ball({
            x: this.x,
            y: this.y + this.radius * 2 * i,
            radius: this.radius,
            color: 'rgba(60, 250, 150, ' + i / length + ')'
        }))
    }
}

Snake.prototype.draw = function (context) {
    for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].draw(context);
    }
};

Snake.prototype.onRenderFrame = function (dt) {
    this.timePassed += dt;
    if (this.timePassed > 0.3) {
        for (var i = 0; i < this.segments.length - 1; i++) {
            this.segments[i].x = this.segments[i+1].x;
            this.segments[i].y = this.segments[i+1].y;
        }
        this.segments[this.segments.length - 1].x += this.vx * this.radius * 2;
        this.segments[this.segments.length - 1].y += this.vy * this.radius * 2;
        this.timePassed = 0;
    }
};

Snake.prototype.onKeyDown = function(keyCode) {
  switch (keyCode) {
      case KEY_UP:
      case KEY_W:
          this.moveUp();
          break;
      case KEY_DOWN:
      case KEY_S:
          this.moveDown();
          break;
      case KEY_LEFT:
      case KEY_A:
          this.moveLeft();
          break;
      case KEY_RIGHT:
      case KEY_D:
          this.moveRight();
          break;
  }
};

Snake.prototype.moveUp = function () {
    this.vx = 0;
    this.vy = -1;
};

Snake.prototype.moveDown = function () {
    this.vx = 0;
    this.vy = 1;
};

Snake.prototype.moveLeft = function () {
    this.vx = -1;
    this.vy = 0;
};

Snake.prototype.moveRight = function () {
    this.vx = 1;
    this.vy = 0;
};

function Ball(params) {
    this.x = params.x || 100;
    this.y = params.y || 100;
    this.radius = params.radius || 25;
    this.color = params.color || "rgba(100,255,50,0.3)";
    this.drag = false;
}

Ball.prototype.draw = function (context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
};

Ball.prototype.isHit = function(x, y) {
    if (x > this.x + this.radius) return false;
    if (x < this.x - this.radius) return false;
    if (y > this.y + this.radius) return false;
    if (y < this.y - this.radius) return false;

    var dx = x - this.x;
    var dy = y - this.y;
    var l = Math.sqrt(Math.pow(dx,2) + Math.pow(dy, 2));
    if (l > this.radius) return false;
    return true;
};

Ball.prototype.onMouseDown = function () {
    console.log('DRAG');
    this.drag = true;
};

Ball.prototype.onMouseUp = function () {
    this.drag = false;
};

Ball.prototype.onMouseMove = function (dx, dy) {
    // if (this.drag) {
    //     this.x += dx;
    //     this.y += dy;
    // }
};

Ball.prototype.onRenderFrame = function (dt) {
    //this.x += 5 * dt;
};

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
    }

    raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(e) {
    scene.onMouseMove(e.layerX, e.layerY);
});

canvas.addEventListener("mousedown", function(e) {
   scene.onMouseDown(e.layerX, e.layerY);
});

canvas.addEventListener("mouseup", function(e) {
    scene.onMouseUp(e.layerX, e.layerY);
});

document.addEventListener('keydown', function(event) {
    console.log(event.keyCode);
    scene.onKeyDown(event.keyCode);
});

var scene = new Scene();
scene.add(new Snake({length: 20}));


var timestamp = Date.now();
function animate() {
    var now = Date.now();
    var dt = now - timestamp;
    timestamp = now;
    clear();
    scene.draw(ctx);
    scene.onRenderFrame(dt / 1000);
    requestAnimationFrame(animate);
}

// canvas.addEventListener("mouseout", function(e) {
//     window.cancelAnimationFrame(raf);
//     running = false;
// });

animate();
const size = 14; // so that there is space in between squares
const movementVar = 15;

var currentGame;
var canvas;
var ctx;
var direction = 'right'; // right is initial direction
var snakeCoordinates = [[15, 15], [30, 15], [45, 15], [60, 15]];

var AppleGenerator = (function() {
    function cls(){
        this.position;
    }

    // Generate random number coordinates [x, y] for apple
    cls.prototype.generateCoordinates = function(canvas) {
        var x = closestDivisibleBy(randomNumberBetween(canvas.width,
                                                       canvas.height),
                                   movementVar);
        var y = closestDivisibleBy(randomNumberBetween(canvas.width,
                                                       canvas.height),
                                   movementVar);
        this.position = [x, y];
    };

    // Generate random number for apple to spawn
    function randomNumberBetween(lo, hi) {
        return Math.floor(lo + Math.random() * (hi - lo));
    };

    // Make sure number is in snake range
    function closestDivisibleBy(n, divisor) {
        return Math.round(n / divisor) * divisor;
    };

    return cls;
})();

var Snake = (function() {
    function cls(snakeCoordinates) {
        this.snakeCoordinates = snakeCoordinates;
    }

    cls.prototype.move = function(coordinates) {
        joinedCoordinates = _.zip(coordinates, this.head);
        newCoordinates = joinedCoordinates.map(function(coordinate){
            return x.reduce(function(sum, number){
                return sum + number;
            });
        });
        this.snakeCoordinates.push(coordinates);
    };

    cls.prototype.tail = function() {
        return this.snakeCoordinates[0];
    };

    cls.prototype.head = function() {
        return this.snakeCoordinates[this.snakeCoordinates.length - 1];
    };

    cls.prototype.removeTail = function() {
        this.snakeCoordinates.shift();
    };

    return cls;
})();

var Game = (function() {
    function cls(height, width, update) {
    }

    cls.prototype.begin = function() {
        init(height, width);
        //currentGame = setInterval(update(), 60);
    };

    // Canvas init
    var init = function(width, height) {
        canvas =
            $('<canvas/>',{'id':'snakeCanvas'})
            .attr({'width': width, 'height': height})[0];

        $('#work_area').append(canvas);

        ctx = canvas.getContext("2d");
    };

    return cls;
})();

var Gameplay = (function() {
    function cls() {
    }

    cls.prototype.paint = function() {
        draw(snakeCoordinates, ctx);
        draw(apple.position, ctx);
    };

    var calculate = function(snake, apple) {
        snake.move(coordinates);
        if (snake.head != apple.position) {
            snake.removeTail();
        } else {
            apple.generateCoordinates();
        }
    };

    // Get directions form keypressed
    $(document).keydown(function(e) {
        var key = e.which;

        if (key == 38) { direction = 'up'; }
        if (key == 40) { direction = 'down'; }
        if (key == 37) { direction = 'left'; }
        if (key == 39) { direction = 'right'; }
    });

    var tranformKeyToCoordinate = function(direction) {
        switch(direction) {
        case 'up':
            return [0, -movementVar];
            break;
        case 'down':
            return [0, movementVar];
            break;
        case 'right':
            return [movementVar, 0];
            break;
        case 'left':
            return [-movementVar, 0];
            break;
        }
    };

    var draw = function(figureCoordinates, ctx) {
        ctx.fillStyle = "rgb(200, 350, 0)";
        figureCoordinates.forEach(function(coordinate) {
            ctx.fillRect(coordinate[0], coordinate[1], size, size);
        });
    };

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    return cls;
})();

//init(1250, 600);
//draw(snakeCoordinates, ctx);
game = new Gameplay
console.log(game.tranformKeyToCoordinate(direction))
snake = new Snake([1,2,3]);
apple = new AppleGenerator();
a = apple.generateCoordinates(canvas);

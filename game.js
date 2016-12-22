const size = 14; // so that there is space in between squares
const movementVar = 15;

var currentGame;
var canvas;
var ctx;
var direction = 'right'; // right is initial direction

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
        this.coordinates = snakeCoordinates;
    }

    cls.prototype.move = function(coordinateIncrement) {
        joinedCoordinates = _.zip(coordinateIncrement, this.head);
        newCoordinates = joinedCoordinates.map(function(coordinate){
            return coordinate.reduce(function(sum, number){
                return sum + number;
            });
        });
        this.coordinates.push(newCoordinates);
    };

    cls.prototype.tail = function() {
        return this.coordinates[0];
    };

    cls.prototype.head = function() {
        return this.coordinates[this.coordinates.length - 1];
    };

    cls.prototype.removeTail = function() {
        this.coordinates.shift();
    };

    return cls;
})();

var Game = (function() {
    function cls(height, width, update) {
    }

    cls.prototype.start = function() {
        this.height = prompt('Enter Height: ');
        this.width = prompt('Enter Width');
        this.snake = new Snake([[15, 15], [30, 15], [45, 15], [60, 15]]);
        this.apple = new AppleGenerator;
        this.apple.generateCoordinates();
        this.gameplay = new Gameplay;
        begin();
    };

    var begin = function() {
        init(this.height, this.width);
        var currentGame = setInterval(this.gameplay.execute, 60);
        this.start();
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

    cls.prototype.execute = function() {

    };

    var paint = function() {
        draw(snakeCoordinates, ctx);
        draw([apple.position], ctx);
    };

    var calculate = function(snake, apple, direction) {
        coordinateIncrement = tranformKeyToCoordinate(direction);
        snake.move(coordinateIncrement);
        if (snake.head != apple.position) {
            snake.removeTail();
        } else {
            apple.generateCoordinates();
        }
    };

    // Get directions from keypressed
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
snake = new Snake([1,2,3]);
console.log(snake.coordinates);
apple = new AppleGenerator();
a = apple.generateCoordinates(canvas);

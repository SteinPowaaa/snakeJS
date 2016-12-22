const size = 14; // so that there is space in between squares
const movementVar = 15;

var direction = 'right'; // right is initial direction
var currentGame;

var AppleGenerator = (function() {
    function cls(){
    }

    // Generate random number coordinates [x, y] for apple
    cls.prototype.generateCoordinates = function(canvas) {
        // Offset so it doesn't spawn off the edge
        var x = closestDivisibleBy(
            randomNumberBetween(0, canvas.width - movementVar),
                                   movementVar);
        var y = closestDivisibleBy(
            randomNumberBetween(0, canvas.height - movementVar),
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

    cls.prototype.move = function(newCoordinates) {
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
    function cls() {
    }

    cls.prototype.start = function() {
        this.width = 1250;//prompt('Enter Width');
        this.height = 600;//prompt('Enter Height: ');
        var canvas = init(this.width, this.height);
        var ctx = canvas.getContext("2d");
        var snake = new Snake([[15, 15],
                               [30, 15],
                               [45, 15],
                               [60, 15]]);
        var apple = new AppleGenerator;
        apple.generateCoordinates(canvas);
        var gameplay = new Gameplay;
        begin(snake, apple, ctx, gameplay, canvas);
    };

    var begin = function(snake, apple, ctx, gameplay, canvas) {
        currentGame = setInterval(function() {
            gameplay.execute(snake, apple, ctx, canvas);
        }, 60);
        //this.start;
    };

    // Canvas init
    var init = function(width, height) {
        var canvas =
                $('<canvas/>',{'id':'snakeCanvas'})
                .attr({'width': width, 'height': height})[0];

        $('#work_area').append(canvas);

        return canvas;
    };

    return cls;
})();

var Gameplay = (function() {
    function cls() {
    }

    cls.prototype.execute = function(snake, apple, ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update(snake, apple, canvas);
        paint(snake, apple, ctx);
        gameEnd(snake, canvas);
    };

    var gameEnd = function(snake, canvas) {
        if (hitWall(snake, canvas) || eatSelf(snake)){
            clearInterval(currentGame);
        }
    };

    var hitWall = function(snake, canvas) {
        return snake.head()[0] >= canvas.width - movementVar ||
            snake.head()[1] >= canvas.height - movementVar ||
            snake.head()[0] <= -1 ||
            snake.head()[1] <= -1;
    };

    var eatSelf = function(snake){
        for(i=0; i<snake.coordinates.length - 1; i++){
            if (_.isEqual(snake.head(), snake.coordinates[i])) {
                return true;
            }
        }
        return false;
    };

    var paint = function(snake, apple, ctx) {
        drawSquares(snake.coordinates, ctx);
        drawColorSquare(apple.position, ctx);
    };

    var update = function(snake, apple, canvas) {
        coordinateIncrement = tranformKeyToCoordinate();
        joinedCoordinates = _.zip(coordinateIncrement, snake.head());
        newCoordinates = joinedCoordinates.map(function(coordinate){
            return coordinate.reduce(function(sum, number){
                return sum + number;
            });
        });
        snake.move(newCoordinates);
        if (!_.isEqual(snake.head(), apple.position)) {
            snake.removeTail();
        } else {
            apple.generateCoordinates(canvas);
        }
    };

    // Get directions from keypressed
    $(document).keydown(function(e) {
        e.preventDefault(); //so it doesn't move window if canvas too big

        var key = e.which;

        if (key == 38) { direction = 'up'; }
        if (key == 40) { direction = 'down'; }
        if (key == 37) { direction = 'left'; }
        if (key == 39) { direction = 'right'; }
    });

    var modifySnake = function() {

    };

    var tranformKeyToCoordinate = function() {
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

    var drawSquares = function(figureCoordinates, ctx) {
        ctx.fillStyle = "rgb(200, 350, 0)";
        figureCoordinates.forEach(function(coordinate) {
            ctx.fillRect(coordinate[0], coordinate[1], size, size);
        });
    };

    var drawColorSquare = function(figureCoordinates, ctx){
        ctx.fillStyle = "rgb(300, 0, 0)";
        ctx.fillRect(figureCoordinates[0],
                     figureCoordinates[1],
                     size,size);
    };

    return cls;
})();

game = new Game;
game.start();

var Apple = (function() {
    function cls(){
    }

    // Generate random number coordinates [x, y] for apple
    cls.prototype.move = function(coordinates) {
        this.position = coordinates;
    };

    return cls;
})();

var Snake = (function() {
    function cls() {
        this.reset();
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

    cls.prototype.reset = function() {
        this.coordinates = [[15, 15],
                           [30, 15],
                           [45, 15],
                           [60, 15]];
    };

    return cls;
})();

var Game = (function() {
    function cls() {
        this.snake = new Snake();
        this.apple = new Apple();
        this.gameplay = new Gameplay();
        this.intervalID;
    }

    cls.prototype.start = function() {
        this.apple.move(this.gameplay.generateCoordinates());
        this.snake.reset();
        this.gameplay.reset();
        this.execute();

    };

    cls.prototype.execute = function() {
        this.intervalID = setInterval((function() {
            this.gameplay.execute(this.snake, this.apple);
            if (this.gameplay.invalid(this.snake)) {
                this.gameEnd();
                this.start();
            }

        }).bind(this), 60);
    };

    cls.prototype.gameEnd = function(snake) {
        clearInterval(this.intervalID);
    };

    return cls;
})();

var Gameplay = (function() {
    function cls() {
        this.movementVar = 15;

        this.painter = new Painter;
        this.direction = 'right';

        this.bindKeyEvents();
    }

    cls.prototype.reset = function() {
        this.direction = 'right';
    };

    cls.prototype.execute = function(snake, apple) {
        this.painter.clear();
        this.update(snake, apple, this.painter.canvas);
        this.painter.paint(snake, apple);
    };

    cls.prototype.invalid = function(snake) {
        return this.hitWall(snake) || this.eatSelf(snake);
    };

    cls.prototype.hitWall = function(snake) {
        return snake.head()[0] >= this.painter
            .canvas.width - this.movementVar ||
            snake.head()[1] >= this.painter
            .canvas.height - this.movementVar ||
            snake.head()[0] <= -1 ||
            snake.head()[1] <= -1;
    };

    cls.prototype.eatSelf = function(snake){
        for(i=0; i<snake.coordinates.length - 1; i++){
            if (_.isEqual(snake.head(), snake.coordinates[i])) {
                return true;
            }
        }
        return false;
    };

    cls.prototype.update = function(snake, apple) {
        var newSnakeCoordinates = this.generateSnakeCoordinates(snake);
        snake.move(newSnakeCoordinates);
        if (!_.isEqual(snake.head(), apple.position)) {
            snake.removeTail();
        } else {
            apple.move(this.generateCoordinates());
        }
    };

    // Get directions from keypressed
    cls.prototype.bindKeyEvents = function () {
        $(document).keydown((function(e) {
            //so it doesn't move window if canvas too big
            e.preventDefault();

            var key = e.which;

            if (key === 38 && this.direction !== 'down') {
                this.direction = 'up';
            }
            if (key === 40 && this.direction !== 'up') {
                this.direction = 'down';
            }
            if (key === 37 && this.direction !== 'right') {
                this.direction = 'left';
            }
            if (key === 39 && this.direction !== 'left') {
                this.direction = 'right';
            }
        }).bind(this));
    };

    cls.prototype.generateSnakeCoordinates = function(snake) {
        coordinateIncrement = this.tranformDirectionToCoordinate();
        joinedCoordinates = _.zip(coordinateIncrement, snake.head());
        return joinedCoordinates.map(function(coordinate) {
            return coordinate.reduce(function(sum, number){
                return sum + number;
            });
        });
    };

    cls.prototype.tranformDirectionToCoordinate = function() {
        return {
            up: [0, -this.movementVar],
            down: [0, this.movementVar],
            right: [this.movementVar, 0],
            left: [-this.movementVar, 0]
        }[this.direction];
    };

    cls.prototype.generateCoordinates = function() {
    // Offset so it doesn't spawn off the edge
    var x = closestDivisibleBy(
        randomNumberBetween(0, this.painter.canvas.width - this.movementVar),
        this.movementVar);
    var y = closestDivisibleBy(
        randomNumberBetween(0, this.painter.canvas.height - this.movementVar),
        this.movementVar);

        return [x, y];
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

var Painter = (function() {
    function cls() {
        this.cellSize = 14;
        this.width = 1250;//prompt('Enter Width');
        this.height = 600;//prompt('Enter Height: ');
        this.initCanvas(this.width, this.height);
        this.ctx = this.canvas.getContext("2d");
    }

    cls.prototype.paint = function(snake, apple) {
        this.drawSquares(snake.coordinates, this.ctx);
        this.drawColorSquare(apple.position, this.ctx);
    };

    cls.prototype.drawSquares = function(figureCoordinates) {
        this.ctx.fillStyle = "rgb(200, 350, 0)";
        figureCoordinates.forEach((function(coordinate) {
            this.ctx.fillRect(coordinate[0], coordinate[1],
                              this.cellSize, this.cellSize);
        }).bind(this));
    };

    cls.prototype.drawColorSquare = function(figureCoordinates){
        this.ctx.fillStyle = "rgb(300, 0, 0)";
        this.ctx.fillRect(figureCoordinates[0],
                          figureCoordinates[1],
                          this.cellSize, this.cellSize);
    };

    cls.prototype.initCanvas = function() {
        this.canvas =
            $('<canvas/>',{'id':'snakeCanvas'})
            .attr({'width': this.width, 'height': this.height})[0];

        $('#work_area').append(this.canvas);
    };

    cls.prototype.clear = function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    return cls;
})();

game = new Game;
game.start();

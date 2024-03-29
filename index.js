//turtle
    var player;
    //for logging what keys are pressed
    var keys = [];
	//number of lines in the background
    var lineCount;
	//holds all of the lines in the background
    var lines = [];
	//number of twitter objects to run
    var tweetCount;
	//rate the number of twitter objects grow
    var tweetSpawn;
	//holds all of the tweets
    var tweets = [];
    var facebookSpawn;
    //holds all of the facebooks
    var facebookCount;
    var facebooks = [];
	//speed instagram resets to trigger
    var instaSpeed;
    var instaCounter;
	//holds instagram object
    var insta;
	//framerate
    var interval = 20;
	//Final Score on a Game Over
    var finalScore;
	//holds the score used for the scoreboard
    var score;
	//holds the scoreboard object
    var board;
	//flag for checking if on start screen
    var start = true;
	//flag for checking if in game over state
    var over = false;
    //flag for winning (get 13k points)
    var win = false;

	//flag for invincibility (for testing only)
    var invincible = false;

	//initializes game
    function startGame() {
        race.start();
        initialize();
    }

	//initializes variables used in the game
    function initialize() {
        score = 0;
        finalScore = 0;
        lineCount = 50;
        tweetCount = 0;
        tweetSpawn = 1000;
        facebookSpawn = 400;
        facebookCount = 0;
        instaSpeed = 2500;
        instaCounter = 0;
        player = new turtle(race.canvas.width/2 - 50, race.canvas.height - 250);
        insta = new instagram();
        board = new scoreBoard();
        if (lines.length < lineCount) {
            for (var i = 0; i < lineCount; i++) {
                lines.push(new backLine());
            }
        }
    }

	//everything called per frame
    function updateGame() {
        race.clear();
        for(var i = 0; i < lines.length; i++) {
            lines[i].update();
            lines[i].move();
        }
        if (start) {
            startScreen();
            if (keys[32]) {
                //reinitialize
                start = false;
                initialize();
                over = false;
                win = false;
            }
        }
        else {
            if (!over) {
                player.speedX = 0;
                player.speedY = 0;
				if (keys[73]) {
					invincible = true;
				}
                if (keys[85]) {
					invincible = false;
				}
                if (keys[37]) {
                    player.speedX = -7; 
                }
                if (keys[39]) {
                    player.speedX = 7; 
                }
                if (keys[38]) {
                    player.speedY = -7; 
                }
                if (keys[40]) {
                    player.speedY = 7; 
                }
                player.move();
                player.update();
                var currentHp = player.hp;
                for (var i =0; i < facebooks.length; i++) {
                    while(facebooks[i].finished()) {
                        facebooks.splice(i,1);
                        if (i >= facebooks.length) {
                            break;
                        }
                    }

                    facebooks[i].move();
                    facebooks[i].update();
                    if (facebooks[i].hit()  && !invincible) {
                        player.hp -= 1;
                        player.color = "red";
                        if (player.hp <= 0) {
                            over = true;
                        }
                        
                    } 
                }
                
                for (var i = 0; i < tweets.length; i++) {
                    while (tweets[i].finished()) {
                        tweets.splice(i,1);
                        if (i >= tweets.length) {
                            break;
                        }
                    }
                    if (i >= tweets.length) {
                        break;
                    }
                    tweets[i].move();
                    tweets[i].update();
                    if (tweets[i].hit() && !invincible) {
                        player.hp -= 1;
                        player.color = "red";
                        if (player.hp <= 0) {
                            over = true;
                        }
                    } 
                }

                if (currentHp === player.hp) {
                    player.color = "green";
                }

                if (!insta.finished()) {
                    insta.move();
                    insta.update();
                }
                
                score += 1;
                board.update();
                
                facebookDifficulty();
                twitterDifficulty();
                instagramDifficulty();

                if (score >= 13000) {
                    finalScore = 13000;
                    over = true;
                    win = true;
                }
            } else if (over && win) {
                winner();
                if (keys[32]) {
                    initialize();
                    over = false;
                    win = false;
                }
            } 
            else {
                gameOver();
                if (keys[32]) {
                    //reinitialize
                    initialize();
                    over = false;
                }
            }
        }
    }

    function facebookDifficulty() {
        while(facebookCount > facebooks.length) {
            console.log("Adding a facebook instance");
            facebooks.push(new facebook());
        }
        //increase count
        facebookCount = score/facebookSpawn;
    }

	//represents the title screen
    function startScreen() {
        ctx = race.context;
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "green";
        ctx.fillText("Awkward", race.canvas.width/2, race.canvas.height/2 - 30);
        ctx.fillText("Turtle", race.canvas.width/2, race.canvas.height/2 + 30); 
        ctx.font = "20px Arial";
        ctx.fillStyle = "purple";
        ctx.fillText("Use arrow buttons to move turtle",race.canvas.width/2, race.canvas.height/2 + 100);
        space(ctx);
    }

	//represents instruction to hit space to start
    function space(c) {
        c.font = "20px Arial";
        c.textAlign = "center";
        c.fillStyle = "red";
        c.fillText("Press Space to Start!", race.canvas.width/2, race.canvas.height - 100);
    }

    //represents the win screen
    function winner() {
        facebooks = [];
        tweets = [];
        insta = null;
        player = null;
        board = null;

        //draw gameover
        ctx = race.context;
        race.canvas.style.webkitFilter = "blur(0px)";
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "green";
        ctx.fillText("YOU WIN!", race.canvas.width/2, race.canvas.height/2); 

        ctx.font = "80px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = getRandomColour();
        ctx.fillText(finalScore, race.canvas.width/2, race.canvas.height/2 - 100);   

        space(ctx);
    }

	//represents the game over screen
    function gameOver() {
        facebooks = [];
        tweets = [];
        insta = null;
        player = null;
        board = null;
        finalScore = score;

        //draw gameover
        ctx = race.context;
        race.canvas.style.webkitFilter = "blur(0px)";
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.fillText("GAME OVER", race.canvas.width/2, race.canvas.height/2); 
        ctx.font = "30px Arial";
        ctx.fillText(finalScore, race.canvas.width/2, race.canvas.height/2 + 50);   
        space(ctx);      
    }

	//logic to increase spawn rate of twitter object to raise difficulty
    function twitterDifficulty() {
        while(tweetCount > tweets.length) {
            tweets.push(new twitter());
        }
        tweetCount = score/tweetSpawn;
    }

	//logic to increase frequency of instagram trigger to raise difficulty
    function instagramDifficulty() {
        if (instaCounter >= instaSpeed) {
            console.log("flash");
            instaSpeed -= 10;
            insta.init();
            instaCounter = 0;
        } else {    
            instaCounter += 1;
        }
    }

	//main game object, holds the canvas (sets size and clears the canvas), sets the frame rate and holds teh event listeners
    var race  = {
        canvas: document.createElement("canvas"),
        start: function() {
            this.canvas.width = 500;
            this.canvas.height = 800;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateGame, interval);
            window.addEventListener('keydown', function (e) {
                keys[e.keyCode] = true;
            })
            window.addEventListener('keyup', function (e) {
                keys[e.keyCode] = false;
            })
        },
        clear: function(){
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

	//returns a random color
    function getRandomColour(){
        var red = Math.floor(Math.random()* 255);
        var green = Math.floor(Math.random() * 255);
        var blue = Math.floor(Math.random() * 255);

        return "rgb("+red+","+green+"," +blue+")";  
    }

	//Creates a random line for the background and moves it down at a random rate
    function backLine() {
        this.X = Math.floor(Math.random() * race.canvas.width);
        this.Y = -1 * Math.floor(Math.random() * 300);
        this.width = Math.floor(Math.random() * 6);
        this.length = Math.floor(Math.random() * 100) + 50;
        this.speed = Math.floor(Math.random() * 5) + 1;
        this.color = getRandomColour();

        this.update = function() {
            ctx = race.context;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.X, this.Y);
            ctx.lineWidth = this.width;
            ctx.lineTo(this.X, this.Y - this.length);
            ctx.closePath();
            ctx.stroke();
        }

        this.move = function() {
            if (this.Y > (race.canvas.height + this.length)) {
                this.Y = -1 * Math.floor(Math.random() * 300);
                this.X = Math.floor(Math.random() * race.canvas.width);
                this.width = Math.floor(Math.random() * 6);
                this.length = Math.floor(Math.random() * 100) + 50;
                this.speed = Math.floor(Math.random() * 5) + 1;
                this.color = getRandomColour();
            } 
            this.Y += this.speed;
        }
    }

	//player's sprite
    function turtle(x, y) {
        this.X = x;
        this.Y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.frameSpeed = 15;
        this.currentFrame = 0;
        this.hp = 300;
        this.color = "green";
        this.update = function() {
            ctx = race.context;
            ctx.beginPath();
            ctx.moveTo(this.X + 25, this.Y + 5);
            ctx.bezierCurveTo(this.X + 50, this.Y + 5, this.X + 50, this.Y + 50, this.X + 25, this.Y + 50);
            ctx.bezierCurveTo(this.X, this.Y + 50, this.X, this.Y + 5, this.X + 25, this.Y + 5);
            ctx.closePath();
            ctx.fillStyle = "brown";
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(this.X + 25, this.Y + 10);
            ctx.bezierCurveTo(this.X + 45, this.Y + 10, this.X + 45, this.Y + 45, this.X + 25, this.Y + 45);
            ctx.bezierCurveTo(this.X + 5, this.Y + 45, this.X + 5, this.Y + 10, this.X + 25, this.Y + 10);
            ctx.closePath();
            ctx.fillStyle = "yellow";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.X + 13, this.Y + 20);
            ctx.lineTo(this.X + 37, this.Y + 20);
            ctx.moveTo(this.X + 10, this.Y + 30);
            ctx.lineTo(this.X + 40, this.Y + 30);
            ctx.moveTo(this.X + 15, this.Y + 40);
            ctx.lineTo(this.X + 35, this.Y + 40);
            ctx.closePath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.X + 25, this.Y);
            ctx.bezierCurveTo(this.X + 35, this.Y, this.X + 35, this.Y + 15, this.X + 25, this.Y + 15);
            ctx.bezierCurveTo(this.X + 15, this.Y + 15, this.X + 15, this.Y, this.X + 25, this.Y);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(this.X + 15, this.Y + 15);
            ctx.lineTo(this.X + 10, this.Y + 10);
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.X + 35, this.Y + 15);
            ctx.lineTo(this.X + 40, this.Y + 10);
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.X + 15, this.Y + 40);
            ctx.lineTo(this.X + 10, this.Y + 45);
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.X + 35, this.Y + 40);
            ctx.lineTo(this.X + 40, this.Y + 45);
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.X + 20, this.Y);
            ctx.lineTo(this.X + 20, this.Y + 5);
            ctx.closePath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.X + 30, this.Y);
            ctx.lineTo(this.X + 30, this.Y + 5);
            ctx.closePath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(race.canvas.width - 50, 50);
            ctx.lineTo(race.canvas.width - 50 - this.hp, 50);
            ctx.closePath();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 15;
            ctx.stroke();
        }

        this.move = function() {
            if (!(this.speedX < 0 && this.X <= 0) && !(this.speedX > 0 && this.X >= (race.canvas.width-50))) {
                this.X += this.speedX;
            }
            if (!(this.speedY < 0 && this.Y <= 5) && !(this.speedY > 0 && this.Y >= (race.canvas.height-55))) {
                this.Y += this.speedY;
            }
        }
    }

	//displays the score
    function scoreBoard() {
        this.update = function() {
            ctx = race.context;
            ctx.textAlign = "left";
            ctx.font = "30px Arial";
            ctx.fillStyle = "purple";
            ctx.fillText(score, 10, 30); 
        }
    }

    function facebook() {
        this.X = Math.floor(Math.random() * race.canvas.width);
        this.Y = -1 * Math.floor(Math.random() * 100);;
        this.speedX = Math.floor(Math.random() * 4);
        this.speedY = Math.floor(Math.random() * 2) + 1;
        this.radius = Math.floor(Math.random() * 11) + 15;

        this.update = function() {
            ctx = race.context;
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.strokeStyle = "black";
            ctx.font = (this.radius * 2) + "px verdana";
            ctx.lineWidth = 10;
            ctx.arc(this.X, this.Y, this.radius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillText("f",this.X -5, this.Y + this.radius);
            ctx.fill();
            ctx.closePath();
            ctx.stroke();  
        }

        this.move = function() {
            this.Y += this.speedY;
        }

        this.hit = function() {
            //get center of the player
            var pX = player.X + 25;
            var pY = player.Y + 25;

            //get the distance between the centers
            var length = Math.sqrt(Math.pow((pX - this.X),2) + Math.pow((pY - this.Y), 2));

            //hit if the distance is less than the sum of the radii of both
            if (length <= (this.radius + 25)) {
                return true;
            } else return false;
        }

        this.finished = function() {
            if (this.Y - this.radius >= race.canvas.height) {
                return true;
            } else return false;
        }
    }

	//bird obstacle, moves side to side at a random rate from a random position
    function twitter() {
        //49 because random returns 0 to 1 less than the width
        this.X = Math.floor(Math.random() * race.canvas.width) - 49;
        this.Y = -1 * Math.floor(Math.random() * 100);
        this.speedX = Math.floor(Math.random() * 6);
        this.speedY = Math.floor(Math.random() * 6) + 3;
        this.counter = 0;
        this.wingUp = false;
        //false = going left, true = going right
        this.direction = Math.floor(Math.random() * 2) == 0 ? true : false;

        this.init = function() {
            this.X = Math.floor(Math.random() * race.canvas.width) - 49;
            this.Y = -1 * Math.floor(Math.random() * 100);
            this.speedX = Math.floor(Math.random() * 6);
            this.speedY = Math.floor(Math.random() * 6) + 1;
            this.counter = 0;
            this.wingUp = false;
            //false = going left, true = going right
            this.direction = Math.floor(Math.random() * 2) == 0 ? true : false;
        }

        this.update = function() {
            ctx = race.context;
            //head and body
            if (this.direction) {
                ctx.beginPath();
                ctx.moveTo(this.X+50, this.Y + 20);
                ctx.bezierCurveTo(this.X + 50, this.Y, this.X + 30, this.Y, this.X + 30, this.Y + 20);
                ctx.lineTo(this.X, this.Y + 20);
                ctx.bezierCurveTo(this.X + 10, this.Y +50, this.X + 40, this.Y +50, this.X + 40, this.Y +20);
                ctx.lineTo(this.X + 50, this.Y +20);
                ctx.closePath();
                ctx.fillStyle = "#1da1f2";
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.stroke();

                //wings
                if (this.wingUp) {
                    ctx.beginPath();
                    ctx.moveTo(this.X + 30, this.Y + 20);
                    ctx.bezierCurveTo(this.X + 20, this.Y + 30, this.X, this.Y + 10, this.X + 10, this.Y);
                    ctx.closePath();
                    ctx.fillStyle = "#1da1f2";
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(this.X + 30, this.Y + 20);
                    ctx.bezierCurveTo(this.X + 10, this.Y + 20, this.X + 10, this.Y + 40, this.X + 30, this.Y + 40);
                    ctx.closePath();
                    ctx.fillStyle = "#1da1f2";
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            } else {
                ctx.beginPath();
                ctx.moveTo(this.X, this.Y + 20);
                ctx.bezierCurveTo(this.X, this.Y, this.X + 20, this.Y, this.X + 20, this.Y + 20);
                ctx.lineTo(this.X + 50,this.Y + 20);
                ctx.bezierCurveTo(this.X + 40, this.Y +50, this.X + 10, this.Y +50, this.X + 10, this.Y +20);
                ctx.lineTo(this.X, this.Y +20);
                ctx.closePath();
                ctx.fillStyle = "#1da1f2";
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.stroke();

                //wings
                if (this.wingUp) {
                    ctx.beginPath();
                    ctx.moveTo(this.X + 20, this.Y + 20);
                    ctx.bezierCurveTo(this.X + 30, this.Y + 30, this.X + 50, this.Y + 10, this.X + 40, this.Y);
                    ctx.closePath();
                    ctx.fillStyle = "#1da1f2";
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(this.X + 20, this.Y + 20);
                    ctx.bezierCurveTo(this.X + 40, this.Y + 20, this.X + 40, this.Y + 40, this.X + 20, this.Y + 40);
                    ctx.closePath();
                    ctx.fillStyle = "#1da1f2";
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }

        this.move = function() {
            //fall and swoop to opposite side
            if (this.X <= 0) {
                this.direction = true;
            }
            if (this.X >= (race.canvas.width-50)) {
                this.direction = false;
            }
            this.counter += 1;
            if (this.counter >= 10) {
                this.wingUp = !this.wingUp;
                this.counter = 0;
            }
            this.X += this.direction? this.speedX : (-1 * this.speedX);
            this.Y += this.speedY;
        }

        this.hit = function() {
            if (this.X + 5 < player.X + 45 &&
                this.X + 45 > player.X + 5 &&
                this.Y + 5 < player.Y + 45 &&
                this.Y + 45 > player.Y + 5) {
                console.log("Hit the player!");
                return true;
            } else return false;
        }

        this.finished = function() {
            if (this.Y >= race.canvas.height) {
                return true;
            } else return false;
        }
    }

	//camera obstacle, flashes and blurs the canvas
    function instagram() {
        this.X = race.canvas.width/2 - 50;
        this.width = 100;
        this.Y = -100;
        this.height = 100;
        this.durationCounter = 0;
        var step = -1;
        this.blur = 100;

        this.init = function() {
            this.durationCounter = 0;
            this.blur = 100;
            step = 1;
			this.Y = -100;
        }

        this.update = function() {
            if (step >= 1) {
                ctx = race.context;
                ctx.beginPath();
                var grd = ctx.createLinearGradient(this.X + this.width, this.Y, this.X, this.Y + this.height);
                grd.addColorStop(0, "blue");
                grd.addColorStop(0.4, "purple");
                grd.addColorStop(0.6, "red");
                grd.addColorStop(1, "yellow");
                ctx.fillStyle = grd;
                ctx.fillRect(this.X, this.Y, this.width, this.height);
                ctx.closePath();
                
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.arc(this.X + 20, this.Y + 20, 10, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.X + 50, this.Y + 50, 25, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
                if (step > 1) {
                    ctx = race.context;
                    ctx.beginPath();
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, race.canvas.width, race.canvas.height);
                    ctx.closePath();
                    this.durationCounter += 1;
					//shows up for 1 second
                    if (this.durationCounter > 50) {
                        step = 0;
                    }
                }
            } else if (step == 0){
                this.blur -= 2;
                race.canvas.style.webkitFilter = 'blur(' + this.blur + 'px)';
                if (this.blur == 0) {
                    step = -1;
                }
            }
        }

        this.move = function() {
            if (this.Y <= 25) {
                this.Y += 4;
            } else {
                if (step > 0) {
                    step += 1;
                }
            }
        }

        this.finished = function() {
            if (step == -1) {
                return true;
            } else return false;
        }
    }
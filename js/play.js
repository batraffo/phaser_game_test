//stato ndo si giuoca
// We create our only state, called 'mainState' 
var playState = {
   /* // We define the 3 default Phaser functions
    preload: function() { 
        // This function will be executed at the beginning 
        // That's where we load the game's assets 
        
        game.load.image('player', 'assets/player.png');//aggiungo il png del giocatore
        //i muriiiiiiiiiiiiiiii
        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');
        
        game.load.image('coin', 'assets/coin.png');
        game.load.image('enemy', 'assets/enemy.png');
    },*/
    
    create: function() {
        // This function is called after the preload function 
        // Here we set up the game, display sprites, etc.
        
        //phaser mi cattura i comandi in modo che non me li legga per sbaglio il browser
        //scrollandomi, per esempio, la pagina verso il basso
        game.input.keyboard.addKeyCapture(
            [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
             Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        
        this.music = game.add.audio('music'); // Add the music
        this.music.loop = true; // Make it loop
        this.music.play(); // Start the music
        
        //se giuoco da telefono
        if (!game.device.desktop) {
            this.addMobileInputs();
        }
        
   //     game.stage.backgroundColor = '#3498db';//mette il colore blu allo sfondo frate'
    //    game.physics.startSystem(Phaser.Physics.ARCADE);//mette la fi(si)ca
      //  game.renderer.renderSession.roundPixels = true;//fa diventare le cose pixel perfect maderfader
        //var player = game.add.sprite(250, 170, 'player');  Create a local variable with 'var player'
        // Create a state variable with 'this.player'
        //this.player = game.add.sprite(250, 170, 'player');
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');//creo una variabile di stato (del livello) al centro dello schermo, però da notare che abbiamo messo il giocatore non centrato ma centrato secondo la parte in alto a sinistra dello sprite
        this.player.anchor.setTo(0.5, 0.5);//così risolvaimo il problema gay di sopra
        // Tell Phaser that the player will use the Arcade physics engine
        
        // Create the 'right' animation by looping the frames 1 and 2
        this.player.animations.add('right', [1, 2], 8, true);
        // Create the 'left' animation by looping the frames 3 and 4
        this.player.animations.add('left', [3, 4], 8, true);
        
        game.physics.arcade.enable(this.player);
        // Add vertical gravity to the player
        this.player.body.gravity.y = 500;
        this.cursor = game.input.keyboard.createCursorKeys();//dico che dobbiamo utilizzare le freccette fighe
        this.createWorld();
        //aggiungo i suoni
        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');
        
        // Display the coin
        this.coin = game.add.sprite(60, 140, 'coin');
        // Add Arcade physics to the coin
        game.physics.arcade.enable(this.coin);
        // Set the anchor point to its center
        this.coin.anchor.setTo(0.5, 0.5);
        // Display the score
        this.scoreLabel = game.add.text(30, 30, 'score: 0',
                                        { font: '18px Arial', fill: '#ffffff' });
        // Initialize the score variable
       // this.score = 0;
        game.global.score = 0;//var globale definita in game
        
        // Create the emitter with 15 particles. We don't need to set the x y
        // Since we don't know where to do the explosion yet
        this.emitter = game.add.emitter(0, 0, 15);
        // Set the 'pixel' image for the particles
        this.emitter.makeParticles('pixel');
        // Set the x and y speed of the particles between -150 and 150
        // Speed will be randomly picked between -150 and 150 for each particle
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        // Scale the particles from 2 time their size to 0 in 800ms
        // Parameters are: startX, endX, startY, endY, duration
        this.emitter.setScale(2, 0, 2, 0, 800);
        // Use no gravity
        this.emitter.gravity = 0;
        
        // Create an enemy group with Arcade physics
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        
        // Create 10 enemies in the group with the 'enemy' image
        // Enemies are "dead" by default so they are not visible in the game
        this.enemies.createMultiple(10, 'enemy');
        // Call 'addEnemy' every 2.2 seconds
        // game.time.events.loop(2200, this.addEnemy, this);
        // Contains the time of the next enemy creation
        this.nextEnemy = 0;
        
        if (!game.device.desktop) {
            // Create an empty label to write the error message if needed
            this.rotateLabel = game.add.text(game.width/2, game.height/2, '',
                                             { font: '30px Arial', fill: '#fff', backgroundColor: '#000' });
            this.rotateLabel.anchor.setTo(0.5, 0.5);
            // Call 'orientationChange' when the device is rotated
            game.scale.onOrientationChange.add(this.orientationChange, this);//callbacca fatta come cambio orientamento del dispositivo
            // Call the function at least once
            this.orientationChange();
        }
    },
    
    update: function() { 
        // This function is called 60 times per second 
        // It contains the game's logic 
        
        // Tell Phaser that the player and the walls should collide
        
        game.physics.arcade.collide(this.player, this.layer);
        // Make the enemies and walls collide
        game.physics.arcade.collide(this.enemies, this.layer);
        
        // If the player is dead, do nothing
        if (!this.player.alive) {
            return;
        }
        
        // We have to use 'this.' to call a function from our state
        this.movePlayer();
        if (!this.player.inWorld) {//se cade di sotto muore
                this.playerDie();
        }
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin,
                                    null, this);
        // Call the 'playerDie' function when the player and an enemy overlap
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie,
                                    null, this);
        // If the 'nextEnemy' time has passed
        if (this.nextEnemy < game.time.now) {
            /*// We add a new enemy
            this.addEnemy();
            // And we update 'nextEnemy' to have a new enemy in 2.2 seconds
            this.nextEnemy = game.time.now + 2200;*/
            // Define our variables
            var start = 4000, end = 1000, score = 100;
            // Formula to decrease the delay between enemies over time
            // At first it's 4000ms, then slowly goes to 1000ms
            var delay = Math.max(
                start - (start - end) * game.global.score / score, end);
            // Create a new enemy and update the 'nextEnemy' time
            this.addEnemy();
            this.nextEnemy = game.time.now + delay;
        }
    },
    
    // And here we will later add some of our own functions
    movePlayer: function() {
        
        // If 0 finger are touching the screen
        if (game.input.totalActivePointers == 0) {
            // Make sure the player is not moving
            this.moveLeft = false;
            this.moveRight = false;
        }//serve per quando trascino via il dito e poi lascio lo schermo
        
        // If the left arrow key is pressed
        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            // Move the player to the left
            // The velocity is in pixels per second
            this.player.body.velocity.x = -200;
            this.player.animations.play('left'); // Left animation
        }
        // If the right arrow key is pressed
        else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
            // Move the player to the right
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        }
        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
            this.player.body.velocity.x = 0;
            this.player.animations.stop(); // Stop animations
            this.player.frame = 0; // Change frame (stand still)
        }
        // If the up arrow key is pressed and the player is on the ground
        //if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body./*touching.down*/onFloor()) {
            // Move the player upward (jump)
          //  this.jumpSound.play();
        //    this.player.body.velocity.y = -320;
        //}
        if (this.cursor.up.isDown || this.wasd.up.isDown) {
            this.jumpPlayer();
        }
    },
    
    createWorld: function() {
       /* // Create our group with Arcade physics
        this.walls = game.add.group();//creo un insieme di oggetti colle stesse proprietà
        this.walls.enableBody = true;//aggiungo la fica arcade a tutto
        // Create the 10 walls in the group
        game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
        game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right
        game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
        game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0,this.walls);
        middleBottom.scale.setTo(1.5, 1);//scalo sti due muti sull'asse x di 1.5x
        // Set all the walls to be immovable
        this.walls.setAll('body.immovable', true);*/
        
        // Create the tilemap
        this.map = game.add.tilemap('map');
        // Add the tileset to the map
        this.map.addTilesetImage('tileset');
        // Create the layer by specifying the name of the Tiled layer
        this.layer = this.map.createLayer('Tile Layer 1');//il nome si trova nel file json ed è deciso da tiled ;)
        // Set the world size to match the size of the layer
        this.layer.resizeWorld();
        // Enable collisions for the first tilset element (the blue wall)
        this.map.setCollision(1);
    },
    
    playerDie: function() {
        // Kill the player to make it disappear from the screen
        this.player.kill();
        this.deadSound.play();
       
        // Flash the color white for 300ms
     //   game.camera.flash(0xffffff, 300);//ricordatelo per quando il tuo pg si prende una botta in un videogaym
        
        // Shake for 300ms with an intensity of 0.02
        game.camera.shake(0.02, 300);
        
        // Set the position of the emitter on top of the player
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        // Start the emitter by exploding 15 particles that will live 800ms
        this.emitter.start(true, 800, null, 15);
        
        // stop the sound and go to the menu state
        this.music.stop();
        // Call the 'startMenu' function in 1000ms
        game.time.events.add(1000, this.startMenu, this);//se non ce non vediamo i particellari di quando muore
    },
    
    takeCoin: function(player, coin) {
      /*  // Kill the coin to make it disappear from the game
        this.coin.kill();*/
        // Increase the score by 5
        game.global.score += 5;
        this.coinSound.play();
        // Update the score label by using its 'text' property
        this.scoreLabel.text = 'score: ' + game.global.score;
        
        // Change the coin position
        this.updateCoinPosition();
        // Scale the coin to 0 to make it invisible
        this.coin.scale.setTo(0, 0);
        // Grow the coin back to its original scale in 300ms
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();//se non metto scale penso mi prenda la posizione
        game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100)
            .yoyo(true).start();//yoyo fa andare indietro l'animazione ovvero il player si rimpicciolisce tra i 100 e 200ms dopo l'inizio del twwen
        //animazione molto utile per quando un player raccoglie un power up
    },
    
    updateCoinPosition: function() {
        // Store all the possible coin positions in an array
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, // Top row
            {x: 60, y: 140}, {x: 440, y: 140}, // Middle row
            {x: 130, y: 300}, {x: 370, y: 300} // Bottom row
        ];
        // Remove the current coin position from the array
        // Otherwise the coin could appear at the same spot twice in a row
        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x == this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }
        // Randomly select a position from the array with 'game.rnd.pick'
        var newPosition = game.rnd.pick(coinPosition);
        // Set the new position of the coin
        this.coin.reset(newPosition.x, newPosition.y);
    },
    
    addEnemy: function() {
        // Get the first dead enemy of the group
        var enemy = this.enemies.getFirstDead();
        // If there isn't any dead enemy, do nothing
        if (!enemy) {
            return;
        }
        // Initialize the enemy
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.width/2, 0);//lo faccio cadere dal buco del water di sopra
        enemy.body.gravity.y = 500;//cade
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);//va casualmente a destra o a sinistra
        enemy.body.bounce.x = 1;//se sbatte la testa cambia la direzione
        enemy.checkWorldBounds = true;//sa dove finisce il mondo
        enemy.outOfBoundsKill = true;//se cade giù nella fogna skiatta male porcodio
    },
    
    //We define a new variable moveRight set to false by default.
    //If onInputOver or onInputDown is triggered, then we will set the variable to true.
    //If onInputOut or onInputUp is triggered, we will set the variable to false.
    //This way if moveRight is true, it means that the user is currenlty pressing the right
    //button.
    
    addMobileInputs: function() {
        // Add the jump button
        var jumpButton = game.add.sprite(350, 240, 'jumpButton');
        jumpButton.inputEnabled = true;
        jumpButton.alpha = 0.5;
        // Call 'jumpPlayer' when the 'jumpButton' is pressed
        jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        
        // Movement variables
        this.moveLeft = false;
        this.moveRight = false;
        
        // Add the move left button
        var leftButton = game.add.sprite(50, 240, 'leftButton');
        leftButton.inputEnabled = true;
        leftButton.alpha = 0.5;
        leftButton.events.onInputOver.add(this.setLeftTrue, this);
        leftButton.events.onInputOut.add(this.setLeftFalse, this);
        leftButton.events.onInputDown.add(this.setLeftTrue, this);
        leftButton.events.onInputUp.add(this.setLeftFalse, this);
        
        // Add the move right button
        var rightButton = game.add.sprite(130, 240, 'rightButton');
        rightButton.inputEnabled = true;
        rightButton.alpha = 0.5;
        rightButton.events.onInputOver.add(this.setRightTrue, this);
        rightButton.events.onInputOut.add(this.setRightFalse, this);
        rightButton.events.onInputDown.add(this.setRightTrue, this);
        rightButton.events.onInputUp.add(this.setRightFalse, this);
    },
    
    // Basic functions that are used in our callbacks
    setLeftTrue: function() {
        this.moveLeft = true;
    },
    
    setLeftFalse: function() {
        this.moveLeft = false;
    },
    
    setRightTrue: function() {
        this.moveRight = true;
    },
    
    setRightFalse: function() {
        this.moveRight = false;
    },
    
    jumpPlayer: function() {
        // If the player is touching the ground
        if (this.player.body.onFloor()) {
            // Jump with sound
            this.player.body.velocity.y = -320;
            this.jumpSound.play();
        }
    },
    
    orientationChange: function() {
        // If the game is in portrait (wrong orientation)
        if (game.scale.isPortrait) {
            // Pause the game and add a text explanation
            game.paused = true;
            this.rotateLabel.text = 'rotate your device in landscape';
        }
        // If the game is in landscape (good orientation)
        else {
            // Resume the game and remove the text
            game.paused = false;
            this.rotateLabel.text = '';
        }
    },
    
    startMenu: function() {//fapartire il menu
        game.state.start('menu');
    },
    
};
/*// Create a 500px by 340px game in the 'gameDiv' of the index.html
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
// Add the 'mainState' to Phaser, and call it 'main'
game.state.add('main', mainState);
game.state.start('main');*/



//codice aggiuntivo figo ma non serve now cazzo
/*// Change the position of the sprite
sprite.x = 21;
sprite.y = 21;
// Return the width and height of the sprite
sprite.width;
sprite.height;
// Change the transparency of the sprite, 0 = invisible, 1 = normal
sprite.alpha = 0.5;
// Change the angle of the sprite, in degrees
sprite.angle = 42;
// Change the color of the sprite
sprite.tint = 0xff0000;
// Remove the sprite from the game
sprite.kill();
// Return false if the sprite was killed
sprite.alive;

// Change the volume of the sound (0 = mute, 1 = full sound)
sound.volume = 0.5;
// Increase the volume from 0 to 1 over the duration specified
sound.fadeIn(duration);
// Decrease the volume from its current value to 0 over the duration
sound.fadeOut(duration);

// Add a 100ms delay before the tween starts
tween.delay(100);
// Repeat the tween 5 times
tween.repeat(5);
// Stop the tween
tween.stop();
// Return true if the tween is currently playing
tween.isRunning;
// Will call 'callback' once the tween is finished
tween.onComplete.add(callback, this);
// And there are lots of other easing functions you can try, like:
tween.easing(Phaser.Easing.Sinusoidal.In);
tween.easing(Phaser.Easing.Exponential.Out);

//Anything that has a number can be tweened. So it can be: x/y position, angle, x/y scale,alpha, volume (for a sound), and so on.
//tween dell'alpha quando un giocatore viene colpito e ha i frame di invincibilità

// Emit different particles
emitter.makeParticles(['image1', 'image2', 'image3']);
// Set min and max rotation velocity
emitter.setRotation(min, max);
// Change the alpha value over time
emitter.setAlpha(startAlpha, endAlpha, duration);
// Change the size of the emitter
emitter.width = 69;
emitter.height = 42;

// Triggered when the pointer is over the button
sprite.events.onInputOver.add(callback, this);
// Triggered when the pointer is moving away from the button
sprite.events.onInputOut.add(callback, this);
// Triggered when the pointer touches the button
sprite.events.onInputDown.add(callback, this);
// Triggered when the pointer goes up over the button
sprite.events.onInputUp.add(callback, this);

*/
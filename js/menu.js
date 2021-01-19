//stato del menu principale

var menuState = {
    create: function() {
        // Add a background image
        //con add le cose vengono messe una sopra l'altra su un asse z immaginaria, prima la aggiungo e più sta dietro e quello che sta dopo viene addato avanti
        game.add.image(0, 0, 'background');//aggiungo lo sfondo con add.image anzichè add.sprite perchè image è più leggero e non mi serve la fica per lo sfondo
        // Display the name of the game
       /* var nameLabel = game.add.text(game.width/2, 80,
                                      'Super Coin Box', { font: '50px Arial', fill: '#ffffff' });*/
        // Changed the y position to -50 so we don't see the label
   /*     var nameLabel = game.add.text(game.width/2, -50, 'Super Coin Box',
                                      { font: '50px Arial', fill: '#ffffff' });*/
        
        // Replaced the '50px Arial' by '70px Geo'
        var nameLabel = game.add.text(game.width/2, -50, 'Super Coin Box',
                                      { font: '70px Geo', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);
        //i tween sono delle animazioni che fungono di intermezzo tra 2 cambiamenti di stato di un'ui
     /*   // Create a tween on the label 
        var tween = game.add.tween(nameLabel);
        // Change the y position of the label to 80 in 1000 ms
        tween.to({y: 80}, 1000);
        // Start the tween
        tween.start();
        //poteva esser fatto tutto anche così game.add.tween(nameLabel).to({y: 80}, 1000).start();*/
        
        /*By default, a tween is moving the object in a straight line at a constant speed. We can
        change that by adding what we call an easing function*/
        game.add.tween(nameLabel).to({y: 80}, 1000)
            .easing(Phaser.Easing.Bounce.Out).start();//l'esaing me lo fa rimbalzare ovvero accelera l'animazione all'inizio e la rallenta alla fine aggiungendoci più frame vicini
        
        // If 'bestScore' is not defined
        // It means that this is the first time the game is played
        if (!localStorage.getItem('bestScore')) {
            // Then set the best score to 0
            localStorage.setItem('bestScore', 0);
        }
        // If the score is higher than the best score
        if (game.global.score > localStorage.getItem('bestScore')) {
            // Then update the best score
            localStorage.setItem('bestScore', game.global.score);
        }
        
        // Show the score at the center of the screen
     /*   var scoreLabel = game.add.text(game.width/2, game.height/2,
                                       'score: ' + game.global.score,  //global.score è una variabile globale definita in game.js
                                       { font: '25px Arial', fill: '#ffffff' });*/
        
        var text = 'score: ' + game.global.score + '\nbest score: ' +
            localStorage.getItem('bestScore');
        var scoreLabel = game.add.text(game.width/2, game.height/2, text,
                                       { font: '25px Arial', fill: '#ffffff', align: 'center' });
        
        scoreLabel.anchor.setTo(0.5, 0.5);
      /*  // Explain how to start the game
        var startLabel = game.add.text(game.width/2, game.height-80,
                                       'press the up arrow key to start',
                                       { font: '25px Arial', fill: '#ffffff' });*/
        //lorendo mobile friendly
        // Store the relevant text based on the device used
        var text;
        if (game.device.desktop) {
            text = 'press the up arrow key to start';
        }
        else {
            text = 'touch the screen to start';
        }
        // Display the text variable
        var startLabel = game.add.text(game.width/2, game.height-80, text,
                                       { font: '25px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        
        // Create the tween
        var tween = game.add.tween(startLabel);
        // Rotate the label to -2 degrees in 500ms
        tween.to({angle: -2}, 500);
        // Then rotate the label to +2 degrees in 1000ms
        tween.to({angle: 2}, 1000);
        // And get back to our initial position in 500ms
        tween.to({angle: 0}, 500);
        // Loop indefinitely the tween
        tween.loop();
        // Start the tween
        tween.start();
        //notare che la rotazione avviene in base a dove si trova l'anchor
        
        
       /* game.add.tween(startLabel).to({angle: -2}, 500).easing(Phaser.Easing.Linear.None).to({angle: 2}, 1000).easing(Phaser.Easing.Linear.None)
            .to({angle: 0}, 500).easing(Phaser.Easing.Linear.None).loop().start(); //poteva tutto esser fatto in una linea*///l'esasing ho provato a farlo io
        
        // Add the button that calls the 'toggleSound' function when pressed
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound,
                                          this);
        // If the game is already muted, display the speaker with no sound
        this.muteButton.frame = game.sound.mute ? 1 : 0;//sennò finito il gioco ricaricavo sempre il frame col suono
        
        // When pressed, call the 'start'
        if (!game.device.desktop) {
            game.input.onDown.add(this.start, this);
        }
        // Create a new Phaser keyboard variable: the up arrow key
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.start, this);//fa la callback prima dell'update (che qui non ce)
    },
    
    start: function() {
        // If we tap in the top left corner of the game on mobile
        if (!game.device.desktop && game.input.y < 50 && game.input.x < 60) {
            // It means we want to mute the game, so we don't start the game
            return;
        }
        
        // Start the actual game
        game.state.start('play');
    },
    
    // Function called when the 'muteButton' is pressed
    toggleSound: function() {
        // Switch the variable from true to false, or false to true
        // When 'game.sound.mute = true', Phaser will mute the game
        game.sound.mute = !game.sound.mute;
        // Change the frame of the button
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },
    
};
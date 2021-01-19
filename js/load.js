//stato dove carico gli assetti e metto una barra di caricamento

var loadState = {
    preload: function () {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.width/2, 150,
                                         'loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        // Display the progress bar
        var progressBar = game.add.sprite(game.width/2, 200,
                                          'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);//permette il riempimento della barra https://phaser.io/docs/2.5.0/Phaser.Loader.html#setPreloadSprite
        // Load all our assets
     //   game.load.image('player', 'assets/player.png');
        game.load.spritesheet('player', 'assets/player2.png', 20, 20);//20px * 20px è la grandezza di ogni frame cosi faser sa dividere lo spriteshit
        game.load.image('enemy', 'assets/enemy.png');
        game.load.image('coin', 'assets/coin.png');
      //  game.load.image('wallV', 'assets/wallVertical.png');
    //    game.load.image('wallH', 'assets/wallHorizontal.png');
        // Load a new asset that we will use in the menu state
        game.load.image('background', 'assets/background.png');
        
        //aggiungiamo sia file ogg che mp3, phaser decide quale caricare in base al browser che usiamo, good boi
        // Sound when the player jumps
        game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
        // Sound when the player takes a coin
        game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
        // Sound when the player dies
        game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
        // Load the music
        game.load.audio('music', ['assets/Rolemusic_-_the_river.mp3']);
        game.load.image('pixel', 'assets/pixel.png');
        game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
        game.load.image('tileset', 'assets/tileset.png');
        game.load.tilemap('map', 'assets/map.json', null,
                          Phaser.Tilemap.TILED_JSON);
        game.load.image('jumpButton', 'assets/jumpButton.png');
        game.load.image('rightButton', 'assets/rightButton.png');
        game.load.image('leftButton', 'assets/leftButton.png');
    },
    
    create: function() {
        // Go to the menu state
        game.state.start('menu');
    }
    
};
        
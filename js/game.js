//dove inizializziamo tutti gli stati
// Initialize Phaser
var game = new Phaser.Game(500, 340, Phaser.AUTO, '');
// Define our global variable
game.global = {
    score: 0
};
// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
// Start the 'boot' state
game.state.start('boot');

/*

1. First the boot state is called to load one image and set some settings.
2. Then the load state is displayed to load all the game’s assets.
3. After that the menu is shown.
4. When the user presses the up arrow key we start the play state.
5. And when the user dies we go back to the menu.

*/
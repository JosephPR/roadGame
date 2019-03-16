// create a new scene 
let gameScene =  new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function() {
    //player speed
    this.playerSpeed = 3;

    //enemy speed
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4.2;

    //boundaries
    this.enemyMinY = 80;
    this.enemyMaxY = 280;

    //we are not terminating
    this.isTerminating = false;
};


//load assets
gameScene.preload = function (){
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
    this.load.image('goal', 'assets/treasure.png');
};
//called after the preload ends
gameScene.create = function() {
    //create bg sprite
    let bg = this.add.sprite(0, 0, 'background');

    //change the origin to the top left corner
    bg.setOrigin(0, 0);
//   bg.setPosition(320, 180);

//create player
this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

//reduce height and width by 50%
this.player.setScale(0.5);

// goal 
this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal' );
this.goal.setScale(0.6);

//create enemy
this.enemies = this.add.group({
    key: 'enemy',
    repeat: 5,
    setXY: {
        x: 90,
        y: 100,
        stepX: 80,
        stepY: 20
    }
});

    // this.enemy = this.add.sprite(160, 180, 'enemy');
    // this.enemy.flipX = true;


    // this.enemies.add(this.enemy);

    //setting scale to all group elements
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.6, -0.6)

    //set flipX, and speed 
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        //flip enemy
        enemy.flipX = true;
        //set speed
        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() *  (this.enemyMaxSpeed - this.enemyMinSpeed)
        enemy.speed = dir * speed;
    }, this)

 
// this.enemy1.flipX = true;
// this.enemy1.scaleX = 2;
// this.enemy1.scaleY = 2;
// this.enemy1.displayWidth = 300;
// this.enemy1.angle = 45;
// this.enemy1.setAngle(-45);
// this.enemy1.setScale(3);
// this.enemy1.setOrigin(0, 0)
};

//this is called 60 times per second
gameScene.update = function(){
// dont execute if we are terminating
if(this.isTerminating) return;

//check for active input
if(this.input.activePointer.isDown) {
    //player walks
    this.player.x += this.playerSpeed;
};
//treasure overlap check
  let playerRect = this.player.getBounds();
  let treasureRect = this.goal.getBounds();

if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    console.log('Reached Goal!!');

    //restart the scene
    return this.gameOver();
  
}

//get enemies
let enemies = this.enemies.getChildren();
let numEnemies = enemies.length;


for(let i = 0; i < numEnemies; i++){
//enemy movement
enemies[i].y += enemies[i].speed ;

// check we havent passed the minimum or maximum of y 
let conditionUp = enemies[i].speed  < 0 && enemies[i].y <= this.enemyMinY;
let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

//if we passed the upper or lower limit reverse
if(conditionUp || conditionDown) {
    enemies[i].speed  *= -1;
}
//check enemy overlap

let enemyRect = enemies[i].getBounds();

if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
  console.log('game over!!');

  //end game
  return this.gameOver();
  
}


}




// this.enemy1.x += .2;
// this.enemy1.angle += 1;

// //check if we reached 2

// if(this.player.scaleX <2) {
//  //make a player grow
// this.player.scaleX += 0.01;
// this.player.scaleY += 0.01;
// }

};

gameScene.gameOver = function(){
this.isTerminating

//shake camera
this.cameras.main.shake(500);

// listen for event completion
this.cameras.main.on('camerashakecomplete', function(camera, effect){

 //fade out
 this.cameras.main.fade(500);
}, this);

this.cameras.main.on('camerafadeoutcomplete', function(camera, effect){
//restart the scene
 this.scene.restart();
}, this);
 
};


// set the configuration of the game
let config = {
    type: Phaser.AUTO,
    width:640,
    height: 360,
    scene: gameScene
}
// create a new game
let game = new Phaser.Game(config);
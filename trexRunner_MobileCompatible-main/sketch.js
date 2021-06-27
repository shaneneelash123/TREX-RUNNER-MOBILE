var trex, trex_running;
var edges;
var ground, movingGround;
var ground2;
var cloud, movingCloud;
var cloud2, movingCloud2;
var o1, o2, o3, o4, o5, o6;
var obstacle;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var obstacleGroup;
var cloudGroup;
var trexCollide;
var gameOver, gameOverText;
var restartButton, button;
var jumpSound;
var collideSound;
var checkPointSound;
 var name = "Syon";
//var highScore = 0
localStorage['HighScore']=0
function preload() {
  trex_running = loadAnimation(
    "costume1.svg",
    "costume2 (1).svg",
    "costume3.svg",
    "costume4.svg",
    "costume5.svg",
    "costume6.svg"
  );
  trexCollide = loadAnimation("costume2 (1).svg");
  movingGround = loadImage("ground2.png");
  movingCloud = loadImage("cloud1.png");
  movingCloud2 = loadImage("cloud2.png");
  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");
  gameOver = loadImage("gameover.svg");
  restartButton = loadImage("restart.svg");
  collideSound = loadSound("collided.wav");
  checkPointSound = loadSound("checkPoint.mp3");
  jumpSound = loadSound("jump.wav");
}
function setup() {
  createCanvas(windowWidth,windowHeight);
 
 
  //create a trex sprite
  trex = createSprite(50,height-70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("stillMotion", trexCollide);
  trex.scale = 0.55;
  
  trex.setCollider("rectangle", 0, 0, 30, 130);
  
  ground = createSprite(width/2, height-80, width, 125);
  ground.addImage("fullGround", movingGround);
 
  ground2 = createSprite(width/2, height-10, width, 125);
  ground2.visible = false;
  
  gameOverText = createSprite(width/2, height/2);
  gameOverText.addImage("gameOver", gameOver);
  gameOverText.visible = false;
  
  button = createSprite(width/2, height/2 + 60);
  button.addImage("restart", restartButton);
  button.visible = false;
  
  var anynumber = Math.round(random(20, 100));
  console.log(anynumber);

  obstacleGroup = createGroup();
  cloudGroup = createGroup();
}

function draw() {
  background("white");
  

  edges = createEdgeSprites();
  trex.collide(ground2);
  if (gameState === PLAY) {
    if ((touches.length > 0 || keyDown("space")) && trex.y  >= height-120) {
      trex.velocityY = -8;
      jumpSound.play();
      touches = []
    }

    trex.velocityY = trex.velocityY + 0.5;
    //increase the speed of ground
    ground.velocityX = -(4 + (3 * score) / 100);

    if (score % 100 === 0 && score > 0) {
      checkPointSound.play();
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    score = score + Math.round(getFrameRate() / 60);

    spawnCactus();
    spawnClouds();

    if (trex.isTouching(obstacleGroup)) {
      gameState = END;
      collideSound.play();
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    cloudGroup.setVelocityEach(0, 0);
    obstacleGroup.setVelocityEach(0, 0);
    cloudGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    trex.changeAnimation("stillMotion", trexCollide);
    trex.velocityY = 0;
    gameOverText.visible = true;
    button.visible = true;
    
    if(mousePressedOver(button)||touches.length>0){
      button.visible = false
      gameOverText.visible = false
      reset();
    }
  }

   
  drawSprites();
  text("Score: " + score, width-170, 40);
  text("High Score: " + localStorage['HighScore'],width-100,40)
 
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10, 100));
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        cloud.addImage("movingCloud", movingCloud);
        break;
      case 2:
        cloud.addImage("movingCloud2", movingCloud2);
        break;
      default:
        break;
    }

    cloud.scale = 0.25;
    cloud.velocityX = -(4 + (3 * score) / 100);
    cloud.lifetime = width/ (4 + (3 * score) / 100);
    cloudGroup.add(cloud);
  }
}

function spawnCactus() {
  if (frameCount % 70 === 0) {
    obstacle = createSprite(width, height-90, width, 125);

    obstacle.velocityX = -(4 + (3 * score) / 100);

    var randObstacle = Math.round(random(1, 6));
    switch (randObstacle) {
      case 1:
        obstacle.addImage("o1", o1);
        break;
      case 2:
        obstacle.addImage("o2", o2);
        break;
      case 3:
        obstacle.addImage("o3", o3);
        break;
      case 4:
        obstacle.addImage("o4", o4);
        break;
      case 5:
        obstacle.addImage("o5", o5);
        break;
      case 6:
        obstacle.addImage("o6", o6);
        break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = width/(4 + (3 * score) / 100);
    obstacleGroup.add(obstacle);
  }
}
function reset(){
   //score to 0
  gameState = PLAY
  
  
  obstacleGroup.destroyEach()
  cloudGroup.destroyEach()
  
  trex.changeAnimation("running", trex_running);
    if(score >  localStorage['HighScore'] ){
     localStorage['HighScore']= score
  }
  score = 0
  //obstacles and clouds has to go back
  
  //gameState has to be play
  
  
}

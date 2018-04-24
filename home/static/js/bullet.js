if(navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
  ismobile = true;
}else{
  ismobile = false;
}

if (localStorage.joystic_sensitivity) {
  var sensitivity_value = Number(localStorage.joystic_sensitivity)
  joystic.Sensitivity = sensitivity_value;
  document.getElementById('view_sensitivity').innerHTML = sensitivity_value;
  document.getElementsByName('sensitivity')[0].value = sensitivity_value;
}

var object = {
  touch : false,
  keyPressOn : {},
  enemyBalls: [],
  speed : {
    x : 0,
    y: 0
  },
  max_speed : 10,
  Level : 0,
  score : 0,
  StarColor : null,
  StartLevel : 4,
  Start_msg : null,
  stopped : false,
  spaceShipSprit : null,
  requestId : null,
  bomb : null,
  bomb_count : 0
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
      object.Level = 0;
      object.score = 0;
      object.StarColor = "white";
      this.canvas.width = window.innerWidth;
      // joystic.Sensitivity = Number(document.getElementsByName('sensitivity')[0].value);
      // console.log(navigator);

      if (ismobile) {
        this.canvas.height = window.innerHeight/100*60;
        object.Start_msg = "화면을 터치하면 게임이 시작됩니다.";
      }else{
        this.canvas.height = window.innerHeight/100*99;
        joystic_doc.style.display = "none";
        document.getElementsByClassName('sensitivity')[0].style.display = "none";
        object.Start_msg = "Enter키를 누르면 게임이 시작됩니다.";
      }
      this.canvas.setAttribute("id","canvas1");
      this.context = this.canvas.getContext("2d");

      playerUnit = {
        x:this.canvas.width/2-32,
        y:this.canvas.height/2-32,
        width: 64,
        height: 64,
        default_speed : 0.5
      };

      var device_width = Math.round(this.canvas.width/100);
      var device_height = Math.round(this.canvas.height/100);

      enemy.createEnemyBalls(Math.floor((device_width*device_height)/10)*object.StartLevel);

      document.addEventListener("keydown", getKeyDown, false);
      document.addEventListener("keyup", getKeyUp, false);
      this.setAeroplane();
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      gameLoop();
    },
    stop : function(){
      if (object.requestId) {
        var score;
        window.cancelAnimationFrame(object.requestId);
        object.stopped = true;
        this.context.fillStyle = "white";
        this.context.font = "bold 50px _sans";
        this.context.textAlign = "center";
        this.context.fillText("Score : "+this.score()+" Seconds", this.canvas.width/2, this.canvas.height/2);
        this.context.fillStyle = "gray";
        this.context.font = "bold 30px _sans";
        this.context.fillText(object.Start_msg, this.canvas.width/2, this.canvas.height/2+50);
      }
    },
    score : function(){
      return (object.score/60).toFixed(2);
    },
    setAeroplane : function(){
      object.spaceShipSprit = new Image();
      object.bomb = new Image();
      object.bomb.src = "/static/image/bomb.png";
      object.spaceShipSprit.onload = function(){
        myGameArea.context.drawImage(object.spaceShipSprit, myGameArea.canvas.width/2-32, myGameArea.canvas.height/2-32);
      }
      object.spaceShipSprit.src = "/static/image/aeroplane_64.png";
    },
    Gamestart : function(){
      if (object.stopped) {
        object.stopped = false;
        object.enemyBalls = [];
        object.count = 0;
        this.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height); 
        this.start();
        object.speed.x = playerUnit.default_speed;
        object.speed.y = playerUnit.default_speed;
      }
    }
}

function bomb(){
  object.bomb = new Image();
  object.bomb.src = "/static/image/bomb.png";


  // for (var i = 0; i < 24; i++) {

  //   myGameArea.context.drawImage(object.bomb, 0, 128, playerUnit.width, playerUnit.height, playerUnit.x, playerUnit.y, playerUnit.width, playerUnit.height);
  // }
  if (object.bomb_count > 0 && object.bomb_count <= 6) {
    myGameArea.context.drawImage(object.bomb, 0, 128, playerUnit.width, playerUnit.height, playerUnit.x, playerUnit.y, playerUnit.width, playerUnit.height);
  }
  if(object.bomb_count > 6 && object.bomb_count <= 12){
    myGameArea.context.drawImage(object.bomb, 0, 64, playerUnit.width, playerUnit.height, playerUnit.x, playerUnit.y, playerUnit.width, playerUnit.height);
  }
  if (object.bomb_count > 12 && object.bomb_count <= 18) {
   myGameArea.context.drawImage(object.bomb, 0, 0, playerUnit.width, playerUnit.height, playerUnit.x, playerUnit.y, playerUnit.width, playerUnit.height);
  }
  if (object.bomb_count > 21) {
    myGameArea.stop();
  }
  object.bomb_count++;
  window.requestAnimationFrame(bomb);

}

function getKeyDown(event){
  if(event == null){
    return;
  }
  object.speed.x = object.max_speed;
  object.speed.y = object.max_speed;
  object.keyPressOn[event.keyCode] = true;
  if (object.stopped && event.keyCode == 13) {
    myGameArea.Gamestart();
  }
}

function getKeyUp(event){
  var keyValue;
  if(event == null){
    keyValue=window.event.keyCode;
    window.event.preventDefault();
  }else{
    keyValue=event.keyCode;
    event.preventDefault();
  }
  object.keyPressOn[keyValue] = false;
}


function gameLoop(){
  calcKeyInnput();
  enemy.calcEnemy();
  checkHitPlayer();
  displayAll();
  if (!object.stopped) {
    object.requestId = window.requestAnimationFrame(gameLoop);
  }
  myGameArea.context.fillStyle = "white";
  myGameArea.context.font = "bold 30px _sans";
  myGameArea.context.textAlign = "right";
  myGameArea.context.fillText(myGameArea.score(), myGameArea.canvas.width-10, 40);
  myGameArea.context.textAlign = "center";
  myGameArea.context.fillText("총알 : "+object.enemyBalls.length, myGameArea.canvas.width/2, myGameArea.canvas.height-10);
  object.score++;
}

var enemy = {
  createEnemyBalls : function(iCount){
    for(var i=0; i<iCount; i++){
      var startX = Math.floor(Math.random()*(myGameArea.canvas.width-1))+1;
      var startY = Math.floor(Math.random()*(myGameArea.canvas.height-1))+1;
      var startPos = Math.floor(Math.random()*4);
      if(startPos == 1)
        startX = 0;
      else if(startPos == 2)
        startY = 0;
      else if(startPos == 3)
        startX = myGameArea.canvas.width;
      else
        startY = myGameArea.canvas.height;

      var startAngle = Math.floor(Math.random()*360);
      var startSpeed = Math.floor(Math.random()*(2))+3;
      var startColor = object.StarColor;
      var enemy_obj = {x:startX, y:startY, color:startColor, radius:4, speed:startSpeed, angle:startAngle,radians:Math.PI/180};
      object.enemyBalls.push(enemy_obj);
    }
  },
  calcEnemy : function(){
    if(object.Level > 300){
      object.StarColor = "orange";
      // object.StarColor = "#33aaff";
      var device_width = Math.round(myGameArea.canvas.width/100);
      var device_height = Math.round(myGameArea.canvas.height/100);
      this.createEnemyBalls(Math.round(device_width*device_height)/100*2);
      object.Level = 0;
    }
    object.Level++;
    for(var i=0;i<object.enemyBalls.length;i++){
      object.enemyBalls[i].radians = object.enemyBalls[i].angle * Math.PI/180;
      object.enemyBalls[i].x += Math.cos(object.enemyBalls[i].radians) * object.enemyBalls[i].speed;
      object.enemyBalls[i].y += Math.sin(object.enemyBalls[i].radians) * object.enemyBalls[i].speed;

      if(object.enemyBalls[i].x > myGameArea.canvas.width || object.enemyBalls[i].x < 0)
        object.enemyBalls[i].angle = 180 - object.enemyBalls[i].angle;
      else if(object.enemyBalls[i].y > myGameArea.canvas.height || object.enemyBalls[i].y < 0)
        object.enemyBalls[i].angle = 360 - object.enemyBalls[i].angle;
    }
  },
  displayEnemy : function(){
    for(var i=0;i<object.enemyBalls.length;i++){
      myGameArea.context.fillStyle = object.enemyBalls[i].color;
      myGameArea.context.beginPath();
      myGameArea.context.arc(object.enemyBalls[i].x, object.enemyBalls[i].y, object.enemyBalls[i].radius, 0, Math.PI*2, true);
      myGameArea.context.closePath();
      myGameArea.context.fill();
    }
  }

}

function calcKeyInnput(){
  if(object.keyPressOn["38"] && playerUnit.y >= 1)
    playerUnit.y -= object.speed.y;  //up
  if(object.keyPressOn["40"] && playerUnit.y <= myGameArea.canvas.height-playerUnit.height-1)
    playerUnit.y += object.speed.y;  //down
  if(object.keyPressOn["37"] && playerUnit.x >= 1)
    playerUnit.x -= object.speed.x;  //left
  if(object.keyPressOn["39"] && playerUnit.x <= myGameArea.canvas.width-playerUnit.width-1)
    playerUnit.x += object.speed.x;  //right
}

function displayAll(){
  myGameArea.context.fillStyle = "black";
  myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
  myGameArea.context.drawImage(object.spaceShipSprit, 0, 0, playerUnit.width, playerUnit.height, playerUnit.x, playerUnit.y, playerUnit.width, playerUnit.height);
  displayPlayer();
  enemy.displayEnemy();
}

myGameArea.start();
object.speed.x = playerUnit.default_speed;
object.speed.y = playerUnit.default_speed;

$("canvas").bind('touchend', function(event){
  myGameArea.Gamestart();
})

function checkHitPlayer(){
  var rtnVal = false;
  for(var i=0;i<object.enemyBalls.length;i++){
    var distanceX = (playerUnit.x+ playerUnit.width/2)-object.enemyBalls[i].x;
    var distanceY = (playerUnit.y+ playerUnit.height/2)-object.enemyBalls[i].y;
    var distance = distanceX*distanceX + distanceY*distanceY;

    if(distance <= (object.enemyBalls[i].radius + (playerUnit.width/4-5))*(object.enemyBalls[i].radius+(playerUnit.height/4-5))){
      rtnVal = true;
      break;
    }
  }
  return rtnVal;
}

function displayPlayer(){
  if(checkHitPlayer())
    myGameArea.stop();
    // bomb();
}
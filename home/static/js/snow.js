var Game = function(){
  this.running = 0,
  this.Level = 3,
  this.background = null,
  this.Snowman = [],
  this.cpu = [],
  this.Live = {Snowman:0,cpu:0},
  this.error_range = 30,
  this.reference_point = {},
  this.screen_radian = 0,
  this.screen_degree = 0,
  this.screen_tan = 0,
  this.a = {x:0,y:0},
  this.b = {x:0,y:0},
  this.c = {x:0,y:0},
  this.SnowBall = [],
  this.PlayerAttack = false,
  this.PlayerNumber = 0,
  this.Power_reference_point = 0,
  this.Energybar = false,
  this.Energybar_count = 0,
  this.Stop = false,
  this.StopCount = 0,
  this.Control = true,
  this.target = false,
  this.target2 = {}
}
Game.prototype.img = {};
Game.prototype.move_limit = 83;
Game.prototype.loop = function(){
 SnowGame.context.fillStyle = "white";
 SnowGame.context.fillRect(0, 0, SnowGame.canvas.width, SnowGame.canvas.height);
  SnowGame.CPUAction();
  SnowGame.SelectCPUAction();
  // SnowGame.TEST();
  
  for (var i = 0; i < object.Snowman.length; i++) {
    if (object.Snowman[i].Action == "damaged" && object.Snowman[i].Life) {
      SnowGame.ActionAnimation(60,253,i,'player');
      if (object.Snowman[i].Action_count > 60) {
        object.Snowman[i].Action_count = 0;
        object.Snowman[i].shoot = false;
        object.Snowman[i].Action = 'ready';
      }
    }else if (object.Snowman[i].Move) {
      SnowGame.ActionAnimation(64,128,i,'player');
    }else{
      if (object.Snowman[i].shoot && object.Snowman[i].Life) {
        SnowGame.ActionAnimation(64,192,i,'player');
        if (object.Snowman[i].Action_count > 60) {
          object.Snowman[i].shoot = false;
          object.Snowman[i].Action_count = 0;
        }
      }else{
        if (object.Snowman[i].Life) {
          SnowGame.ActionAnimation(64,0,i,'player');
        }else{
          SnowGame.context.drawImage(Game.prototype.img.dead, 0, 0, 64, 64, object.Snowman[i].X, object.Snowman[i].Y, 64, 64);
        }
      }
    }
    object.Snowman[i].Action_count++;
  }
  SnowGame.MoveSnowBall();
  for (var i = 0; i < SnowGame.canvas.height; i++) {
   if (i == 0) {break;}
  }
  SnowGame.Energybar();
  if (object.Live.Snowman == 0 || object.Live.cpu == 0) {
    var finish_msg,iden;
    object.Live.Snowman == 0 ? iden = 'cpu' : iden = 'player';
    object.Control = false;
    object.StopCount++;
    if (object.StopCount > SnowGame.StopCount(iden)) {
      if (object.Live.Snowman == 0) {
        finish_msg = '패배';
        object.Level = 1;
      }
      if (object.Live.cpu == 0) {
        finish_msg = '승리';
        object.Level++;
      }
      object.Stop = true;
      
      SnowGame.context.fillStyle = "gray";
      SnowGame.context.globalAlpha = "0.8";
      SnowGame.context.fillRect(0,0,SnowGame.canvas.width,SnowGame.canvas.height);

      SnowGame.context.fillStyle = "white";
      SnowGame.context.font = "bold 50px _sans";
      SnowGame.context.textAlign = "center";
      SnowGame.context.fillText(finish_msg, SnowGame.canvas.width/2, SnowGame.canvas.height/2);
      SnowGame.context.fillStyle = "gray";
      SnowGame.context.font = "bold 30px _sans";
      SnowGame.context.fillText(object.Start_msg, SnowGame.canvas.width/2, SnowGame.canvas.height/2+50);

    }
  }
  if (!object.Stop) {
    object.running = window.requestAnimationFrame(object.loop);
  }

  if (document.getElementById('myonoffswitch') && document.getElementById('myonoffswitch').checked) {
    SnowGame.LineView();
  }
  
}
// Game.prototype.Stop = function(){
//   window.cancelAnimationFrame(object.running);
// }

var lastPt=null;
var SnowGame = {
  canvas : document.createElement("canvas"),
  Start : function(){
    object.Stop = false;
    object.Control = true;
    object.StopCount = 0;
    object.Snowman.splice(0);
    object.cpu.splice(0);

    this.canvas.setAttribute("id","canvas1");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;


    if (ismobile) {
      this.canvas.height = window.innerHeight/100*60;
      object.Start_msg = "화면을 터치하면 게임이 시작됩니다.";
    }else{
      this.canvas.height = window.innerHeight/100*99;
      // joystic_doc.style.display = "none";
      // document.getElementsByClassName('sensitivity')[0].style.display = "none";
      object.Start_msg = "화면을 클릭하면 게임이 시작됩니다.";
    }
    object.a.x = Game.prototype.move_limit;
    object.a.y = this.canvas.height;
    object.b.x = 0;
    object.b.y = this.canvas.height-Game.prototype.move_limit;
    object.Power_reference_point = this.getLineLength(0,0,this.canvas.width,this.canvas.height)/15;

    this.context.fillStyle = "#f7f7f7";
    var player_interval = Math.floor(this.canvas.width/3)/2;
    object.reference_point.X = this.canvas.width-player_interval;
    object.reference_point.Y = this.canvas.height-player_interval;
    var player = [
      {X:object.reference_point.X, Y:object.reference_point.Y, Move:false, Energy:3, Life:true, shoot: false, Action_count: 0},
      {X:object.reference_point.X-player_interval*1.5, Y:object.reference_point.Y,Move:false, Energy:3, Life:true, shoot: false, Action_count: 0},
      {X:object.reference_point.X, Y:object.reference_point.Y-player_interval*1.5,Move:false, Energy:3, Life:true, shoot: false, Action_count: 0}
    ]
    for (var i = 0; i < player.length; i++) {
      object.Snowman.push(player[i]);
      if (player[i].Life) object.Live.Snowman++;
    }

    //디바이스 이동제한 각도 구하기
    var device_width = this.canvas.width-object.move_limit;
    var device_height = this.canvas.height-object.move_limit;
    // object.screen_degree = Math.atan(device_width/device_height)*180/Math.PI;
    object.screen_degree = Math.atan2(device_height,device_width)*180/Math.PI;
    object.screen_radian = Math.atan2(device_height,device_width);
    object.screen_tan = Math.tan(object.screen_radian);
    this.CreateCPUPlayer2();

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.SetSnowMans(this);

    object.c.x = object.Snowman[0].X;
    object.c.y = object.Snowman[0].Y;
    object.loop();

    window.addEventListener("mousedown", this.mouse_down, false);
    window.addEventListener("mousemove", this.mouse_move, false);
    window.addEventListener("mouseup", this.mouse_up, false);
    this.canvas.addEventListener("touchstart", this.touch_start, false);
    this.canvas.addEventListener("touchmove", this.touch_move, false);
    this.canvas.addEventListener("touchend", this.touch_end, false);
  },
  SetSnowMans : function(t){
    Game.prototype.img.snowman = new Image();
    Game.prototype.img.snowman.src = "/static/image/snow.png";
    Game.prototype.img.snowball = new Image();
    Game.prototype.img.snowball.src = "/static/image/snowball2.png";
    Game.prototype.img.dead = new Image();
    Game.prototype.img.dead.src = "/static/image/dead.png";
    Game.prototype.img.energybar = new Image();
    Game.prototype.img.energybar.src = "/static/image/test.png";
  },
  mouse_down : function(e){
    //console.log("X:"+e.pageX+"| Y:"+e.pageY);
    if (object.Stop) {
      SnowGame.Start();
    }
    for (var i = 0; i < object.Snowman.length; i++) {
      if (e.pageX+object.error_range > object.Snowman[i].X && e.pageX-object.error_range < object.Snowman[i].X+64 && e.pageY+object.error_range > object.Snowman[i].Y && e.pageY-object.error_range < object.Snowman[i].Y+64) {
        if (object.Snowman[i].Action !== 'damaged') {
          if (object.Snowman[i].Life && object.Control) {
            object.Snowman[i].Move = true;
            object.PlayerNumber = i;
            object.PlayerAttack = true;
            object.Energybar = 1;
          }
          break;
        }
      }
    }
  },
  mouse_move : function(e){
    var SG = SnowGame;
    var GM = Game;
    var p_w = 64;
    var eX = e.pageX;
    var eY = e.pageY;

    var limit_X = SG.Limit_X(eY);

    for (var i = 0; i < object.Snowman.length; i++) {
      if(object.Snowman[i].Move) {
        object.Snowman[i].X = eX-p_w/2;
        object.Snowman[i].Y = eY-p_w/2;
        if (eX < limit_X) {
          object.Snowman[i].X = limit_X-p_w/2;
        }

        //이동제한
        if (object.Snowman[i].X < object.move_limit) object.Snowman[i].X = object.move_limit;
        if (object.Snowman[i].X > SG.canvas.width-p_w) object.Snowman[i].X = SG.canvas.width-p_w;
        if (object.Snowman[i].Y < object.move_limit) object.Snowman[i].Y = object.move_limit;
        if (object.Snowman[i].Y > SG.canvas.height-p_w) object.Snowman[i].Y = SG.canvas.height-p_w;
      }
    }
  },
  mouse_up : function(e){
    // Terminate touch path
    
    for (var i = 0; i < object.Snowman.length; i++) {
      object.Snowman[i].Move = false;
      
    }
    if (object.Snowman[object.PlayerNumber]) {
      if (object.PlayerAttack) {
        SnowGame.CreateSnowBall(object.Snowman[object.PlayerNumber].X,object.Snowman[object.PlayerNumber].Y,'player',object.Energybar);
        object.PlayerAttack = false;
        object.Snowman[object.PlayerNumber].shoot = true;
      }
    }
    object.Energybar = false;
  },
  touch_start : function(e) {
    console.log(e.touches[0].pageX+'|'+e.touches[0].pageY);
    e.preventDefault();
    if (object.Stop) {
      SnowGame.Start();
    }else{


      for (var i = 0; i < object.Snowman.length; i++) {
        if (e.touches[0].pageX+object.error_range > object.Snowman[i].X && e.touches[0].pageX-object.error_range < object.Snowman[i].X+64 && e.touches[0].pageY+object.error_range > object.Snowman[i].Y && e.touches[0].pageY-object.error_range < object.Snowman[i].Y+64) {
          if (object.Snowman[i].Action !== 'damaged') {
            if (object.Snowman[i].Life && object.Control) {
              object.Snowman[i].Move = true;
              object.PlayerNumber = i;
              object.PlayerAttack = true;
              object.Energybar = 1;
            }
            break;
          }
        }
      }
    }
  },
  touch_move : function(e) {
    e.preventDefault();
    var SG = SnowGame;
    var GM = Game;
    var p_w = 64;
    var eX = e.touches[0].pageX;
    var eY = e.touches[0].pageY;

    var limit_X = SG.Limit_X(eY);

    for (var i = 0; i < object.Snowman.length; i++) {
      if(object.Snowman[i].Move) {
        object.Snowman[i].X = eX-p_w/2;
        object.Snowman[i].Y = eY-p_w/2;
        if (eX < limit_X) {
          object.Snowman[i].X = limit_X-p_w/2;
        }

        //이동제한
        if (object.Snowman[i].X < object.move_limit) object.Snowman[i].X = object.move_limit;
        if (object.Snowman[i].X > SG.canvas.width-p_w) object.Snowman[i].X = SG.canvas.width-p_w;
        if (object.Snowman[i].Y < object.move_limit) object.Snowman[i].Y = object.move_limit;
        if (object.Snowman[i].Y > SG.canvas.height-p_w) object.Snowman[i].Y = SG.canvas.height-p_w;
      }
    }
  },

  touch_end : function(e) {
    e.preventDefault();
    // Terminate touch path
    
    for (var i = 0; i < object.Snowman.length; i++) {
      object.Snowman[i].Move = false;
      
    }
    if (object.Snowman[object.PlayerNumber]) {
      if (object.PlayerAttack) {
        SnowGame.CreateSnowBall(object.Snowman[object.PlayerNumber].X,object.Snowman[object.PlayerNumber].Y,'player',object.Energybar);
        object.PlayerAttack = false;
        object.Snowman[object.PlayerNumber].shoot = true;
      }
    }
    object.Energybar = false;
  },
  CreateCPUPlayer : function(){
    var temp_ary = {};
    temp_ary.Action_count = Math.floor(Math.random()*240);
    var result = {Action: 'ready', Action_count: temp_ary.Action_count, Energy:3, position: {oldX:50,oldY:150,newX:0,newY:0}};
    object.cpu.push(result);
  },
  CreateCPUPlayer2 : function(){
    var obj = object;
    var temp_obj;
    for (var i = 0; i < obj.Level*3; i++) {
      temp_obj = {Action: 'ready', Energy:3, position: {oldX:0,oldY:0,newX:0,newY:0},speed:0,shoot:false,Life:true};
      temp_obj.Action_count = Math.floor(Math.random()*240);
      this.getCPUPosition(function(data){
        temp_obj.position.oldX = data.x;
        temp_obj.position.oldY = data.y;
      })
      object.cpu.push(temp_obj);
      if (temp_obj.Life) object.Live.cpu++;
    }
  },
  CreateSnowBall : function(x,y,team,power){
    var PowerLength = object.Power_reference_point*power;
    var temp_ball = {X:x, Y:y, Power:power, Team : team, PowerLength:PowerLength, error_range: 0}
    team == 'cpu' ? temp_ball.degree = 30 : temp_ball.degree = 210;
    object.SnowBall.push(temp_ball);
    // console.log(temp_ball);
  },
  CheckCPUCreatePosition : function(){

  },
  CPUAction : function(){
    var aaa = 4;
    for (var i = 0; i < object.cpu.length; i++) {
      if (object.cpu[i].Life) {
        if (object.cpu[i].Action == 'ready') {
          if (object.cpu[i].Action_count >= 0 && object.cpu[i].Action_count < aaa) {
            this.ActionAnimation(0,131,i,'cpu');
          }
          if (object.cpu[i].Action_count >= aaa && object.cpu[i].Action_count < aaa*2) {
            this.ActionAnimation(0,192,i,'cpu');
          }
          if (object.cpu[i].Action_count >= 7) object.cpu[i].Action_count = 0;
        }
        if (object.cpu[i].Action == 'move') {
          var act_num = Math.floor(object.cpu[i].Action_count/4);
          act_num%2 == 0 ? act_num = 1 : act_num = 2;
          if (act_num == 1) {
            this.ActionAnimation(0,256,i,'cpu');
          }else{
            this.ActionAnimation(0,320,i,'cpu');
          }
          this.CPUMove(i);
        }
        if (object.cpu[i].Action == "attack") {
          if (object.cpu[i].Action_count <= 200) {
            var act_num = Math.floor(object.cpu[i].Action_count/2);
            act_num%2 == 0 ? act_num = 1 : act_num = 2;
              if (act_num == 1) {
                this.ActionAnimation(0,131,i,'cpu');
              }else{
                this.ActionAnimation(0,192,i,'cpu');
              }
          }else{
            if (object.cpu[i].Action_count > 200 && object.cpu[i].Action_count < 240) {
              this.ActionAnimation(0,0,i,'cpu');
            }
            if (object.cpu[i].Action_count >= 240 && object.cpu[i].Action_count < 280) {
              this.ActionAnimation(0,64,i,'cpu');
              if (object.cpu[i].shoot) {
                this.CreateSnowBall(object.cpu[i].position.oldX+32,object.cpu[i].position.oldY+32,'cpu',8);
                object.cpu[i].shoot = false;
              }
            }
            if (object.cpu[i].Action_count >= 279) {
              object.cpu[i].Action_count = 0;
              object.cpu[i].Action = 'ready';
            }
          }
        }
        if (object.cpu[i].Action == "damaged") {
          this.ActionAnimation(10,384,i,'cpu');
          if (object.cpu[i].Action_count > 60) {
            object.cpu[i].Action_count = 0;
            object.cpu[i].Action = 'ready';
          }  
        }
        object.cpu[i].Action_count++;
      }else{
        this.context.drawImage(Game.prototype.img.dead, 0, 64, 64, 64, object.cpu[i].position.oldX, object.cpu[i].position.oldY, 64, 64);
      }
    }
  },
  CPUMove : function(o_num){
    var obj = object;
    obj.cpu[o_num].radians = obj.cpu[o_num].degree * Math.PI/180; 
    if (0 < obj.cpu[o_num].move_limit) {
      obj.cpu[o_num].move_limit -= obj.cpu[o_num].speed;
      obj.cpu[o_num].position.oldX += Math.cos(obj.cpu[o_num].radians)*obj.cpu[o_num].speed;
      obj.cpu[o_num].position.oldY += Math.sin(obj.cpu[o_num].radians)*obj.cpu[o_num].speed;
    }else{
      obj.cpu[o_num].Action = 'ready';
      obj.cpu[o_num].Action_count = 0;
    }
  },
  SelectCPUAction : function(){
    var cpu_x,cpu_y;
    for (var i = 0; i < object.cpu.length; i++) {
      if (object.cpu[i].Life) {
        if (object.cpu[i].Action == "ready") {
          if (generateRandom(1,100) < 6) {
            ori_x = object.cpu[i].X;
            ori_y = object.cpu[i].Y;

            this.getCPUPosition(function(data){
              object.cpu[i].position.newX = data.x;
              object.cpu[i].position.newY = data.y;
            })

            object.cpu[i].degree = Math.atan2(object.cpu[i].position.newY-object.cpu[i].position.oldY,object.cpu[i].position.newX-object.cpu[i].position.oldX)*180/Math.PI;
            object.cpu[i].move_limit = this.getLineLength(object.cpu[i].position.oldX,object.cpu[i].position.oldY, object.cpu[i].position.newX, object.cpu[i].position.newY);
            object.cpu[i].speed = generateRandom(2,5);
            object.cpu[i].Action = "move";
          }else if(generateRandom(3,100) < 10 && object.Control){
            object.cpu[i].Action = "attack";
            object.cpu[i].shoot = true;
          }
        }
      }
    }
  },
  PlayerAction : function(){

  },
  MoveSnowBall : function(){
    var obj = object;
    for (var i = 0; i < obj.SnowBall.length; i++) {
      var snowball_radian = obj.SnowBall[i].degree*Math.PI/180;

      this.context.drawImage(Game.prototype.img.snowball, 0, 0, 20, 20, obj.SnowBall[i].X-20, obj.SnowBall[i].Y+obj.SnowBall[i].error_range-32, 20, 20);
      this.context.drawImage(Game.prototype.img.snowball, 0, 30, 20, 20, obj.SnowBall[i].X-20, obj.SnowBall[i].Y, 20, 20);
      
      if (obj.SnowBall[i].Power < 8) {
        obj.SnowBall[i].PowerLength -= 10;
        if (obj.SnowBall[i].PowerLength < 0) obj.SnowBall.splice(i,1);
      }

      if (obj.SnowBall[i]) {
        obj.SnowBall[i].X += Math.cos(snowball_radian)*10;
        obj.SnowBall[i].Y += Math.sin(snowball_radian)*10;
        if (obj.SnowBall[i].Power < 8 && obj.SnowBall[i].PowerLength < 160) {
          obj.SnowBall[i].X -= Math.cos(snowball_radian)*1;
          obj.SnowBall[i].degree -= 3;
          obj.SnowBall[i].error_range += 1.5;
        }

        for (var b = 0; b < obj.cpu.length; b++) {
          if (obj.SnowBall[i].Team == "player" && obj.cpu[b].Life && obj.cpu[b].position.oldX+64 > obj.SnowBall[i].X && obj.cpu[b].position.oldX < obj.SnowBall[i].X && obj.cpu[b].position.oldY+64 > obj.SnowBall[i].Y && obj.cpu[b].position.oldY < obj.SnowBall[i].Y) {
            obj.SnowBall.splice(i,1);
            obj.cpu[b].Energy--;
            obj.cpu[b].Action = "damaged";
            obj.cpu[b].Action_count = 0;
            if (obj.cpu[b].Energy == 0 && obj.cpu[b].Life) {
              obj.cpu[b].Life = false;
              obj.Live.cpu--;
            }
            break;
          }
        }
      }
      if (obj.SnowBall[i]) {
        for (var c = 0; c < obj.Snowman.length; c++) {
          if (obj.SnowBall[i].Team == "cpu" && obj.Snowman[c].Life && obj.SnowBall[i].X >= obj.Snowman[c].X && obj.SnowBall[i].Y >= obj.Snowman[c].Y && obj.SnowBall[i].X <= obj.Snowman[c].X+64 && obj.SnowBall[i].Y <= obj.Snowman[c].Y+64) {
            obj.SnowBall.splice(i,1);
            obj.Snowman[c].Energy--;
            obj.Snowman[c].Action = "damaged";
            obj.Snowman[c].Move = false;
            obj.Snowman[c].Action_count = 0;
            if (obj.PlayerNumber == c) {
              obj.PlayerNumber = 99;
              obj.Energybar = false;
            }
            if (obj.Snowman[c].Energy == 0 && obj.Snowman[c].Life) {
              obj.Snowman[c].Life = false;
              obj.Live.Snowman--;
            }
            break;
          }
        }
      }
      if (obj.SnowBall[i]) {
        if (obj.SnowBall[i].X < 0 || obj.SnowBall[i].X > this.canvas.width || obj.SnowBall[i].Y < 0 || obj.SnowBall[i].Y > this.canvas.heiht) {
          obj.SnowBall.splice(i,1);
        }
      }
    }
  },
  Limit_X : function(y){
    return Math.floor((Game.prototype.move_limit*object.screen_tan+(this.canvas.height-y))/object.screen_tan);
  },
  Limit_Y : function(x,y){
    var line_length = Math.floor(this.getLineLength(this.Limit_X(y),y,x,y));
    return Math.floor(y-line_length*Math.tan(object.screen_radian));
    // return (Game.prototype.move_limit*object.screen_tan+(this.canvas.width-x))/object.screen_tan;
  },
  getLineLength : function(x1, y1, x2, y2) {
    var temp_width = Math.abs(x1-x2),
    temp_height = Math.abs(y1-y2);
    lineLength = Math.sqrt(Math.pow(temp_width, 2)+Math.pow(temp_height, 2));
    return lineLength;
  },
  getCPUPosition : function(callback){
    var temp_obj = {}
    temp_obj.y = generateRandom(0,this.canvas.height-(Game.prototype.move_limit*1));
    temp_obj.x = generateRandom(0,this.Limit_X(temp_obj.y)-(Game.prototype.move_limit*1));
    if (!object.target) {
      if (generateRandom(1,2) == 2) {
        object.target2.a = {X:20, Y:20};
        object.target2.b = {X:40, Y:20};
        object.target2.c = {X:60, Y:20};
        object.target = true;
        //console.log('target');
      }
    }
    
    callback(temp_obj);
  },
  ActionAnimation : function(x,y,i,player){
    var drawX,drawY;
    if (player == 'cpu') {
      drawX = object.cpu[i].position.oldX;
      drawY = object.cpu[i].position.oldY;
    }else{
      drawX = object.Snowman[i].X;
      drawY = object.Snowman[i].Y;
    }
    this.context.drawImage(Game.prototype.img.snowman, x, y, 64, 64, drawX, drawY, 64, 64);
    
  },
  Energybar : function(){
    if (object.Energybar) {
      var energeY = (object.Energybar-1)*64;
      var barX = object.Snowman[object.PlayerNumber].X+50;
      var barY = object.Snowman[object.PlayerNumber].Y;
      var width = 8*object.Energybar;
      ismobile ? this.context.drawImage(Game.prototype.img.energybar, 0, 0, width, 64, barX-50, barY-100, width, 64) : this.context.drawImage(Game.prototype.img.snowman, 128, energeY, 64, 64, barX, barY, 64, 64);
      if (this.Delay(10)) {
        object.Energybar++;
        if (object.Energybar > 8) object.Energybar = 8;
      }
      object.Energybar_count++;
    }
  },
  Delay : function(d){
    var act_num = Math.floor(object.running/1);
    // var act_num = Math.floor(object.Energybar_count/1);
      act_num%d == 0 ? act_num = true : act_num = false;
      return act_num;
  },
  StopCount : function(iden){
    var Stop_count;
    iden == "cpu" ? Stop_count = 300 : Stop_count = 50;
    return Stop_count;
  },
  TEST : function(){
    var player = Game.prototype.img.player_snowman;

    this.context.fillStyle = "red";
    this.context.font = "bold 40px _sans";
    this.context.textAlign = "center";

    this.context.beginPath();
    this.context.arc(object.a.x, object.a.y, 6, 0, Math.PI*2, true);
    // this.context.arc(object.b.x, object.b.y, 4, 0, Math.PI*2, true);
    this.context.closePath();
    this.context.fill();
    object.a.x += Math.cos(object.screen_radian)*5;
    object.a.y -= Math.sin(object.screen_radian)*5;
    object.b.x += Math.cos(object.screen_radian)*5;
    object.b.y -= Math.sin(object.screen_radian)*5;

    // console.log("X: "+object.a.x+"|Y: "+object.a.y);

    var c_radian = 30*Math.PI/180;
    this.context.beginPath();
    this.context.arc(object.c.x, object.c.y, 4, 0, Math.PI*2, true);
    this.context.closePath();
    this.context.fill();
    object.c.x -= Math.cos(c_radian)*10;
    object.c.y -= Math.sin(c_radian)*10;

    if (object.a.y > this.canvas.height || object.a.x > this.canvas.width || object.a.y < 0) {
      object.a.y = this.canvas.height;
      object.a.x = Game.prototype.move_limit;
    }
    if (object.b.y > this.canvas.height || object.b.x > this.canvas.width || object.b.y < 0) {
      object.b.y = this.canvas.height-Game.prototype.move_limit;
      object.b.x = 0;
    }
    if (object.c.y > this.canvas.height || object.c.x > this.canvas.width || object.c.y < 0 || object.c.x < 0) {
      object.c.y = object.Snowman[0].Y;
      object.c.x = object.Snowman[0].X;
    }

    this.context.fillStyle = "white";
  },
  LineView : function(){
    if (object.target) {
      if (this.Delay(1)) {
        this.context.fillStyle = "red";
        this.context.beginPath();
        this.context.arc(object.target2.a.X, object.target2.a.Y, 6, 0, Math.PI*2, true);
        this.context.arc(object.target2.b.X, object.target2.b.Y, 6, 0, Math.PI*2, true);
        this.context.closePath();
        this.context.fill();

        this.context.beginPath();
        this.context.arc(object.target2.c.X, object.target2.c.Y, 6, 0, Math.PI*2, true);
        this.context.closePath();
        this.context.fill();
        this.context.beginPath();
        this.context.moveTo(object.target2.a.X,object.target2.a.Y);
        this.context.lineTo(object.Snowman[0].X,object.Snowman[0].Y);
        this.context.lineTo(object.Snowman[0].X,object.target2.b.Y);
        this.context.closePath();
        this.context.stroke();

        this.context.globalAlpha = "0.3";
        this.context.beginPath();
        this.context.moveTo(0,object.target2.a.Y);
        this.context.lineTo(object.Snowman[0].X,object.Snowman[0].Y);
        this.context.closePath();
        this.context.stroke();

        this.context.globalAlpha = "1.0";
        this.context.beginPath();
        this.context.moveTo(Game.prototype.move_limit,this.canvas.height);
        this.context.lineTo(this.canvas.width,Game.prototype.move_limit);
        this.context.closePath();
        this.context.stroke();

        //cpu 위치
        var temp_line = Math.abs(object.Snowman[0].X/Math.cos(207.2*Math.PI/180));
        // console.log(Math.floor(temp_line*Math.tan(object.screen_radian)));

        this.context.beginPath();
        this.context.moveTo(object.Snowman[0].X,object.Snowman[0].Y);
        this.context.lineTo(0,object.Snowman[0].Y-Math.floor(temp_line*Math.tan(207.2*Math.PI/180)));
        this.context.closePath();
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.font = "bold 20px _sans";
        this.context.fillText("a("+object.target2.a.X+","+object.target2.a.Y+")", object.target2.a.X+30, object.target2.a.Y+30);
        this.context.fillText("("+(object.Snowman[0].X+32)+","+object.Snowman[0].Y+")", object.Snowman[0].X+50, object.Snowman[0].Y-5);
        this.context.fillText(object.screen_degree,100,100);
        this.context.fillText("b("+object.target2.b.X+","+object.target2.b.Y+")", object.target2.b.X+30, object.target2.b.Y+30);

        var test_line_length = Math.floor(this.getLineLength(object.target2.a.X,object.target2.a.Y,object.Snowman[0].X,object.Snowman[0].Y));
        this.context.fillText(test_line_length+"px", object.target2.a.X+test_line_length/2, object.target2.a.Y+30);
        this.context.fillText(Math.floor(test_line_length/Math.cos(object.screen_radian))+"px", object.target2.a.X+test_line_length/2, object.target2.a.Y-100);

        object.target2.a.X = this.Limit_X(object.Snowman[0].Y);
        object.target2.a.Y = object.Snowman[0].Y;
        object.target2.b.X = object.Snowman[0].X;
        object.target2.b.Y = this.Limit_Y(object.Snowman[0].X,object.Snowman[0].Y);

        if (object.target2.a.X > object.Snowman[0].X) {
          object.target2.a.X = object.Snowman[0].X;
          object.target2.a.Y = this.Limit_Y(object.Snowman[0].X,object.Snowman[0].Y);
          object.target2.b.X = object.Snowman[0].X;
        }

        object.target2.lineLength = Math.floor(this.getLineLength(object.target2.a.X,object.target2.a.Y,object.target2.b.X,object.target2.b.Y));
      }
    }
  }
}

var generateRandom = function (min, max) {
  var ranNum = Math.floor(Math.random()*(max-min+1))+min;
  return ranNum;
}

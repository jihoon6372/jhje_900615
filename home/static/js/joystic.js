document.getElementsByName('sensitivity')[0].onchange = function(){
  localStorage.joystic_sensitivity = this.value;
  document.getElementById('view_sensitivity').innerHTML = this.value;
  joystic.Sensitivity = this.value;
}

var move = {
  default : {
    X : joystic.Left+joystic.Width/2,
    Y : joystic.Top+joystic.Height/2
  },
  move_coordinate : function(e,callback){
    var moveX = e.targetTouches[0].pageX-this.default.X;
    var moveY = e.targetTouches[0].pageY-this.default.Y;
    Math.abs(moveX) > joystic.Width/2 ? joystic.X = Math.sign(moveX)*(joystic.Width/2) : joystic.X = moveX;
    Math.abs(moveY) > joystic.Height/2 ? joystic.Y = Math.sign(moveY)*(joystic.Height/2) : joystic.Y = moveY;  
    this.joystic_move(joystic.X, 1*(-(joystic.Y)));
    callback({
      X : joystic.X,
      Y : joystic.Y
    });
  },
  joystic_move : function(x,y){
    $("."+joystic.J_class).css('left', x);
    $("."+joystic.J_class).css('bottom', y);
  },
  aeroMove : function(x,y){
    var temp_speed;
    this.moveStop();
    if (x > 5){
      object.keyPressOn["39"] = true;  //right
      // temp_speed = playerUnit.default_speed+x/10;
      temp_speed = x*(object.max_speed/((joystic.Width/2)-joystic.Sensitivity));
      temp_speed > object.max_speed ? object.speed.x = object.max_speed : object.speed.x = temp_speed;
    } 
    if (x < -5){
      object.keyPressOn["37"] = true;  //left
      // temp_speed = playerUnit.default_speed-x/10;
      temp_speed = -x*(object.max_speed/((joystic.Width/2)-joystic.Sensitivity));
      temp_speed > object.max_speed ? object.speed.x = object.max_speed : object.speed.x = temp_speed;
    } 
    if (y > 5){
      object.keyPressOn["40"] = true;  //down
      // temp_speed = playerUnit.default_speed+y/10;
      temp_speed = y*(object.max_speed/((joystic.Height/2)-joystic.Sensitivity));
      temp_speed > object.max_speed ? object.speed.y = object.max_speed : object.speed.y = temp_speed;
    }
    if (y < -5){
      object.keyPressOn["38"] = true;  //up
      // temp_speed = playerUnit.default_speed-y/10;
      temp_speed = -y*(object.max_speed/((joystic.Height/2)-joystic.Sensitivity));
      temp_speed > object.max_speed ? object.speed.y = object.max_speed : object.speed.y = temp_speed;
    }

    if (object.speed.x < 1) object.speed.x = 1;
    if (object.speed.y < 1) object.speed.y = 1;
    console.log("X:"+object.speed.x+"| Y:"+object.speed.y);
  },
  moveStop : function(){
    for (var i = 37; i <= 40; i++) {
      object.keyPressOn[i] = false;
    }
  }
}

$('.'+joystic.J_class).bind('touchstart',function(event){ 
    event.preventDefault(); 
    var e = event.originalEvent;
    move.move_coordinate(e,function(data){});
    object['touch'] = true;
});
$('.'+joystic.J_class).bind('touchmove', function(event){ 
    event.preventDefault();
    var e = event.originalEvent;
    move.move_coordinate(e, function(data){
      move.aeroMove(data.X, data.Y);
    });
});
$('.'+joystic.J_class).bind('touchend', function(event){
  event.preventDefault();
  var e = event.originalEvent;
  move.joystic_move(0,0);
  object['touch'] = false;
  move.moveStop();
})

$("input[name=sensitivity]").bind('touchmove', function(event){
  document.getElementById('view_sensitivity').innerHTML = this.value;
})
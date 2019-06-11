var player;
var enemies;
var cursors;
var timer;
var alive = true;
canvas_width = window.innerWidth * window.devicePixelRatio;
canvas_height = window.innerHeight * window.devicePixelRatio;
const game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, 'main');
game.global = {
  food: 0,
  food: 1
}
var RemotePlayer = function (index, username, game, player, startX, startY, startAngle, role, startsize, startkomnata) {
  this.x = startX
  this.y = startY
  this.angle = startAngle
  this.username = username
  this.game = game
  this.player = player
  this.size = startsize
  this.komnata = startkomnata
  this.alive = true
  if (role === "fish") {
    this.player = game.add.sprite(this.x, this.y, 'fish')
  } else if (role === "shark") {
    this.player = game.add.sprite(this.x, this.y, 'shark')
  }
  this.player.anchor.setTo(0.5, 0.5)
  this.player.name = index.toString()
  game.physics.arcade.enable(this.player)
  this.player.body.collideWorldBounds = true
  this.player.angle = this.angle
  this.style = { font: "14px Arial", fill: "white", align: "center" };
  this.playertext = game.add.text(-30, 0, this.username, style);
  this.playertext.angle = 90;
  this.playertext.name = "playertext";
  this.playertext.anchor.set(0.5);
  this.player.addChild(this.playertext);
  this.player.animations.add('right', [0], true);
}

var playState = {
  preload: function () {
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    game.load.image('background', 'assets/spacebackground.jpg');
    game.load.spritesheet('fish', 'assets/survivX.png', 35, 43);
    game.load.spritesheet('shark', 'assets/monsterX.png', 33, 43);
    game.load.image('food', 'assets/trap.png', 32, 32);
    game.load.image('surp', 'assets/surp.png', 32, 32);
    game.load.spritesheet('blood', 'assets/blood.png', 128, 128);
    game.load.image('co', 'map/co.png');
    game.load.image('planet1', 'map/planet1.png');
    game.load.image('planet2', 'map/planet2.png');
    game.load.image('ship', 'map/ship.png');
    game.load.image('WarMachines', 'map/WarMachines.png');
    game.load.tilemap('map', 'map/map2.json', null, Phaser.Tilemap.TILED_JSON);
  },

  create: function () {
    console.log(roomId)
    game.physics.startSystem(Phaser.Physics.ARCADE);
    speedtrap = false;
    speedupsharkx2 = false;
    speeduppp = false;
    speedupfish = false;
    bullet_array = [];
    item_lst = [];
    enemies = [];
    game.add.image(0, 0, 'background');
    game.add.image(1024, 0, 'background');
    game.add.image(0, 1024, 'background');
    game.add.image(1024, 1024, 'background');
    game.world.setBounds(0, 0, 2016, 2016);
    map = game.add.tilemap('map');
    map.addTilesetImage('co');
    // map.addTilesetImage('ship');
    map.addTilesetImage('planet1');
    map.addTilesetImage('planet2');
    map.addTilesetImage('WarMachines');
    layer = map.createLayer('Tile Layer 1');
    // layer.alpha = 0.5;
    layer.resizeWorld();
    map.setCollision(385);
    var layer2 = map.createLayer('Tile Layer 2');
    var layer3 = map.createLayer('Tile Layer 3');
    var layer4 = map.createLayer('Tile Layer 4');
    game.renderer.renderSession.roundPixels = true;
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.stage.disableVisibilityChange = true;
    game.global.food = 0;
    game.global.food1 = 0;
    let spawn_locations = [
      { x: 1400, y: 720 },
      { x: 407, y: 492 },
      { x: 402, y: 733 },
      { x: 576, y: 1080 },
      { x: 1066, y: 1236 },
      { x: 915, y: 826 },
      { x: 614, y: 1508 },
      { x: 1006, y: 1758 },
      { x: 1411, y: 1804 },
      { x: 1520, y: 1573 },
      { x: 1332, y: 909 },
      { x: 1000, y: 630 }
    ];
    let num = Math.floor(Math.random() * 12);
    var startX = spawn_locations[num].x
    var startY = spawn_locations[num].y
    if (currentPlayer.role === "fish") {
      player = game.add.sprite(startX, startY, 'fish');
    } else {
      player = game.add.sprite(startX, startY, 'shark');
      socket.emit('display game timer', { timer: 180, room_id: roomId });
    }
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5, 0.5);
    player.body.collideWorldBounds = true;
    game.camera.follow(player);
    cursors = game.input.keyboard.createCursorKeys();
    setEventHandlers();
    const timerBg = game.add.graphics(0, 0);
    timerBg.beginFill(0x50E3C2, 1);
    timerBg.drawCircle(70, 70, 80);
    timer = game.add.text(72, 73, '180s', { font: "24px Arial", fill: "#ffffff", align: "center" });
    timer.anchor.setTo(0.5, 0.5);
    timerBg.fixedToCamera = true;
    timer.fixedToCamera = true;
    game.username = uzern;
    socket.emit('new player', { x: player.x, y: player.y, angle: player.angle, role: currentPlayer.role, room_id: roomId, username: game.username, size: 0, komnata: roomId });
    style = { font: "14px Arial", fill: "white", align: "center" };
    playertext = game.add.text(-30, 00, game.username, style);
    playertext.angle = 90
    playertext.name = "playertext";
    playertext.anchor.set(0.5);
    player.addChild(playertext);
    item_lst.push(playertext);
    FKey = game.input.keyboard.addKey(Phaser.KeyCode.F);
    QKey = game.input.keyboard.addKey(Phaser.KeyCode.Q);
    if (currentPlayer.role === "fish") {
      const timerBg1 = game.add.graphics(0, 0);
      const timerBg2 = game.add.sprite(70.5, 143, 'food');
      timerBg2.anchor.setTo(0.5, 0.5);
      timerBg2.scale.setTo(0.8, 0.8)
      timerBg1.beginFill(0x50E3C2, 1);
      timerBg1.drawCircle(70, 150, 45);
      foodLabel = game.add.text(70.7, 166, game.global.food, { font: "17px Arial", fill: "#ffffff", align: "center" });
      foodLabel.anchor.setTo(0.5, 0.5);
      timerBg1.fixedToCamera = true;
      timerBg2.fixedToCamera = true;
      foodLabel.fixedToCamera = true;
    }
  },

  update: function () {
    game.physics.arcade.collide(player, layer);
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].alive) {
        if (currentPlayer.role === "shark") {
          if (FKey.isDown) {
            if ((game.physics.arcade.distanceBetween(enemies[i].player, player)) <= 80) {
              game.physics.arcade.overlap(player, enemies[i].player, this.eatFish);
            }
          }
          if ((game.physics.arcade.distanceBetween(food, player)) <= 80) {
            game.physics.arcade.overlap(player, food, this.eatFood);
          }
          if ((game.physics.arcade.distanceBetween(food1, player)) <= 80) {
            game.physics.arcade.overlap(player, food1, this.eatFood1);
          }
        }
        else {
          if ((game.physics.arcade.distanceBetween(food, player)) <= 80) {
            game.physics.arcade.overlap(player, food, this.eatFood);
          }
          if ((game.physics.arcade.distanceBetween(food1, player)) <= 80) {
            game.physics.arcade.overlap(player, food1, this.eatFood1);
          }
          if (QKey.isDown && !this.shot) {
            this.shot = true;
            socket.emit('shoot-bullet', { id: socket.id, room_id: roomId, x: player.x, y: player.y });
          }
          if (!QKey.isDown) {
            this.shot = false;
          }
        }
      }
    }
    if (currentPlayer.role === "shark") {
      for (var i = 0; i < bullet_array.length; i++) {
        bullet_array[i].update();
        if ((game.physics.arcade.distanceBetween(bullet_array[i], player)) <= 80) {
          game.physics.arcade.overlap(player, bullet_array[i], this.eatBullet);
        }
      }
    }
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.body.angularVelocity = 0
    player.animations.play('right');
    if (currentPlayer.role === "fish") {
      if(speedupfish){
        playerMove(30);
      }else if(!speedupfish){
        playerMove(125);
      }
    } else {
      if (!speedtrap && !speeduppp && !speedupsharkx2) {
        playerMove(120);//скорость монстра
      } else if (speeduppp && !speedtrap && !speedupsharkx2) {
        playerMove(155);
      } else if(speedupsharkx2 && !speeduppp && !speedtrap){
        playerMove(205);
      }else if(!speedupsharkx2 && !speeduppp && speedtrap){
        playerMove(0);
      }else{
        playerMove(120)
      }
    }
    socket.emit('move player', { x: player.body.x, y: player.body.y, angle: player.angle, room_id: roomId });
    if (currentPlayer.role === "fish") {
      foodLabel.text = game.global.food;
    }
    for (var i = 0; i < enemies.length; i++) {
      var p = enemies[i];
       if (p.player.xx != undefined) {
        p.player.body.x += (p.player.xx - p.player.body.x) * 0.16;
        p.player.body.y += (p.player.yy - p.player.body.y)* 0.16;
       }
    }
  },
  // render: function () {
  //   game.debug.spriteCoords(player, 150, 50);
  // },
  eatFish: function (player, enemy) {
    enemy.kill();
    socket.emit('kill player', { id: enemy.name, room_id: roomId });
    add_blood(player.body.x, player.body.y);
    socket.emit('nevedimka', { id: socket.id, room_id: roomId });
  },
  eatFood: function (player, food) {
    if (currentPlayer.role === "shark") {
      food.destroy();
      sharkis = true;
      speeduppp = true;
      socket.emit('updateFood', { id: socket.id, room_id: roomId, shark: sharkis });
    }
    else {
      food.destroy();
      game.global.food = game.global.food + 1;
      var foodik = game.global.food;
      socket.emit('updateFood', { id: socket.id, room_id: roomId, food: foodik });
    }
  },
  eatFood1: function (player, food1) {
    if (currentPlayer.role === "shark") {
      food1.destroy();
      sharkis1 = true;
      speedupsharkx2 = true;
      socket.emit('updateFood1', { id: socket.id, room_id: roomId, shark: sharkis1 });
    }
    else {
      food1.destroy();
      fishis = true;
      speedupfish = true;
      socket.emit('updateFood1', { id: socket.id, room_id: roomId, fish: fishis});
    }
  },
  eatBullet: function (player, bullet) {
    socket.emit('updateTrap', { id: socket.id, room_id: roomId, x: bullet.x, y: bullet.y });
    speedtrap = true;
    bullet.destroy();
  }
}

function fadePicture(idplyera) {
  if (idplyera == socket.id) {
    player.alpha = 0.3; //я вижу себя чуть-чуть
  }
  else {
    var removePlayer = playerById(idplyera);
    if (!removePlayer) {
      return;
    }
    removePlayer.player.alpha = 0.02;//меня видят таким противники 0.02
  }
}

function fadePicture1(idplyera) {
  if (idplyera == socket.id) {
    player.alpha = 1;
  }
  else {
    var removePlayer = playerById(idplyera);
    if (!removePlayer) {
      return;
    }
    removePlayer.player.alpha = 1;
  }
}

function minusScore(myid) {
  if (myid == socket.id) { game.global.food = game.global.food - 1 }
}

function minusScore1(myid) {
  if (myid == socket.id) { game.global.food1 = game.global.food1 - 1 }
}

function add_blood(x, y) {
  var blood = game.add.sprite(x, y, 'blood');
  blood.anchor.setTo(0.5, 0.5);
  var blood_anim = blood.animations.add('splat');
  blood.animations.play('splat', 20, false);
  blood_anim.onComplete.add(function () { blood.destroy(true, false) }, this);
}

function playerMove(speed) {
  if (cursors.left.isDown) {
    player.body.angularVelocity = -speed
  } else if (cursors.right.isDown) {
    player.body.angularVelocity = speed
  }
  if (cursors.up.isDown) {
    player.animations.add('right', [1], true);
    player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, speed));
  }
  else{
    player.animations.add('right', [0], true);
  }
}

var setEventHandlers = function () {
  socket.on('disconnect', onSocketDisconnect);
  socket.on('new player', onNewPlayer);
  socket.on('move player', onMovePlayer);
  socket.on('remove player', onRemovePlayer);
  socket.on('kill player', onKillPlayer);
  socket.on('display game timer', onDisplayGameTimer);
  socket.on('time up', onTimeUp);
  socket.on('game over', onAllFishesDied);
  socket.on("foodPosition", createFoodBar);
  socket.emit("findHealth", roomId);
  socket.on("foodPosition1", createFoodBar1);
  socket.emit("findHealth1", roomId);
  socket.on("skritnost", fadePicture);
  socket.on("skritnost1", fadePicture1);
  socket.on('newtrap', onNewTrap);
  socket.on('minusscore', minusScore);
  socket.on('deleteTrap', DeleteTrap);
  socket.on('speedtrue', speedtrue);
  socket.on('speedupp', speedupp);
  socket.on('speedupp1', speedupp1);
  socket.on('speedupfish', speedupfish1);
  socket.on('sharkdisconnect', sharkdisconnect);
}
function onSocketDisconnect() {
  console.log('Disconnected from socket server');
}

function speedtrue() {
  speedtrap = false;
}

function speedupp() {
  speeduppp = false;
}

function speedupp1() {
  speedupsharkx2 = false;
}

function speedupfish1() {
  speedupfish = false;
}


function DeleteTrap(xx, yy) {
  for (var i = 0; i < bullet_array.length; i++) {
    console.log(bullet_array[i].x)
    if (bullet_array[i].x == xx && bullet_array[i].y == yy) {
      bullet_array[i].destroy();
      bullet_array.splice(i, 1);
      i--;
    }
  }
}

function onNewTrap(xx, yy) {
  bullet = game.add.sprite(xx, yy, 'food');
  bullet.anchor.setTo(0.5, 0.5);
  game.physics.enable(bullet, Phaser.Physics.ARCADE);
  bullet_array.push(bullet);
}

function onNewPlayer(data) {
  var duplicate = playerById(data.id);
  if (duplicate) {
    return
  }
  var new_enemy = new RemotePlayer(data.id, data.username, game, player, data.x, data.y, data.angle, data.role, data.size, data.komnata)
  enemies.push(new_enemy);
}

function createFoodBar(coords) {
  if (this.foodBar) {
    food.destroy();
    this.foodBar = false;
  }
  this.foodBar = true;
  food = game.add.sprite(coords.x, coords.y, 'surp');
  food.anchor.setTo(0.5, 0.5);
  game.physics.enable(food, Phaser.Physics.ARCADE);
}

function createFoodBar1(coords) {
  if (this.foodBar1) {
    food1.destroy();
    this.foodBar1 = false;
  }
  this.foodBar1 = true;
  food1 = game.add.sprite(coords.x, coords.y, 'surp');
  food1.anchor.setTo(0.5, 0.5);
  game.physics.enable(food1, Phaser.Physics.ARCADE);
}

function onMovePlayer(data) {
  var movePlayer = playerById(data.id);
  if (!movePlayer) {
    return
  }
  movePlayer.player.body.x = data.x;
  movePlayer.player.body.y = data.y;
  movePlayer.player.angle = data.angle;
  if (socket.id != data.id){
    var enemyPlayer = playerById(data.id);
    enemyPlayer.player.xx = data.x;
    enemyPlayer.player.yy = data.y;
    enemyPlayer.anglee = data.angle;
  }
}

function onRemovePlayer(data) {
  var removePlayer = playerById(data.id);
  if (!removePlayer) {
    return
  }
  removePlayer.player.kill();
  enemies.splice(enemies.indexOf(removePlayer), 1);
}

function onKillPlayer(data) {
  var removePlayer = playerById(data.id);
  if (!removePlayer) {
    player.kill();
  } else {
    add_blood(removePlayer.player.body.x, removePlayer.player.body.y);
    removePlayer.player.kill()
    enemies.splice(enemies.indexOf(removePlayer), 1);
  }
  if (data.id == socket.id) {
    alive = false;
    loadLostScreen();
  }
}

function onDisplayGameTimer(count) {
  timer.setText(count + "s");
}
function sharkdisconnect() {
  loadSharkScreen();
}

function onTimeUp() {
  if (currentPlayer.role === "fish") {
    loadWonScreen(); // выжившие win
  }
  else {
    loadLostScreen();// монстр lose
  }
}

function onAllFishesDied() {
  if (currentPlayer.role === "fish") {
    loadLostScreen();
  } else {
    loadWonScreen();
  }
}

function loadLostScreen() {
  $.ajax({
    url: 'template/lost.html'
  }).done(function (response) {
    if ($('#main').html() != response) {
      $('#main').empty();
      $('#main').html(response);
    }
  }).fail(function () {
    console.log("error");
  }).always(function () {
    console.log("complete");
  });
}

function loadWonScreen() {
  $.ajax({
    url: 'template/won.html'
  }).done(function (response) {
    if ($('#main').html() != response) {
      $('#main').empty();
      $('#main').html(response);
    }
  }).fail(function () {
    console.log("error");
  }).always(function () {
    console.log("complete");
  });
}

function loadSharkScreen() {
  $.ajax({
    url: 'template/sharkdisk.html'
  }).done(function (response) {
    if ($('#main').html() != response) {
      $('#main').empty();
      $('#main').html(response);
    }
  }).fail(function () {
    console.log("error");
  }).always(function () {
    console.log("complete");
  });
}

function playerById(id) {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].player.name === id) {
      return enemies[i];
    }
  }
  return false;
}
game.state.add('play', playState);
game.state.start('play');

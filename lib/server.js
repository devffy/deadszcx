const util = require('util');
const http = require('http');
const path = require('path');
const ecstatic = require('ecstatic');
const io = require('socket.io')();
const logger = require('tracer').colorConsole();
const port = process.env.PORT || 2000;

const server = http.createServer(ecstatic({ root: path.resolve(__dirname, '../public'), cache: 1 }))
  .listen({ port, exclusive: true });
io.listen(server, { secure: true });

var count; var count1; var count2; var count3; var count4; var count5;
var myInterval; var myInterval1; var myInterval2; var myInterval3; var myInterval4; var myInterval5;
var timerInterval; var room = 'room'; var roomCount = 0; var roomName;

let users = [];
let players = [];
let bullet_array = [];

const Player = require('./player');

var Bullets = function (startX, startY) {
  this.x = startX;
  this.y = startY;
}

io.sockets.on('connection', (client) => {
  console.log('New player has connected: ' + client.id);
  client.on('disconnect', onClientDisconnect);
  client.on('new player', onNewPlayer);
  client.on('move player', onMovePlayer);
  client.on('join game', function (data) {
    roomName = room + roomCount;
    client.join(roomName);
    io.in(roomName).emit('get roomid', roomCount);
    users.push(data);
    io.emit('display players', users);
    if (users.length == 2) { //поставить 3 перед релизом!
      onCountDown();
    }
  });
  client.on('get users', onGetUsers);
  client.on('kill player', onKillPlayer);
  client.on('display game timer', onDisplayGameTimer);
  client.on("findHealth", locateFood);
  client.on("findHealth1", locateFood1);
  client.on("updateFood", changeFood);
  client.on("updateFood1", changeFood1);
  client.on("nevedimka", nevedimkas);
  client.on('shoot-bullet', shootBullet);
  client.on("updateTrap", changeTrap);
  client.on("speedup", speedup);
})

function shootBullet(data) {
  var bulletPlayer = playerById(data.id);
  var roomId = data.room_id;
  var tmpName = room + roomId;
  if (bulletPlayer == false) {
    return;
  }
  if (!bullet_array[roomId]) {
    bullet_array[roomId] = [];
  }
  if (bulletPlayer.size > 0) {
    var newBullet = new Bullets(data.x, data.y);
    xx = data.x
    yy = data.y
    bullet_array[roomId].push(newBullet);
    io.in(tmpName).emit('newtrap', xx, yy)
    var myid = bulletPlayer.id;
    for (var i = 0; i < players[roomId].length; i++) {
      if (players[roomId][i].id == data.id) {
        players[roomId][i].size -= 1;
      }
      players[roomId].push();
    }
    io.in(tmpName).emit('minusscore', myid);
  }
}

function nevedimkas(data) {
  var plyer = playerById(data.id);
  var roomId = data.room_id;
  var tmpName = room + roomId;
  var idplyera = plyer.id
  onCountDown1(roomId, tmpName, idplyera, plyer);
  io.in(tmpName).emit("skritnost", idplyera);
}

let f_positions = [
  { x: 1470, y: 560 },
  { x: 1633, y: 567 },
  { x: 1680, y: 648 },
  { x: 1653, y: 747 },
  { x: 1540, y: 786 },
  { x: 1458, y: 1043 },
  { x: 1691, y: 1659 },
  { x: 1594, y: 1809 },
  { x: 1417, y: 1824 },
  { x: 955, y: 1116 },
  { x: 363, y: 1785 },
  { x: 601, y: 1835 }
];
let currentFood = { x: 0, y: 0 };
function locateFood(data) {
  var roomId = data;
  var tmpName = room + roomId;
  if (currentFood.x == 0 && currentFood.y == 0) {
    let f_num = Math.floor(Math.random() * 12);
    currentFood = { x: f_positions[f_num].x, y: f_positions[f_num].y };
    io.in(tmpName).emit("foodPosition", { x: currentFood.x, y: currentFood.y });
  }
  else {
    io.in(tmpName).emit("foodPosition", { x: currentFood.x, y: currentFood.y });
  }
}

let f_positions1 = [
  { x: 1470, y: 560 },
  { x: 1633, y: 567 },
  { x: 1680, y: 648 },
  { x: 1653, y: 747 },
  { x: 1540, y: 786 },
  { x: 1458, y: 1043 },
  { x: 1691, y: 1659 },
  { x: 1594, y: 1809 },
  { x: 1417, y: 1824 },
  { x: 955, y: 1116 },
  { x: 363, y: 1785 },
  { x: 601, y: 1835 }
];
let currentFood1 = { x: 0, y: 0 };
function locateFood1(data) {
  var roomId = data;
  var tmpName = room + roomId;
  if (currentFood1.x == 0 && currentFood1.y == 0) {
    let f_num1 = Math.floor(Math.random() * 12);
    currentFood1 = { x: f_positions1[f_num1].x, y: f_positions1[f_num1].y };
    io.in(tmpName).emit("foodPosition1", { x: currentFood1.x, y: currentFood1.y });
  }
  else {
    io.in(tmpName).emit("foodPosition1", { x: currentFood1.x, y: currentFood1.y });
  }
}

function changeTrap(data) {
  var plyer = playerById(data.id);
  var roomId = data.room_id;
  var tmpName = room + roomId;
  var idplyera = plyer.id
  xx = data.x;
  yy = data.y;
  for (var i = 0; i < bullet_array[roomId].length; i++) {
    if (bullet_array[roomId][i].x == data.x && bullet_array[roomId][i].y == data.y) {
      bullet_array[roomId].splice(i, 1);
      i--;
      io.emit('deleteTrap', xx, yy);
    }
  }


  onCountDown2(roomId, tmpName, idplyera, plyer);
}

function speedup(roomId, tmpName, idplyera, plyer) {
  count3 = 8;
  myInterval3 = setInterval(function () {
    if (count3 <= 0) {
      clearInterval(myInterval3);
      io.in(tmpName).emit("speedupp", idplyera);
    }
    count3--;
  }, 1000);
}

function speedup1(roomId, tmpName, idplyera, plyer) {
  count5 = 8;
  myInterval5 = setInterval(function () {
    if (count5 <= 0) {
      clearInterval(myInterval5);
      io.in(tmpName).emit("speedupp1", idplyera);
    }
    count5--;
  }, 1000);
}
function speedupfish(roomId, tmpName, idplyera, plyer) {
  count4 = 5;
  myInterval4 = setInterval(function () {
    if (count4 <= 0) {
      clearInterval(myInterval4);
      io.in(tmpName).emit("speedupfish", idplyera);
    }
    count4--;
  }, 1000);
}


function changeFood(data) {
  var plyer = playerById(data.id);
  var roomId = data.room_id;
  var tmpName = room + roomId;
  var idplyera = plyer.id
  var positions = f_positions1.slice();
  var index = positions.findIndex(element => element.x == currentFood.x && element.y == currentFood.y);
  positions.splice(positions.indexOf(index), 1);
  let f_num = Math.floor(Math.random() * 11);
  currentFood = { x: positions[f_num].x, y: positions[f_num].y };
  io.in(tmpName).emit("foodPosition", { x: currentFood.x, y: currentFood.y });
  for (var i = 0; i < players[roomId].length; i++) {
    if (players[roomId][i].id == data.id) {
      players[roomId][i].size = data.food;
    }
    players[roomId].push();
  }
  if (data.shark == true) {
    speedup(roomId, tmpName, idplyera, plyer);
  }
}

function changeFood1(data) {
  var plyer = playerById(data.id);
  var roomId = data.room_id;
  var tmpName = room + roomId;
  var idplyera = plyer.id
  var positions1 = f_positions.slice();
  var index1 = positions1.findIndex(element => element.x == currentFood1.x && element.y == currentFood1.y);
  positions1.splice(positions1.indexOf(index1), 1);
  let f_num1 = Math.floor(Math.random() * 11);
  currentFood1 = { x: positions1[f_num1].x, y: positions1[f_num1].y };
  io.in(tmpName).emit("foodPosition1", { x: currentFood1.x, y: currentFood1.y });
  if (data.shark == true) {
    speedup1(roomId, tmpName, idplyera, plyer);
  }
  if (data.fish == true) {
    speedupfish(roomId, tmpName, idplyera, plyer);
  }
}

function onCountDown() {
  count = 10; // изменить перед релизом
  myInterval = setInterval(function () {
    if (count <= 0) {
      clearInterval(myInterval);
      onAssignRole();
      roomCount++;
    }
    io.emit('display count down', count);
    count--;
  }, 1000);
}

//невидимость монстра 5 секунд
function onCountDown1(roomId, tmpName, idplyera, plyer) {
  count1 = 13;
  myInterval1 = setInterval(function () {
    if (count1 <= 0) {
      clearInterval(myInterval1);
      io.in(tmpName).emit("skritnost1", idplyera);
    }
    count1--;
  }, 1000);
}

function onCountDown2(roomId, tmpName, idplyera, plyer) {
  count2 = 3;
  myInterval2 = setInterval(function () {
    if (count2 <= 0) {
      clearInterval(myInterval2);
      io.in(tmpName).emit("speedtrue", idplyera);
    }
    count2--;
  }, 1000);
}

function onGetUsers() {
  io.emit('display players', users);
}

function onAssignRole() {
  var num = Math.floor(Math.random() * users.length);
  for (var i = 0; i < users.length; i++) {
    if (i == num) {
      users[i].role = "shark";
    }
  }
  io.in(roomName).emit('display role', users);

  users = [];
}

function onClientDisconnect(roomId) {
  console.log('Player has disconnected: ' + this.id);
  var removePlayer = playerById(this.id);
  var roomId = removePlayer.komnata;
  var tmpName = room + roomId;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === this.id) {
      users.splice(i, 1)
      this.broadcast.emit('display players', users)
    }
  }
  if (users.length < 2) {   //если игрок выходит, то счет отменяется //поставить 3 перед релизом!
    io.emit('hide count down');
    clearInterval(myInterval);
  }
  if (!removePlayer) {
    return
  }
  if (players[roomId]) {
    players[roomId].splice(players[roomId].indexOf(removePlayer), 1);
  }
  if (removePlayer.role == 'shark') {
    this.broadcast.to(tmpName).emit('sharkdisconnect');
  }
  if (players[roomId].length == 1 && removePlayer.role == 'fish') {
    this.broadcast.to(tmpName).emit('game over');
  }
  this.broadcast.to(tmpName).emit('remove player', { id: this.id });
}

function onNewPlayer(data) {
  var newPlayer = new Player(data.username, data.x, data.y, data.angle, data.role, data.size, data.komnata);
  newPlayer.id = this.id;
  newPlayer.username = data.username;
  newPlayer.size = data.size;
  newPlayer.role = data.role;
  newPlayer.komnata = data.komnata;
  var roomId = data.room_id;
  var tmpName = room + roomId;
  this.broadcast.to(tmpName).emit('new player', { id: newPlayer.id, x: newPlayer.x, y: newPlayer.y, angle: newPlayer.angle, role: newPlayer.role, size: newPlayer.size, komnata: newPlayer.komnata, username: newPlayer.username });
  if (!players[roomId]) {
    players[roomId] = [];
  }
  var existingPlayer;
  for (var i = 0; i < players[roomId].length; i++) {
    existingPlayer = players[roomId][i];
    this.emit('new player', { id: existingPlayer.id, x: existingPlayer.x, y: existingPlayer.y, angle: existingPlayer.angle, role: existingPlayer.role, size: existingPlayer.size, komnata: existingPlayer.komnata, username: existingPlayer.username });
  }
  players[roomId].push(newPlayer);
}

function onMovePlayer(data) {
  var roomId = data.room_id;
  var tmpName = room + roomId;
  var movePlayer = playerById(this.id);
  if (movePlayer) {
    movePlayer.x = data.x;
    movePlayer.y = data.y;
    movePlayer.angle = data.angle;
    this.broadcast.to(tmpName).emit('move player', { id: movePlayer.id, x: movePlayer.x, y: movePlayer.y, angle: movePlayer.angle })
  }
}

function onKillPlayer(data) {
  var roomId = data.room_id;
  var tmpName = room + roomId;
  var removePlayer = playerById(data.id);
  if (!removePlayer) {
    return
  }
  players[roomId].splice(players[roomId].indexOf(removePlayer), 1);
  io.in(tmpName).emit('kill player', { id: data.id });
  if (players[roomId].length == 1) {
    clearInterval(timerInterval);
    io.in(tmpName).emit('game over');
  }
}

function onDisplayGameTimer(data) {
  var roomId = data.room_id;
  var tmpName = room + roomId;
  timerInterval = setInterval(function () {
    if (data.timer == 0) {
      io.in(tmpName).emit('time up');
    }
    io.in(tmpName).emit('display game timer', data.timer);
    data.timer--;
  }, 1000);
}

function playerById(id) {
  for (var i = 0; i < players.length; i++) {
    for (var j = 0; j < players[i].length; j++) {
      if (players[i][j].id == id) {
        return players[i][j]
      }
    }
  }
  return false
}
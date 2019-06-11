$(document).ready(function () {
  var player = {};
  $('#join-btn').on('click', function () {
    signup();
  });
  $('#username').keypress(function (e) {
    if (e.which == 13) {
      signup();
    }
  });
  function signup() {
    if ($('#username').val()) {
      player.name = $('#username').val();
      player.id = socket.id;
      player.role = 'fish';
      socket.emit('join game', player);
      $(this).prop('disabled', true);
      loadPregame();
    } else {
      $('.info__label').text('please enter your username');
      setTimeout(function () {
        $('.info__label').text('enter username');
      }, 1000)
    }
  }
  $('.tutorial-link').click(function (e) {
    e.preventDefault();
    $('.tutorial-modal').fadeIn('slow');
    $('.mask').fadeIn('slow');
  })
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();
  var boxHeight = $('.tutorial-modal').height();
  var boxWidth = $('.tutorial-modal').width();
  $('.tutorial-modal').css({ 'left': ((windowWidth - boxWidth) / 2), 'top': ((windowHeight - boxHeight) / 2) });
  $('.close-btn').click(function (e) {
    e.preventDefault();
    $('.tutorial-modal').hide();
    $('.mask').hide();
  })

  $('.mask').click(function () {
    $('.tutorial-modal').hide();
    $('.mask').hide();
  })

  function loadPregame() {
    $.ajax({
      url: 'template/players-list.html'
    }).done(function (response) {
      if ($('#main').html() != response) {
        $('#content').fadeOut(200, function () {
          $('#main').html(response);
          socket.emit('get users');
          console.log(roomId);
        })
      }
    }).fail(function () {
    }).always(function () {
    });
  };

  function loadRole(players) {
    $.ajax({
      url: 'template/role.html'
    }).done(function (response) {
      if ($('#main').html() != response) {
        $('#content').fadeOut(200, function () {
          $('#main').html(response);
          $.each(players, function (index, el) {
            if (el.id == socket.id) {
              currentPlayer = el;
              if (el.role === "fish") {
                $('.role-text').text("You are survivor");
                $('.role-img').attr('src', '/assets/surviv.png');
              } else {
                $('.role-text').text("You are monster");
                $('.role-img').attr('src', '/assets/monster.png');
              }
            }
          });
        })
      }
    }).fail(function () {
    }).always(function () {
    });
  }

  function loadGame() {
    $.ajax({
      url: 'template/game.html'
    }).done(function (response) {
      if ($('#main').html() != response) {
        $('#content').fadeOut(200, function () {
          $(document.body).append(response);
          uzern = player.name
        })
      }
    }).fail(function () {
    }).always(function () {
    });
  }

  socket.on('get roomid', function (data) {
    roomId = data;
  })

  socket.on('display players', function (players) {
    $('#players-list').html('');
    $.each(players, function (index, el) {
      if (el.id == socket.id) {
        $('<li>').text(el.name).appendTo($('#players-list')).addClass('players-list__item highlight-color');
      } else {
        $('<li>').text(el.name).appendTo($('#players-list')).addClass('players-list__item');
      }
    });
  })

  socket.on('display count down', function (count) {
    if ($('#players-list').length) {
      $('.countdown').show();
    }
    if ($('#players-list').length == 0) {
      $('.countdown').hide();
    }
    $('.countdown__number span').text(count);
  })

  socket.on('hide count down', function () {
    $('.countdown').hide();
  })

  socket.on('display role', function (players) {
    $('.countdown').hide();
    loadRole(players);
    setTimeout(function () {
      $('.countdown').hide();
      loadGame();
    }, 2000);
  })
})

window.onload = function () {
  var socket = io();
  if (document.getElementById('user')) {
    console.log('hello')
    socket.name = document.getElementById('user').innerHTML
    console.log(socket.name)
    socket.emit('admin', socket.name)
  }

  if (document.getElementById('form')) {
    document.getElementById('form').onsubmit = function (e) {
      e.preventDefault();
      var date = new Date();
      var message = document.getElementById('message').value;
      document.getElementById('message').value = ""
      sendMessage(message)
      $("#chatbox").append(`<div class='container2'><img src='/images/goku.jpg' alt='Avatar' style='width:100%;'><p>${message}</p><span class='time-right'>${date.getHours().toString() + ':' + date.getMinutes().toString()}</span></div>`)
    }
  }

  var joinRoom = function(e) {
    e.preventDefault();
    var admin = document.getElementById('user').innerHTML
    console.log('laksldfk')
    socket.emit('adminJoin', e.target.innerHTML, admin)
  }

  if (document.getElementById('joinRoom')) {
    document.querySelector('#joinRoom').forEach(link => {
      link.onclick = joinRoom
    })
  }


  function sendMessage(message) {
    if ($("#chatbox").children().length === 0) {
      if (!document.getElementById('user'))
        console.log(document.getElementById("sessionID").innerHTML)
      socket.emit('joinChatRoom', document.getElementById("sessionID").innerHTML)
    }
    socket.emit('message', message)
  }

  socket.on('message', (message) => {
    var date = new Date();
    console.log(message)
    $("#chatbox").append(`<div class='container2 darker'><img src='/images/vegeta.jpg' alt='Avatar' class='right' style='width:100%;'><p>${message}</p><span class='time-right'>${date.getHours().toString() + ':' + date.getMinutes().toString()}</span></div>`)
  })

  socket.on('newChat', (sessionID) => {
    window.alert('New User Live Chat Available')
    if (document.getElementById("chatboxes")) {
      console.log('this also happend')
      var listItem = document.createElement('li');
      listItem.setAttribute('id', 'joinRoom');
      listItem.innerHTML += sessionID;
      listItem.onclick = joinRoom
      listItem.setAttribute('style', 'cursor:pointer')
      document.getElementById('chatboxes').appendChild(listItem)
    }
  })
}



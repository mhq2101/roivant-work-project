var socket = io();
function beginChat() {
  socket.emit('joinChatRoom', document.getElementById("sessionID").innerHTML)
  document.getElementById('beginChat').setAttribute('style', "display:none")
  $("#chatbox").append("<h1 id='loading' >Please wait... a representative will be with you momentarily. Thank you for your patience<h1>")
}
var joinRoom = function (e) {
  var admin = document.getElementById('user').innerHTML
  socket.emit('adminJoin', e.target.innerHTML, admin)
  document.getElementById('currentChat').innerHTML = 'Connected: ' + e.target.innerHTML
}
window.onload = function () {

  if (document.getElementById('user')) {
    socket.name = document.getElementById('user').innerHTML
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

  

  if (document.getElementById('joinRoom')) {
    document.querySelectorAll('#joinRoom').forEach(link => {
      link.onclick = joinRoom
    })
  }


  function sendMessage(message) {
    socket.emit('message', message)
  }

  socket.on('message', (message) => {
    var date = new Date();
    $("#chatbox").append(`<div class='container2 darker'><img src='/images/vegeta.jpg' alt='Avatar' class='right' style='width:100%;'><p>${message}</p><span class='time-right'>${date.getHours().toString() + ':' + date.getMinutes().toString()}</span></div>`)
  })

  socket.on('newChat', (sessionID) => {
    window.alert('New User Live Chat Available')
    if (document.getElementById("chatboxes")) {
      var listItem = document.createElement('li');
      listItem.setAttribute('id', 'joinRoom');
      listItem.innerHTML += sessionID;
      listItem.onclick = joinRoom
      listItem.setAttribute('style', 'cursor:pointer')
      document.getElementById('chatboxes').appendChild(listItem)
    }
  })

  socket.on('adminJoin', (admin) => {
    $("#loading").remove();
    document.getElementById("message-bar").setAttribute('style', "position:fixed;bottom:0; width:100%;")
    $("#chatbox").append(`<h3 class="w3-center">${admin} has joined</h3>`)
  })
}



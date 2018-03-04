window.onload = function () {
  var socket = io();

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

  function sendMessage(message) {
    console.log(socket)
    socket.emit('message', message)
  }

  socket.on('message', (message) => {
    var date = new Date();
    console.log(message)
    $("#chatbox").append(`<div class='container2 darker'><img src='/images/vegeta.jpg' alt='Avatar' class='right' style='width:100%;'><p>${message}</p><span class='time-right'>${date.getHours().toString() + ':' + date.getMinutes().toString()}</span></div>`)
  })
}



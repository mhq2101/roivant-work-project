
module.exports = function (io, admins, chatRooms) {

  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    //socket message listener
    socket.on("message", function (message) {
      socket.broadcast.to(socket.room).emit('message', message)
    })

    socket.on('admin', (admin) => {
      admins[admin] = socket;
      socket.join('admins')
    })

    socket.on('joinChatRoom', room => {
      socket.join(room)
      socket.room = room
      io.to('admins').emit('newChat', room)
      chatRooms[room] = {
        name: room,
        admins: []
      }
    })

    socket.on('adminJoin', (room, admin) => {
      socket.join(room)
      socket.room = room
      socket.broadcast.to(room).emit('adminJoin', admin)
      var copy = chatRooms[room].admins.slice();
      copy.push(admin)
      chatRooms[room].admins = copy
    })
  });

}


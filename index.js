const express = require('express')
const path = require('path');
const bodyparser = require('body-parser');
const app=express()

app.set('views',path.join(__dirname,'views'))
app.engine('html',require('ejs').renderFile)
app.set('view engine','html')
app.use(bodyparser.json())

app.get('/',(req,res)=>{
  res.render('index')
})

server=app.listen(3000,function(){
  console.log('Server started on port 3000 ...');
})

const io = require('socket.io')(server);

io.on('connection',(socket)=>{
  socket.username='Anonymous'
  var name=socket.username
  socket.broadcast.emit('joined_room',{name:socket.username+ ' joined the room'});
  console.log('New User Connected with name:'+ socket.username);

  socket.on('new_msg',(data)=>{
    console.log(data);
    socket.broadcast.emit('new_msg_all',data)
  })

  socket.on('change_name',(data)=>{
    io.sockets.emit('joined_room',{name:socket.username+ ' changed into '+data.username});
    socket.username=data.username;
    name=socket.username
    console.log('UserName Changed to :'+socket.username);
  })

  socket.on('disconnect',(socket)=>{
    console.log('disconnect');
    io.sockets.emit('joined_room',{name:name+ ' has left the room'});
  })
})

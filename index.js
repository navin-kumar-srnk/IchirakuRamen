
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(http);
let rooms=[]
app.use(express.static(path.join(__dirname, './frontEnd')));
app.get('/',(req, res, next) => {
  res.sendFile('index.html',{ root: './frontEnd' });
})

io.on('connection', (socket)=>{
console.log("connected");



socket.on("joinRoom",({playerName,roomId},res)=>{
  rooms.push({roomId:roomId,playerName:playerName})
  console.log(rooms);
  socket.join(roomId)
  res({playerName:playerName})
  var clientNumber = io.sockets.adapter.rooms[roomId].length;
  if(clientNumber==2)
  {
   let players= rooms.filter(ele=>{ return ele.roomId==roomId})
   console.log(players);
    io.to(roomId).emit('response', {players:players});
  }
  })

  
  socket.on("test",(roomId,res)=>{
    console.log(roomId);
    io.to(roomId).emit('response', "starts in 20");
    })

    socket.on("start",({vh,vw,room},res)=>{
   

      let x=(Math.floor(Math.floor(Math.random() * (vw-10))/50)*50)+"px"
      let y=(Math.floor(Math.floor(Math.random() * (vh-10))/50)*50)+"px"

      io.to(room).emit('addFood', {x:x,y:y});
    })


    socket.on('addPoint',({player,roomId,points},res)=>{
      let p=points
      points.forEach((ele,i)=>{
        if(ele.playerName==player)
        {
            p[i].points=points[i].points+1

        }
    })

      io.to(roomId).emit('addPointListener', p);
    })



    socket.on('keyUp',({roomId,player},res)=>{
      io.to(roomId).emit('keyUpResponse', {player:player});

    })

    
    socket.on('ResultsResquest',({points,roomId},res)=>{
      const winner = points.reduce((p, c) => p.points > c.points ? p : c);
       rooms=rooms.filter(ele=>ele.roomId!=roomId)
       console.log(rooms);
      io.to(roomId).emit('resultsReponse', {winner:winner});
 
      })
   socket.on("reload",({roomId,playerName})=>{
    rooms=rooms.filter(ele=>(ele.roomId!=roomId && ele.playerName!=playerName) )
    console.log(rooms);
   })
});


// http.listen(3000, function(){
//   console.log('listening on *:' + 3000);
// });

http.listen(3000, '0.0.0.0',()=>{
  console.log(process.env.PORT);
});
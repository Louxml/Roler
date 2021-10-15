var express = require("express")
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/public',express.static('public'));
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/demo',(req,res) => {
    res.sendFile(__dirname + '/demo.html');
});

io.on('connection',(socket) => {
    socket.on('cmd', (data) => {
        io.emit('cmd',data)
    })
})

http.listen(3000,() => {
    console.log("listening to 3000");
})
var express = require("express")
var app = express();
var http = require('http').createServer(app);

app.use('/package',express.static('package'));
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(8060,() => {
    console.log("listening to 8060");
})
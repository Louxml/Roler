var express = require("express")
var app = express();
var http = require('http').createServer(app);

app.use('/packages',express.static('packages'));
app.use('/test', express.static("test"));
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(8060,() => {
    console.log("listening to 8060");
})
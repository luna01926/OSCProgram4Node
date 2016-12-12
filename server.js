var http = require('http');
var fs = require('fs');
var server = http.createServer();

var ws = require('ws').Server; /* for WebSocket */

const debug = false;
var host = debug?'localhost':'';
var port = 3000;

// node.js
server.on('request', function(req, res){
    var url = req.url;
    if('/' == url){
        fs.readFile('./index.html','utf-8', function(err, data){
            if(!err){
                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(data);
                res.end();
            }
        });
    }
    else if('/index.js' == url){
        fs.readFile('./index.js', 'utf-8', function(err, data){
            if(!err){
                res.writeHead(200, {'Content-Type':'text/javascript'});
                res.write(data);
                res.end();
            }
        });
    }
    else if('/jquery.min.js' == url){
        fs.readFile('./jquery.min.js', 'utf-8', function(err, data){
            if(!err){
                res.writeHead(200, {'Content-Type':'text/javascript'});
                res.write(data);
                res.end();
            }
        });
    }
    else if('/src/icebox.mp3' == url){
        fs.readFile('./src/icebox.mp3', function(err, data){
            if(!err){
                //console.log("icebox");
                res.writeHead(200, {'Context-Type':'audio/mp3'});
                res.write(data);
                res.end();
            }
        });
    }
});
server.listen(port, host);

var wsport = 3333;
var wsServer = new ws({'host':host, 'port':wsport});

var oscport = 6666;
var nodeosc = require('node-osc');
var client = new nodeosc.Client(host, oscport);

// WebSocket
wsServer.on('connection', function(socket){
    socket.on('message', function (msg) {
        var mes = JSON.parse(msg);
        //console.log(mes);
        if(mes.osc && mes.type!='i'){
            client.send(mes.path, 200, mes.data);
        }
    });
});

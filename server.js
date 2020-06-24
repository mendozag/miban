'use strict'
const express = require(`express`);
const parser = (`body-parser`);
const app = express();
const EventEmitter = require('events');
var port = 3000;
var path = require ('path');

const Stream = new EventEmitter();
var uid = "0";
var udiR = "";
var messagesNoRead = {
    "1":{"noread":0},
    "2":{"noread":0},
    "3":{"noread":0},
}

app.use(express.json());
app.use(
    express.urlencoded({
        extended:true,
    }),
);

app.get('/my-endpoint', function(request, response){
    response.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Access-Control-Allow-Origin' : '*',
        'Connection': 'keep-alive',
    });
    console.log("Hola");
    
    Stream.on('push', function(event, data){
        response.write(`event: ` + String(event) + `\n`  + `data: ` + JSON.stringify(data) + `\n\n`);
    });
});

app.get('/my-endpoint/:uid', function(request, response){
    //uidR = request.params.uid;
    console.log("Uid: ", uid);
    
    response.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Access-Control-Allow-Origin' : '*',
        'Connection': 'keep-alive',
    });
    console.log("Hola");
    
    Stream.on('push', function(event, data){
        //console.log("Data: ",data.uid);
        //console.log("User: ", request.params.uid);
        //console.log("Contador: ", messagesNoRead[request.params.uid].noread);

        response.write(`event: ` + String(event) + `\n`  + `data: ` + JSON.stringify({uid: request.params.id, counterUid: messagesNoRead[request.params.uid].noread}) + `\n\n`);
    });
});


setInterval(function() {
    //console.log("uidR: ", uidR);
    
    uid = 1 + (Math.floor(Math.random() * 3));
    messagesNoRead[uid].noread++
    console.log(messagesNoRead);
    
        Stream.emit('push','message', 
        { 
            titulomsg: 'Movimiento Bancario',
            msg: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque nostrum alias quia quis eveniet consequuntur illum, est porro esse quaerat voluptate error, tenetur soluta officia blanditiis, aut harum in minima.',
            uid: uid,
            readed: false
        });
    
}, 1000);

app.listen(3000);

//rutas
app.use('/', express.static('client', {redirect: false}));
app.get('*', function(req, res, next){
    response.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Access-Control-Allow-Origin' : '*',
        'Connection': 'keep-alive',
    });
    res.sendFile(path.resolve('client/index.html'));
});

console.log('Servidor Express corriendo');

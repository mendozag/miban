const express = require(`express`);
const parser = (`body-parser`);
const app = express();
const EventEmitter = require('events');
var port = 3000;
const Stream = new EventEmitter();
var uid = "0";
var udiR = "";
var messagesNoRead = {
    "1":{"noread":0},
    "2":{"noread":0},
    "3":{"noread":0},
}

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

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
    //console.log("Hola");
    Stream.on('push', function(event, data){
        response.write(`event: ` + String(event) + `\n`  + `data: ` + JSON.stringify(data) + `\n\n`);
    });
});

app.get('/my-endpoint/:uid', function(request, response){
    uidR = request.params.uid;
    //console.log("Uid: ", uid);
    
    response.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Access-Control-Allow-Origin' : '*',
        'Connection': 'keep-alive',
    });
    //console.log("Hola");
    
    Stream.on('push', function(event, data){        
        //console.log(data);
        response.write(`event: ` + String(event) + `\n`  + `data: ` + JSON.stringify({uid: request.params.id, counterUid: messagesNoRead[request.params.uid].noread}) + `\n\n`);
    });
});

app.get('/mensajes/:uid', function(request, response){
    response.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Access-Control-Allow-Origin' : '*',
        'Connection': 'keep-alive',
    });

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mensajes");
        var query = { uid: "2" };
        dbo.collection("mensajes").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      });
    //response.write(`event: ` + String(event) + `\n` + `data: ` + JSON.stringify({mss: "Hola", titulo: "EsUnTitulo"}) + `\n\n`);
});


setInterval(function() {
    //console.log("uidR: ", uidR);    
    uid = 1 + (Math.floor(Math.random() * 3));
    messagesNoRead[uid].noread++
    console.log(messagesNoRead);
    var d = new Date();
    var _id = d.getTime();
    
        Stream.emit('push','message', 
        { 
            titulomsg: 'Movimiento Bancario',
            msg: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque nostrum alias quia quis eveniet consequuntur illum, est porro esse quaerat voluptate error, tenetur soluta officia blanditiis, aut harum in minima.',
            uid: uid,
            readed: false,
            //_id: _id
        });

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mensajes");
            var myobj = { 
                titulomsg: 'Movimiento Bancario',
                msg: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque nostrum alias quia quis eveniet consequuntur illum, est porro esse quaerat voluptate error, tenetur soluta officia blanditiis, aut harum in minima.',
                uid: uid,
                readed: false,
                //_id: _id
            };
            dbo.collection("mensajes").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
            });
          });
}, 3000);

app.listen(3000);

console.log('Servidor Express corriendo');

/*
MIT License

Copyright (c) 2020 Villain_Mahil
*/

const req = require('request'); //use `npm i request` for this
const webSocketClient = require('websocket').client; //use `npm i websocket` for this
let token;
let guilds;
let cache = {};
cache.guilds = new Map();
let heartbeatno = 0; //if this exceeds 2 reconnect

let identity = { //identity
    "op": 2,
    "d": {
      "token": null,
      "properties": {
          "$os": "mac",
          "$browser": "discpp_js",
          "$device": "discpp_js"
        },
      "intents": 4609, //only guild events and dm and guild messages
      "shard": [0, 1] //shard support coming soon!
    }
};

function disconnect(){
  module.exports.connect();
}

let sequence = 0;
let session_id = 0;
let onmesgfunc = function(){
};
let onreadyfunc = function(){
};
let onguildjoinfunc = function(){
};
let onguildleavefunc = function(){
};

module.exports = {
  cache: cache,
  postMessage: (channel, message) => { //post a message
    return new Promise((resolve, reject) => {
      if(typeof message == "string"){
        message = {
          content: message
        }
      }
      const options = {
        url: `https://discord.com/api/v6/channels/${channel}/messages`,
        headers: {"Authorization": `Bot ${token}`, "Content-type": "application/json"},
        body: JSON.stringify(message)
      }
      req.post(options,
      (error, response, body) => {
        if(error){
          reject(error);
        }
        resolve(body);
      });
    });
  },
  onMessage: function(func){
    onmesgfunc = func;
  },
  onReady: function(func){
    onreadyfunc = func;
  },
  onGuildJoin: function(func){
    onguildjoinfunc = func;
  },
  onGuildLeave: function(func){
    onguildleavefunc = func;
  },
  connect: (p_token) => {
    const client = new webSocketClient();
    token = p_token; //set token to one provided

    client.on('connectFailed', (error) => {
      console.log('Discpp.js says: \nConnection Error' + error.toString());
    });

    client.on('connect', (connection) => {

      this.websocketcon = connection;

      connection.on('error', (error) => {
        console.log("Discpp.js says: \nConnection Error: " + error.toString());
      });

      connection.on('close', () => { //closes connection, reopens it
        client.abort();
        return disconnect();
      });

      connection.on('message', (message) => {
        if (message.type === 'utf8') { //check message
          const data = JSON.parse(message.utf8Data);
          if (data.s) { //sets sequence
            sequence = data.s;
          }
          switch(data.op){
            case 10: //discord has init, hello message
              setInterval(() => {
                connection.sendUTF(JSON.stringify({
                  "op": 1,
                  "d": sequence
                }));
                if(heartbeatno > 2){
                  connection.sendUTF(JSON.stringify({
                    "op": 6,
                    "d": {
                      "token": p_token,
                      "session_id": session_id,
                      "seq": sequence
                      }
                    }
                  ));
                  console.log("heartbeat non");
                  heartbeatno = 0;
                }else{
                  heartbeatno++;
                }
              }, (data.d.heartbeat_interval)); //start heartbeating

              identity.d.token = p_token; //set identity token

              connection.sendUTF(JSON.stringify(identity), (err) => {
                if(err){
                  console.log("Discpp.js says: \n"+err);
                  return;
                }
              }); //send our identity
              break;
            case 11: //discord has acknowledged heartbeat
              heartbeatno--; //decrement hearbeat counts
              break;
            case 7: //reconnect
              connection.sendUTF(JSON.stringify({
                "op": 6,
                "d": {
                  "token": p_token,
                  "session_id": session_id,
                  "seq": sequence
                  }
                }
              ));
              break;
            case 9: //discord could not connect
              if(data.d){
                connection.sendUTF(JSON.stringify({
                  "op": 6,
                  "d": {
                    "token": p_token,
                    "session_id": session_id,
                    "seq": sequence
                    }
                  }
                ));
              }else{
                console.log("The client was not able to connect. Maybe an invalid token was provided");
                client.abort(); //some problem, maybe in invalid token was provided
                return;
              }
              break;
            case 0: //gateway event
              if (data.d && data.d.session_id) {
                session_id = data.d.session_id;
              }
              if (data.t == "READY"){
                cache.guilds.clear();
                guilds = data.d.guilds.length;
              }else if (data.t == "MESSAGE_CREATE"){
                onmesgfunc(data.d);
              }else if (data.t == "GUILD_CREATE"){
                if(guilds > 0){
                  guilds--;
                  if(guilds == 0){
                    onreadyfunc();
                  }
                }else if(guilds == 0){
                  onguildjoinfunc(Object.assign({}, data.d));
                }
                cache.guilds.set(data.d.id, data.d);
              }else if (data.t == "GUILD_UPDATE"){
                cache.guilds.set(data.d.id, data.d);
              }else if (data.t == "GUILD_DELETE"){
                onguildleavefunc(Object.assign({}, cache.guilds.get(data.d.id)));
                cache.guilds.delete(data.d.id);
              }
              break;
            default:
              console.log(data.op + " idk");
              break;
          }
        }
      });
    });
    client.connect('wss://gateway.discord.gg/?v=6&encoding=json');
  }
}

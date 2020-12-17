const discpp = require('./discpp.js');
const fs = require('fs');
const commands = JSON.parse(fs.readFileSync("example.json"));

const onReady = function(){
  console.log("ready");
}

const onMesg = function(mesg){
  if(mesg.author.bot)return;
  mesg.content = mesg.content.trim();
  if(mesg.content == "-help"){
    let helpmesg = "";
    for (const thing in commands["all"]){
      helpmesg += "`" + thing + "`" + ": " + commands["all"][thing][1] + "\n";
    }
    if(commands[mesg.guild_id]){
      for (const thing in commands[mesg.guild_id]){
        helpmesg += "`" + thing + "`" + ": " + commands[mesg.guild_id][thing][1] + "\n";
      }
    }
    restjs.postMessage(mesg.channel_id, helpmesg);
    return;
  }
  let entered = commands["all"][mesg.content]
    ||(commands[mesg.guild_id]?
    commands[mesg.guild_id][mesg.content]:undefined);
  if(entered){
    entered = entered[0];
    let fimbed;
    if(entered.startsWith("EMBED-")){
      console.log("embed");
      fimbed = entered.substring(6, entered.length);
      fimbed = fimbed.split("$*$");
      if(fimbed.length == 4 && fimbed[0] != ""){
        if(fimbed[1] == ""){
          fimbed[1] = "000000"
        }
        entered = {
          embed: {
            title: fimbed[0],
            color: fimbed[1]
          }
        }
        if(fimbed[2] != ""){
          entered.embed.description = fimbed[2];
        }
        if(fimbed[3] != ""){
          entered.content = fimbed[3];
        }
      }
    }
    if(typeof entered == "string"){
      entered = entered.replace(/\$NAME\$/, mesg.author.username);
    }
    restjs.postMessage(mesg.channel_id, entered);
  }
}

const joinGuild = function(guild){
  console.log(guild.name);
}

discpp.onMessage(onMesg);
discpp.onReady(onReady);
discpp.onGuildJoin(joinGuild);
discpp.connect(commands.token);

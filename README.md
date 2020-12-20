# DisCOPP.js
A minimalistic discord api wrapper library for node.js.
This library requires request (npm i request), and websocket (npm i websocket).
***

***NOTE:*** To use the example, download the files discpp.js, example.js, and example.json, and then keep them in the same folder. Then, go to example.json and replace TOKEN_GOES_HERE with your bot's token, replace HELP_COMMAND_NAME with your preferred help command name, save, and run `node example.js` in the terminal. For more info on the example go to the bottom of the file. The example is an extension of this project by another user: https://github.com/Lioncat2002/LionCatBot/.

#### DisCOPP.js is a minimalist discord API wrapper, and a javascript port of the soon to come DisCOPP.cpp library
Currently, discopp only suports a few events, listed below.

Add the discopp.js file to your project and type
```
const discopp = require("./discopp.js");
```
***
### DisCOPP.js is event based.
To set the on ready callback, add
```
discopp.onReady(ready_callback_function);//called when the bot becomes ready
```

To set the on message send callback, add
```
discopp.onMessage(message_send_callback);//called when a message in sent in a dm channel or guild channel
```
The mesage callback takes one argument, the message object.

The two other callbacks are:
```
discopp.onGuildJoin(on_guild_join_callback);//called when bot joins guild, callback gets the object of the joined guild as an argument
discopp.onGuildLeave(on_guild_leave_callback);//called when the bot leaves a guild, callback gets the object of the guild that it left as an argument
```
The guild object is documented here- https://discord.com/developers/docs/resources/guild#guild-object.

### DisCOPP.js APIs
DisCOPP.js only has one API, postMessage. We may add more in the future.

To send a message, use the function
```
discopp.postMessage("CHANNEL_ID, message);
```
The message parameter can be a message object (https://discord.com/developers/docs/resources/channel#message-object) or a string. If you want to post an embed, use the object syntax.

### DisCOPP.js cache
The discopp cache stores all the guilds that the bot is currently in. It is present at `discopp.cache.guilds`.

### Running your bot
The run your bot, add this line **after** setting the callback functions.
```
discopp.connect("BOT_TOKEN");
```

## The example bot
If you don't want to code a bot, you can use the example. **DO NOT EDIT** example.js. To add your own commands, add a new field under "all" or a public command (the command will be useable in any server) for under a field with the server's id for a private command (it only works in that specific server). Don't forget to add the comma unless it is the last field, in which case there should be no comma. If you are experiencing an error, check if all the commas are present. Here is an example command field:
```
"name of command": ["what the bot should reply. if you add $NAME$ here it will get replaced by the username of the person who used the command when the bot sends the message", "the description of the command, this comes when you use the help command that is specified in your example.json file."]
```

# Discpp.js
A minimalistic discord api wrapper library.
This library requires request (npm i request), request-promise-native (npm i request-promise-native), and websocket (npm i websocket).
***
### Discpp.js is a minimalist discord API wrapper, and a javascript port of the soon to come discpp.cpp library
Currently, discpp only suports two events- on ready and on messange send

Add the discpp.js file to your project and type
```
const discpp = require("./discpp.js");
```
***
## Discpp.js is event based.
To set the on ready callback, add
```
discpp.onReady(ready_callback_function);//called when the bot becomes ready
```

To set the on message send callback, add
```
discpp.onMessage(message_send_callback);//called when a message in sent in a dm channel or guild channel
```
The mesage callback takes one argument, the message object.

## Discpp.js APIs
Discpp.js only has one API, postMessage. We may add more in the future.

To send a message, use the function
```
discpp.postMessage("CHANNEL_ID, message);
```
The message parameter can be a message object (https://discord.com/developers/docs/resources/channel#message-object) or a string. If you want to post an embed, use the object syntax.

## Running your bot
The run your bot, add this line **after** setting the callback functions.
```
discpp.connect("BOT_TOKEN");
```

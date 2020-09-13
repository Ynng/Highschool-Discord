const disc = require("discord.js")
var client = new disc.Client() 
const fs = require('fs')
const token = 'NzU0NDgzNTI1MTEzMDg2MDM2.X11Zig.jL277UrSscYYRR7kf9Vp1XnvUhI';


client.registry.registerGroup('reply',"Reply")
client.registry.registerCommandsIn(__dirname + "/commands")

fs.readdir("./Commands",(err,files) =>{
    if (err){
        return console.log(err)
    }
    files.forEach((f) =>{
        const command = require(`./commands/${file}`);
        client.commands.set(command.name,command);
    })
    
})

// Prefix for the bot
const prefix = "!"

client.on('message', message =>{
    if(message.content.startsWith(prefix)){
    const edit = message.content.slice(prefix.length).split(" ")
    const ag = edit.shift().toLowerCase()
        if(ag == 'try'){
            message.channel.send('tried')
        }
    else{
        return;
    }
    }
})

client.login(token);
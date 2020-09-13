const config = require("../botconfig.json");
const fs = require('fs');

module.exports = (bot, message) => {

    var prefix = config.prefix;
    if (message.content.startsWith(prefix) || message.content.startsWith(`<@!${bot.user.id}>`) || message.channel.type == "dm"||message.channel.name === config.welcomeChannel) {
        var msg;
        if (message.content.startsWith(prefix)) {
            msg = message.content.substring(prefix.length).trim();
        } else if(message.content.startsWith(`<@!${bot.user.id}>`)){
            msg = message.content.substring(bot.user.id.length+4).trim();   
        }else {
            msg = message.content;
        }

        if(message.channel.name === config.welcomeChannel && !message.content.startsWith(prefix)){
            var commmandfile = bot.commands.get(bot.aliases.get("addcourse"));
            fs.appendFile('log.txt', `@${message.author.username} just sent "${msg}"\n\n`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }else{
            msg = msg.replace(/\s+/g, ' ');
            var args = msg.split(" ");
            var cmd = args.shift().toLowerCase();
            fs.appendFile('log.txt', `@${message.author.username} just requested "${cmd}" with args "${args}"\n\n`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
            var commmandfile = bot.commands.get(bot.aliases.get(cmd));
        }
        if (commmandfile) {
            commmandfile.run(bot, message, args);
        }
    }
};
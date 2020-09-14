const config = require("../botconfig.json");
const fs = require('fs');
const recent = new Set();
const timeouttime = 3000;

module.exports = (bot, message) => {
    var prefix = config.prefix;
    if (message.content.startsWith(prefix) || message.content.startsWith(`<@!${bot.user.id}>`) || message.channel.type == "dm" || message.channel.name === config.welcomeChannel) {
        var msg;
        if (message.content.startsWith(prefix)) {
            msg = message.content.substring(prefix.length).trim();
        } else if (message.content.startsWith(`<@!${bot.user.id}>`)) {
            msg = message.content.substring(bot.user.id.length + 4).trim();
        } else {
            msg = message.content;
        }

        if (recent.has(message.author.id))
            return utils.simpleMessage(`:tired_face: Woah there! You're going too fast, slow down!`, message, config.loadingColor, config.tempMsgTime);

        if (message.channel.name === config.welcomeChannel) {
            var commmandfile = bot.commands.get(bot.aliases.get("addcourse"));
            fs.appendFile('log.txt', `@${message.author.username} just sent "${msg}"\n\n`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        } else {
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
        recent.add(message.author.id);
        setTimeout(recent.delete(message.author.id), timeouttime)
    }
};

const config = require("../botconfig.json");
const utils = require("./utils.js");
const fs = require('fs');
const recent = {};

async function resetSpamCount(userId) {
    setTimeout(() => {
        recent[userId]--;
    }, config.spamTime);
}

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
        if (!(message.author.id in recent))
            recent[message.author.id] = 0;
        recent[message.author.id]++;
        resetSpamCount(message.author.id);

        if (recent[message.author.id] >= config.spamMessageCount) {
            if (message.channel.name === config.welcomeChannel)
                utils.safeDeleteMessage(message);
            if (recent[message.author.id] == config.spamMessageCount)
                utils.simpleMessage(`:tired_face: Woah there! You're going too fast, wait ${config.spamTime/1000} seconds  before trying that again!`, message, config.warningColor, config.tempMsgTime);
            fs.appendFile('log.txt', `@${message.author.username} just spammed "${recent[message.author.id]}"\n\n`, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });

            return;
        }

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
    }
};

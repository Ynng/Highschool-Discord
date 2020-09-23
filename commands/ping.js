const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message) => {
    // console.log(bot.emojis.resolveID(config.emojis.loadingEmojiId));
    let embed = new Discord.MessageEmbed()
        .setTitle(`${bot.emojis.resolve(config.emojis.loadingEmojiId)} pinging....`)
        .setColor(config.loadingColor);
    utils.embedAddStamp(message, embed, message.author);
    message.channel.send(embed).then(msg => {
        setTimeout(() => msg.edit(embed
            .setTitle(`:ping_pong: pong!`)
            .setColor(config.embedColor)
            .addField("Bot Ping:", `${msg.createdTimestamp - message.createdTimestamp}ms`, true)
            .addField("Api Ping:", `${bot.ws.ping}ms`, true)), bot.ws.ping);
    });
};

module.exports.help = {
    name: "ping",
    description: "Calculates the current ping of the bot, me!",
    aliases: ["ping", "p"]
};

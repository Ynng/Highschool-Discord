const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message) => {
    let embed = new Discord.RichEmbed()
        .setTitle(`${bot.emojis.get(config.emojis.loadingEmojiId)} pinging....`)
        .setColor(config.loadingColor);
    utils.embedAddStamp(message, embed, message.author);
    message.channel.send(embed).then(msg => {
        msg.edit(embed
            .setTitle(`:ping_pong: pong!`)
            .setColor(config.embedColor)
            .addField("Bot Ping:", `${(msg.createdTimestamp - message.createdTimestamp).toFixed(0)}ms`, true)
            .addField("Api Ping:", `${bot.ping.toFixed(0)}ms`, true));
    });
};

module.exports.help = {
    name: "ping",
    description: "Calculates the current ping of the bot, me!",
    aliases: ["ping", "p"]
};
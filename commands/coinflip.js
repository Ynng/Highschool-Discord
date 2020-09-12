const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message) => {
    let result = Math.random() < 0.5;
    let embed = new Discord.RichEmbed();
    if (result) {
        embed.setTitle(`${bot.emojis.get(config.emojis.coinHeadEmojiId)} Heads`)
            .setColor(config.embedColor);
    } else {
        embed.setTitle(`${bot.emojis.get(config.emojis.coinTailEmojiId)} Tails`)
            .setColor(config.embedColor);
    }
    utils.embedAddStamp(message, embed, message.author);
    message.channel.send(embed);
};

module.exports.help = {
    name: "coinflip",
    description: "Flip a coin, get either Heads or Tails randomly",
    aliases: ["coinFlip", "coin","cf"]
};
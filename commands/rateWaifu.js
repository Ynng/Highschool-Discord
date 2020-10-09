const Discord = require('discord.js')
const config = require("../botconfig.json");
var seedrandom = require('seedrandom');
const utils = require('../util/utils');

module.exports.run = async (client, message, args) => {

    let waifu = args.join(" ");
    if (!args[0])
        return utils.simpleMessage("I need your waifu's **name**", message, config.errorColor, config.tempMsgTime);
    if (waifu.length > 30)
        return utils.simpleMessage("Your waifu is over 30 characters??", message, config.errorColor, config.tempMsgTime);


    let result = seedrandom(waifu)();
    result = result*100;
    result = result - result%1;
    
    let emoji = "😭";
    if (result > 40) emoji = "🤔";
    if (result > 50) emoji = "🤷";
    if (result > 60) emoji = "👌";
    if (result > 70) emoji = "👍";
    if (result > 80) emoji = "👀";
    if (result > 90) emoji = "❤";

    const embed = new Discord.MessageEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 ${emoji}`)
        .setColor(config.embedColor)
    utils.embedAddStamp(message,embed, message.author);
    message.channel.send(embed);
}

module.exports.help = {
  name: "rateWaifu",
  args: "{@user} {Waifuuuu}",
  description: "Rates a certain waifu of your choosing",
  example: `${config.prefix}rate Ynng`,
  aliases: ["rate", "ratewaifu"]
};

const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message) => {
  if (utils.checkDm(message)) return;

  let serverIcon = message.guild.iconURL;

  let embed = new Discord.RichEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(serverIcon)
    .setTitle(`Server Information`)
    .addField("Name", message.guild.name, true)
    .addField("Owner", message.guild.owner, true)
    .addField("Age", `${utils.getAgeString(utils.getAgeDate(message.guild.createdAt))}`, true)
    .addField("Population", message.guild.memberCount);
  utils.embedAddStamp(message, embed, message.author);
  message.channel.send(embed);
};

module.exports.help = {
  name: "serverinfo",
  description: "This displays some information on the current server",
  aliases: ["server", "serverinfo", "guildinfo"]
};
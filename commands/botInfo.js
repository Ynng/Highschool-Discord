const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message) => {
  let botIcon = bot.user.displayAvatarURL();

  let totalSeconds = (bot.uptime / 1000);
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

  let embed = new Discord.MessageEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(botIcon)
    .setTitle("Bot Information")
    .addField("Hi, my name is", bot.user.username, true)
    .addField(`Library`, `[discord.js](https://discord.js.org/#/)`, true)
    .addField(`Users`, `${client.users.size}`, true)
    .addField(`I have been Oneline for`, `${uptime}`, true)
    .addField("I have existed for", utils.getAgeString(utils.getAgeDate(bot.user.createdAt)), true)
    .addField("My Prefix is", `\`${config.prefix}\``, true)
    .addField("Author", "@Ynng#1017", true);
    .setTimestamp()
  utils.embedAddStamp(message, embed, message.author);

  message.channel.send(embed);
};

module.exports.help = {
  name: "botinfo",
  description: "This displays some information on the bot, me!",
  aliases: ["info", "botinfo", "bot", "stats", "stat"]
};

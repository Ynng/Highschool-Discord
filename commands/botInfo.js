const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message) => {
  let botIcon = bot.user.displayAvatarURL;

  let embed = new Discord.RichEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(botIcon)
    .setTitle("Bot Information")
    .addField("Hi, my name is", bot.user.username, true)
    .addField("I have existed for", utils.getAgeString(utils.getAgeDate(bot.user.createdAt)), true)
    .addField("My Prefix is", `\`${config.prefix}\``, true)
    .addField("I was made and maintained by", "@Ynng#1017", true);
  utils.embedAddStamp(message, embed, message.author);

  message.channel.send(embed);
};

module.exports.help = {
  name: "botinfo",
  description: "This displays some information on the bot, me!",
  aliases: ["info", "botinfo", "bot", "stats", "stat"]
};
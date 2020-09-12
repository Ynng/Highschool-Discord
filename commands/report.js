const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
  if (utils.checkDm(message)) return;
  
  let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!target) return utils.simpleMessage(":frowning2: Can't find the user", message, config.errorColor, config.tempTime);

  let moderationChannel = message.guild.channels.find(channel => channel.name === config.moderationChannel);
  if (!moderationChannel) return utils.simpleMessage(`:warning: Can't find the moderation channel: "${config.moderationChannel}", no where to report to`, message, config.errorColor, config.tempTime);

  args.shift();
  let reason = args.join(" ");
  if (!reason) return utils.simpleMessage(":warning: You need a reason to report someone", message, config.errorColor, config.tempTime);

  let targetIcon = target.user.avatarURL;
  let authorIcon = message.author.avatarURL;

  let embed = new Discord.RichEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(targetIcon)
    .setTitle(`**@${target.user.username} Just Got Reported!**`)
    .addField("I have reported", target.user, true)
    .addField("On the behalf of", message.author, true)
    .addField("For the reason", reason);

  let moderationEmbed = new Discord.RichEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(targetIcon)
    .setTitle(`**Report**`)
    .addField("Reported User", `${target.user} with ID: ${target.user.id}`, true)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`, true)
    .addField("Report Reason", reason)
    .addField("Report Time", message.createdAt);

  let pmEmbed = new Discord.RichEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(authorIcon)
    .setTitle(`**You Just Got Reported in the server "${message.guild.name}"**`)
    .addField("You got reported by", `${message.author}`, true)
    .addField("For the reason", reason, true)
    .addField("At", message.createdAt);

  target.user.send(pmEmbed).catch(() => {
    console.log("Error, can't send dm to a user");
});
moderationChannel.send(moderationEmbed);
  message.channel.send(embed);
};

module.exports.help = {
  name: "report",
  args: "{@user} {Reason}",
  description: "Reports the targetted user to the server admins",
  example: "$report @kOoLGamingContentYT for advertising",
  aliases: ["report"]
};
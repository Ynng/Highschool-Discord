const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
  if (utils.checkDm(message)) return;

  var rank = message.member.roles.highest.position;
  var botrank = message.guild.members.resolve(bot.user).roles.highest.position;
  if (botrank > rank)
    return utils.simpleMessage(`:no_entry_sign: This is an admin only command.`, message, config.errorColor, config.tempMsgTime)

  utils.safeDeleteMessage(message);

  message.guild.fetchBans().then(banlist => {
    console.log(banlist);
  })
  
};

module.exports.help = {
  name: "bannedlist",
  description: "This is a debug command only available to the owner of the server",
  aliases: ["bannedlist"]
};

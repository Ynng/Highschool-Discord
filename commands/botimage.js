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

  var imageLink;
  console.log(args[0])
  switch (args[0]) {
    case "roles":
      imageLink = "https://i.imgur.com/JeRNnSk.png";
      break;
    case "welcome":
      imageLink = "https://i.imgur.com/jGgYLka.png";
      break;
    case "invite":
      imageLink = "https://i.imgur.com/bEK7jpB.png"
      break;
    case "rules":
      imageLink = "https://i.imgur.com/5ow8h8g.png"
      break;
    case "info":
      imageLink = "https://i.imgur.com/TjdcWpC.png"
      break;
    default:
      return message.channel.send("Unrecognized message label");
  }

  message.channel.send("", { files: [imageLink] });
};

module.exports.help = {
  name: "botimage",
  description: "This is a debug command only available to the owner of the server",
  aliases: ["botimage"]
};

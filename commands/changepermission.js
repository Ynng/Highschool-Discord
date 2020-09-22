const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
  if (utils.checkDm(message)) return;

  var rank = message.member.roles.highest.position;
  var botrank = message.guild.members.resolve(bot.user).roles.highest.position;
  if (botrank > rank)
    return utils.simpleMessage(`:no_entry_sign: This is an admin only command.`, message, config.errorColor, config.tempMsgTime)

  var re = new RegExp(/[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]/g);

  //Sets all course code role's permission to 0
  // message.guild.roles.cache.forEach(role => {
  //   console.log(role.name);
  //   if(role.name.match(re)){
  //     role.setPermissions(0);
  //   }
  // })

  message.guild.channels.cache.forEach(channel => {
    if(channel.parentID=="755245454412873779" || channel.parentID=="755245455255928862" || channel.parentID == "755245456942170153"){
      console.log(channel.name);
      channel.createOverwrite(config.modrole, {
        VIEW_CHANNEL: true
      }, "Allowing moderators to see all channels")
    }
  })

  message.channel.send("success");
};

module.exports.help = {
  name: "changepermission",
  description: "This is a debug command only available to the owner of the server",
  aliases: ["changepermission"]
};

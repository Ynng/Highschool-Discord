const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");
const users = require("../user_list.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
  if (utils.checkDm(message)) return;

  var rank = message.member.roles.highest.position;
  var botrank = message.guild.members.resolve(bot.user).roles.highest.position;
  if (botrank > rank)
    return utils.simpleMessage(`:no_entry_sign: This is an admin only command.`, message, config.errorColor, config.tempMsgTime)

  if (message.guild != config.targetServer)
    return;

  var target = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
  if (!target) return utils.simpleMessage(":frowning2: Can't find the user", message, config.errorColor, config.tempMsgTime);
  
  args.shift();
  var username = args.join(" ");

  if(args.length == 0){
    delete users.fixed_username[target.id];
    target.roles.add(message.guild.roles.cache.find(r => r == config.changeUsernameRole));
    target.roles.remove(message.guild.roles.cache.find(r => r == config.fixedUsernameRole));
    message.channel.send("Successfully removed forced username!");

  }else{
    users.fixed_username[target.id] = username;
    target.setNickname(username);
    target.roles.remove(message.guild.roles.cache.find(r => r == config.changeUsernameRole));
    target.roles.add(message.guild.roles.cache.find(r => r == config.fixedUsernameRole));
    message.channel.send("Successfully forced username!");

  }
  

  fs.writeFile("user_list.json", JSON.stringify(users), err => {
    // Checking for errors 
    if (err) throw err;
    console.log("Done writing"); // Success 
  });

};

module.exports.help = {
  name: "forceusername",
  description: "This is a debug command only available to the owner of the server",
  aliases: ["forceusername"]
};

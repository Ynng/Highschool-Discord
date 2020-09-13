const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message) => {
  if (utils.checkDm(message)) return;

  let serverIcon = message.guild.iconURL();

  let embed = new Discord.MessageEmbed()
          .setAuthor(`${serverName}`)
          .setFooter(`Server created on ${message.guild.createdAt} ||---|| SERVER PREFIX ${prefix}`)
          .setThumbnail(serverIcon)
          .setTitle("Server Information!")
          .addField("You joined on", message.member.joinedAt, true)
          .addField("Total Members", `**${message.guild.memberCount}**`, true)
          .addBlankField()
          .addField('Humans', `**${message.guild.members.filter(member => !member.user.bot).size}**`, true)
          .addField('Bots', `**${message.guild.members.filter(member => member.user.bot).size}**`, true)
          .addField('Member Status', `**${message.guild.members.filter(o => o.presence.status === 'online').size}** Online\n**${message.guild.members.filter(i => i.presence.status === 'idle').size}** Idle/Away\n**${message.guild.members.filter(dnd => dnd.presence.status === 'dnd').size}** Do Not Disturb\n**${message.guild.members.filter(off => off.presence.status === 'offline').size}** Offline/Invisible\n**${message.guild.members.filter(s => s.presence.status === 'streaming').size}** Streaming`)
          .addField("Server Owner", message.guild.owner.user.tag, true)
          .addField("Region", region)
          .setColor(`${message.guild.displayHexColor}`);
  utils.embedAddStamp(message, embed, message.author);
  message.channel.send(embed);
};

module.exports.help = {
  name: "serverinfo",
  description: "This displays some information on the current server",
  aliases: ["server", "serverinfo", "guildinfo"]
};

const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message) => {
  if (utils.checkDm(message)) return;

  let serverIcon = message.guild.iconURL();

  let embed = new Discord.MessageEmbed()
          .setAuthor(`${message.guild.name}`)
          .setFooter(`Server created on ${message.guild.createdAt} ||---|| SERVER PREFIX ${config.prefix}`)
          .setThumbnail(serverIcon)
          .setTitle("Server Information!")
          .addField("You joined on", message.member.joinedAt, true)
          .addField("Region", message.guild.region, true)
          .addField("Server Owner", message.guild.owner.user.tag, true)
          .addField("Total Members", `**${message.guild.memberCount}**`, true)
          .addField('Humans', `**${message.guild.members.cache.filter(member => !member.user.bot).size}**`, true)
          .addField('Bots', `**${message.guild.members.cache.filter(member => member.user.bot).size}**`, true)
          .addField('Member Status', `**${message.guild.members.cache.filter(o => o.presence.status === 'online').size}** Online\n**${message.guild.members.cache.filter(i => i.presence.status === 'idle').size}** Idle/Away\n**${message.guild.members.cache.filter(dnd => dnd.presence.status === 'dnd').size}** Do Not Disturb\n**${message.guild.members.cache.filter(off => off.presence.status === 'offline').size}** Offline/Invisible\n**${message.guild.members.cache.filter(s => s.presence.status === 'streaming').size}** Streaming`, true)
          .setColor(config.embedColor);
  utils.embedAddStamp(message, embed, message.author);
  message.channel.send(embed);
};

module.exports.help = {
  name: "serverinfo",
  description: "This displays some information on the current server",
  aliases: ["server", "serverinfo", "guildinfo"]
};

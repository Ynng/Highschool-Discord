const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message) => {
  if (utils.checkDm(message)) return;

  let serverIcon = message.guild.iconURL();

  let embed = new Discord.MessageEmbed()
          .setAuthor(`${message.guild.name}`)
          .setThumbnail(serverIcon)
          .setTitle("Server Information!")
          .addField("Age", `${utils.getAgeString(utils.getAgeDate(message.guild.createdAt))}`, true)
          .addField("Region", message.guild.region, true)
          .addField("Server Owner", message.guild.owner.user.tag, true)
          .addField('Member Status', `**${message.guild.members.cache.filter(o => o.presence.status === 'online').size}** Online\n**${message.guild.members.cache.filter(i => i.presence.status === 'idle').size}** Idle/Away\n**${message.guild.members.cache.filter(dnd => dnd.presence.status === 'dnd').size}** Do Not Disturb\n**${message.guild.members.cache.filter(off => off.presence.status === 'offline').size}** Offline/Invisible\n**${message.guild.members.cache.filter(s => s.presence.status === 'streaming').size}** Streaming`, true)
          .addField("Members", `**${message.guild.memberCount}** Total\n**${message.guild.members.cache.filter(member => !member.user.bot).size}** Humans\n**${message.guild.members.cache.filter(member => member.user.bot).size}** Bots`, true)
          .setColor(config.embedColor);
  utils.embedAddStamp(message, embed, message.author);
  message.channel.send(embed);
};

module.exports.help = {
  name: "serverinfo",
  description: "This displays some information on the current server",
  aliases: ["server", "serverinfo", "guildinfo"]
};

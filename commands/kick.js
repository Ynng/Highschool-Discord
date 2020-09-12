const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
    if (utils.checkDm(message)) return;

    if (!message.guild.member(bot.user).hasPermission(this.help.permission)) return utils.simpleMessage(":no_entry_sign: **I** need the **Kick Members** permission to do that", message, config.errorColor, config.tempTime);
    if (!message.member.hasPermission(this.help.permission)) return utils.simpleMessage(":no_entry_sign: You need the **Kick Members** permission to do that", message, config.errorColor, config.tempTime);

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!target) return utils.simpleMessage(":frowning2: Can't find the user", message, config.errorColor, config.tempTime);
    if (target.hasPermission(this.help.permission)) return utils.simpleMessage(":warning: You can't kick someone with the permission **Kick Members**", message, config.errorColor, config.tempTime);
    if (!target.kickable) return utils.simpleMessage(":thinking: I can't kick this user for some reason", message, config.errorColor, config.tempTime);

    let targetIcon = target.user.avatarURL;
    let authorIcon = message.author.avatarURL;
    let moderationChannel = message.guild.channels.find(channel => channel.name === config.moderationChannel);

    args.shift();
    let reason = args.join(" ");
    if (!reason) reason = "No Reason was Given";

    let embed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**@${target.user.username} Just Got Kicked!**`)
        .addField(`I have kicked`, `${target.user}`, true)
        .addField(`On the behalf of`, `${message.author}`, true)
        .addField("For the reason", reason);

    let moderationEmbed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**Kick**`)
        .addField("Kicked User", `${target.user} with ID: ${target.user.id}`, true)
        .addField("Kicked By", `${message.author} with ID: ${message.author.id}`, true)
        .addField("Kick Reason", reason)
        .addField("Kick Time", message.createdAt);

    let pmEmbed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(authorIcon)
        .setTitle(`**You Just Got Kicked from the server "${message.guild.name}"**`)
        .addField("You got kicked by", `${message.author}`, true)
        .addField("For the reason", reason, true)
        .addField("At", message.createdAt);

    target.user.send(pmEmbed).catch(() => {
        console.log("Failed to send pm");
    });
    try {
        moderationChannel.send(moderationEmbed);
    } catch (e) {
        console.log("Moderation events channel does not exsist");
        utils.simpleMessage(`:warning: Can't find the moderation channel: "${config.moderationChannel}", detailed information about this kick won't be recorded`, message, config.errorColor);
    }

    message.channel.send(embed);
    setTimeout(() => {
        message.guild.member(target).kick();
    }, 2500);
};

module.exports.help = {
    name: "kick",
    args: "{@user} [Reason]",
    description: "Kicks the targetted user from this server.",
    permission: "KICK_MEMBERS",
    example: "$k @xX_KoolGamer6903_Xx for spamming",
    aliases: ["kick", "k"]
};
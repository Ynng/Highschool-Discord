const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
    if (utils.checkDm(message)) return;

    var rank = message.member.roles.highest.position;
    var botrank = message.guild.members.resolve(bot.user).roles.highest.position;
    if (botrank > rank)
        return utils.simpleMessage(`:no_entry_sign: This is an admin only command.`, message, config.errorColor, config.tempMsgTime)

    let embed = new Discord.MessageEmbed().setTitle("Join a chat of your interest!")
        .addField("React to this message with the emoji that corresponds to your interest.", "🏯︱Anime\n📺︱Party Games\n🏅︱Sports\n🎮︱Gaming\n💻︱Technology")
        .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
        .setColor(config.serverColor);

    if (args.length > 0) {
        if (args[0].length > 0) {
            message.channel.messages.fetch(args[0]).then(message => message.edit("", embed));
            return;
        }
    }

    message.channel.send(embed);
};

module.exports.help = {
    name: "reactionroleb",
    description: "This is a debug command only available to the owner of the server",
    aliases: ["reactionroleb"]
};

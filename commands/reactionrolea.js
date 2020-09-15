const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
    if (utils.checkDm(message)) return;

    var rank = message.member.roles.highest.position;
    var botrank = message.guild.members.resolve(bot.user).roles.highest.position;
    if (botrank > rank)
        return utils.simpleMessage(`:no_entry_sign: This is an admin only command.`, message, config.errorColor, config.tempMsgTime)

    var embed;
    if (args[0] == "1")
        message.channel.send("", { files: ["https://i.imgur.com/JeRNnSk.png"] });
    else if(args[0] == "2"){

        embed = new Discord.MessageEmbed().setTitle("Become an alumni!")
            .addField("React to this message with the :mortar_board: emoji to get the alumni role.", "Please only do this if you are an alumni.")
            .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
            .setColor(config.serverColor);
        message.channel.send(embed);
    }

};

module.exports.help = {
    name: "reactionrolea",
    description: "This is a debug command only available to the owner of the server",
    aliases: ["reactionrolea"]
};

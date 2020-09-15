const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message) => {
    if (utils.checkDm(message)) return;

    let embed = new Discord.MessageEmbed().setTitle("Become an alumni!")
        .addField("React to this message with the :mortar_board: emoji to get the alumni role.", "Please only do this if you are an alumni.")
        .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
        .setColor(config.serverColor);
        
    message.channel.send(embed);
};

module.exports.help = {
    name: "customembeda",
    description: "This is a debug command only available to the owner of the server",
    aliases: ["customembeda"]
};

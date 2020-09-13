const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
    if (utils.checkDm(message)) return;
    
    let target = message.guild.member(message.mentions.users.first());
    if (!target) return utils.simpleMessage(":frowning2: Can't find the user", message, config.errorColor, config.tempTime);

    let userIcon = target.user.displayAvatarURL();

    let embed = new Discord.MessageEmbed()
        .setColor(`${config.embedColor}`)
        .setImage(userIcon)
        .setTitle("Avatar/Profile picture")
        .setDescription(`of ${target.user}`)
        .setURL(userIcon);
    utils.embedAddStamp(message, embed, message.author);

    message.channel.send(embed);
};

module.exports.help = {
    name: "avatar",
    args: "{@user}",
    description: "Gets the avatar/profile picture of the given user",
    example: "$avatar @KoolGamer5742, $pfp @Karasawamiko",
    aliases: ["avatar","pfp","profile"]
};
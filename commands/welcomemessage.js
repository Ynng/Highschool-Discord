const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
    if (utils.checkDm(message)) return;

    var rank = message.member.roles.highest.position;
    var botrank = message.guild.members.resolve(bot.user).roles.highest.position;
    if (botrank > rank)
        return utils.simpleMessage(`:no_entry_sign: This is an admin only command.`, message, config.errorColor, config.tempMsgTime)

    if (args == "1")
        message.channel.send("", { files: ["https://i.imgur.com/QUhC0c7.png"] });
    else if (args == "2") {
        let embed = new Discord.MessageEmbed().setTitle("Welcome!")
            .addField('The **Unionville HS** Discord Server is your one stop shop for everything UHS!', ':books: `Course Chats` for the homework advice!\n:link: `Grade Chats` to connect with your grade!\n:school: `#ask-an-alum` for post-secondary advice!\n:joystick: `Entertainment` to find someone to game with!\n:desktop: `tech-support` if you need any, well, tech support.\n:question: And more to come!')
            .addField(":thinking: Make sure to read `#rules-and-info`", "Sending any message in this server means you've read and agreed to the server rules.")
            .addField('\u200b', '\u200b')
            .addField(":clap::clap:**ENTER THE COURSE CODES OF YOUR CLASSES BELOW** :point_down: to join your course chats, department chats and grade chats!", "Don't worry about formatting, if the code is valid, we can read it!")
            .addField('\u200b', 'Please only use this channel to post course codes. All messages will be deleted automatically')
            .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
            .setColor(config.serverColor);

        message.channel.send(embed);
    } else if (args == "3")
        message.channel.send("", { files: ["https://i.imgur.com/UqVnclU.png"] });
    else if (args == "4") {
        embed = new Discord.MessageEmbed().setTitle("Invite your classmates!")
            .addField(":laughing:  A dedicated `course chat` will be created automatically when there are more then 5 people from the same class", "More dedicated chats and features will be added later")
            .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
            .setColor(config.serverColor);

        message.channel.send(embed);
    }

};

module.exports.help = {
    name: "welcomemessage",
    description: "This is a debug command only available to the owner of the server",
    aliases: ["welcomemessage"]
};

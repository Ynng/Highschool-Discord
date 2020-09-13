const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
    var re = new RegExp("[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]");
    var list = require('../course_list.json');
    var noMatch = true;
    if (re.test(message.content)) {
        for (entry in list) {
            if (message.content == entry) {
                message.channel.send(`works format, ${message.content}`);
                noMatch = false;
                var count = 0;
                var roleExists = false;
                for (role in message.member.roles) {
                    if (re.test(role.name)) {
                        count++;
                        if (count < 10) {
                            if (entry == role.name) {
                                roleExists = true;
                                message.member.addRole(role);
                                message.channel.send(`added ${role.name} to ${message.member.name}`);
                            }
                        } else {
                            message.channel.send(`too many subjects`);
                        }
                    }
                }
                if (!roleExists) {
                    message.guild.roles.create({
                        data: {
                            name: entry,
                            color: 'BLACK',
                        },
                        reason: `New course ${entry} required by ${message.member} `
                    })
                    message.member.addRole(message.guild.roles.find(rNew => rNew.name == entry));
                    message.channel.send(`added ${entry} to ${message.member.name}`);

                }
            }
        }
    } else {
        return message.channel.send(`${message.content} invalid`);
    }

    if (noMatch) {
        message.channel.send("course doesn't exist");
    }
};

module.exports.help = {
    name: "Add Course",
    args: "Any text containing course codes",
    description: "Add a new course to your user!",
    example: "&addcourse ENG1D0",
    aliases: ["addcourse"]
};
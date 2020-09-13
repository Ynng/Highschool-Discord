const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
    var re = new RegExp("[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]");
    var list = require('../course_list.json');
    var noMatch = true;
    if(re.test(message.content)) {
        for(entry in list){
            if(message.content==entry){
                message.channel.send(`works format, ${message.content}`);
                noMatch = false;
            }
        }
    } else {
        return message.channel.send(`${message.content} invalid`);
    }

    if(noMatch){
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
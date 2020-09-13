const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
    var re = new RegExp("[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]");
    var list = require('../course_list.json');
    let roleown;
    for(role in message.member.roles){
        if (role == message.content){
            roleown = True;
        }
    }
    if (re.test(message.content)){
        for (entry in list){
            if(message.content == entry && roleown == True){
                message.member.roles.remove(message.content)
                message.channel.send(`deleted ${role.name} from ${message.member.name}`)
            }
            else{
                message.channel.send(`You do not have this role.`)
            }
        }
    }
}

module.exports.help = {
    name: "Remove Course",
    args: "Any text containing course codes",
    description: "Remove an existing course from your user!",
    example: "&removecourse ENG1D0",
    aliases: ["removecourse"]
};
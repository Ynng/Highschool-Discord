const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
    var re = new RegExp("[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]");
    var list = require('../course_list.json');
    var rank  = message.member.highestRole.CalculatedPosition;
    var botrank = bot.highestRole.CalculatedPosition;
    let roleown;
    for(role in message.member.roles){
        if (role == message.content){
            roleown = True;
        }
    }
    if (re.test(message.content)){
        for (entry in list){
            if(message.content == entry && roleown == True){
                if(rank < botrank){
                    message.member.roles.remove(message.content)
                    utils.simpleMessage(`deleted ${role.name} from ${message.member.name}.`,message, config.errorColor, 4 * config.tempMsgTime)
                }
            }
            else if (rank > botrank){
                utils.simpleMessage(`The bot does not have sufficient permission to edit the role you request.`,message, config.errorColor, 4 * config.tempMsgTime)
            }
            else{
                utils.simpleMessage(`You do not have this role.`,message, config.errorColor, 4 * config.tempMsgTime)
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

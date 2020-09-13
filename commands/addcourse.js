const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
    var re = new RegExp("[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]");
    var list = require('./coure_list.json');
    if(args==undefined) {
        if(re.test(message.content)) {
            for(entry in list){
                if(message.content==entry){
                    return message.channel.send(`works format, ${message.content}`);
                }
                else {
                    return message.channel.send("course doesn't exist");
                }
            }
        } else {
            return message.channel.send(`${message.contet} invalid`);
        }
    }  
};

module.exports.help = {
    name:"",
    args:`{test} `,
    description:"",
    permission:"",
    example:`${config.prefix}template test`,
    aliases: ["template"]
};
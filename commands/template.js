/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
    
    
};

module.exports.help = {
    name:"template",
    args:`{test} `,
    description:"template",
    permission:"",
    example:`${config.prefix}template test`,
    aliases: ["template"]
};
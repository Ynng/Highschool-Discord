const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");


module.exports.run = async (bot, message, args) => {
    if (args[0]) {
        var targetCommand = args[0];
    } else {
        var commandsArray = [];
        bot.commands.array().forEach(command => {
            commandsArray.push(command.help.name);
        });

        var embed = new Discord.MessageEmbed()
            .setColor(`${config.embedColor}`)
            .setAuthor(`Help for ${bot.user.username}`, bot.user.displayAvatarURL())
            .addField("My commands:", `\`${config.prefix}${commandsArray.join(`\`, \`${config.prefix}`)}\``)
            // .addField("My prefix:", `\`${config.prefix}\``)
            .addField("Need help on a command?", `\`\`\`html\n< ${config.prefix}help {command} >\`\`\``);

        utils.embedAddStamp(message, embed, message.author);
        message.channel.send(embed);
        return;
    }

    if (targetCommand.startsWith(config.prefix)) {
        targetCommand = targetCommand.substring(config.prefix.length).trim();
    }
    if (bot.commands.get(bot.aliases.get(targetCommand))) {
        var command = bot.commands.get(bot.aliases.get(targetCommand));
        var pmEmbed = new Discord.MessageEmbed()
            .setColor(`${config.embedColor}`);
        utils.embedAddStamp(message, pmEmbed, message.author);

        var dmAble = true;
        await message.author.send(utils.getHelpString(command)).catch(() => {
            console.log("Error, can't send dm to a user");
            dmAble = false;
            utils.simpleMessage(":frowning2: I can't dm you, please change your settings or unblock me", message, config.errorColor, config.tempMsgTime);
        });
        if (message.channel.type != "dm") {
            if (dmAble) {
                message.author.send(pmEmbed).catch(() => {
                    // console.log("Error, can't send dm to a user B");
                });
                utils.simpleMessage(":ok_hand: Check your DMs!", message, config.embedColor, config.tempMsgTime);
            }
        }
    } else {
        utils.simpleMessage(":frowning2: I can't find that command, do `!help` to get a list of available commands", message, config.errorColor, config.tempMsgTime);
    }
};

module.exports.help = {
    name: "help",
    description: "DM you helpful infos on the given command, or just lists the commands and prefix",
    args: "[command name]",
    example: `${config.prefix}help, ${config.prefix}? ping, ${config.prefix}?`,
    aliases: ["help", "?", "h"]
};
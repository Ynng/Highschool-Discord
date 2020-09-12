"use strict";

const Discord = require("discord.js");

const config = require("../botconfig.json");

module.exports = {
    getAgeDate: function (birthday) {
        return new Date(Date.now() - birthday.valueOf());
    },

    getAgeString: function (age) {
        let seconds = age.getSeconds();
        let minutes = age.getMinutes();
        let hours = age.getHours();
        let days = age.getDate();
        let months = age.getMonth();
        let year = age.getFullYear() - 1970;
        if (year > 0) {
            return `${year} Years and ${months} Months`;
        } else if (months > 0) {
            return `${months} Months and ${days} Days`;
        } else if (days > 0) {
            return `${days} Days and ${hours} Hours`;
        } else if (hours > 0) {
            return `${hours} Hours and ${minutes} Minutes`;
        } else if (minutes > 0) {
            return `${minutes} Minutes and ${seconds} Seconds`;
        } else {
            return `${seconds} Seconds`;
        }
    },

    getPermissionsString: function (permission) {
        let output = permission
            .replace("ADD_REACTIONS", "Add Reactions")
            .replace("ADMINISTRATOR", "Administrator")
            .replace("ATTACH_FILES", "Attach Files")
            .replace("BAN_MEMBERS", "Ban Members")
            .replace("CHANGE_NICKNAME", "Change Nickname")
            .replace("CONNECT", "Connect")
            .replace("CREATE_INSTANT_INVITE", "Create Instant Invite")
            .replace("DEAFEN_MEMBERS", "Deafen Members")
            .replace("EMBED_LINKS", "Embed Links")
            .replace("KICK_MEMBERS", "Kick Members")
            .replace("MANAGE_CHANNELS", "Manage Channels")
            .replace("MANAGE_EMOJIS", "Manage Emojis")
            .replace("MANAGE_GUILD", "Manage Server")
            .replace("MANAGE_MESSAGES", "Manage Messages")
            .replace("MANAGE_NICKNAMES", "Manage Other Nicknames")
            .replace("MANAGE_ROLES", "Manage Roles")
            .replace("MANAGE_WEBHOOKS", "Manage Webhooks")
            .replace("MENTION_EVERYONE", "Mention Everyone")
            .replace("MOVE_MEMBERS", "Move Members")
            .replace("MUTE_MEMBERS", "Mute Members")
            .replace("READ_MESSAGE_HISTORY", "Read Message History")
            .replace("SEND_MESSAGES", "Send Messages")
            .replace("SEND_TTS_MESSAGES", "Send Text-to-Speech Messages")
            .replace("SPEAK", "Speak")
            .replace("VIEW_AUDIT_LOG", "View Audit Log")
            .replace("VIEW_CHANNEL", "View Channel")
            .replace("USE_EXTERNAL_EMOJIS", "Use External Emojis")
            .replace("USE_VAD", "Use Voice Activation Detection");
        return output;
    },

    getMonthStr: function (intMonth) {
        switch (intMonth) {
            case 1:
            default:
                return 'Jan';
            case 2:
                return 'Feb';
            case 3:
                return 'Mar';
            case 4:
                return 'Apr';
            case 5:
                return 'May';
            case 6:
                return 'Jun';
            case 7:
                return 'Jul';
            case 8:
                return 'Aug';
            case 9:
                return 'Sep';
            case 10:
                return 'Oct';
            case 11:
                return 'Nov';
            case 12:
                return 'Dec';
        }
    },

    getHelpString: function (command) {
        let usage = command.help.args;
        let aliases = command.help.aliases;
        let permission = command.help.permission;
        let description = command.help.description;
        let example = command.help.example;
        let name = command.help.name;
        let argumentHelp = `\`\`\`md\n> Remove Brackets when typing commands\n> [] = optional arguments\n> {} = mandatory arguments\`\`\``;

        if (!name) name = aliases[0];
        if (!usage) {
            usage = `${config.prefix}${name}`;
            argumentHelp = "";
            if (!example) example = usage;
        }
        else {
            usage = `${config.prefix}${name} ${usage}`;
            if (!example) example = "No example provided";
            else example = example.replace(/\$/g, config.prefix);
        }
        if (!permission) permission = "";
        else {
            permission = `#Permission Needed\n${this.getPermissionsString(permission)}\n`;
        }
        if (!description) description = "No description provided";
        aliases = aliases.join(" , ");
        return `\`\`\`html\n< ${usage} >\`\`\`\`\`\`md\n# Aliases\n${aliases}\n${permission}# Description\n${description}\n# Example Commmand(s)\n${example}\`\`\`${argumentHelp}`;
    },

    simpleMessage: function (text, message, color, timeout) {
        if (!message.deletable || !timeout) {
            let embed = new Discord.RichEmbed()
                .setTitle(`${text}`)
                .setColor(color);
            this.embedAddStamp(message, embed, message.author);
            return message.channel.send(embed);
        } else {
            let embed = new Discord.RichEmbed()
                .setTitle(`${text}`)
                .setFooter(`Removing in ${timeout / 1000} seconds`)
                .setColor(color);
            return message.channel.send(embed).then(msg => {
                this.safeDeleteMessage(msg, timeout);
                this.safeDeleteMessage(message, timeout);
            });
        }
    },

    editSimpleMessage: function (text, editMessage, originMessage, color, timeout) {
        if (!originMessage.deletable || !timeout) {
            let embed = new Discord.RichEmbed()
                .setTitle(`${text}`)
                .setColor(color);
            this.embedAddStamp(originMessage, embed, originMessage.author);
            return editMessage.edit(embed);
        } else {
            let embed = new Discord.RichEmbed()
                .setTitle(`${text}`)
                .setFooter(`Removing in ${timeout / 1000} seconds`)
                .setColor(color);
            return editMessage.edit(embed).then(msg => {
                this.safeDeleteMessage(msg, timeout);
                this.safeDeleteMessage(originMessage, timeout);
            });
        }
    },

    safeDeleteMessage: function (message, timeout) {
        // eslint-disable-next-line no-unused-vars
        message.delete(timeout).catch(error => {
            // eslint-disable-next-line no-console
            console.log("Failed to delete message");
            return;
        });
    },

    embedAddStamp: function (message, embed, author) {
        if (message.channel.type != "dm") {
            embed
                .setFooter(`Requested by: ${author.username}`, author.avatarURL)
                .setTimestamp();
        }
    },

    checkDm: function (message) {
        if (message.channel.type == "dm") {
            this.simpleMessage(":warning: This command only works in a server", message, config.errorColor);
            return true;
        } else return false;
    }
};
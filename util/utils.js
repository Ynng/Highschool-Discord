"use strict";

const Discord = require("discord.js");

const config = require("../botconfig.json");

const courseList = require("../course_list.json");

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
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
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
    } else {
      usage = `${config.prefix}${name} ${usage}`;
      if (!example) example = "No example provided";
      else example = example.replace(/\$/g, config.prefix);
    }
    if (!permission) permission = "";
    else {
      permission = `#Permission Needed\n${this.getPermissionsString(
        permission
      )}\n`;
    }
    if (!description) description = "No description provided";
    aliases = aliases.join(" , ");
    return `\`\`\`html\n< ${usage} >\`\`\`\`\`\`md\n# Aliases\n${aliases}\n${permission}# Description\n${description}\n# Example Commmand(s)\n${example}\`\`\`${argumentHelp}`;
  },

  simpleMessage: function (text, message, color, timeout) {
    if (!message.deletable || !timeout) {
      let embed = new Discord.MessageEmbed()
        .setTitle(`${text}`)
        .setFooter(
          `Requested by: ${message.author.username}`,
          message.author.avatarURL()
        )
        .setColor(color);
      this.embedAddStamp(message, embed, message.author);
      return message.channel.send(embed);
    } else {
      let embed = new Discord.MessageEmbed()
        .setTitle(`${text}`)
        .setFooter(
          `${message.author.username} | Removing this message in ${
            timeout / 1000
          } seconds`,
          message.author.avatarURL()
        )
        .setColor(color);
      return message.channel.send(embed).then((msg) => {
        this.safeDeleteMessage(msg, timeout);
        this.safeDeleteMessage(message, timeout);
      });
    }
  },

  editSimpleMessage: function (
    text,
    editMessage,
    originMessage,
    color,
    timeout
  ) {
    if (!originMessage.deletable || !timeout) {
      let embed = new Discord.MessageEmbed()
        .setTitle(`${text}`)
        .setFooter(
          `Requested by: ${message.author.username}`,
          message.author.avatarURL()
        )
        .setColor(color);
      this.embedAddStamp(originMessage, embed, originMessage.author);
      return editMessage.edit(embed);
    } else {
      let embed = new Discord.MessageEmbed()
        .setTitle(`${text}`)
        .setFooter(
          `${originMessage.author.username} | Removing this message in ${
            timeout / 1000
          } seconds`,
          message.author.avatarURL()
        )
        .setColor(color);
      return editMessage.edit(embed).then((msg) => {
        this.safeDeleteMessage(msg, timeout);
        this.safeDeleteMessage(originMessage, timeout);
      });
    }
  },

  safeDeleteMessage: function (message, t) {
    message
      .delete({ timeout: t, reason: "Temporary bot message" })
      .catch((error) => {
        console.log("Failed to delete message");
        return;
      });
  },

  embedAddStamp: function (message, embed, author) {
    if (message.channel.type != "dm") {
      embed
        .setFooter(`Requested by: ${author.username}`, author.avatarURL())
        .setTimestamp();
    }
  },

  checkDm: function (message) {
    if (message.channel.type == "dm") {
      this.simpleMessage(
        ":warning: This command only works in a server",
        message,
        config.errorColor
      );
      return true;
    } else return false;
  },

  andjoin: function (array, separator) {
    if (array.length == 1) return `${array[0]}`;
    var string = array[0];
    for (var i = 1; i < array.length - 1; i++) {
      string += separator;
      string += array[i];
    }
    string += " and ";
    string += array[array.length - 1];
    return string;
  },

  andisarejoin: function (array, separator) {
    if (array.length == 1) return `${this.andjoin(array, separator)} is`;
    else return `${this.andjoin(array, separator)} are`;
  },

  decodeCourse: function (courseCode) {
    //check if course actually exists
    courseCode = courseCode.toUpperCase();
    const courseInfo = courseList[courseCode];
    if (!courseInfo) {
      console.log(`Invalid course tried to be decoded: ${courseCode}`);
      return;
    }

    const decodeCourseType = function (letter) {
      switch (letter) {
        case "M":
          return "Uni./College";
        case "U":
          return "University";
        case "C":
          return "College";
        case "D":
          return "Academic";
        case "P":
          return "Applied";
        case "E":
          return "Workplace";
        case "L":
          return "Essential";
        case "O":
        case "X":
        default:
          return "";
      }
    };

    let courseType = decodeCourseType(courseCode[4]);
    if (courseType != "") {
      courseType = " " + courseType;
    }
    /*
        Explanation:
        ESL has perfect names as-is.
        For international languages, they go by levels B, C, D
        Other courses get the same old treatment: "Grade 9 Academic Math", etc.
        To fix MAP4C1 becoming "Grade 12 College College Math" there is a filter to remove duplicate words.
        */
    switch (courseInfo.department) {
      case "ESL":
        return courseInfo.name;
      case "Chinese":
      case "Spanish":
        return `Level ${courseCode[3]} ${courseInfo.name}`;
      default:
        return `Grade ${courseInfo.grade + 8}${courseType} ${
          courseInfo.name
        }`.replace(/(\w+) \1 /g, "$1 ");
    }
  },
};

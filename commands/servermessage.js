const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
  if (utils.checkDm(message)) return;

  var rank = message.member.roles.highest.position;
  var botrank = message.guild.members.resolve(bot.user).roles.highest.position;
  if (botrank > rank)
    return utils.simpleMessage(`:no_entry_sign: This is an admin only command.`, message, config.errorColor, config.tempMsgTime)

  utils.safeDeleteMessage(message);

  var embed;
  console.log(args[0])
  switch (args[0]) {
    case "alumni_react":
      embed = new Discord.MessageEmbed().setTitle("Become an alumni!")
        .addField("React to this message with the :mortar_board: emoji to get the alumni role.", "An Alumni is someone that has graduated. Please only do this if you are an alumni.")
        .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
        .setColor(config.serverColor);
      break;
    case "entertainment_react":
      embed = new Discord.MessageEmbed().setTitle("Join a chat of your interest!")
        .addField("React to this message with the emoji that corresponds to your interest.", "🏯︱Anime\n📺︱Party Games (You will get pinged for party game events)\n🏅︱Sports\n🎮︱Gaming\n💻︱Technology")
        .setFooter(text = "Message an admin if you'd like to add more categories here!")
        .setColor(config.serverColor);
      break;
    case "welcome-old":
      embed = new Discord.MessageEmbed().setTitle("Welcome!")
        .addField('The **Unionville HS** Discord Server is your one stop shop for everything UHS!', ':books: `Course Chats` for the homework advice!\n:link: `Grade Chats` to connect with your grade!\n:school: `#ask-an-alum` for post-secondary advice!\n:joystick: `Entertainment` to find someone to game with!\n:desktop: `tech-support` if you need any, well, tech support.\n:question: And more to come!')
        .addField(":thinking: Make sure to read `#rules-and-info`", "Sending any message in this server means you've read and agreed to the server rules.")
        .addField('\u200b', '\u200b')
        .addField(":clap::clap:**ENTER THE COURSE CODES OF YOUR CLASSES BELOW** :point_down: to join your course chats, department chats and grade chats!", "Don't worry about formatting, if the code is valid, we can read it!")
        .addField('\u200b', 'Please only use this channel to post course codes. All messages will be deleted automatically')
        .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
        .setColor(config.serverColor);
      break;
    case "add-course":
      embed = new Discord.MessageEmbed().setTitle(":point_down: Enter your course codes below :point_down:")
        .addField("Chat with people from your grade, department and classes!", "The full course code is 6 characters long.")
        .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
        .setColor(config.serverColor);
      break;
    case "invite":
      embed = new Discord.MessageEmbed().setTitle("Invite your classmates!")
        .addField(":laughing:  A dedicated `course chat` will be created automatically when there are more then 5 people from the same class", "More dedicated chats and features will be added later")
        .setFooter(text = "Message an admin if you need help, have a request or suggestion!")
        .setColor(config.serverColor);
      break;
    default:
      embed = "Unrecognized message label";
  }

  if (args.length > 1) {
    if (args[1].length > 1) {
      message.channel.messages.fetch(args[1]).then(message => message.edit("", embed));
      return;
    }
  }

  message.channel.send(embed);
};

module.exports.help = {
  name: "servermessage",
  description: "This is a debug command only available to the owner of the server",
  aliases: ["servermessage"]
};

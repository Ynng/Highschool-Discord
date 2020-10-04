const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");

module.exports.run = async (bot, message, args) => {
  //check that the person using it is an admin
  if (utils.checkDm(message)) return;
  var rank = message.member.roles.highest.position;
  var botrank = message.guild.members.resolve(bot.user).roles.highest.position;
  if (botrank > rank)
    return utils.simpleMessage(
      `:no_entry_sign: This is an admin only command.`,
      message,
      config.errorColor,
      config.tempMsgTime
    );

  // locate the "class" category
  var category = message.guild.channels.cache.find(
    (channel) => channel.id == "755245456942170153"
  );
  if (category == undefined)
    category = message.guild.channels.cache.find(
      (channel) => channel.name == "📙Classes"
    );
  if (category == undefined)
    await message.guild.channels
      .create("📙Classes", { type: "category" })
      .then((channel) => (category = channel));

  //change the topic of each class. this will take a while, but thank god await exists.
  for (let temp of category.children) {
    let channel = temp[1];
    if ((channel.type == "text")) {
      await channel.setTopic(
        utils.decodeCourse(channel.name),
        "New Channel Name Update! Hooray!"
      );
    }
  }

  return utils.simpleMessage("The update should be done! If it's totally screwed over, please don't sue me.", message,
    config.errorColor,
    config.tempMsgTime)
};

module.exports.help = {
  name: "upgradeclasses",
  description: "This is an admin command. It's used to change the class channel topics to the new format.",
  aliases: ["upgradeclasses"]
};

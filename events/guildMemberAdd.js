const config = require("../botconfig.json");
const users = require("../user_list.json");

module.exports = async (bot, member) => {
  console.log(`${member.id} joined! "${member.guild}"`);
  if (member.guild != config.targetServer)
    return;

  if (member.id in users.fixed_username) {
    member.roles.add(config.fixedUsernameRole);
    member.setNickname(users.fixed_username[member.id]);
  } else {
    member.roles.add(config.changeUsernameRole);
  }

  for(let i = 0; i<config.autoroles.length; i++){
    member.roles.add(config.autoroles[i]);
  }
};
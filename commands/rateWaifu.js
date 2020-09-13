const Discord = require('discord.js')
const config = require("../botconfig.json");

module.exports.run = async (client, message, args) => {

    let waifu = args.join(" ");
    if (!args[0]) {$
        let embed = new Discord.MessageEmbed()
                .setTitle("I need your waifu's **name**")
                .setDescription('Try again?')
                .setTimestamp()
                .setColor(0xFF0013);
            message.channel.send(embed);
            return;
    }
    if (waifu.length > 30) {
        let embed = new Discord.MessageEmbed()
                .setTitle("Your waifu's is over 30 characters??")
                .setDescription('I can\'t process that, try again?')
                .setTimestamp()
                .setColor(0xFF0013);
            message.channel.send(embed);
            return;
    }

    let result = 1;
    for(let i = 0; i < waifu.length; i++){
        result = (result*256+waifu.charCodeAt(i))%1000;
    }
    result = result/10 - (result / 10)%1;

    const happyrate = new Discord.MessageEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 ❤`)
        .setColor(`GREEN`)

    const sadembed = new Discord.MessageEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 😭`)
        .setColor(`GREEN`)

    const idkembed = new Discord.MessageEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 🤔`)
        .setColor(`GREEN`)

    const shrugembed = new Discord.MessageEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 🤷`)
        .setColor(`GREEN`)

    const okembed = new Discord.MessageEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 👌`)
        .setColor(`GREEN`)

    const thumbupembed = new Discord.MessageEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 👍`)
        .setColor(`GREEN`)

    const eyesembed = new Discord.MessageEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 👀`)
        .setColor(`GREEN`)

    if (result > 90) return message.channel.send(happyrate)
    if (result > 80) return message.channel.send(eyesembed)
    if (result > 70) return message.channel.send(thumbupembed)
    if (result > 60) return message.channel.send(okembed)
    if (result > 50) return message.channel.send(shrugembed)
    if (result > 40) return message.channel.send(idkembed)
    return message.channel.send(sadembed)
}

module.exports.help = {
  name: "rateWaifu",
  args: "{@user} {Waifuuuu}",
  description: "Rates a certain waifu of your choosing",
  example: `${config.prefix}rate Ynng`,
  aliases: ["rate", "ratewaifu"]
};

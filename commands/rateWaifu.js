const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {

    let waifu = args.join(" ");
    if (!args[0]) {
        let embed = new Discord.RichEmbed()
                .setTitle("I need your waifu's **name**")
                .setDescription('Try again?')
                .setTimestamp()
                .setColor(0xFF0013);
            message.channel.send(embed);
            return;
    }
    if (waifu.length > 30) {
        let embed = new Discord.RichEmbed()
                .setTitle("Your waifu's is over 30 characters??")
                .setDescription('I can\'t process that, try again?')
                .setTimestamp()
                .setColor(0xFF0013);
            message.channel.send(embed);
            return;
    }
    let result = Math.floor((Math.random() * 100) + 0);

    const happyrate = new Discord.RichEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 ❤`)
        .setColor(`GREEN`)

    const sadembed = new Discord.RichEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 😭`)
        .setColor(`GREEN`)

    const idkembed = new Discord.RichEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 🤔`)
        .setColor(`GREEN`)

    const shrugembed = new Discord.RichEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 🤷`)
        .setColor(`GREEN`)

    const okembed = new Discord.RichEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 👌`)
        .setColor(`GREEN`)

    const thumbupembed = new Discord.RichEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 👍`)
        .setColor(`GREEN`)

    const eyesembed = new Discord.RichEmbed()
        .setTitle("Rating...")
        .setDescription(`I would rate **${waifu}** ${result}/100 👀`)
        .setColor(`GREEN`)

    if (result > 90) return message.channel.send(happyrate)
    if (result < 30) return message.channel.send(sadembed)
    if (result > 40) return message.channel.send(idkembed)
    if (result > 50) return message.channel.send(shrugembed)
    if (result > 60) return message.channel.send(okembed)
    if (result > 70) return message.channel.send(thumbupembed)
    if (result > 80) return message.channel.send(eyesembed)
}

module.exports.help = {
  name: "rateWaifu",
  args: "{@user} {Waifuuuu}",
  description: "Rates a certain waifu of your choosing",
  example: `${config.prefix}rate Ynng`,
  aliases: ["report"]
};

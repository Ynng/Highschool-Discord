const config = require("../botconfig.json");


module.exports = bot => {
    console.log(`${bot.user.username} is online!`);

    let statusNum = 0;
    // console.log(bot.emojis);
    setInterval(() => {
        let statuses = [
            `over ${bot.guilds.cache.size} server(s)`,
            `over ${bot.users.cache.size} user(s)`
        ];
        let status = statuses[statusNum];
        bot.user.setActivity(`${status} | "${config.prefix}help"`, { type: "WATCHING" })
            // .then(presence => console.log(`Activity set to "${status}"`))
            .catch(console.error);
        if (statusNum >= statuses.length - 1) statusNum = 0;
        else statusNum++;
    }, 10000);
};
const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");
const request = require("request-promise-native");
const queryLimit = 30;


module.exports.run = async (bot, message, args) => {
    var requestQuery;
    if (!args[0]) return utils.simpleMessage(":warning: You need to enter a valid subreddit or something to search for", message, config.errorColor, config.tempTime);
    if (args[0].startsWith("r/")) {
        if (args.length > 1) {
            var subreddit = args.shift();
            requestQuery = {
                uri: `https://www.reddit.com/${subreddit}/search.json`,
                qs: {
                    q: args.join(" "),
                    sort: "relevance",
                    limit: queryLimit,
                    restrict_sr: 1
                },
                json: true
            };
        } else {
            requestQuery = {
                uri: `https://www.reddit.com/${args[0]}.json`,
                qs: {
                    limit: queryLimit,
                },
                json: true
            };
        }
    } else {
        requestQuery = {
            uri: `https://www.reddit.com/search.json`,
            qs: {
                q: args.join(" "),
                sort: "relevance",
                limit: queryLimit,
                restrict_sr: 0
            },
            json: true
        };
    }

    let loadingEmbed = new Discord.RichEmbed()
        .setTitle(`${bot.emojis.get(config.emojis.loadingEmojiId)} fetching...`)
        .setColor(config.loadingColor);
    utils.embedAddStamp(message, loadingEmbed, message.author);
    let loadingMessage = await message.channel.send(loadingEmbed);
    try {
        var requestResponse = (await request(requestQuery));
        requestResponse = requestResponse.data.children;
        for (var i = requestResponse.length - 1; i >= 0; i--) {
            //filtering out nsfw and videos
            if (requestResponse[i].data.over_18
                || requestResponse[i].data.is_video
                || requestResponse[i].data.media
                || !(requestResponse[i].data.url.endsWith(".png")
                    || requestResponse[i].data.url.endsWith(".jpg")
                    || requestResponse[i].data.url.endsWith(".gif")))
                requestResponse.splice(i, 1);
        }
        var responseLength = requestResponse.length;
        let childrenIndex = Math.floor(Math.random() * responseLength);
        requestResponse = requestResponse[childrenIndex].data;
        var redditEmbed = new Discord.RichEmbed()
            .setAuthor(`r/${requestResponse.subreddit}`)
            .setURL(`https://www.reddit.com${requestResponse.permalink}`)
            .setTitle(requestResponse.title)
            .setImage(requestResponse.url)
            .setColor(config.embedColor);
    } catch (e) {
        return utils.editSimpleMessage(":frowning2: Error, try searching for something else?", loadingMessage, message, config.errorColor, config.tempTime);
    }

    utils.embedAddStamp(message, redditEmbed, message.author);
    loadingMessage.edit(redditEmbed);
};

module.exports.help = {
    name: "reddit",
    args: `[r/subreddit name] [stuff to search for]`,
    example: "$r r/anime chika, $reddit r/animemes, $r minecraft cursed images",
    description: "Pulls a random image from the top 50 results on reddit",
    aliases: ["reddit", "r"],
};
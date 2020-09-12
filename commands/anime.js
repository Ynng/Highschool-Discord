const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");
const request = require("request-promise-native");

module.exports.run = async (bot, message, args) => {
    if (!args[0]) return utils.simpleMessage(":warning: You need to enter something to search for", message, config.errorColor, config.tempTime);
    var query = `
    query SearchQuery($search: String) {
      Media (search: $search, type: ANIME) {
        id
        title {
          english
          romaji
          native
        }
        format
        status
        episodes
        duration
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        meanScore
        popularity
        description(asHtml: false)
        coverImage {
          large
        }
      }
    }`;
    var requestQuery = {
        url: 'https://graphql.anilist.co',
        method: 'POST',
        headers: {
            'User-Agent': 'request',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: {
            query: query,
            variables: { search: args.join(" ") }
        },
        json: true
    };

    let loadingEmbed = new Discord.RichEmbed()
        .setTitle(`${bot.emojis.get(config.emojis.loadingEmojiId)} fetching...`)
        .setColor(config.loadingColor);
    utils.embedAddStamp(message, loadingEmbed, message.author);
    let loadingMessage = await message.channel.send(loadingEmbed);
    try {
        var requestResponse = (await request(requestQuery));
        // console.log(requestResponse);
        let anime = requestResponse.data.Media;

        var animeEmbed = new Discord.RichEmbed()
            .setColor(config.embedColor);

        //Thumbnail
        if (anime.coverImage["large"])
            animeEmbed.setThumbnail(anime.coverImage["large"]);

        //Title
        let animeTitle = [];
        if (anime.title.english)
            animeTitle.push(anime.title.english);
        if (anime.title.romaji)
            if (animeTitle[0] != anime.title.romaji)
                animeTitle.push(anime.title.romaji);
        if (anime.title.native)
            if (animeTitle[0] != anime.title.native)
                if (animeTitle[1] != anime.title.native)
                    animeTitle.push(anime.title.native);
        if (animeTitle.length < 1)
            animeTitle.push("*No Title*");
        animeEmbed.setTitle(animeTitle.shift());
        if (animeTitle.length > 0) {
            var description = "also known as:\n";
            animeTitle.forEach((name) => {
                description += `*\`${name}\`*\n`;
            });
            animeEmbed.setDescription(description);
        }

        //Format
        if (anime.format) {
            animeEmbed.addField("Format", anime.format
                .replace('TV_SHORT', 'TV Short')
                .replace('MOVIE', 'Movie')
                .replace('SPECIAL', 'Special')
                .replace('MUSIC', 'Music')
                .replace('MANGA', 'Manga')
                .replace('NOVEL', 'Novel')
                .replace('ONE_SHOT', 'One Shot'), true);
        }

        //Status
        if (anime.status) {
            animeEmbed.addField("Status", anime.status
                .replace('FINISHED', 'Finished')
                .replace('RELEASING', 'Airing')
                .replace('NOT_YET_RELEASED', 'Not Released'), true);
        }

        //Dates
        var dateStr = "";
        var dateTitleStr = "";
        if (anime.startDate.day) var startDateStr = `${utils.getMonthStr(anime.startDate.month)} ${anime.startDate.day}, ${anime.startDate.year}`;
        if (anime.endDate.day) var endDateStr = `${utils.getMonthStr(anime.endDate.month)} ${anime.endDate.day}, ${anime.endDate.year}`;
        if (startDateStr === endDateStr) endDateStr = "";
        if (startDateStr)
            if (endDateStr) {
                dateTitleStr = "Aired";
                dateStr = startDateStr + " to " + endDateStr;
            } else {
                dateTitleStr = "Aired on";
                dateStr = startDateStr;
            }
        else if (endDateStr) {
            dateTitleStr = "Ended on";
            dateStr = endDateStr;
        }
        if (dateStr && dateTitleStr) animeEmbed.addField(dateTitleStr, dateStr, true);

        //Episode/Time Count
        if (anime.episodes || anime.duration)
            animeEmbed.addField(anime.episodes != 1 ? "Episodes" : "Episode Length", `${anime.episodes != 1 ? anime.episodes + "eps (" + anime.duration + "mins)" : anime.duration + "mins"}`, true);

        //Score
        if (anime.meanScore)
            animeEmbed.addField("Score", `${anime.meanScore / 10.0}/10`, true);

        //Popularity
        if (anime.popularity)
            animeEmbed.addField("Popularity", anime.popularity, true);

        //Description
        if (anime.description) {
            anime.description = (anime.description).replace(/<[/a-zA-Z0-9]+>/g, '').replace(/[\r\n]/g, ' ');
            if (anime.description.length > 233) anime.description = anime.description.substring(0, 233) + `... [Read More](https://anilist.co/anime/${anime.id})`;
            animeEmbed.addField("Description", anime.description, true);
        } else {
            animeEmbed.addField("Want more information?", `[Learn More](https://anilist.co/anime/${anime.id})`, true);
        }


    } catch (e) {
        return utils.editSimpleMessage(":frowning2: No anime found, try searching for something else?", loadingMessage, message, config.errorColor, config.tempTime);
    }

    utils.embedAddStamp(message, animeEmbed, message.author);
    loadingMessage.edit(animeEmbed);
};

module.exports.help = {
    name: "anime",
    args: `{Search Term}`,
    example: "$a boku no pico, $anime sakurasou",
    description: "Pulls information about the searched anime from anilist",
    aliases: ["a", "anime"],
};
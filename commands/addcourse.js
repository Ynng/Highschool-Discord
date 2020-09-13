const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");
const courselist = require('../course_list.json');
const fs = require('fs');


module.exports.run = async (bot, message, args) => {
    if (utils.checkDm(message)) return;
    var re = new RegExp(/[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]/g);
    utils.safeDeleteMessage(message, 1000);

    //Match all potential course code with regex
    var rawCourses = message.content.match(re);
    if (!rawCourses)
        return utils.simpleMessage(":thinking: No valid course code detected!", message, config.errorColor, config.tempMsgTime /3 * 2);

    //Remove duplicated inputs
    rawCourses = [...new Set(rawCourses)];
    // Make sure all courses are valid (in the course list)
    var courses = [];
    for (entry in courselist)
        for (let i = rawCourses.length - 1; i >= 0; i--)
            if (rawCourses[i] === entry) {
                courses.push(rawCourses[i]);
                rawCourses.splice(i, 1);
            }

    // Sending a error message about all invalid course codes
    if (rawCourses.length > 0)
        utils.simpleMessage(`:thinking: ${utils.andisarejoin(rawCourses, ', ')} are not valid course codes!`, message, config.errorColor,  2 * config.tempMsgTime);

    if (courses.length == 0) return;

    //Check the already existing courses
    var courseCount = 0;
    for (role in message.member.roles)
        if (re.test(role.name))
            courseCount++;

    //Add course roles to the user
    var tooManyCourses = false;
    var addedCourses = [];
    courses.forEach(course => {
        if (courseCount > 8){
            tooManyCourses = true;
            return;
        }

        addedCourses.push(course);
        var existingRole = message.guild.roles.cache.find(r => r.name == course);
        courseCount++;

        if (existingRole != undefined) {
            message.member.roles.add(existingRole);
            return;
        }
        message.guild.roles.create({
            data: {
                name: course
            },
            reason: `New course ${course} required by ${message.member.displayName}`
        }).then(newRole => message.member.roles.add(newRole));

        fs.appendFile('log.txt', `New course ${course} required by ${message.member.displayName}\n`, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    })

    utils.simpleMessage(`:ok_hand: Added ${utils.andisarejoin(addedCourses, ', ')}  to your account!`, message, config.validColor,  2 * config.tempMsgTime);

    if(tooManyCourses)
        return utils.simpleMessage(":no_entry_sign: You have too many subjects already. Ask an admin to remove some for you before adding more!", message, config.errorColor, 2 * config.tempMsgTime);

};

module.exports.help = {
    name: "Add Course",
    args: "Any text containing course codes",
    description: "Add a new course to your user!",
    example: "&addcourse ENG1D0 COP4X0-01 MDM4U1-01 : Mathematics of Data",
    aliases: ["addcourse"]
};
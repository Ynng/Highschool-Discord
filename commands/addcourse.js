const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");
const list = require('../course_list.json');


module.exports.run = async (bot, message, args) => {
    var re = new RegExp(/[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]/g);
    // utils.safeDeleteMessage(message, 1000);

    var potentialCourses = message.content.match(re);

    
    if(! potentialCourses) {
        return utils.simpleMessage(":thinking: The course code is not valid, contact an admin for help!", message, config.errorColor, config.tempMsgTime);
    }

    noMatch = true;
    var courses = [];
    var wrongCourses = [];
    for(entry in list){
        potentialCourses.forEach(course => {
            if(course==entry){
                courses.push(course);
                noMatch = false;
            }
        })
    }

    var count = 0;
    for (role in message.member.roles) {
        if (re.test(role.name)) {
            count++;
        }
    }

    courses.forEach(course => {
        if (count < 10) {
            var roleAdd = message.guild.roles.cache.find(r => r.name == course);
            count++;

            if (roleAdd != undefined) {
                message.member.roles.add(roleAdd);
                return message.channel.send(`added ${course} to ${message.member.displayName}`);
            } else {
                message.guild.roles.create({
                    data: {
                        name: course
                    },
                    reason: `New course ${course} required by ${message.member.displayName}`
                }).then(newRole => message.member.roles.add(newRole));
                return message.channel.send(`New course ${course} required by ${message.member.displayName}`);
            }
        } else {
            return message.channel.send(`too many subjects`);
        }
    })
    

    // console.log(courses);

    // if(noMatch){
    //     return utils.simpleMessage(":thinking: The course code is not valid, contact an admin for help!", message, config.errorColor, config.tempMsgTime);
    // }
};

module.exports.help = {
    name: "Add Course",
    args: "Any text containing course codes",
    description: "Add a new course to your user!",
    example: "&addcourse ENG1D0 COP4X0-01 MDM4U1-01 : Mathematics of Data",
    aliases: ["addcourse"]
};
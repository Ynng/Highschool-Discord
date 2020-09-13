const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils");
const courselist = require('../course_list.json');
const fs = require('fs');
//Initiate a set for recent users




module.exports.run = async (bot, message, args) => {
    if(recent.has(message.author.id)){
        return utils.simpleMessage(":no_entry_sign: User has recently added their course code too fast", message, config.errorColor, config.tempMsgTime / 3 * 2);
    }
    else{
        messageContent = message.content.toUpperCase();
    messageContent = messageContent.replace(/\s/g, '');

    replyToUser = [];
    /****************************************
        Parsing user input
    *************************************/
    var re = new RegExp(/[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]/g);
    if (message.channel.name === config.welcomeChannel)
        utils.safeDeleteMessage(message);

    //Match all potential course code with regex
    var rawCourses = messageContent.match(re);
    if (!rawCourses)
        return utils.simpleMessage(":thinking: No valid course code detected!", message, config.errorColor, config.tempMsgTime);

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
        replyToUser.push([`:thinking: The following course codes are not valid!`, utils.andjoin(rawCourses, ', ')]);

    var coursesAlreadyIn = [];
    message.member.roles.cache.forEach(role => {
        for (let i = courses.length - 1; i >= 0; i--)
            if (courses[i] === role.name) {
                coursesAlreadyIn.push(role.name);
                courses.splice(i, 1);
            }
    });

    if (coursesAlreadyIn.length > 0)
        replyToUser.push([`:thinking: You are already in the following courses!`, utils.andjoin(coursesAlreadyIn, ', ')]);

    //Check the already existing courses
    var courseCount = 0;
    message.member.roles.cache.forEach(role => {
        if (re.test(role.name))
            courseCount++;
    })
    /****************************************
        Add course roles to the user
    *************************************/
    var tooManyCourses = false;
    var allAddedRoles = [];
    var newCreatedRoles = [];
    var addedCoursesString = [];
    for (i = 0; i < courses.length; i++) {
        course = courses[i];
        if (courseCount > 8) {
            tooManyCourses = true;
            continue;
        }
        addedCoursesString.push(course);
        var existingRole = message.guild.roles.cache.find(r => r.name == course);
        courseCount++;

        if (existingRole != undefined) {
            allAddedRoles.push(existingRole);
            message.member.roles.add(existingRole);
            continue;
        }

        //Creating new course role
        await message.guild.roles.create({
            data: {
                name: course
            },
            reason: `New course ${course} required by ${message.member.displayName}`
        }).then(newRole => {
            //Adds the role to the user
            message.member.roles.add(newRole);
            newCreatedRoles.push(newRole);
            allAddedRoles.push(newRole);
        });

        fs.appendFile('log.txt', `New course ${course} required by ${message.member.displayName}\n`, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

    /****************************************
        Create/Add "Grade" Channels
    *************************************/
    //If "Grades" category does not exist, create it
    var category = message.guild.channels.cache.find(channel => channel.name == "Grades");
    if (category == undefined)
        await message.guild.channels.create("Grades", { type: "category" })
    for (i = 0; i < newCreatedRoles.length; i++) {
        if (courselist[newCreatedRoles[i].name].grade == -1)
            continue;

        var grade = courselist[newCreatedRoles[i].name].grade;
        var gradeString = `grade-${grade + 8}`
        var channel = message.guild.channels.cache.find(channel => channel.name == gradeString);

        //If channel already exist, add the new role to permission overwrite 
        if (channel != undefined) {
            channel.createOverwrite(newCreatedRoles[i], { 'VIEW_CHANNEL': true });
        } else {
            //Else, create the new channel with the correct permission overwrite
            await message.guild.channels.create(gradeString, {
                parent: message.guild.channels.cache.find(channel => channel.name == "Grades"),
                position: grade,
                permissionOverwrites: [
                    {
                        id: newCreatedRoles[i].id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    }
                ]
            })
        }
    }


    /****************************************
        Create/Add "Departments" Channels
    *************************************/
    //If "Departments" category does not exist, create it
    var category = message.guild.channels.cache.find(channel => channel.name == "Departments");
    if (category == undefined)
        await message.guild.channels.create("Departments", { type: "category" })
    for (i = 0; i < newCreatedRoles.length; i++) {
        var department = courselist[newCreatedRoles[i].name].department;
        var channel = message.guild.channels.cache.find(channel => channel.topic == department);

        //If channel already exist, add the new role to permission overwrite 
        if (channel != undefined) {
            channel.createOverwrite(newCreatedRoles[i], { 'VIEW_CHANNEL': true });
        } else {
            //Else, create the new channel with the correct permission overwrite
            await message.guild.channels.create(department, {
                parent: message.guild.channels.cache.find(channel => channel.name == "Departments"),
                topic: department,
                permissionOverwrites: [
                    {
                        id: newCreatedRoles[i].id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    }
                ]
            })
        }
    }

    /****************************************
        Create/Add "Class" Channels
    *************************************/
    //If "Class" category does not exist, create it
    var category = message.guild.channels.cache.find(channel => channel.name == "Class");
    if (category == undefined)
        await message.guild.channels.create("Class", { type: "category" })
    for (i = 0; i < allAddedRoles.length; i++) {
        if (!courselist[allAddedRoles[i].name].dedicated_chat)
            continue;

        /****************************************
            Check to see if the new role has enough user
        *************************************/
        var courseCount = 1;//Yourself
        message.guild.members.cache.forEach(member => {
            if (member.id === message.author.id)
                return;
            if (member.roles.cache.find(r => r.name === allAddedRoles[i].name))
                courseCount++;
        })
        console.log(`${allAddedRoles[i].name} ${courseCount}/${config.classChannelUserRequirement}`);

        if (courseCount < config.classChannelUserRequirement)
            continue;

        var courseCode = allAddedRoles[i].name
        var courseName = courselist[courseCode].name;
        var channel = message.guild.channels.cache.find(channel => channel.topic == courseCode);
        //If channel already exist, skip
        if (channel != undefined)
            continue;
        //Else, create the new channel with the correct permission overwrite
        utils.simpleMessage(`:laughing: That's ${courseCount} whole people in ${allAddedRoles[i].name}! A dedicated chat is created!`, message, config.validColor, 4 * config.tempMsgTime);
        await message.guild.channels.create(courseName, {
            parent: message.guild.channels.cache.find(channel => channel.name == "Class"),
            topic: courseCode,
            permissionOverwrites: [
                {
                    id: allAddedRoles[i].id,
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                }
            ]
        }).then(channel => {
            let embed = new Discord.MessageEmbed()
                .setTitle(`:laughing: New Dedicated Chat!`)
                .addField(`Welcome to the new dedicated chat for ${allAddedRoles[i].name}!`, `${allAddedRoles[i]}This chat is created automatically. A dedicated class chat is created automatically when more then ${config.classChannelUserRequirement} people in the server have the same class.`)
                .setColor(config.embedColor);
            channel.send(embed);
        });
    }

    if (tooManyCourses)
        replyToUser.push([":no_entry_sign: You have too many classes already. Ask an admin to remove some for you before adding more!", "\u200b"]);

    let embed = new Discord.MessageEmbed()
        .setColor(`${config.errorColor}`)
        .setTitle("Error adding courses")
        .setFooter(`${message.author.username} | Removing this message in ${config.tempMsgTime * 2 / 1000} seconds`, message.author.avatarURL());

    if (addedCoursesString.length > 0){
        replyToUser.push([`:ok_hand: The following courses are added to your account!`, utils.andjoin(addedCoursesString, ', ')]);
        embed.setColor(config.embedColor).setTitle("Success adding courses");
    }
    
    for(let i = replyToUser.length - 1; i >= 0; i--){
        embed.addField(replyToUser[i][0], replyToUser[i][1]);
    }

    message.channel.send(embed);
    setTimeout(recent.delete(msg.author.id),30000)
    };
}


module.exports.help = {
    name: "addcourse",
    args: "Any text containing course codes",
    description: "Add a new course to your user!",
    example: `${config.prefix}addcourse ENG1D0 COP4X0-01 MDM4U1-01 : Mathematics of Data`,
    aliases: ["addcourse"]
};
export { nhieCommand };
import { NHIEQUESTIONS, sendMessage } from '../bot.js';
var questionLog = {};
function nhieCommand(args, message, guildSettings) {
    var index = undefined;
    var guild = message.guild;
    var channelSettings = guildSettings[message.channel.id]
    if (!channelSettings) return
    if (args.length > 1) {
        sendMessage(message.channel, "You can only specify one rating (pg, pg13, or r).");
    }
    else if (args.length === 0) {
        let categories = [];
        if (channelSettings["nhie pg"]) {
            categories.push("pg");
        }
        if (channelSettings["nhie pg13"]) {
            categories.push("pg13");
        }
        if (channelSettings["nhie r"]) {
            categories.push("r");
        }
        if (categories.length === 0) {
            sendMessage(message.channel, "Never Have I Ever questions are disabled here. To enable them, use `+enable nhie`.");
        }
        else {
            let rating = categories[Math.floor(Math.random() * categories.length)];
            do {
                index = Math.floor(Math.random() * NHIEQUESTIONS[rating].length);
            } while (questionLog[guild.id]?.includes(index));
            sendMessage(message.channel, NHIEQUESTIONS[rating][index]);
        }
    }
    else {
        if (!["pg", "pg13", "r"].includes(args[0])) {
            sendMessage(message.channel, args[0] + " is not a valid rating. Valid Never Have I Ever ratings are pg, pg13, and r.");
        }
        else {
            if (channelSettings[("nhie " + args[0])]) {
                do {
                    index = Math.floor(Math.random() * NHIEQUESTIONS[args[0]].length);
                } while (questionLog[guild.id]?.includes(index));
                sendMessage(message.channel, NHIEQUESTIONS[args[0]][index]);
            }
            else {
                sendMessage(message.channel, args[0].toUpperCase() + " Never Have I Ever questions are disabled here. To enable them, use `+enable nhie " + args[0] + "`.");
            }
        }
    }
    if (!(guild.id in questionLog)) {
        questionLog[guild.id] = [];
    }
    if (questionLog[guild.id].length > 30) {
        questionLog[guild.id].shift();
    }
    if (index) {
        questionLog[guild.id].push(index);
    }
}

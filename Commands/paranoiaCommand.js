export { paranoiaCommand };
import { PARANOIAQUESTIONS, sendMessage } from '../bot.js';
import { checkUserParanoia, addUser } from './paranoiaData.js';
var questionLog = {};
async function paranoiaCommand(args, message, guildSettings) {
    var index;
    var check = await checkUserParanoia(message.mentions.users.first()?.id, message.guild.id);
    var mentionedUsers = message.mentions.users;
    var guild = message.guild;
    var channelSettings = guildSettings[message.channel.id]
    if (!channelSettings) return
    if (mentionedUsers.size === 0) {
        sendMessage(message.channel, "You have to mention someone to send them a question.");
    }
    else if (mentionedUsers.size > 1) {
        sendMessage(message.channel, "You can only send a question to one user at a time.");
    }
    else if (args.length > 2) {
        sendMessage(message.channel, "You can only specify one rating (pg, pg13, or r).");
    }
    else if (check) {
        sendMessage(message.channel, "That user already has a question active.");
    }
    else if (args.length === 1) {
        let categories = [];
        if (channelSettings["paranoia pg"]) {
            categories.push("pg");
        }
        if (channelSettings["paranoia pg13"]) {
            categories.push("pg13");
        }
        if (channelSettings["paranoia r"]) {
            categories.push("r");
        }
        if (categories.length === 0) {
            sendMessage(message.channel, "Paranoia questions are disabled here. To enable them, use `+enable paranoia`.");
        }
        else {
            let rating = categories[Math.floor(Math.random() * categories.length)];
            do {
                index = Math.floor(Math.random() * PARANOIAQUESTIONS[rating].length);
            } while (questionLog[guild.id]?.includes(index));
            sendQuestionToUser(mentionedUsers.first(), rating, index, message);
        }
    }
    else if (args.length === 2) {
        let rating;
        if (/<@!?[0-9]+>/.test(args[0])) {
            rating = args[1];
        }
        else {
            rating = args[0];
        }
        if (!["pg", "pg13", "r"].includes(rating)) {
            sendMessage(message.channel, rating + " is not a valid rating. Valid paranoia ratings are pg, pg13, and r.");
        }
        else {
            if (channelSettings[("paranoia " + rating)]) {
                do {
                    index = Math.floor(Math.random() * PARANOIAQUESTIONS[rating].length);
                } while (questionLog[guild.id]?.includes(index));
                sendQuestionToUser(mentionedUsers.first(), rating, index, message)
            }
            else {
                sendMessage(message.channel, rating.toUpperCase() + " paranoia questions are disabled here. To enable them, use `+enable paranoia " + rating + "`.");
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
function sendQuestionToUser(user, rating, index, message) {
    user.send(`Question from ${message.author.username} in ${message.guild.name}: \n${PARANOIAQUESTIONS[rating][index]}\nReply with \`+ans [answer]\`.`)
        .then(() => { addUser(user.id, message.guild.id, message.channel.id, PARANOIAQUESTIONS[rating][index]); })
        .catch((err) => { sendMessage(message.channel, "That user has their DMs set to closed."); console.log(err); });
}

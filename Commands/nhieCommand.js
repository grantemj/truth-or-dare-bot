export { Command, SlashCommand, Meta };
import { NHIEQUESTIONS, sendMessage } from '../bot.js';
var questionLog = {};
function Command(args, message, channelSettings, prefix) {
    var index;
    var { guild } = message;
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
            sendMessage(message.channel, `Never Have I Ever questions are disabled here. To enable them, use \`${prefix}enable nhie\``);
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
                sendMessage(message.channel, `That rating is disabled here. To enable it, use \`+enable nhie ${args[0]}\``);
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

function SlashCommand(interaction, channelSettings) {
    var index
    var { guild, options } = interaction

    var rating
    if (options.has('rating')) {
        if (!channelSettings["nhie " + options.get('rating').value]) {
            interaction.editReply("That rating is disabled here")
            return
        } else {
            rating = options.get('rating').value
        }
    } else {
        let ratings = [];
        if (channelSettings["nhie pg"]) {
            ratings.push("pg");
        }
        if (channelSettings["nhie pg13"]) {
            ratings.push("pg13");
        }
        if (channelSettings["nhie r"]) {
            ratings.push("r");
        }

        if (ratings.length === 0) {
            interaction.editReply("All Never Have I Ever ratings are disabled here")
            return
        } else {
            rating = ratings[Math.floor(Math.random() * ratings.length)]
        }
    }

    do {
        index = Math.floor(Math.random() * NHIEQUESTIONS[rating].length);
    } while (questionLog[guild.id]?.includes(index));
    interaction.editReply(NHIEQUESTIONS[rating][index])

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

const Meta = {
    name: 'nhie',
    description: "Gives a random Never Have I Ever question to be answered",
    options: [
        {
            name: 'rating',
            description: "The maturity level of the topics the question can relate to",
            type: "STRING",
            required: false,
            choices: [
                { name: "pg", value: "pg" },
                { name: "pg13", value: "pg13" },
                { name: "r", value: "r" }
            ]
        }
    ]
}
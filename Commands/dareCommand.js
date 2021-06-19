export { Command, SlashCommand, Meta, Aliases };
import { DAREQUESTIONS, sendMessage } from '../bot.js';

const Aliases = ["d"]

var questionLog = {};

function Command(args, message, channelSettings, prefix) {
    var index;
    var guild = message.guild;
    if (args.length > 2) {
        sendMessage(message.channel, "You can only specify one rating (pg, pg13, r) and/or one type (d, irl).");
    }
    else if (args.length === 0) {
        let categories = [];
        if (channelSettings["dare d"]) {
            if (channelSettings["dare pg"]) {
                categories.push("pg_d");
            }
            if (channelSettings["dare pg13"]) {
                categories.push("pg13_d");
            }
            if (channelSettings["dare r"]) {
                categories.push("r_d");
            }
        }
        if (channelSettings["dare irl"]) {
            if (channelSettings["dare pg"]) {
                categories.push("pg_irl");
            }
            if (channelSettings["dare pg13"]) {
                categories.push("pg13_irl");
            }
            if (channelSettings["dare r"]) {
                categories.push("r_irl");
            }
        }
        if (categories.length === 0) {
            sendMessage(message.channel, `Dare questions are disabled here. To enable them, use \`${prefix}enable dare\``);
        }
        else {
            let category = categories[Math.floor(Math.random() * categories.length)];
            do {
                index = Math.floor(Math.random() * DAREQUESTIONS[category].length);
            } while (questionLog[guild.id]?.includes(index));
            sendMessage(message.channel, DAREQUESTIONS[category][index]);
        }
    }
    else if (args.length === 1) {
        if (!["pg", "pg13", "r", "d", "irl"].includes(args[0])) {
            sendMessage(message.channel, args[0] + " is not a valid rating/type. Valid dare ratings are pg, pg13, and r, and valid dare types are d and irl.");
        }
        else {
            if (["pg", "pg13", "r"].includes(args[0])) {
                if (channelSettings["dare " + args[0]]) {
                    let types = [];
                    if (channelSettings["dare d"]) {
                        types.push("d");
                    }
                    if (channelSettings["dare irl"]) {
                        types.push("irl");
                    }
                    if (types.length > 0) {
                        let type = types[Math.floor(Math.random() * types.length)];
                        do {
                            index = Math.floor(Math.random() * DAREQUESTIONS[(args[0] + "_" + type)].length);
                        } while (questionLog[guild.id]?.includes(index));
                        sendMessage(message.channel, DAREQUESTIONS[(args[0] + "_" + type)][index]);
                    }
                    else {
                        sendMessage(message.channel, `Dare questions are disabled here. To enable them, use \`${prefix}enable dare\``);
                    }
                } else {
                    sendMessage(message.channel, `That rating is disabled here. To enable it, use \`${prefix}enable dare ${args[0]}\``)
                }
            }
            else if (["d", "irl"].includes(args[0])) {
                if (channelSettings["dare " + args[0]]) {
                    let ratings = [];
                    if (channelSettings["dare pg"]) {
                        ratings.push("pg");
                    }
                    if (channelSettings["dare pg13"]) {
                        ratings.push("pg13");
                    }
                    if (channelSettings["dare r"]) {
                        ratings.push("r");
                    }
                    if (ratings.length > 0) {
                        let rating = ratings[Math.floor(Math.random() * ratings.length)];
                        do {
                            index = Math.floor(Math.random() * DAREQUESTIONS[(rating + "_" + args[0])].length);
                        } while (questionLog[guild.id]?.includes(index));
                        sendMessage(message.channel, DAREQUESTIONS[(rating + "_" + args[0])][index]);
                    }
                    else {
                        sendMessage(message.channel, `Dare questions are disabled here. To enable them, use \`${prefix}enable dare\``);
                    }
                } else {
                    sendMessage(message.channel, `That type is disabled here. To enable it, use \`${prefix}enable dare ${args[0]}\``)
                }
            }
        }
    }
    else if (args.length === 2) {
        if (!["pg", "pg13", "r", "d", "irl"].includes(args[0])) {
            sendMessage(message.channel, args[0] + " is not a valid rating/type. Valid dare ratings are pg, pg13, and r, and valid dare types are d and irl.");
        }
        else if (!["pg", "pg13", "r", "d", "irl"].includes(args[1])) {
            sendMessage(message.channel, args[1] + " is not a valid rating/type. Valid dare ratings are pg, pg13, and r, and valid dare types are d and irl.");
        }
        else if (["pg", "pg13", "r"].includes(args[0]) && ["pg", "pg13", "r"].includes(args[1])) {
            sendMessage(message.channel, "You can only specify one rating at a time.");
        }
        else if (["d", "irl"].includes(args[0]) && ["d", "irl"].includes(args[1])) {
            sendMessage(message.channel, "You can only specify one type at a time.");
        }
        else {
            let rating;
            let type;
            if (["pg", "pg13", "r"].includes(args[0])) {
                rating = args[0];
                type = args[1];
            }
            else {
                rating = args[1];
                type = args[0];
            }
            if (!channelSettings[("dare " + rating)]) {
                sendMessage(message.channel, `That rating is disabled here. To enable it, use \`${prefix}enable dare ${rating}\``);
            }
            else if (!channelSettings[("dare " + type)]) {
                sendMessage(message.channel, `That type is disabled here. To enable it, use \`${prefix}enable dare ${type}\``);
            }
            else {
                do {
                    index = Math.floor(Math.random() * DAREQUESTIONS[(rating + "_" + type)].length);
                } while (questionLog[guild.id]?.includes(index));
                sendMessage(message.channel, DAREQUESTIONS[(rating + "_" + type)][index]);
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
    var index;
    var { guild, options } = interaction

    var rating, type

    if (options.has('rating')) {
        if (!channelSettings["dare " + options.get('rating').value]) {
            interaction.editReply("That rating is disabled here")
            return
        } else {
            rating = options.get('rating').value
        }
    } else {
        let ratings = [];
        if (channelSettings["dare pg"]) {
            ratings.push("pg");
        }
        if (channelSettings["dare pg13"]) {
            ratings.push("pg13");
        }
        if (channelSettings["dare r"]) {
            ratings.push("r");
        }

        if (ratings.length === 0) {
            interaction.editReply("All dare ratings are disabled here")
            return
        } else {
            rating = ratings[Math.floor(Math.random() * ratings.length)]
        }
    }

    if (options.has('type')) {
        if (!channelSettings["dare " + options.get('type').value]) {
            interaction.editReply("That type is disabled here")
            return
        } else {
            type = options.get('type').value
        }
    } else {
        let types = [];
        if (channelSettings["dare d"]) {
            types.push("d");
        }
        if (channelSettings["dare irl"]) {
            types.push("irl");
        }

        if (types.length === 0) {
            interaction.editReply("All dare types are disabled here")
            return
        } else {
            type = types[Math.floor(Math.random() * types.length)]
        }
    }

    do {
        index = Math.floor(Math.random() * DAREQUESTIONS[rating + "_" + type].length);
    } while (questionLog[guild.id]?.includes(index));
    interaction.editReply(DAREQUESTIONS[rating + "_" + type][index])
    
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
    name: 'dare',
    description: "Gives a dare that has to be completed",
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
        },
        {
            name: 'type',
            description: "Whether the dare can be completed digitally or in real life",
            type: "STRING",
            required: false,
            choices: [
                { name: "d", value: "d" },
                { name: "irl", value: "irl" }
            ]
        }
    ]
}
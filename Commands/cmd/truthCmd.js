export { cmd };
import { Command } from '../commandTemplate.js';

const cmd = new Command({
    title: "Truth Command",
    aliases: ['truth', 't'],
    desc: 'Gives a random question that has to be answered truthfully',
    type: 'q',
    requiredArgs: [],
    optionalArgs: [
        {
            name: 'rating',
            description: "The maturity level of the topics the question can relate to",
            type: "STRING",
            choices: [
                { name: 'pg',     desc: 'Gives a \'PG\' question (no inappropriate content).'},
                { name: 'pg13',   desc: 'Gives a \'PG13\' rated question (may be suggestive, many have to with dating/relationships).'},
                { name: 'r',      desc: 'Gives a "R" rated question (most likely overtly sexual).'}
            ]
        }
    ],

    cmd: function (args, message, channelSettings, prefix) {
        var index;
        var { guild } = message;
        if (!channelSettings) return
        if (args.length > 1) {
            sendMessage(message.channel, "You can only specify one rating (pg, pg13, or r).");
        }
        else if (args.length === 0) {
            let categories = [];
            if (channelSettings["truth pg"]) {
                categories.push("pg");
            }
            if (channelSettings["truth pg13"]) {
                categories.push("pg13");
            }
            if (channelSettings["truth r"]) {
                categories.push("r");
            }
            if (categories.length === 0) {
                sendMessage(message.channel, `Truth questions are disabled here. To enable them, use \`${prefix}enable truth\``);
            }
            else {
                let rating = categories[Math.floor(Math.random() * categories.length)];
                do {
                    index = Math.floor(Math.random() * TRUTHQUESTIONS[rating].length);
                } while (questionLog[guild.id]?.includes(index));
                sendMessage(message.channel, TRUTHQUESTIONS[rating][index]);
            }
        }
        else {
            if (!["pg", "pg13", "r"].includes(args[0])) {
                sendMessage(message.channel, args[0] + " is not a valid rating. Valid truth ratings are pg, pg13, and r.");
            }
            else {
                if (channelSettings[("truth " + args[0])]) {
                    do {
                        index = Math.floor(Math.random() * TRUTHQUESTIONS[args[0]].length);
                    } while (questionLog[guild.id]?.includes(index));
                    sendMessage(message.channel, TRUTHQUESTIONS[args[0]][index]);
                }
                else {
                    sendMessage(message.channel, `That rating is disabled here. To enable it, use \`+enable truth ${args[0]}\``);
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
    },

    slash: function (interaction, channelSettings) {
        var index
        var { guild, options } = interaction
    
        var rating
        if (options.has('rating')) {
            if (!channelSettings["truth " + options.get('rating').value]) {
                interaction.editReply("That rating is disabled here")
                return
            } else {
                rating = options.get('rating').value
            }
        } else {
            let ratings = [];
            if (channelSettings["truth pg"]) {
                ratings.push("pg");
            }
            if (channelSettings["truth pg13"]) {
                ratings.push("pg13");
            }
            if (channelSettings["truth r"]) {
                ratings.push("r");
            }
    
            if (ratings.length === 0) {
                interaction.editReply("All truth ratings are disabled here")
                return
            } else {
                rating = ratings[Math.floor(Math.random() * ratings.length)]
            }
        }
    
        do {
            index = Math.floor(Math.random() * TRUTHQUESTIONS[rating].length);
        } while (questionLog[guild.id]?.includes(index));
        interaction.editReply(TRUTHQUESTIONS[rating][index])
    
        if (!(guild.id in questionLog)) {
            questionLog[guild.id] = [];
        }
        if (questionLog[guild.id].length > 50) {
            questionLog[guild.id].shift();
        }
        if (index) {
            questionLog[guild.id].push(index);
        }
    }
})
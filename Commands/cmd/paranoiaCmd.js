export { cmd };
import { Command } from '../commandTemplate.js';
import { PARANOIAQUESTIONS, sendMessage } from '../../bot.js';
import { checkUserParanoia, addUser } from './../paranoiaData.js';

var questionLog = {};

const cmd = new Command({
    title: "Paranoia Command",
    aliases: ['paranoia', 'p'],
    desc: 'Sends a paranoia question to the target through DMs',
    type: 'q',
    requiredArgs: [
        {
            name: 'target',
            description: "The user to send the paranoia question to",
            type: "USER",
        }
    ],
    optionalArgs: [
        {
            name: 'rating',
            description: "The maturity level of the topics the question can relate to",
            type: "STRING",
            choices: [
                { name: "pg",   desc: "Gives a \"PG\" question (no inappropriate content)" },
                { name: "pg13", desc: "Gives a \"PG-13\" question (may be suggestive, many have to with dating/relationships.)" },
                { name: "r",    desc: "Gives a \"R\" rated question (most likely overtly sexual)" }
            ]
        }
    ],

    cmd: function (args, message, channelSettings, prefix) {
        var index;
        var { guild } = message
        var check = await checkUserParanoia(message.mentions.users.first()?.id, message.guild.id);
        var mentionedUsers = message.mentions.users;
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
                sendMessage(message.channel, `Paranoia questions are disabled here. To enable them, use \`${prefix}enable paranoia\``);
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
                    sendMessage(message.channel, `${rating.toUpperCase()} paranoia questions are disabled here. To enable them, use \`${prefix}enable paranoia ${rating}\``);
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
        var user = options.get('target').user
        var check = await checkUserParanoia(user.id, guild.id);
    
        if (user.bot) {
            interaction.editReply("Bots can't answer paranoia questions, no matter how hard they try")
            return
        } else if (check) {
            interaction.editReply("That user already has a question active from this server")
            return
        }
    
        var rating
        if (options.has('rating')) {
            if (!channelSettings["paranoia " + options.get('rating').value]) {
                interaction.editReply("That rating is disabled here")
                return
            } else {
                rating = options.get('rating').value
            }
        } else {
            let ratings = [];
            if (channelSettings["paranoia pg"]) {
                ratings.push("pg");
            }
            if (channelSettings["paranoia pg13"]) {
                ratings.push("pg13");
            }
            if (channelSettings["paranoia r"]) {
                ratings.push("r");
            }
    
            if (ratings.length === 0) {
                interaction.editReply("All paranoia ratings are disabled here")
                return
            } else {
                rating = ratings[Math.floor(Math.random() * ratings.length)]
            }
        }
    
        do {
            index = Math.floor(Math.random() * PARANOIAQUESTIONS[rating].length);
        } while (questionLog[guild.id]?.includes(index));
        user.send(`Question from ${interaction.user.username} in ${guild.name}: \n${PARANOIAQUESTIONS[rating][index]}\nReply with \`/ans\``)
            .then(() => {
                addUser(user.id, guild.id, interaction.channel.id, PARANOIAQUESTIONS[rating][index])
                interaction.editReply("Paranoia question sent")
            })
            .catch((err) => {
                interaction.editReply("That user has their DMs set to closed")
                console.log(err)
            });
    
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
})

function sendQuestionToUser(user, rating, index, message) {
    user.send(`Question from ${message.author.username} in ${message.guild.name}: \n${PARANOIAQUESTIONS[rating][index]}\nReply with \`+ans [answer]\`.`)
        .then(() => {
            addUser(user.id, message.guild.id, message.channel.id, PARANOIAQUESTIONS[rating][index])
            sendMessage(message.channel, "Paranoia question sent")
        })
        .catch((err) => {
            sendMessage(message.channel, "That user has their DMs set to closed.")
            console.log(err)
        });
}

export { Command, SlashCommand, Meta, Aliases };
import { client, sendMessage, handler } from '../bot.js';
import { checkUserAns, removeUser } from './paranoiaData.js';

const Aliases = ["a"]

async function Command(args, message) {
    let checkUser = await checkUserAns(message.author.id);
    if (checkUser) {
        if (args.length === 0) {
            sendMessage(message.channel, "You have to provide an answer");
        }
        else {
            let channelSettings = await handler.query("getChannelSettings", checkUser.channel);
            if (!channelSettings) {
                sendMessage(message.channel, "Channel to send reply to was not found")
            } else if ((Math.random() < 0.55 && channelSettings["show paranoia"] === "default") || channelSettings["show paranoia"] === "all") {
                client.channels.forge(checkUser.channel).send(`Question: ${checkUser.question}\n${message.author.username} said: ${escapeString(args.join(" "))}`).catch(() => console.log("Invalid channel ID"));
            }
            else {
                client.channels.forge(checkUser.channel).send(`Question is kept secret\n${message.author.username} said: ${escapeString(args.join(" "))}`).catch(() => console.log("Invalid channel ID"));
            }
            if (/\[.+\]/.test(args.join(" "))) {
                sendMessage(message.channel, "You don't need to enclose your answer in brackets. Example: Use '+ans John', not '+ans [John]'.");
            }
            removeUser(message.author.id);
        }
    }
    else {
        sendMessage(message.channel, "You currently have no active questions");
    }
}

async function SlashCommand(interaction) {
    let checkUser = await checkUserAns(interaction.user.id)
    if (checkUser) {
        let channelSettings = await handler.query("getChannelSettings", checkUser.channel)
        if (!channelSettings) {
            interaction.editReply("Channel to send reply to was not found")
        } else if ((Math.random() < 0.55 && channelSettings["show paranoia"] === "default") || channelSettings["show paranoia"] === "all") {
            client.channels.forge(checkUser.channel).send(`Question: ${checkUser.question}\n${interaction.user.username} said: ${escapeString(interaction.options.get('answer').value)}`).catch(() => console.log("Invalid channel ID"))
        } else {
            client.channels.forge(checkUser.channel).send(`Question is kept secret\n${interaction.user.username} said: ${escapeString(interaction.options.get('answer').value)}`).catch(() => console.log("Invalid channel ID"));
        }
        removeUser(interaction.user.id)
        interaction.editReply("Answer sent")
    } else {
        interaction.editReply("You currently have no active questions")
    }
}

const Meta = {
    name: 'ans',
    description: 'Used to answer a paranoia question, can only be used in DMs',
    options: [
        {
            name: 'answer',
            type: 'STRING',
            description: "Your answer to the question",
            required: true
        }
    ]
}

function escapeString(string) {
    return (string
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, "\\n")
        .replace(/\"/g, '\\"')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\;/g, '\\;'));
}

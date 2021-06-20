export { Command, SlashCommand, Meta, Aliases };
import { sendMessage, handler } from '../bot.js';

const Aliases = ["c"]

function Command(args, message) {
    handler.query("deleteParanoiaData", message.author.id).then(() => {
        sendMessage(message.channel, "Paranoia question queue cleared");
    });
}

function SlashCommand(interaction) {
    handler.query("deleteParanoiaData", interaction.user.id).then(() => {
        interaction.reply("Paranoia question queue cleared")
    })
}

const Meta = {
    name: 'clear',
    description: "Used to clear a user's queue of paranoia questions"
}

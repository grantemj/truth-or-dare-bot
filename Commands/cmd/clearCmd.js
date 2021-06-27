export { cmd };
import { Command } from '../commandTemplate.js';

const cmd = new Command({
    title: "Clear Command",
    aliases: ['clear', 'c'],
    desc: 'Used to clear a user\'s queue of paranoia questions',
    type: 'q',
    requiredArgs: [],
    optionalArgs: [],

    cmd: function (args, message) {
        handler.query("deleteParanoiaData", message.author.id).then(() => {
            sendMessage(message.channel, "Paranoia question queue cleared");
        });
    },

    slash: function (interaction) {
        handler.query("deleteParanoiaData", interaction.user.id).then(() => {
            interaction.reply("Paranoia question queue cleared")
        })
    }
})
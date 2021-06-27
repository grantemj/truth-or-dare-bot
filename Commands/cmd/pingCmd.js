export { cmd };
import { Command } from '../commandTemplate.js';
import { client } from '../../bot.js';

const cmd = new Command({
    title: "Ping Command",
    aliases: ['ping'],
    desc: 'Displays the average ping between the bot and Discord\'s webservers.',
    type: 'c',
    requiredArgs: [],
    optionalArgs: [],

    cmd: function (args, message) {
        message.channel.send("Ping: " + client.ws.ping + "ms");
    },

    slash: function (interaction) {
        return interaction.editReply("Ping " + client.ws.ping + "ms");
    }
})
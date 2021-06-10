export { Command, SlashCommand };
import { client } from '../bot.js';
async function Command(message) {
    message.channel.send("Ping: " + client.ws.ping + "ms");
}
async function SlashCommand(interaction) {
    return interaction.editReply("Ping " + client.ws.ping + "ms");
}

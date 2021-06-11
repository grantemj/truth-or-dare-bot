export { Command, SlashCommand, Meta };
import { client } from '../bot.js';
async function Command(message) {
    message.channel.send("Ping: " + client.ws.ping + "ms");
}
async function SlashCommand(interaction) {
    return interaction.editReply("Ping " + client.ws.ping + "ms");
}
const Meta = {
    name: 'ping',
    description: "ping Displays the average ping between the bot and Discord's webservers"
}

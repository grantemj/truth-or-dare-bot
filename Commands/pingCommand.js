export { Command, SlashCommand, Meta };
import { client } from '../bot.js';
function Command(args, message) {
    message.channel.send("Ping: " + client.ws.ping + "ms");
}
function SlashCommand(interaction) {
    return interaction.editReply("Ping " + client.ws.ping + "ms");
}
const Meta = {
    name: 'ping',
    description: "Displays the average ping between the bot and Discord's webservers"
}

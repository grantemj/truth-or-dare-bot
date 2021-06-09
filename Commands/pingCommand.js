export { pingCommand };
import { client } from '../bot.js';
async function pingCommand(message) {
    message.channel.send("Ping: " + client.ws.ping + "ms");
}

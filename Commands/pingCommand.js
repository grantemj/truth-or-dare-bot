export { pingCommand };
import { client } from '../bot.js';
async function Command(message) {
    message.channel.send("Ping: " + client.ws.ping + "ms");
}

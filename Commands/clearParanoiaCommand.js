export { clearParanoiaCommand };
import { sendMessage, handler } from '../bot.js';
function clearParanoiaCommand(message) {
    handler.query("deleteParanoiaData", message.author.id).then(() => {
        sendMessage(message.channel, "Paranoia data cleared");
    });
}

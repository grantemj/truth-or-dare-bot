export { clearParanoiaCommand };
import { deleteParanoiaData } from '../mongodbFunctions.js';
import { sendMessage } from '../bot.js';
function clearParanoiaCommand(message) {
    deleteParanoiaData(message.author.id).then(() => {
        sendMessage(message.channel, "Paranoia data cleared");
    });
}

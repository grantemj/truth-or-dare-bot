export { truthfulCommand };
import { sendMessage } from '../bot.js';
function truthfulCommand(message, args) {
    if (message.mentions.users.size === 0) {
        sendMessage(message.channel, "You have to mention a user to gauge their truthfulness.");
    }
    else if (message.mentions.users.size > 1) {
        sendMessage(message.channel, "You can only check one user at a time.");
    }
    else if (message.mentions.users.size < args.length) {
        sendMessage(message.channel, "Ping one user at a time to check their truthfulness.");
    }
    else {
        let userID = BigInt(message.mentions.users.first().id);
        let userPercent = Number(userID % BigInt(100)) / 100;
        let truthPercent = (1.70667 * userPercent ** 3) - (2.56 * userPercent ** 2) + (1.85333 * userPercent);
        let timeModifier = ((Date.now() / 4320000) % 1000) / 83.33 - 6;
        let finalPercent = truthPercent + 0.15 * Math.sin((20 + timeModifier) * Math.PI * truthPercent);
        if (finalPercent > 1) {
            finalPercent -= 0.5;
        }
        else if (finalPercent < 0) {
            finalPercent += 0.5;
        }
        sendMessage(message.channel, `<@${message.mentions.users.first().id}> is ${Math.round(finalPercent * 100)}% truthful in their answers.`);
    }
}

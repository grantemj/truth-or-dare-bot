export { ansCommand };
import { client, sendMessage } from '../bot.js';
import { getServerSettings } from '../mongodbFunctions.js';
import { checkUserAns, removeUser } from './paranoiaData.js';
async function ansCommand(args, message) {
    let checkUser = await checkUserAns(message.author.id);
    if (checkUser) {
        if (args.length === 0) {
            sendMessage(message.channel, "You have to provide an answer");
        }
        else {
            let guildSettings = await getServerSettings(checkUser.guild);
            if (!guildSettings) {
                sendMessage("It appears that Truth or Dare is no longer a member of that server, or there has been some other error")
                return
            }
            if ((Math.random() < 0.55 && guildSettings[checkUser.channel]?.["show paranoia"] === "default") || guildSettings[checkUser.channel]?.["show paranoia"] === "all") {
                client.channels.forge(checkUser.channel).send(`Question: ${checkUser.question}\n${message.author.username} said: ${escapeString(args.join(" "))}`).catch(() => console.log("Invalid channel ID"));
            }
            else {
                client.channels.forge(checkUser.channel).send(`Question is kept secret\n${message.author.username} said: ${escapeString(args.join(" "))}`).catch(() => console.log("Invalid channel ID"));
            }
            if (/\[.+\]/.test(args.join(" "))) {
                sendMessage(message.channel, "You don't need to enclose your answer in brackets. Example: Use '+ans John', not '+ans [John]'.");
            }
            removeUser(message.author.id);
        }
    }
    else {
        sendMessage(message.channel, "You currently have no active questions");
    }
}
function escapeString(string) {
    return (string
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, "\\n")
        .replace(/\"/g, '\\"')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\;/g, '\\;'));
}

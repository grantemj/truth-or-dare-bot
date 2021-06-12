export { prefixCommand };
import { sendMessage, handler } from '../bot.js';
async function prefixCommand(args, message, guildPrefix) {
    let guild = message.guild
    let member = await guild.members.fetch(message.author.id, false)
    let roles = await Promise.all(member.roles.cache.map(role => guild.roles.fetch(role.id, false)))
    console.dir(roles)
    let admin = member.permissions.has("ADMINISTRATOR")
        || roles.some(role => role.permissions.has("ADMINISTRATOR"))
    if (!admin) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else if (args.length === 0) {
        sendMessage(message.channel, "Your current prefix is " + guildPrefix);
    }
    else if (args.length === 1) {
        handler.query("setPrefix", guild.id, args[0]);
        sendMessage(message.channel, `Prefix set to ${args[0]} followed by no space. To put a space between your prefix and the command, use ${args[0]}prefix [new prefix] s`);
    }
    else if (args.length === 2) {
        if (args[1] === "s") {
            handler.query("setPrefix", guild.id, args[0] + " ");
            sendMessage(message.channel, `Prefix set to ${args[0]} followed by a space.`);
        }
        else {
            sendMessage(message.channel, "Your new prefix cannot contain any spaces");
        }
    }
    else {
        sendMessage(message.channel, "Your new prefix cannot contain any spaces");
    }
}

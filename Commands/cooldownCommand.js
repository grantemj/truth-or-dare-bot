export { cooldownCommand };
import { sendMessage, handler } from '../bot.js';
async function cooldownCommand(args, message, guildCooldown) {
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
        sendMessage(message.channel, "Your current cooldown is " + (guildCooldown/1000).toFixed(1) + " seconds.");
    }
    else if (args.length === 1) {
        handler.query("setCooldown", guild.id, args[0]);
        sendMessage(message.channel, `Cooldown set to ${args[0]} seconds.`);
    }
    else if (args.length === 2) {
        if (args[1] === "s") {
            handler.query("setCooldown", guild.id, args[0] + " ");
            sendMessage(message.channel, `Cooldown set to ${args[0]} seconds.`);
        }
        else {
            sendMessage(message.channel, "Your new cooldown cannot contain any spaces.");
        }
    }
    else {
        sendMessage(message.channel, "Your new cooldown cannot contain any spaces.");
    }
}

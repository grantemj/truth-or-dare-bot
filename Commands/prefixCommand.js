export { prefixCommand };
import { sendMessage } from '../bot.js';
import { setPrefix } from '../mongodbFunctions.js';
async function prefixCommand(args, message, guildPrefix) {
    let guild = message.guild;
    let messageMember = await guild.members.fetch(message.author.id, false);
    await guild.roles.fetch();
    if (!messageMember.hasPermission('ADMINISTRATOR')) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else if (args.length === 0) {
        sendMessage(message.channel, "Your current prefix is " + guildPrefix);
    }
    else if (args.length === 1) {
        await setPrefix(guild.id, args[0]);
        sendMessage(message.channel, `Prefix set to ${args[0]} followed by no space. To put a space between your prefix and the command, use ${args[0]}prefix [new prefix] s`);
    }
    else if (args.length === 2) {
        if (args[1] === "s") {
            await setPrefix(guild.id, args[0] + " ");
            sendMessage(message.channel, `Prefix set to ${args[0]} followed by a space.`);
        }
        else {
            sendMessage(message.channel, "Your new prefix cannot contain any spaces");
        }
    }
    else {
        sendMessage(message.channel, "Your new prefix cannot contain any spaces");
    }
    await guild.roles.fetch({ cache: false, force: true });
}

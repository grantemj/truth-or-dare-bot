export { cmd };
import { Command } from '../commandTemplate.js';
import { sendMessage, handler } from '../../bot.js';

const cmd = new Command({
    title: "Prefix Command",
    aliases: ['prefix'],
    desc: 'Used to set a new prefix for the bot. Standard '+' prefix will be used in DMs.',
    type: 'c',
    requiredArgs: [
        {
            name: 'newPrefix',
            description: "New prefix must either contain +, !, $, %, ^, &, -, <, or >, or be between 4 and 8 characters long.",
            type: "STRING",
        }
    ],
    optionalArgs: [
        {
            name: 'infixSpace',
            description: 'By default, the bot will expect no space between the prefix and a command (ex. \`+truth\`). If you want an infix space (ex. \`tod truth\`), use \`${prefix}prefix [new prefix] s\`.',
            type: "STRING",
        }
    ],

    cmd: function (args, message, channelSettings, prefix) {
        let { guild } = message
        let member = await guild.members.fetch(message.author.id, false)
        let roles = await Promise.all(member.roles.cache.map(role => guild.roles.fetch(role.id, false)))
        let admin = member.permissions.has("ADMINISTRATOR")
            || roles.some(role => role.permissions.has("ADMINISTRATOR"))
        if (!admin) {
            sendMessage(message.channel, "You must be an administrator to use this command.");
        }
        else if (args.length === 0) {
            sendMessage(message.channel, "Your current prefix is " + prefix);
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
    },

    slash: function (interaction) {
    }
})
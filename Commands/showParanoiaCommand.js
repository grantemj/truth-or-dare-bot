export { showParanoiaCommand };
import { sendMessage } from '../bot.js';
import { settingsChange } from './settingsChange.js';
async function showParanoiaCommand(args, message, guildSettings, guildPrefix) {
    let guild = message.guild;
    let messageMember = await guild.members.fetch(message.author.id);
    if (!messageMember.hasPermission('ADMINISTRATOR')) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else {
        let server = args.includes("server");
        if (server) {
            if (args.length === 1) {
                sendMessage(message.channel, "You have to specify how many paranoia questions you want shown using `all`, `none`, or `default` (half).");
            }
            else if (args.includes("all")) {
                await settingsChange(message, guildSettings, ["show paranoia"], server, "all");
                sendMessage(message.channel, `All paranoia questions serverwide will now show after they are answered. To change this, use \`${guildPrefix}showparanoia\`.`);
            }
            else if (args.includes("none")) {
                await settingsChange(message, guildSettings, ["show paranoia"], server, "none");
                sendMessage(message.channel, `No paranoia questions serverwide will be shown after they are answered. To change this, use \`${guildPrefix}showparanoia\`.`);
            }
            else if (args.includes("default") || args.includes("half")) {
                await settingsChange(message, guildSettings, ["show paranoia"], server, "default");
                sendMessage(message.channel, `Half of the paranoias answered serverwide will have the questions displayed (intended behavior). To change this, use \`${guildPrefix}showparanoia\`.`);
            }
            else {
                sendMessage(message.channel, "That is not a valid option. Specify `all`, `none`, or `default`.");
            }
        }
        else {
            if (args.length === 0) {
                sendMessage(message.channel, "You have to specify how many paranoia questions you want shown using `all`, `none`, or `default` (half).");
            }
            else if (args.includes("all")) {
                await settingsChange(message, guildSettings, ["show paranoia"], server, "all");
                sendMessage(message.channel, `All paranoia questions will now show after they are answered. To change this, use \`${guildPrefix}showparanoia\`.`);
            }
            else if (args.includes("none")) {
                await settingsChange(message, guildSettings, ["show paranoia"], server, "none");
                sendMessage(message.channel, `No paranoia questions will be shown after they are answered. To change this, use \`${guildPrefix}showparanoia\`.`);
            }
            else if (args.includes("default") || args.includes("half")) {
                await settingsChange(message, guildSettings, ["show paranoia"], server, "default");
                sendMessage(message.channel, `Half of the paranoias answered will have the questions displayed (intended behavior). To change this, use \`${guildPrefix}showparanoia\`.`);
            }
            else {
                sendMessage(message.channel, "That is not a valid option. Specify `all`, `none`, or `default`.");
            }
        }
    }
}

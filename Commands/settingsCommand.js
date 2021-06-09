export { settingsCommand };
import { Discord, sendMessage } from '../bot.js';
function settingsCommand(args, message, guildSettings) {
    if (args.length == 0) {
        let channelSettings = guildSettings[message.channel.id];
        let settingsEmbed = new Discord.MessageEmbed()
            .setColor('#e73c3b')
            .setTitle('Channel Settings')
            .addFields({ name: "__Truth__", value: `pg: ${channelSettings["truth pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["truth pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["truth r"] ? ":white_check_mark:" : ":x:"}` }, { name: "__Dare__", value: `pg: ${channelSettings["dare pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["dare pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["dare r"] ? ":white_check_mark:" : ":x:"}\nd: ${channelSettings["dare d"] ? ":white_check_mark:" : ":x:"}    irl: ${channelSettings["dare irl"] ? ":white_check_mark:" : ":x:"}` }, { name: "__Would You Rather__", value: `pg: ${channelSettings["wyr pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["wyr pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["wyr r"] ? ":white_check_mark:" : ":x:"}` }, { name: "__Never Have I Ever__", value: `pg: ${channelSettings["nhie pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["nhie pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["nhie r"] ? ":white_check_mark:" : ":x:"}` }, { name: "__Paranoia__", value: `pg: ${channelSettings["paranoia pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["paranoia pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["paranoia r"] ? ":white_check_mark:" : ":x:"}\nshow paranoia: ${channelSettings["show paranoia"]}` })
            .setTimestamp();
        message.channel.send(settingsEmbed).catch(() => {
            sendMessage(message.channel, "Embeds are disabled in this channel");
        });
    }
}

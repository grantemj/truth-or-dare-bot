export { Command, SlashCommand, Meta, Aliases };
import { Discord, sendMessage, handler } from '../bot.js';

const Aliases = ["config"]

function Command(args, message, channelSettings) {
    if (args.length == 0) {
        let settingsEmbed = new Discord.MessageEmbed()
            .setColor('#e73c3b')
            .setTitle('Channel Settings')
            .addFields(
                {
                    name: "__Truth__", 
                    value: `pg: ${channelSettings["truth pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["truth pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["truth r"] ? ":white_check_mark:" : ":x:"}` 
                },
                {
                    name: "__Dare__",
                    value: `pg: ${channelSettings["dare pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["dare pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["dare r"] ? ":white_check_mark:" : ":x:"}\nd: ${channelSettings["dare d"] ? ":white_check_mark:" : ":x:"}    irl: ${channelSettings["dare irl"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Would You Rather__",
                    value: `pg: ${channelSettings["wyr pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["wyr pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["wyr r"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Never Have I Ever__",
                    value: `pg: ${channelSettings["nhie pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["nhie pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["nhie r"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Paranoia__",
                    value: `pg: ${channelSettings["paranoia pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["paranoia pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["paranoia r"] ? ":white_check_mark:" : ":x:"}\nshow paranoia: ${channelSettings["show paranoia"]}` 
                }
            )
            .setTimestamp();
        message.channel.send(settingsEmbed).catch(() => {
            sendMessage(message.channel, "Embeds are disabled in this channel");
        });
    }
}

async function SlashCommand(interaction, channelSettings) {
    let { options } = interaction
    if (options.has('channel')) {
        if (options.get('channel').channel.type !== "text") {
            interaction.editReply("The channel must be a text channel")
            return
        }

        let channelID = options.get('channel').channel.channelID
        let cs = await handler.query('getChannelSettings', channelID)

        var settingsEmbed = new Discord.MessageEmbed()
            .setColor('#e73c3b')
            .setTitle('Channel Settings')
            .addFields(
                {
                    name: "__Truth__", 
                    value: `pg: ${cs["truth pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${cs["truth pg13"] ? ":white_check_mark:" : ":x:"}    r: ${cs["truth r"] ? ":white_check_mark:" : ":x:"}` 
                },
                {
                    name: "__Dare__",
                    value: `pg: ${cs["dare pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${cs["dare pg13"] ? ":white_check_mark:" : ":x:"}    r: ${cs["dare r"] ? ":white_check_mark:" : ":x:"}\nd: ${cs["dare d"] ? ":white_check_mark:" : ":x:"}    irl: ${cs["dare irl"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Would You Rather__",
                    value: `pg: ${cs["wyr pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${cs["wyr pg13"] ? ":white_check_mark:" : ":x:"}    r: ${cs["wyr r"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Never Have I Ever__",
                    value: `pg: ${cs["nhie pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${cs["nhie pg13"] ? ":white_check_mark:" : ":x:"}    r: ${cs["nhie r"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Paranoia__",
                    value: `pg: ${cs["paranoia pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${cs["paranoia pg13"] ? ":white_check_mark:" : ":x:"}    r: ${cs["paranoia r"] ? ":white_check_mark:" : ":x:"}\nshow paranoia: ${cs["show paranoia"]}` 
                }
            )
            .setTimestamp();
    } else {
        var settingsEmbed = new Discord.MessageEmbed()
            .setColor('#e73c3b')
            .setTitle('Channel Settings')
            .addFields(
                {
                    name: "__Truth__", 
                    value: `pg: ${channelSettings["truth pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["truth pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["truth r"] ? ":white_check_mark:" : ":x:"}` 
                },
                {
                    name: "__Dare__",
                    value: `pg: ${channelSettings["dare pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["dare pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["dare r"] ? ":white_check_mark:" : ":x:"}\nd: ${channelSettings["dare d"] ? ":white_check_mark:" : ":x:"}    irl: ${channelSettings["dare irl"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Would You Rather__",
                    value: `pg: ${channelSettings["wyr pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["wyr pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["wyr r"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Never Have I Ever__",
                    value: `pg: ${channelSettings["nhie pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["nhie pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["nhie r"] ? ":white_check_mark:" : ":x:"}`
                },
                {
                    name: "__Paranoia__",
                    value: `pg: ${channelSettings["paranoia pg"] ? ":white_check_mark:" : ":x:"}    pg13: ${channelSettings["paranoia pg13"] ? ":white_check_mark:" : ":x:"}    r: ${channelSettings["paranoia r"] ? ":white_check_mark:" : ":x:"}\nshow paranoia: ${channelSettings["show paranoia"]}` 
                }
            )
            .setTimestamp();
    }
    interaction.editReply(settingsEmbed).catch(() => {
        interaction.editReply("Embeds are disabled in this channel")
    })
}

const Meta = {
    name: 'settings',
    description: "Lists the settings for the specified channel",
    options: [
        {
            name: 'channel',
            description: "The channel to list settings for",
            type: 'CHANNEL',
            required: false
        }
    ]
}
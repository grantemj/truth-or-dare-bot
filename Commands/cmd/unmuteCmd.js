export { cmd };
import { Command } from '../commandTemplate.js';
import { sendMessage, handler } from '../../bot.js';

const cmd = new Command({
    title: "Unmute Command",
    aliases: ['unmute', 'um'],
    desc: 'Used to unmute the bot in the channel the message the sent.',
    type: 'c',
    requiredArgs: [
        {
            name: 'serverwide',
            description: "Whether the bot should be unmuted across the whole server",
            type: "BOOLEAN",
        }
    ],
    optionalArgs: [
        {
            name: 'channel',
            description: "If not unmuting serverwide, which channel the bot should be unmuted in",
            type: "CHANNEL",
        }
    ],

    cmd: function (args, message, channelSettings, prefix) {
        let { guild } = message
        let member = await guild.members.fetch(message.author.id, false)
        let roles = await Promise.all(member.roles.cache.map(role => guild.roles.fetch(role.id, false)))
        let admin = member.permissions.has("ADMINISTRATOR")
            || roles.some(role => role.permissions.has("ADMINISTRATOR"))
        if (!admin) {
            sendMessage(message.channel, "You must be an administrator to use this command");
        }
        else {
            if (args.includes('server') && args.length === 1) {
                let serverChannels = await handler.query("getServerChannels", message.guild.id)
                for (let channel of serverChannels) {
                    let cs = await handler.query("getChannelSettings", channel)
                    cs["muted?"] = false
                    handler.query("setChannelSettings", channel, cs)
                }
                sendMessage(message.channel, `Unmuted serverwide. Use ${prefix}mute to mute`);
            }
            else if (args.length === 0) {
                if (channelSettings["muted?"] === false) {
                    sendMessage(message.channel, "I am already unmuted");
                }
                else {
                    channelSettings["muted?"] = false;
                    handler.query("setChannelSettings", message.channel.id, channelSettings);
                    sendMessage(message.channel, `Unmuted in this channel. Use ${prefix}mute to mute`);
                }
            }
        }
    },

    slash: function (interaction, channelSettings) {
        let { guild, options } = interaction
        let serverwide = options.get('serverwide').value
        if (serverwide) {
            let serverChannels = await handler.query("getServerChannels", guild.id)
            for (let channel of serverChannels) {
                let cs = await handler.query("getChannelSettings", channel)
                cs["muted?"] = false
                handler.query("setChannelSettings", channel, cs)
            }
            interaction.editReply("Muted serverwide. Use `/unmute` to unmute")
        } else if (options.has('channel')) {
            if (options.get('channel').channel.type !== "text") {
                interaction.editReply("The channel must be a text channel")
                return
            }
    
            let channelID = options.get('channel').channel.id
            let cs = await handler.query("getChannelSettings", channelID)
            cs["muted?"] = false
            handler.query("setChannelSettings", channelID, cs)
            interaction.editReply(`Unmuted in <#${channelID}>. Use \`/mute\` to mute>`)
        } else {
            channelSettings["muted?"] = false
            handler.query("setChannelSettings", interaction.channel.id, channelSettings)
            interaction.editReply("Unmuted in this channel. Use `/mute` to mute")
        }
    }
})
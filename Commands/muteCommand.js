export { Command, SlashCommand, Meta };
import { sendMessage, handler } from '../bot.js';
async function Command(args, message, channelSettings, prefix) {
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
                cs["muted?"] = true
                handler.query("setChannelSettings", channel, cs)
            }
            sendMessage(message.channel, `Muted serverwide. Use ${prefix}unmute to unmute`);
        }
        else if (args.length === 0) {
            if (channelSettings["muted?"] === true) {
                sendMessage(message.channel, "I am already muted");
            }
            else {
                channelSettings["muted?"] = true;
                handler.query("setChannelSettings", message.channel.id, channelSettings);
                sendMessage(message.channel, `Muted in this channel. Use ${prefix}unmute to unmute`);
            }
        }
    }
}

async function SlashCommand(interaction, channelSettings) {
    let { guild, options } = interaction
    let serverwide = options.get('serverwide').value
    if (serverwide) {
        let serverChannels = await handler.query("getServerChannels", guild.id)
        for (let channel of serverChannels) {
            let cs = await handler.query("getChannelSettings", channel)
            cs["muted?"] = true
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
        cs["muted?"] = true
        handler.query("setChannelSettings", channelID, cs)
        interaction.editReply(`Muted in <#${channelID}>. Use \`/unmute\` to unmute>`)
    } else {
        channelSettings["muted?"] = true
        handler.query("setChannelSettings", interaction.channel.id, channelSettings)
        interaction.editReply("Muted in this channel. Use `/unmute` to unmute")
    }
}

const Meta = {
    name: 'mute',
    description: "Used to mute the bot in the channel the message was sent",
    defaultPermission: false,
    options: [
        {
            name: 'serverwide',
            description: "Whether the bot should be muted across the whole server",
            type: "BOOLEAN",
            required: true
        },
        {
            name: 'channel',
            description: "If not muting serverwide, which channel the bot should be muted in",
            type: "CHANNEL",
            required: false
        }
    ]
}
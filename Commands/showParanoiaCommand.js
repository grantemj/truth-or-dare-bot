export { Command, SlashCommand, Meta };
import { sendMessage } from '../bot.js';
import { settingsChange } from './settingsChange.js';
async function Command(args, message, channelSettings, prefix) {
    let { guild, channel } = message
    let messageMember = await guild.members.fetch(message.author.id);
    if (!messageMember.hasPermission('ADMINISTRATOR')) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else {
        let server = args.includes("server");
        if (server) {
            if (args.length === 1) {
                sendMessage(channel, "You have to specify how many paranoia questions you want shown using `all`, `none`, or `default` (half).");
            } else if (args.length > 2) {
                sendMessage(channel, "You can only specify one setting")
            } else {
                let serverChannels = await handler.query("getServerChannels", guild.id)
                let value

                if (args.includes("all")) {
                    value = "all"
                    sendMessage(channel, `All paranoia questions serverwide will now show after they are answered. To change this, use \`${prefix}showparanoia\``)
                } else if (args.includes("none")) {
                    value = "none"
                    sendMessage(channel, `No paranoia questions serverwide will be shown after they are answered. To change this, use \`${prefix}showparanoia\``)
                } else if (args.includes("default") || args.includes("half")) {
                    value = "default"
                    sendMessage(channel, `Half of the paranoia questions answered serverwide will have the questions displayed (intended behavior). To change this, use \`${prefix}showparanoia\``)
                } else {
                    sendMessage(channel, "That is not a valid option. Specify `all`, `none`, or `default`")
                }

                if (value) {
                    for (let c of serverChannels) {
                        let cs = await handler.query("getChannelSettings", c)
                        settingsChange(c, cs, ["show paranoia"], value)
                    }
                }
            }
        }
        else {
            if (args.length === 0) {
                sendMessage(channel, "You have to specify how many paranoia questions you want shown using `all`, `none`, or `default` (half).");
            } else if (args.length > 1) {
                sendMessage(channel, "You can only specify one setting")
            } else {
                let value

                if (args[0] === "all") {
                    value = "all"
                    sendMessage(channel, `All paranoia questions will now show after they are answered. To change this, use \`${guildPrefix}showparanoia\``)
                } else if (args[0] === "none") {
                    value = "none"
                    sendMessage(channel, `No paranoia questions will be shown after they are answered. To change this, use \`${guildPrefix}showparanoia\``)
                } else if (args[0] === "default" || args[0] === "half") {
                    value = "default"
                    sendMessage(channel, `Half of the paranoia questions answered will have the questions displayed (intended behavior). To change this, use \`${guildPrefix}showparanoia\``)
                } else {
                    sendMessage("That is not a valid option. Specify `all`, `none`, or `default`")
                }

                if (value) {
                    settingsChange(channel.id, channelSettings, ["show paranoia"], value)
                }
            }
        }
    }
}

async function SlashCommand(interaction, channelSettings) {
    let { options, channel } = interaction
    
    let server = options.get('serverwide').value
    let value = options.get('value').value
    if (server) {
        if (value === "all") {
            interaction.editReply("All paranoia questions serverwide will now show after they are answered. To change this, use \`/showparanoia\`")
        } else if (value === "none") {
            interaction.editReply("No paranoia questions serverwide will be shown after they are answered. To change this, use \`/showparanoia\`")
        } else if (value === "default") {
            interaction.editReply("Half of the paranoia questions answered serverwide will have the questions displayed (intended behavior). To change this, use \`/showparanoia\`")
        }

        let serverChannels = await handler.query("getServerChannels", guild.id)
        for (let c of serverChannels) {
            let cs = await handler.query("getChannelSettings")
            settingsChange(c, cs, ["show paranoia"], value)
        }
    } else if (options.has('channel')) {
        if (options.get('channel').channel.type !== "text") {
            interaction.editReply("The channel must be a text channel")
            return
        }

        let targetChannel = options.get('channel').channel
        let cs = await handler.query("getChannelSettings", targetChannel.id)

        if (value === "all") {
            interaction.editReply(`All paranoia questions in <#${targetChannel.id}> will now show after they are answered. To change this, use \`/showparanoia\``)
        } else if (value === "none") {
            interaction.editReply(`No paranoia questions in <#${targetChannel.id}> will be shown after they are answered. To change this, use \`/showparanoia\``)
        } else if (value === "default") {
            interaction.editReply(`Half of the paranoia questions in <#${targetChannel.id}> answered will have the questions displayed (intended behavior). To change this, use \`/showparanoia\``)
        }

        settingsChange(targetChannel.id, cs, ["show paranoia"], value)
    } else {
        if (value === "all") {
            interaction.editReply("All paranoia questions will now show after they are answered. To change this, use \`/showparanoia\`")
        } else if (value === "none") {
            interaction.editReply("No paranoia questions will be shown after they are answered. To change this, use \`/showparanoia\`")
        } else if (value === "default") {
            interaction.editReply("Half of the paranoia questions answered will have the questions displayed (intended behavior). To change this, use \`/showparanoia\`")
        }

        settingsChange(channel.id, channelSettings, ["show paranoia"], value)
    }
}

const Meta = {
    name: 'showparanoia',
    description: "Change how often the question is shown for paranoia questions",
    options: [
        {
            name: 'serverwide',
            description: "Whether the setting applies to all channels in the server",
            type: "BOOLEAN",
            required: true
        },
        {
            name: 'value',
            description: "The value to change the setting to",
            type: "STRING",
            required: true,
            choices: [
                { name: "all", value: "all" },
                { name: "none", value: "none" },
                { name: "default", value: "default" }
            ]
        },
        {
            name: 'channel',
            description: "If not serverwide, the channel to change the setting in",
            type: "CHANNEL",
            required: false
        }
    ]
}
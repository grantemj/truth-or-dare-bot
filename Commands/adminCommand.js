export { SlashCommand, Meta }
import { client, commandIDs } from '../bot.js'
import * as https from 'https'

async function SlashCommand(interaction) {
    let { guild, user, options } = interaction
    let member = await guild.members.fetch(user.id, false)
    let roles = await Promise.all(member.roles.cache.map(role => guild.roles.fetch(role.id, false)))
    let admin = member.permissions.has("ADMINISTRATOR")
        || roles.some(role => role.permissions.has("ADMINISTRATOR"))

    if (!admin) {
        interaction.editReply("This command can only be used by those with admin permissions in this server")
        return
    }

    let set = options.get('set')
    let remove = options.get('remove')

    let role = set?.options.filter(x => x.name === "role")[0].role || remove?.options.filter(x => x.name === "role")[0].role
    // setPermissions is not supported on the latest discord.js-light release, may have to use a REST request instead 
    //
    // client.application.commands.setPermissions(guild.id, [
    //     {
    //         id: commandIDs.disable,
    //         permissions: [
    //             {
    //                 id: role.id,
    //                 type: "ROLE",
    //                 permission: options.has('set')
    //             }
    //         ]
    //     },
    //     {
    //         id: commandIDs.enable,
    //         permissions: [
    //             {
    //                 id: role.id,
    //                 type: "ROLE",
    //                 permission: options.has('set')
    //             }
    //         ]
    //     },
    //     {
    //         id: commandIDs.mute,
    //         permissions: [
    //             {
    //                 id: role.id,
    //                 type: "ROLE",
    //                 permission: options.has('set')
    //             }
    //         ]
    //     },
    //     {
    //         id: commandIDs.unmute,
    //         permissions: [
    //             {
    //                 id: role.id,
    //                 type: "ROLE",
    //                 permission: options.has('set')
    //             }
    //         ]
    //     }
    // ])

    for (let c of ["disable", "enable", "mute", "unmute"]) {
        let opts = {
            host: `discord.com`,
            port: 443,
            path: `/api/v8/applications/${client.application.id}/guilds/${guild.id}/commands/${commandIDs[c]}/permissions`,
            method: "PUT",
            headers: {
                'Authorization': `Bot ${process.env.TOKEN}`,
                'Content-Type': "application/json"
            }
        }

        let req = https.request(opts)
        req.on('error', console.error)
        req.write(JSON.stringify({
            permissions: [
                {
                    id: role.id,
                    type: 1,
                    permission: options.has('set')
                }
            ]
        }))
        req.end()
    }

    interaction.editReply(options.has('set') ? "Role set as an admin role" : "Role removed as an admin role")
}

const Meta = {
    name: 'admin',
    description: "Used to set or remove a role as an admin role (can use commands like enable and disable)",
    options: [
        {
            name: 'set',
            description: "Set a role as an admin role",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'role',
                    description: "The role to mark as an admin",
                    type: 'ROLE',
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: "Remove admin permissions from a role",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'role',
                    description: "The role to mark as an admin",
                    type: 'ROLE',
                    required: true
                }
            ]
        }
    ]
}
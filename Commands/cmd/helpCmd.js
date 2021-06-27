export { cmd };
import { Command } from '../commandTemplate.js';
import { Discord, sendMessage } from '../bot.js';

const cmd = new Command({
    title: "Help Command",
    aliases: ['help', 'h'],
    desc: '+help [command]: Lists all commands or gives info about a command.',
    type: 'c',
    requiredArgs: [],
    optionalArgs: [
        {
            name: 'command',
            description: "Gives info about a specific command",
            type: "STRING",
            required: false,
            choices: [
                { name: "q",        desc: "q" },
                { name: "c",        desc: "c" },
                { name: "help",     desc: "help" }, // Will need to eventually auto-gen the rest of these choices
                { name: "truth",    desc: "Asks a truth question, can specify type of question with arguments." },
                { name: "dare",     desc: "Gives a dare, can specify type of dare with arguments." },
                { name: "wyr",      desc: "Asks a 'would you rather' question, can specify type of question with arguments." },
                { name: "nhie",     desc: "Gives a 'never have I ever' prompt, can specify type with arguments." },
                { name: "paranoia", desc: "Sends a paranoia question to the target, can specify type of question with arguments. Answer a question with \'' + prefix + 'ans.\' You must mention the target (@ them), not type their nickname out." },
                { name: "clearparanoia", desc: "Used to clear unanswered paranoia questions, can only be done in DMs." },
                { name: "ans",      desc: "Used to answer a paranoia question, can only be done in DMs." }, 
                { name: "settings", desc: "settings" },
                { name: "links",    desc: "links" },
                { name: "truthful", desc: "Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions" },
                { name: "stats",    desc: "stats" },
                { name: "ping",     desc: "ping" },
                { name: "enable",   desc: "enable" },
                { name: "disable",  desc: "disable" },
                { name: "mute",     desc: "mute" },
                { name: "unmute",   desc: "unmute" },
                { name: "prefix",   desc: "prefix" }
            ]
        }
    ],

    cmd: function (args, message, channelSettings, prefix) {
        if (args.length == 0) {
            sendMessage(message.channel, createHelpEmbed(helpColor, 'Commands:', [
                { name: `__Question Commands__`, value: `${prefix}help q: Commands used to get questions or other fun content from the bot (truth, dare, paranoia, etc.)` },
                { name: `__Control Commands__`, value: `${prefix}help c: Commands used to control how the bot functions or change settings (enable, mute, prefix, etc.)` }
            ], prefix))
        }
        else if (args.length > 1) {
            for (let argument of args) {
                Command([argument], message, prefix);
            }
        }
        else if (args.length == 1) {
            switch (args[0]) {
                case "q":
                    sendMessage(message.channel, createHelpEmbed(helpColor, 'Question Commands:', [
                        { name: `__${prefix}truth [rating]__`, value: 'Asks a truth question, can specify type of question with arguments.' },
                        { name: `__${prefix}dare [rating] [type]__`, value: 'Gives a dare, can specify type of dare with arguments.' },
                        { name: `__${prefix}wyr [rating]__`, value: 'Asks a \'would you rather\' question, can specify type of question with arguments.' },
                        { name: `__${prefix}nhie [rating]__`, value: 'Gives a \'never have I ever\' prompt, can specify type with arguments.' },
                        { name: `__${prefix}paranoia [target] [rating]__`, value: 'Sends a paranoia question to the target, can specify type of question with arguments. Answer a question with \'' + prefix + 'ans.\' You must mention the target (@ them), not type their nickname out.' },
                        { name: `__${prefix}clearparanoia__`, value: 'Used to clear unanswered paranoia questions, can only be done in DMs.' },
                        { name: `__${prefix}ans [answer]__`, value: 'Used to answer a paranoia question, can only be done in DMs.' },
                        { name: `__${prefix}truthful [target]__`, value: 'Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions.' }
                    ], prefix))
                    break;
                case "c":
                    sendMessage(message.channel, createHelpEmbed(helpColor, 'Control Commands:', [
                        { name: `__${prefix}prefix [new prefix]__`, value: 'Used to set a new prefix for the bot.' },
                        { name: `__${prefix}settings__`, value: 'Lists the settings in the current channel. Use +enable and +disable to change settings.' },
                        { name: `__${prefix}enable [command] [category]__`, value: 'Used to enable categories or commands that have been disabled.' },
                        { name: `__${prefix}disable [command] [category]__`, value: 'Used to disable categories or commands. Everything except r rated commands is enabled by default.' },
                        { name: `__${prefix}showparanoia__`, value: 'Toggles between only 50% of paranoia questions being shown (intended use) and all of them.' },
                        { name: `__${prefix}mute__`, value: 'Used to mute the bot in the channel the message was sent.' },
                        { name: `__${prefix}unmute__`, value: 'Used to unmute the bot in the channel the message the sent.' },
                        { name: `__${prefix}links__`, value: 'Gives various links related to the bot, including the question submit form, feedback form, support server, how to add the bot to your own server, and more.' },
                        { name: `__${prefix}stats__`, value: 'Lists various measures and statistics about the bot and its performance.' }
                    ], prefix))
                    break;
                case "help": 
                    sendMessage(message.channel, createHelpEmbed(helpColor, 'Help command', [
                        { name: '__Aliases__', value: `\`${prefix}help\`, \`${prefix}h\`` },
                        { name: '__Usage__', value: `**${prefix}help [command]**: Gives info about a specific command` }
                    ], prefix))
                    break
                case "truth":
                case "t":
                    sendMessage(message.channel, createHelpEmbed(todColor, 'Truth command', [
                        { name: '__Aliases__', value: `\`${prefix}truth\`, \`${prefix}t\``},
                        { name: '__Usage__', value: `**${prefix}truth [rating]**: Gives a random question that has to be answered truthfully` },
                        { name: '__Arguments__', value: '**pg**: Gives a \'PG\' question (no inappropriate content)\n**pg13**: Gives a \'PG13\' rated question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                    ], prefix))
                    break;
                case "dare":
                case "d":
                    sendMessage(message.channel, createHelpEmbed(todColor, 'Dare command', [
                        { name: '__Aliases__', value: `\`${prefix}dare\`, \`${prefix}d\``},
                        { name: '__Usage__', value: `**${prefix}dare [rating] [type]**: Gives a dare that has to be completed.` },
                        { name: '__Arguments__', value: '**d**: Gives a dare that is done over the internet or on a device\n**irl**: Gives a dare that is done in real life/in person\n**pg**: Gives a "PG" dare (no inappropriate content)\n**pg13**: Gives a "PG-13" dare (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated dare (most likely overtly sexual)' }
                    ], prefix))
                    break;
                case "wyr":
                    sendMessage(message.channel, createHelpEmbed(wyrColor, "Would You Rather command", [
                        { name: '__Aliases__', value: `\`${prefix}wyr\``},
                        { name: '__Usage__', value: `**${prefix}wyr [rating]**: Gives a 'Would You Rather' question that has to be answered.` },
                        { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                    ], prefix))
                    break;
                case "nhie":
                    sendMessage(message.channel, createHelpEmbed(nhieColor, "Never Have I Ever command", [
                        { name: '__Aliases__', value: `\`${prefix}nhie\``},
                        { name: '__Usage__', value: `**${prefix}nhie [rating]**: Gives a 'Never Have I Ever' question that has to be answered.` },
                        { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                    ], prefix))
                    break;
                case "paranoia":
                case "p":
                    sendMessage(message.channel, createHelpEmbed(paranoiaColor, 'Paranoia command', [
                        { name: '__Aliases__', value: `\`${prefix}paranoia\`, \`${prefix}p\``},
                        { name: '__Usage__', value: `**${prefix}paranoia [target] [rating]**: Sends a paranoia question to the target. Select the target by @ing them.` },
                        { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                    ], message, prefix))
                    break;
                case "ans":
                    sendMessage(message.channel, createHelpEmbed(paranoiaColor, 'Answer command', [
                        { name: '__Aliases__', value: `\`${prefix}ans\`, \`${prefix}\`a`},
                        { name: '__Usage__', value: `**${prefix}ans [answer]**: Used to answer a paranoia question, can only be used in DMs. The brackets are placeholders and represent an argument, it is not required to enclose your answer in brackets. Example: Use \'${prefix}ans John\', not \'${prefix}ans [John]\'.` }
                    ], prefix))
                    break;
                case "links":
                case "link":
                case "vote":
                case "invite":
                    sendMessage(message.channel, createHelpEmbed(infoColor, 'Links command', [
                        { name: '__Aliases__', value: `\`${prefix}links\`, \`${prefix}link\`, \`${prefix}vote\`, \`${prefix}invite\``},
                        { name: '__Usage__', value: `**${prefix}links**: Gives various links related to the bot, including the question submit form, feedback form, support server, how to add the bot to your own server, and more.` }
                    ], prefix))
                    break;
                case "stats":
                    sendMessage(message.channel, createHelpEmbed(infoColor, "Stats Command", [
                        { name: '__Aliases__', value: `\`${prefix}stats\`, \`${prefix}s\``},
                        { name: '__Usage__', value: `**${prefix}stats**: +stats: Lists various measures and statistics about the bot and its performance.` }
                    ], prefix))
                    break;
                case "prefix":
                    sendMessage(message.channel, createHelpEmbed(settingsColor, 'Prefix command', [
                        { name: '__Aliases__', value: `\`${prefix}prefix\``},
                        { name: '__Usage__', value: `**${prefix}prefix [new prefix] [infix space]**: Used to set a new prefix for the bot. Standard '+' prefix will be used in DMs. New prefix must either contain +, !, $, %, ^, &, -, <, or >, or be between 4 and 8 characters long. By default, the bot will expect no space between the prefix and a command (ex. \`+truth\`). If you want an infix space (ex. \`tod truth\`), use \`${prefix}prefix [new prefix] s\`.` }
                    ], prefix))
                    break;
                case "config":
                case "settings":
                    sendMessage(message.channel, createHelpEmbed(settingsColor, 'Settings command', [
                        { name: '__Aliases__', value: `\`${prefix}settings\`, \`${prefix}config\``},
                        { name: '__Usage__', value: `**${prefix}settings**: Lists the settings for the current channel.` }
                    ], prefix))
                    break;
                case "en":
                case "enable":
                    sendMessage(message.channel, createHelpEmbed(settingsColor, 'Enable command', [
                        { name: '__Aliases__', value: `\`${prefix}enable\`, \`${prefix}en\``},
                        { name: '__Usage__', value: `**${prefix}enable [command] [rating]**: Enables the command/rating specified.` },
                        { name: '__Arguments__', value: '**server**: Enables serverwide. If this argument is absent, the command/category will be enabled only in the channel the message was sent.\n**pg**: Enables pg category for all commands, or can be added after a command to enable for that command only.\n**pg13**: Enables pg13 category for all commands, or can be added after a command to enable for that command only.\n**r**: Enables r category for all commands, or can be added after a command to enable for that command only.\n**d**: Enables digital category for the dare command.\n**irl**: Enables real life category for the dare command.\n**truth**: Enables all categories for the truth command.\n**dare**: Enables all categories for the dare command.\n**wyr**: Enables all categories for the Would You Rather command.\n**nhie**: Enables all categories for the Never Have I Ever command.\n**paranoia**: Enables all categories for the paranoia command.' }
                    ], prefix))
                    break;
                case "dis":
                case "disable":
                    sendMessage(message.channel, createHelpEmbed(settingsColor, 'Disable command', [
                        { name: '__Aliases__', value: `\`${prefix}disable\`, \`${prefix}dis\``},
                        { name: '__Usage__', value: `**${prefix}disable [command] [rating]**: Disables the command/rating specified.` },
                        { name: '__Arguments__', value: '**server**: Disables serverwide. If this argument is absent, the command/category will be disabled only in the channel the message was sent.\n**pg**: Disables pg category for all commands, or can be added after a command to disable for that command only.\n**pg13**: Disables pg13 category for all commands, or can be added after a command to disable for that command only.\n**r**: Disables r category for all commands, or can be added after a command to disable for that command only.\n**d**: Disables digital category for the dare command.\n**irl**: Disables real life category for the dare command.\n**truth**: Disables all categories for the truth command.\n**dare**: Disables all categories for the dare command.\n**wyr**: Disables all categories for the Would You Rather command.\n**nhie**: Disables all categories for the Never Have I Ever command.\n**paranoia**: Disables all categories for the paranoia command.' }
                    ], prefix))
                    break;
                case "m":
                case "mute":
                    sendMessage(message.channel, createHelpEmbed(settingsColor, 'Mute command', [
                        { name: '__Aliases__', value: `\`${prefix}mute\`, \`${prefix}m\``},
                        { name: '__Usage__', value: `**${prefix}mute**: Used to mute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                    ], prefix))
                    break;
                case "um":
                case "unmute":
                    sendMessage(message.channel, createHelpEmbed(settingsColor, 'Unmute command', [
                        { name: '__Aliases__', value: `\`${prefix}unmute\`, \`${prefix}um\``},
                        { name: '__Usage__', value: `**${prefix}unmute \n Used to unmute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                    ], prefix))
                    break;
                case "sp":
                case "showparanoia":
                    sendMessage(message.channel, createHelpEmbed(paranoiaColor, "Show Paranoia Command", [
                        { name: '__Aliases__', value: `\`${prefix}showparanoia\`, \`${prefix}toggleparanoia\`, \`${prefix}sp\``},
                        { name: '__Usage__', value: `**${prefix}showparanoia**: Toggles between only 50% of paranoia questions being shown (intended use) and all of them.` }
                    ], prefix))
                    break;
                case "c":
                case "clear":
                    sendMessage(message.channel, createHelpEmbed(paranoiaColor, "Clear Paranoia Command", [
                        { name: '__Aliases__', value: `\`${prefix}clearparanoia\`, \`${prefix}cp\``},
                        { name: '__Usage__', value: `**${prefix}clearparanoia**: Deletes the unanswered paranoia questions, can only be used in DMs.` }
                    ], prefix))
                    break;
                case "tf":
                case "truthful":
                    sendMessage(message.channel, createHelpEmbed(todColor, "Truthful Command", [
                        { name: '__Aliases__', value: `\`${prefix}truthful\`, \`${prefix}tf\``},
                        { name: '__Usage__', value: `**${prefix}truthful [target]**: Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions.` }
                    ], prefix))
                    break;
                case "ping":
                    sendMessage(message.channel, createHelpEmbed(infoColor, "Ping Command", [
                        { name: '__Aliases__', value: `\`${prefix}ping\``},
                        { name: '__Usage__', value: `**${prefix}ping**: Displays the average ping between the bot and Discord's webservers.` }
                    ], prefix))
                    break;
                default:
                    message.channel.send(args[0] + " is not a valid command.");
                    break;
            }
        }
    },

    slash: function (interaction, channelSettings) {
        if (!interaction.options.has('command')) {
            interaction.editReply(createHelpEmbed(helpColor, 'Commands:', [
                { name: `__Question Commands__`, value: `/help q: Commands used to get questions or other fun content from the bot (truth, dare, paranoia, etc.)` },
                { name: `__Control Commands__`, value: `/help c: Commands used to control how the bot functions or change settings (enable, mute, prefix, etc.)` }
            ], '/'))
        } else {
            let command = interaction.options.get('command').value
            switch(command) {
                case "q":
                    interaction.editReply(createHelpEmbed(helpColor, 'Question Commands:', [
                        { name: `__/truth [rating]__`, value: 'Asks a truth question, can specify type of question with arguments.' },
                        { name: `__/dare [rating] [type]__`, value: 'Gives a dare, can specify type of dare with arguments.' },
                        { name: `__/wyr [rating]__`, value: 'Asks a \'would you rather\' question, can specify type of question with arguments.' },
                        { name: `__/nhie [rating]__`, value: 'Gives a \'never have I ever\' prompt, can specify type with arguments.' },
                        { name: `__/paranoia [target] [rating]__`, value: 'Sends a paranoia question to the target, can specify type of question with arguments. Answer a question with \'' + prefix + 'ans.\' You must mention the target (@ them), not type their nickname out.' },
                        { name: `__/clearparanoia__`, value: 'Used to clear unanswered paranoia questions, can only be done in DMs.' },
                        { name: `__/ans [answer]__`, value: 'Used to answer a paranoia question, can only be done in DMs.' },
                        { name: `__/truthful [target]__`, value: 'Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions.' }
                    ], '/'))
                    break;
                case "c":
                    interaction.editReply(createHelpEmbed(helpColor, 'Control Commands:', [
                        { name: `__/prefix [new prefix]__`, value: 'Used to set a new prefix for the bot.' },
                        { name: `__/settings__`, value: 'Lists the settings in the current channel. Use +enable and +disable to change settings.' },
                        { name: `__/enable [command] [category]__`, value: 'Used to enable categories or commands that have been disabled.' },
                        { name: `__/disable [command] [category]__`, value: 'Used to disable categories or commands. Everything except r rated commands is enabled by default.' },
                        { name: `__/showparanoia__`, value: 'Toggles between only 50% of paranoia questions being shown (intended use) and all of them.' },
                        { name: `__/mute__`, value: 'Used to mute the bot in the channel the message was sent.' },
                        { name: `__/unmute__`, value: 'Used to unmute the bot in the channel the message the sent.' },
                        { name: `__/links__`, value: 'Gives various links related to the bot, including the question submit form, feedback form, support server, how to add the bot to your own server, and more.' },
                        { name: `__/stats__`, value: 'Lists various measures and statistics about the bot and its performance.' }
                    ], '/'))
                    break;
                case "help":
                    interaction.editReply(createHelpEmbed(helpColor, 'Help command', [
                        { name: '__Usage__', value: `**/help [command]**: Gives info about a specific command` }
                    ], '/'))
                case "truth":
                    interaction.editReply(createHelpEmbed(todColor, 'Truth command', [
                        { name: '__Usage__', value: `**/truth [rating]**: Gives a random question that has to be answered truthfully` },
                        { name: '__Arguments__', value: '**pg**: Gives a \'PG\' question (no inappropriate content)\n**pg13**: Gives a \'PG13\' rated question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                    ], '/'))
                    break;
                case "dare":
                    interaction.editReply(createHelpEmbed(todColor, 'Dare command', [
                        { name: '__Usage__', value: `**/dare [rating] [type]**: Gives a dare that has to be completed.` },
                        { name: '__Arguments__', value: '**d**: Gives a dare that is done over the internet or on a device\n**irl**: Gives a dare that is done in real life/in person\n**pg**: Gives a "PG" dare (no inappropriate content)\n**pg13**: Gives a "PG-13" dare (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated dare (most likely overtly sexual)' }
                    ], '/'))
                    break;
                case "wyr":
                    interaction.editReply(createHelpEmbed(wyrColor, "Would You Rather command", [
                        { name: '__Usage__', value: `**/wyr [rating]**: Gives a 'Would You Rather' question that has to be answered.` },
                        { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                    ], '/'))
                    break;
                case "nhie":
                    interaction.editReply(createHelpEmbed(nhieColor, "Never Have I Ever command", [
                        { name: '__Usage__', value: `**/nhie [rating]**: Gives a 'Never Have I Ever' question that has to be answered.` },
                        { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                    ], '/'))
                    break;
                case "paranoia":
                    interaction.editReply(createHelpEmbed(paranoiaColor, 'Paranoia command', [
                        { name: '__Usage__', value: `**/paranoia [target] [rating]**: Sends a paranoia question to the target. Select the target by @ing them.` },
                        { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                    ], '/'))
                    break;
                case "ans":
                    interaction.editReply(createHelpEmbed(paranoiaColor, 'Answer command', [
                        { name: '__Usage__', value: `**/ans [answer]**: Used to answer a paranoia question, can only be used in DMs. The brackets are placeholders and represent an argument, it is not required to enclose your answer in brackets. Example: Use \'/ans John\', not \'/ans [John]\'.` }
                    ], '/'))
                    break;
                case "links":
                    interaction.editReply(createHelpEmbed(infoColor, 'Links command', [
                        { name: '__Usage__', value: `**/links**: Gives various links related to the bot, including the question submit form, feedback form, support server, how to add the bot to your own server, and more.` }
                    ], '/'))
                    break;
                case "stats":
                    interaction.editReply(createHelpEmbed(infoColor, "Stats Command", [
                        { name: '__Usage__', value: `**/stats**: +stats: Lists various measures and statistics about the bot and its performance.` }
                    ], '/'))
                    break;
                case "settings":
                    interaction.editReply(createHelpEmbed(settingsColor, 'Settings command', [
                        { name: '__Usage__', value: `**/settings [channel]**: Lists the settings for the specified channel.` }
                    ], '/'))
                    break;
                case "enable":
                    interaction.editReply(createHelpEmbed(settingsColor, 'Enable command', [
                        { name: '__Usage__', value: `**/enable [command] [rating]**: Enables the command/rating specified.` },
                        { name: '__Arguments__', value: '**server**: Enables serverwide. If this argument is absent, the command/category will be enabled only in the channel the message was sent.\n**pg**: Enables pg category for all commands, or can be added after a command to enable for that command only.\n**pg13**: Enables pg13 category for all commands, or can be added after a command to enable for that command only.\n**r**: Enables r category for all commands, or can be added after a command to enable for that command only.\n**d**: Enables digital category for the dare command.\n**irl**: Enables real life category for the dare command.\n**truth**: Enables all categories for the truth command.\n**dare**: Enables all categories for the dare command.\n**wyr**: Enables all categories for the Would You Rather command.\n**nhie**: Enables all categories for the Never Have I Ever command.\n**paranoia**: Enables all categories for the paranoia command.' }
                    ], '/'))
                    break;
                case "disable":
                    interaction.editReply(createHelpEmbed(settingsColor, 'Disable command', [
                        { name: '__Usage__', value: `**/disable [command] [rating]**: Disables the command/rating specified.` },
                        { name: '__Arguments__', value: '**server**: Disables serverwide. If this argument is absent, the command/category will be disabled only in the channel the message was sent.\n**pg**: Disables pg category for all commands, or can be added after a command to disable for that command only.\n**pg13**: Disables pg13 category for all commands, or can be added after a command to disable for that command only.\n**r**: Disables r category for all commands, or can be added after a command to disable for that command only.\n**d**: Disables digital category for the dare command.\n**irl**: Disables real life category for the dare command.\n**truth**: Disables all categories for the truth command.\n**dare**: Disables all categories for the dare command.\n**wyr**: Disables all categories for the Would You Rather command.\n**nhie**: Disables all categories for the Never Have I Ever command.\n**paranoia**: Disables all categories for the paranoia command.' }
                    ], '/'))
                    break;
                case "mute":
                    interaction.editReply(createHelpEmbed(settingsColor, 'Mute command', [
                        { name: '__Usage__', value: `**/mute**: Used to mute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                    ], '/'))
                    break;
                case "unmute":
                    interaction.editReply(createHelpEmbed(settingsColor, 'Unmute command', [
                        { name: '__Usage__', value: `**/unmute**: Used to unmute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                    ], '/'))
                    break;
                case "admin":
                    interaction.editReply(createHelpEmbed(settingsColor, 'Admin command', [
                        { name: '__Usage__', value: `**/admin [set/remove] [role]**: Used to set/remove a role as an admin (can use certain slash commands, does NOT have anything to do with the Administrator setting on roles in Discord)` },
                        { name: '__Arguments__', value: `**set/remove**: Whether to set or remove admin permissions from a role\n**role**: The role to set/remove as an admin` }
                    ], '/'))
                    break
                case "showparanoia":
                    interaction.editReply(createHelpEmbed(paranoiaColor, "Show Paranoia Command", [
                        { name: '__Usage__', value: `**/showparanoia**: Toggles between only 50% of paranoia questions being shown (intended use) and all of them.` }
                    ], '/'))
                    break;
                case "clear":
                    interaction.editReply(createHelpEmbed(paranoiaColor, "Clear Paranoia Command", [
                        { name: '__Usage__', value: `**/clearparanoia**: Deletes the unanswered paranoia questions, can only be used in DMs.` }
                    ], '/'))
                    break;
                case "truthful":
                    interaction.editReply(createHelpEmbed(todColor, "Truthful Command", [
                        { name: '__Usage__', value: `**/truthful [target]**: Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions.` }
                    ], '/'))
                    break;
                case "ping":
                    interaction.editReply(createHelpEmbed(infoColor, "Ping Command", [
                        { name: '__Usage__', value: `**/ping**: Displays the average ping between the bot and Discord's webservers.` }
                    ], '/'))
                    break;
            }
        }
    }
})

function createHelpEmbed(color, title, fields, prefix) {
    return new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .addFields(...fields)
        .setTimestamp()
        .setFooter(`Use '${prefix}help [command]' for more information on a specific command`, 'https://i.imgur.com/rTRsrJ5.png');
}
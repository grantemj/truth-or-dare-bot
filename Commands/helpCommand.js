export { Command, SlashCommand, Meta };
import { Discord, sendMessage } from '../bot.js';
function Command(args, message, channelSettings, prefix) {
    if (args.length == 0) {
        sendMessage(message.channel, createHelpEmbed("#3498da", 'Commands:', [
            { name: `__Question Commands__`, value: `${prefix}help q: Commands used to get questions or other fun content from the bot (truth, dare, paranoia, etc.)` },
            { name: `__Control Commands__`, value: `${prefix}help c: Commands used to control how the bot functions or change settings (enable, mute, prefix, etc.)` }
        ], prefix))
    }
    else if (args.length > 1) {
        for (let argument of args) {
            helpCommand([argument], message, prefix);
        }
    }
    else if (args.length == 1) {
        switch (args[0]) {
            case "q":
                sendMessage(message.channel, createHelpEmbed('#3498da', 'Question Commands:', [
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
                sendMessage(message.channel, createHelpEmbed('#3498da', 'Control Commands:', [
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
            case "truth":
            case "t":
                sendMessage(message.channel, createHelpEmbed('#e67e21', 'Truth command', [
                    { name: '__Aliases', value: `\`${prefix}truth\`, \`${prefix}t\``},
                    { name: '__Usage__', value: `**${prefix}truth [rating]**: Gives a random question that has to be answered truthfully` },
                    { name: '__Arguments__', value: '**pg**: Gives a \'PG\' question (no inappropriate content)\n**pg13**: Gives a \'PG13\' rated question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], prefix))
                break;
            case "dare":
            case "d":
                sendMessage(message.channel, createHelpEmbed('#e67e21', 'Dare command', [
                    { name: '__Aliases', value: `\`${prefix}dare\`, \`${prefix}d\``},
                    { name: '__Usage__', value: `**${prefix}dare [rating] [type]**: Gives a dare that has to be completed.` },
                    { name: '__Arguments__', value: '**d**: Gives a dare that is done over the internet or on a device\n**irl**: Gives a dare that is done in real life/in person\n**pg**: Gives a "PG" dare (no inappropriate content)\n**pg13**: Gives a "PG-13" dare (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated dare (most likely overtly sexual)' }
                ], prefix))
                break;
            case "wyr":
                sendMessage(message.channel, createHelpEmbed('#f1c40e', "Would You Rather command", [
                    { name: '__Aliases', value: `\`${prefix}wyr\``},
                    { name: '__Usage__', value: `**${prefix}wyr [rating]**: Gives a 'Would You Rather' question that has to be answered.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], prefix))
                break;
            case "nhie":
                sendMessage(message.channel, createHelpEmbed('#2ecc70', "Never Have I Ever command", [
                    { name: '__Aliases', value: `\`${prefix}nhie\``},
                    { name: '__Usage__', value: `**${prefix}nhie [rating]**: Gives a 'Never Have I Ever' question that has to be answered.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], prefix))
                break;
            case "paranoia":
            case "p":
                sendMessage(message.channel, createHelpEmbed('#9b59b5', 'Paranoia command', [
                    { name: '__Aliases', value: `\`${prefix}paranoia\`, \`${prefix}p\``},
                    { name: '__Usage__', value: `**${prefix}paranoia [target] [rating]**: Sends a paranoia question to the target. Select the target by @ing them.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], message, prefix))
                break;
            case "ans":
                sendMessage(message.channel, createHelpEmbed('#9b59b5', 'Answer command', [
                    { name: '__Aliases', value: `\`${prefix}ans\``},
                    { name: '__Usage__', value: `**${prefix}ans [answer]**: Used to answer a paranoia question, can only be used in DMs. The brackets are placeholders and represent an argument, it is not required to enclose your answer in brackets. Example: Use \'${prefix}ans John\', not \'${prefix}ans [John]\'.` }
                ], prefix))
                break;
            case "links":
            case "link":
            case "vote":
            case "invite":
                sendMessage(message.channel, createHelpEmbed('#e91e62', 'Links command', [
                    { name: '__Aliases', value: `\`${prefix}links\`, \`${prefix}link\`, \`${prefix}vote\`, \`${prefix}invite\``},
                    { name: '__Usage__', value: `**${prefix}links**: Gives various links related to the bot, including the question submit form, feedback form, support server, how to add the bot to your own server, and more.` }
                ], prefix))
                break;
            case "stats":
                sendMessage(message.channel, createHelpEmbed("#e91e62", "Stats Command", [
                    { name: '__Aliases', value: `\`${prefix}stats\`, \`${prefix}s\``},
                    { name: '__Usage__', value: `**${prefix}stats**: +stats: Lists various measures and statistics about the bot and its performance.` }
                ], prefix))
                break;
            case "prefix":
                sendMessage(message.channel, createHelpEmbed('#e73c3b', 'Prefix command', [
                    { name: '__Aliases', value: `\`${prefix}truth\`, \`${prefix}t\``},
                    { name: '__Usage__', value: `**${prefix}prefix [new prefix] [infix space]**: Used to set a new prefix for the bot. Standard '+' prefix will be used in DMs. New prefix must either contain +, !, $, %, ^, &, -, <, or >, or be between 4 and 8 characters long. By default, the bot will expect no space between the prefix and a command (ex. \`+truth\`). If you want an infix space (ex. \`tod truth\`), use \`${prefix}prefix [new prefix] s\`.` }
                ], prefix))
                break;
            case "config":
            case "settings":
                sendMessage(message.channel, createHelpEmbed('#e73c3b', 'Settings command', [
                    { name: '__Aliases', value: `\`${prefix}settings\`, \`${prefix}config\``},
                    { name: '__Usage__', value: `**${prefix}settings**: Lists current settings both serverwide and in the channel the message was sent. If a category is not shown, it is enabled by default.` }
                ], prefix))
                break;
            case "en":
            case "enable":
                sendMessage(message.channel, createHelpEmbed('#e73c3b', 'Enable command', [
                    { name: '__Aliases', value: `\`${prefix}enable\`, \`${prefix}en\``},
                    { name: '__Usage__', value: `**${prefix}enable [command] [rating]**: Enables the command/rating specified.` },
                    { name: '__Arguments__', value: '**server**: Enables serverwide. If this argument is absent, the command/category will be enabled only in the channel the message was sent.\n**pg**: Enables pg category for all commands, or can be added after a command to enable for that command only.\n**pg13**: Enables pg13 category for all commands, or can be added after a command to enable for that command only.\n**r**: Enables r category for all commands, or can be added after a command to enable for that command only.\n**d**: Enables digital category for the dare command.\n**irl**: Enables real life category for the dare command.\n**truth**: Enables all categories for the truth command.\n**dare**: Enables all categories for the dare command.\n**wyr**: Enables all categories for the Would You Rather command.\n**nhie**: Enables all categories for the Never Have I Ever command.\n**paranoia**: Enables all categories for the paranoia command.' }
                ], prefix))
                break;
            case "dis":
            case "disable":
                sendMessage(message.channel, createHelpEmbed('#e73c3b', 'Disable command', [
                    { name: '__Aliases', value: `\`${prefix}disable\`, \`${prefix}dis\``},
                    { name: '__Usage__', value: `**${prefix}disable [command] [rating]**: Disables the command/rating specified.` },
                    { name: '__Arguments__', value: '**server**: Disables serverwide. If this argument is absent, the command/category will be disabled only in the channel the message was sent.\n**pg**: Disables pg category for all commands, or can be added after a command to disable for that command only.\n**pg13**: Disables pg13 category for all commands, or can be added after a command to disable for that command only.\n**r**: Disables r category for all commands, or can be added after a command to disable for that command only.\n**d**: Disables digital category for the dare command.\n**irl**: Disables real life category for the dare command.\n**truth**: Disables all categories for the truth command.\n**dare**: Disables all categories for the dare command.\n**wyr**: Disables all categories for the Would You Rather command.\n**nhie**: Disables all categories for the Never Have I Ever command.\n**paranoia**: Disables all categories for the paranoia command.' }
                ], prefix))
                break;
            case "m":
            case "mute":
                sendMessage(message.channel, createHelpEmbed('#e73c3b', 'Mute command', [
                    { name: '__Aliases', value: `\`${prefix}mute\`, \`${prefix}m\``},
                    { name: '__Usage__', value: `**${prefix}mute**: Used to mute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                ], prefix))
                break;
            case "um":
            case "unmute":
                sendMessage(message.channel, createHelpEmbed('#e73c3b', 'Unmute command', [
                    { name: '__Aliases', value: `\`${prefix}unmute\`, \`${prefix}um\``},
                    { name: '__Usage__', value: `**${prefix}unmute \n Used to unmute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                ], prefix))
                break;
            case "sp":
            case "toggleparanoia":
            case "showparanoia":
                sendMessage(message.channel, createHelpEmbed('#e73c3b', "Show Paranoia Command", [
                    { name: '__Aliases', value: `\`${prefix}showparanoia\`, \`${prefix}toggleparanoia\`, \`${prefix}sp\``},
                    { name: '__Usage__', value: `**${prefix}showparanoia**: Toggles between only 50% of paranoia questions being shown (intended use) and all of them.` }
                ], prefix))
                break;
            case "cp":
            case "clearparanoia":
                sendMessage(message.channel, createHelpEmbed('#e73c3b', "Clear Paranoia Command", [
                    { name: '__Aliases', value: `\`${prefix}clearparanoia\`, \`${prefix}cp\``},
                    { name: '__Usage__', value: `**${prefix}clearparanoia**: Deletes the unanswered paranoia questions, can only be used in DMs.` }
                ], prefix))
                break;
            case "tf":
            case "truthful":
                sendMessage(message.channel, createHelpEmbed("#e67e21", "Truthful Command", [
                    { name: '__Aliases', value: `\`${prefix}truthful\`, \`${prefix}tf\``},
                    { name: '__Usage__', value: `**${prefix}truthful [target]**: Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions.` }
                ], prefix))
                break;
            case "ping":
                sendMessage(message.channel, createHelpEmbed("#e73c3", "Ping Command", [
                    { name: '__Aliases', value: `\`${prefix}ping\``},
                    { name: '__Usage__', value: `**${prefix}ping**: Displays the average ping between the bot and Discord's webservers.` }
                ], prefix))
                break;
            default:
                message.channel.send(args[0] + " is not a valid command.");
                break;
        }
    }
}

function SlashCommand(interaction, channelSettings) {
    if (!interaction.options.has('command')) {
        interaction.editReply(createHelpEmbed("#3498da", 'Commands:', [
            { name: `__Question Commands__`, value: `/help q: Commands used to get questions or other fun content from the bot (truth, dare, paranoia, etc.)` },
            { name: `__Control Commands__`, value: `/help c: Commands used to control how the bot functions or change settings (enable, mute, prefix, etc.)` }
        ], '/'))
    } else {
        let command = interaction.options.get('command')
        switch(command) {
            case "q":
                interaction.editReply(createHelpEmbed('#3498da', 'Question Commands:', [
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
                interaction.editReply(createHelpEmbed('#3498da', 'Control Commands:', [
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
            case "truth":
            case "t":
                interaction.editReply(createHelpEmbed('#e67e21', 'Truth command', [
                    { name: '__Aliases', value: `\`/truth\`, \`/t\``},
                    { name: '__Usage__', value: `**/truth [rating]**: Gives a random question that has to be answered truthfully` },
                    { name: '__Arguments__', value: '**pg**: Gives a \'PG\' question (no inappropriate content)\n**pg13**: Gives a \'PG13\' rated question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], '/'))
                break;
            case "dare":
            case "d":
                interaction.editReply(createHelpEmbed('#e67e21', 'Dare command', [
                    { name: '__Aliases', value: `\`/dare\`, \`/d\``},
                    { name: '__Usage__', value: `**/dare [rating] [type]**: Gives a dare that has to be completed.` },
                    { name: '__Arguments__', value: '**d**: Gives a dare that is done over the internet or on a device\n**irl**: Gives a dare that is done in real life/in person\n**pg**: Gives a "PG" dare (no inappropriate content)\n**pg13**: Gives a "PG-13" dare (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated dare (most likely overtly sexual)' }
                ], '/'))
                break;
            case "wyr":
                interaction.editReply(createHelpEmbed('#f1c40e', "Would You Rather command", [
                    { name: '__Aliases', value: `\`/wyr\``},
                    { name: '__Usage__', value: `**/wyr [rating]**: Gives a 'Would You Rather' question that has to be answered.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], '/'))
                break;
            case "nhie":
                interaction.editReply(createHelpEmbed('#2ecc70', "Never Have I Ever command", [
                    { name: '__Aliases', value: `\`/nhie\``},
                    { name: '__Usage__', value: `**/nhie [rating]**: Gives a 'Never Have I Ever' question that has to be answered.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], '/'))
                break;
            case "paranoia":
            case "p":
                interaction.editReply(createHelpEmbed('#9b59b5', 'Paranoia command', [
                    { name: '__Aliases', value: `\`/paranoia\`, \`/p\``},
                    { name: '__Usage__', value: `**/paranoia [target] [rating]**: Sends a paranoia question to the target. Select the target by @ing them.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], '/'))
                break;
            case "ans":
                interaction.editReply(createHelpEmbed('#9b59b5', 'Answer command', [
                    { name: '__Aliases', value: `\`/ans\``},
                    { name: '__Usage__', value: `**/ans [answer]**: Used to answer a paranoia question, can only be used in DMs. The brackets are placeholders and represent an argument, it is not required to enclose your answer in brackets. Example: Use \'/ans John\', not \'/ans [John]\'.` }
                ], '/'))
                break;
            case "links":
            case "link":
            case "vote":
            case "invite":
                interaction.editReply(createHelpEmbed('#e91e62', 'Links command', [
                    { name: '__Aliases', value: `\`/links\`, \`/link\`, \`/vote\`, \`/invite\``},
                    { name: '__Usage__', value: `**/links**: Gives various links related to the bot, including the question submit form, feedback form, support server, how to add the bot to your own server, and more.` }
                ], '/'))
                break;
            case "stats":
                interaction.editReply(createHelpEmbed("#e91e62", "Stats Command", [
                    { name: '__Aliases', value: `\`/stats\`, \`/s\``},
                    { name: '__Usage__', value: `**/stats**: +stats: Lists various measures and statistics about the bot and its performance.` }
                ], '/'))
                break;
            case "prefix":
                interaction.editReply(createHelpEmbed('#e73c3b', 'Prefix command', [
                    { name: '__Aliases', value: `\`/truth\`, \`/t\``},
                    { name: '__Usage__', value: `**/prefix [new prefix] [infix space]**: Used to set a new prefix for the bot. Standard '+' prefix will be used in DMs. New prefix must either contain +, !, $, %, ^, &, -, <, or >, or be between 4 and 8 characters long. By default, the bot will expect no space between the prefix and a command (ex. \`+truth\`). If you want an infix space (ex. \`tod truth\`), use \`/prefix [new prefix] s\`.` }
                ], '/'))
                break;
            case "config":
            case "settings":
                interaction.editReply(createHelpEmbed('#e73c3b', 'Settings command', [
                    { name: '__Aliases', value: `\`/settings\`, \`/config\``},
                    { name: '__Usage__', value: `**/settings**: Lists current settings both serverwide and in the channel the message was sent. If a category is not shown, it is enabled by default.` }
                ], '/'))
                break;
            case "en":
            case "enable":
                interaction.editReply(createHelpEmbed('#e73c3b', 'Enable command', [
                    { name: '__Aliases', value: `\`/enable\`, \`/en\``},
                    { name: '__Usage__', value: `**/enable [command] [rating]**: Enables the command/rating specified.` },
                    { name: '__Arguments__', value: '**server**: Enables serverwide. If this argument is absent, the command/category will be enabled only in the channel the message was sent.\n**pg**: Enables pg category for all commands, or can be added after a command to enable for that command only.\n**pg13**: Enables pg13 category for all commands, or can be added after a command to enable for that command only.\n**r**: Enables r category for all commands, or can be added after a command to enable for that command only.\n**d**: Enables digital category for the dare command.\n**irl**: Enables real life category for the dare command.\n**truth**: Enables all categories for the truth command.\n**dare**: Enables all categories for the dare command.\n**wyr**: Enables all categories for the Would You Rather command.\n**nhie**: Enables all categories for the Never Have I Ever command.\n**paranoia**: Enables all categories for the paranoia command.' }
                ], '/'))
                break;
            case "dis":
            case "disable":
                interaction.editReply(createHelpEmbed('#e73c3b', 'Disable command', [
                    { name: '__Aliases', value: `\`/disable\`, \`/dis\``},
                    { name: '__Usage__', value: `**/disable [command] [rating]**: Disables the command/rating specified.` },
                    { name: '__Arguments__', value: '**server**: Disables serverwide. If this argument is absent, the command/category will be disabled only in the channel the message was sent.\n**pg**: Disables pg category for all commands, or can be added after a command to disable for that command only.\n**pg13**: Disables pg13 category for all commands, or can be added after a command to disable for that command only.\n**r**: Disables r category for all commands, or can be added after a command to disable for that command only.\n**d**: Disables digital category for the dare command.\n**irl**: Disables real life category for the dare command.\n**truth**: Disables all categories for the truth command.\n**dare**: Disables all categories for the dare command.\n**wyr**: Disables all categories for the Would You Rather command.\n**nhie**: Disables all categories for the Never Have I Ever command.\n**paranoia**: Disables all categories for the paranoia command.' }
                ], '/'))
                break;
            case "m":
            case "mute":
                interaction.editReply(createHelpEmbed('#e73c3b', 'Mute command', [
                    { name: '__Aliases', value: `\`/mute\`, \`/m\``},
                    { name: '__Usage__', value: `**/mute**: Used to mute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                ], '/'))
                break;
            case "um":
            case "unmute":
                interaction.editReply(createHelpEmbed('#e73c3b', 'Unmute command', [
                    { name: '__Aliases', value: `\`/unmute\`, \`/um\``},
                    { name: '__Usage__', value: `**/unmute \n Used to unmute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                ], '/'))
                break;
            case "sp":
            case "toggleparanoia":
            case "showparanoia":
                interaction.editReply(createHelpEmbed('#e73c3b', "Show Paranoia Command", [
                    { name: '__Aliases', value: `\`/showparanoia\`, \`/toggleparanoia\`, \`/sp\``},
                    { name: '__Usage__', value: `**/showparanoia**: Toggles between only 50% of paranoia questions being shown (intended use) and all of them.` }
                ], '/'))
                break;
            case "cp":
            case "clearparanoia":
                interaction.editReply(createHelpEmbed('#e73c3b', "Clear Paranoia Command", [
                    { name: '__Aliases', value: `\`/clearparanoia\`, \`/cp\``},
                    { name: '__Usage__', value: `**/clearparanoia**: Deletes the unanswered paranoia questions, can only be used in DMs.` }
                ], '/'))
                break;
            case "tf":
            case "truthful":
                interaction.editReply(createHelpEmbed("#e67e21", "Truthful Command", [
                    { name: '__Aliases', value: `\`/truthful\`, \`/tf\``},
                    { name: '__Usage__', value: `**/truthful [target]**: Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions.` }
                ], '/'))
                break;
            case "ping":
                interaction.editReply(createHelpEmbed("#e73c3", "Ping Command", [
                    { name: '__Aliases', value: `\`/ping\``},
                    { name: '__Usage__', value: `**/ping**: Displays the average ping between the bot and Discord's webservers.` }
                ], '/'))
                break;
        }
    }
}

const Meta = {
    name: 'help',
    description: "+help [command]: Lists all commands or gives info about a command.",
    options: [
        {
            name: 'command',
            description: "The command to get help for",
            type: "STRING",
            required: false,
            choices: [
                { name: "q", value: "q" },
                { name: "c", value: "c" },
                { name: "help", value: "help" },
                { name: "truth", value: "truth" },
                { name: "dare", value: "dare" },
                { name: "wyr", value: "wyr" },
                { name: "nhie", value: "nhie" },
                { name: "paranoia", value: "paranoia" },
                { name: "ans", value: "ans" }, 
                { name: "settings", value: "settings" },
                { name: "links", value: "links" },
                { name: "truthful", value: "truthful" },
                { name: "stats", value: "stats" },
                { name: "ping", value: "ping" },
                { name: "enable", value: "enable" },
                { name: "disable", value: "disable" },
                { name: "mute", value: "mute" },
                { name: "unmute", value: "unmute" },
                { name: "prefix", value: "prefix" }
            ]
        }
    ]
}

function createHelpEmbed(color, title, fields, prefix) {
    return new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .addFields(...fields)
        .setTimestamp()
        .setFooter(`Use '${prefix}help [command]' for more information on a specific command`, 'https://i.imgur.com/rTRsrJ5.png');
}

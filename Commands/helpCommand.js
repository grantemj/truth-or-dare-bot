export { helpCommand };
import { Discord, sendMessage } from '../bot.js';
function helpCommand(args, message, guildPrefix) {
    if (args.length == 0) {
        sendHelpEmbed("#3498da", 'Commands:', [
            { name: `__Question Commands__`, value: `${guildPrefix}help q: Commands used to get questions or other fun content from the bot (truth, dare, paranoia, etc.)` },
            { name: `__Control Commands__`, value: `${guildPrefix}help c: Commands used to control how the bot functions or change settings (enable, mute, prefix, etc.)` }
        ], message, guildPrefix);
    }
    if (args.length > 1) {
        for (let argument of args) {
            helpCommand([argument], message, guildPrefix);
        }
    }
    else if (args.length == 1) {
        switch (args[0]) {
            case "q":
                sendHelpEmbed('#3498da', 'Question Commands:', [
                    { name: `__${guildPrefix}truth [rating]__`, value: 'Asks a truth question, can specify type of question with arguments.' },
                    { name: `__${guildPrefix}dare [rating] [type]__`, value: 'Gives a dare, can specify type of dare with arguments.' },
                    { name: `__${guildPrefix}wyr [rating]__`, value: 'Asks a \'would you rather\' question, can specify type of question with arguments.' },
                    { name: `__${guildPrefix}nhie [rating]__`, value: 'Gives a \'never have I ever\' prompt, can specify type with arguments.' },
                    { name: `__${guildPrefix}paranoia [target] [rating]__`, value: 'Sends a paranoia question to the target, can specify type of question with arguments. Answer a question with \'' + guildPrefix + 'ans.\' You must mention the target (@ them), not type their nickname out.' },
                    { name: `__${guildPrefix}clearparanoia__`, value: 'Used to clear unanswered paranoia questions, can only be done in DMs.' },
                    { name: `__${guildPrefix}ans [answer]__`, value: 'Used to answer a paranoia question, can only be done in DMs.' },
                    { name: `__${guildPrefix}truthful [target]__`, value: 'Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions.' }
                ], message, guildPrefix);
                break;
            case "c":
                sendHelpEmbed('#3498da', 'Control Commands:', [
                    { name: `__${guildPrefix}prefix [new prefix]__`, value: 'Used to set a new prefix for the bot.' },
                    { name: `__${guildPrefix}settings__`, value: 'Lists the settings in the current channel. Use +enable and +disable to change settings.' },
                    { name: `__${guildPrefix}enable [command] [category]__`, value: 'Used to enable categories or commands that have been disabled.' },
                    { name: `__${guildPrefix}disable [command] [category]__`, value: 'Used to disable categories or commands. Everything except r rated commands is enabled by default.' },
                    { name: `__${guildPrefix}showparanoia__`, value: 'Toggles between only 50% of paranoia questions being shown (intended use) and all of them.' },
                    { name: `__${guildPrefix}mute__`, value: 'Used to mute the bot in the channel the message was sent.' },
                    { name: `__${guildPrefix}unmute__`, value: 'Used to unmute the bot in the channel the message the sent.' },
                    { name: `__${guildPrefix}links__`, value: 'Gives various links related to the bot, including the question submit form, feedback form, support server, how to add the bot to your own server, and more.' },
                    { name: `__${guildPrefix}stats__`, value: 'Lists various measures and statistics about the bot and its performance.' }
                ], message, guildPrefix);
                break;
            case "truth":
            case "t":
                sendHelpEmbed('#e67e21', 'Truth command', [
                    { name: '__Aliases', value: `\`${guildPrefix}truth\`, \`${guildPrefix}t\``},
                    { name: '__Usage__', value: `**${guildPrefix}truth [rating]**: Gives a random question that has to be answered truthfully` },
                    { name: '__Arguments__', value: '**pg**: Gives a \'PG\' question (no inappropriate content)\n**pg13**: Gives a \'PG13\' rated question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], message, guildPrefix);
                break;
            case "dare":
            case "d":
                sendHelpEmbed('#e67e21', 'Dare command', [
                    { name: '__Aliases', value: `\`${guildPrefix}dare\`, \`${guildPrefix}d\``},
                    { name: '__Usage__', value: `**${guildPrefix}dare [rating] [type]**: Gives a dare that has to be completed.` },
                    { name: '__Arguments__', value: '**d**: Gives a dare that is done over the internet or on a device\n**irl**: Gives a dare that is done in real life/in person\n**pg**: Gives a "PG" dare (no inappropriate content)\n**pg13**: Gives a "PG-13" dare (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated dare (most likely overtly sexual)' }
                ], message, guildPrefix);
                break;
            case "wyr":
                sendHelpEmbed('#f1c40e', "Would You Rather command", [
                    { name: '__Aliases', value: `\`${guildPrefix}wyr\``},
                    { name: '__Usage__', value: `**${guildPrefix}wyr [rating]**: Gives a 'Would You Rather' question that has to be answered.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], message, guildPrefix);
                break;
            case "nhie":
                sendHelpEmbed('#2ecc70', "Never Have I Ever command", [
                    { name: '__Aliases', value: `\`${guildPrefix}nhie\``},
                    { name: '__Usage__', value: `**${guildPrefix}nhie [rating]**: Gives a 'Never Have I Ever' question that has to be answered.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], message, guildPrefix);
                break;
            case "paranoia":
            case "p":
                sendHelpEmbed('#9b59b5', 'Paranoia command', [
                    { name: '__Aliases', value: `\`${guildPrefix}paranoia\`, \`${guildPrefix}p\``},
                    { name: '__Usage__', value: `**${guildPrefix}paranoia [target] [rating]**: Sends a paranoia question to the target. Select the target by @ing them.` },
                    { name: '__Arguments__', value: '**pg**: Gives a "PG" question (no inappropriate content)\n**pg13**: Gives a "PG-13" question (may be suggestive, many have to with dating/relationships.)\n**r**: Gives a "R" rated question (most likely overtly sexual)' }
                ], message, guildPrefix);
                break;
            case "ans":
                sendHelpEmbed('#9b59b5', 'Answer command', [
                    { name: '__Aliases', value: `\`${guildPrefix}ans\``},
                    { name: '__Usage__', value: `**${guildPrefix}ans [answer]**: Used to answer a paranoia question, can only be used in DMs. The brackets are placeholders and represent an argument, it is not required to enclose your answer in brackets. Example: Use \'${guildPrefix}ans John\', not \'${guildPrefix}ans [John]\'.` }
                ], message, guildPrefix);
                break;
            case "links":
            case "link":
            case "vote":
            case "invite":
                sendHelpEmbed('#e91e62', 'Links command', [
                    { name: '__Aliases', value: `\`${guildPrefix}links\`, \`${guildPrefix}link\`, \`${guildPrefix}vote\`, \`${guildPrefix}invite\``},
                    { name: '__Usage__', value: `**${guildPrefix}links**: Gives various links related to the bot, including the question submit form, feedback form, support server, how to add the bot to your own server, and more.` }
                ], message, guildPrefix);
                break;
            case "stats":
                sendHelpEmbed("#e91e62", "Stats Command", [
                    { name: '__Aliases', value: `\`${guildPrefix}stats\`, \`${guildPrefix}s\``},
                    { name: '__Usage__', value: `**${guildPrefix}stats**: +stats: Lists various measures and statistics about the bot and its performance.` }
                ], message, guildPrefix);
                break;
            case "prefix":
                sendHelpEmbed('#e73c3b', 'Prefix command', [
                    { name: '__Aliases', value: `\`${guildPrefix}truth\`, \`${guildPrefix}t\``},
                    { name: '__Usage__', value: `**${guildPrefix}prefix [new prefix] [infix space]**: Used to set a new prefix for the bot. Standard '+' prefix will be used in DMs. New prefix must either contain +, !, $, %, ^, &, -, <, or >, or be between 4 and 8 characters long. By default, the bot will expect no space between the prefix and a command (ex. \`+truth\`). If you want an infix space (ex. \`tod truth\`), use \`${guildPrefix}prefix [new prefix] s\`.` }
                ], message, guildPrefix);
                break;
            case "config":
            case "settings":
                sendHelpEmbed('#e73c3b', 'Settings command', [
                    { name: '__Aliases', value: `\`${guildPrefix}settings\`, \`${guildPrefix}config\``},
                    { name: '__Usage__', value: `**${guildPrefix}settings**: Lists current settings both serverwide and in the channel the message was sent. If a category is not shown, it is enabled by default.` }
                ], message, guildPrefix);
                break;
            case "en":
            case "enable":
                sendHelpEmbed('#e73c3b', 'Enable command', [
                    { name: '__Aliases', value: `\`${guildPrefix}enable\`, \`${guildPrefix}en\``},
                    { name: '__Usage__', value: `**${guildPrefix}enable [command] [rating]**: Enables the command/rating specified.` },
                    { name: '__Arguments__', value: '**server**: Enables serverwide. If this argument is absent, the command/category will be enabled only in the channel the message was sent.\n**pg**: Enables pg category for all commands, or can be added after a command to enable for that command only.\n**pg13**: Enables pg13 category for all commands, or can be added after a command to enable for that command only.\n**r**: Enables r category for all commands, or can be added after a command to enable for that command only.\n**d**: Enables digital category for the dare command.\n**irl**: Enables real life category for the dare command.\n**truth**: Enables all categories for the truth command.\n**dare**: Enables all categories for the dare command.\n**wyr**: Enables all categories for the Would You Rather command.\n**nhie**: Enables all categories for the Never Have I Ever command.\n**paranoia**: Enables all categories for the paranoia command.' }
                ], message, guildPrefix);
                break;
            case "dis":
            case "disable":
                sendHelpEmbed('#e73c3b', 'Disable command', [
                    { name: '__Aliases', value: `\`${guildPrefix}disable\`, \`${guildPrefix}dis\``},
                    { name: '__Usage__', value: `**${guildPrefix}disable [command] [rating]**: Disables the command/rating specified.` },
                    { name: '__Arguments__', value: '**server**: Disables serverwide. If this argument is absent, the command/category will be disabled only in the channel the message was sent.\n**pg**: Disables pg category for all commands, or can be added after a command to disable for that command only.\n**pg13**: Disables pg13 category for all commands, or can be added after a command to disable for that command only.\n**r**: Disables r category for all commands, or can be added after a command to disable for that command only.\n**d**: Disables digital category for the dare command.\n**irl**: Disables real life category for the dare command.\n**truth**: Disables all categories for the truth command.\n**dare**: Disables all categories for the dare command.\n**wyr**: Disables all categories for the Would You Rather command.\n**nhie**: Disables all categories for the Never Have I Ever command.\n**paranoia**: Disables all categories for the paranoia command.' }
                ], message, guildPrefix);
                break;
            case "m":
            case "mute":
                sendHelpEmbed('#e73c3b', 'Mute command', [
                    { name: '__Aliases', value: `\`${guildPrefix}mute\`, \`${guildPrefix}m\``},
                    { name: '__Usage__', value: `**${guildPrefix}mute**: Used to mute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                ], message, guildPrefix);
                break;
            case "um":
            case "unmute":
                sendHelpEmbed('#e73c3b', 'Unmute command', [
                    { name: '__Aliases', value: `\`${guildPrefix}unmute\`, \`${guildPrefix}um\``},
                    { name: '__Usage__', value: `**${guildPrefix}unmute \n Used to unmute the bot in the channel the message was sent. When muted, the bot will not respond to any commands.` }
                ], message, guildPrefix);
                break;
            case "sp":
            case "toggleparanoia":
            case "showparanoia":
                sendHelpEmbed('#e73c3b', "Show Paranoia Command", [
                    { name: '__Aliases', value: `\`${guildPrefix}showparanoia\`, \`${guildPrefix}toggleparanoia\`, \`${guildPrefix}sp\``},
                    { name: '__Usage__', value: `**${guildPrefix}showparanoia**: Toggles between only 50% of paranoia questions being shown (intended use) and all of them.` }
                ], message, guildPrefix);
                break;
            case "cp":
            case "clearparanoia":
                sendHelpEmbed('#e73c3b', "Clear Paranoia Command", [
                    { name: '__Aliases', value: `\`${guildPrefix}clearparanoia\`, \`${guildPrefix}cp\``},
                    { name: '__Usage__', value: `**${guildPrefix}clearparanoia**: Deletes the unanswered paranoia questions, can only be used in DMs.` }
                ], message, guildPrefix);
                break;
            case "tf":
            case "truthful":
                sendHelpEmbed("#e67e21", "Truthful Command", [
                    { name: '__Aliases', value: `\`${guildPrefix}truthful\`, \`${guildPrefix}tf\``},
                    { name: '__Usage__', value: `**${guildPrefix}truthful [target]**: Uses semi-quasi-pseudo-random procedures to tell you how truthful a user is while answering questions.` }
                ], message, guildPrefix);
                break;
            case "ping":
                sendHelpEmbed("#e73c3", "Ping Command", [
                    { name: '__Aliases', value: `\`${guildPrefix}ping\``},
                    { name: '__Usage__', value: `**${guildPrefix}ping**: Displays the average ping between the bot and Discord's webservers.` }
                ], message, guildPrefix);
                break;
            default:
                message.channel.send(args[0] + " is not a valid command.");
                break;
        }
    }
}
function sendHelpEmbed(color, title, fields, message, guildPrefix) {
    let helpEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .addFields(...fields)
        .setTimestamp()
        .setFooter(`Use '${guildPrefix}help [command]' for more information on a specific command`, 'https://i.imgur.com/rTRsrJ5.png');
    message.channel.send(helpEmbed).catch(() => {
        sendMessage(message.channel, "Embeds are disabled in this channel. Help message sent to DMs.");
        message.author.send(helpEmbed).catch(() => {
            sendMessage(message.channel, "Your DMs are set to closed/friends only.");
        });
    });
}

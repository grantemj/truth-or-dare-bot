export { Command };
import { sendMessage } from '../bot.js';

class Command {
    constructor(args) {
        this.name       = args.title;
        this.aliases    = args.aliases;         // List of strings that will trigger the cmd
        this.type       = args.type;            // What grouping the cmd belongs to (matters to help cmd)
        this.descript   = args.desc;            // Short description to be displayed when help is called on
        this.reArgs     = args.requiredArgs;    // Any arguments that are required for the cmd
        this.opArgs     = args.optionalArgs;    // Any arguments that are optional for the cmd
        this.runCmd     = args.run;             // The function that actually runs the cmd
        this.color      = args.color;           // The color to used any embeds for this cmd
        this.perms      = args.perms;           // The permissions required to run this command
    }

    // TODO: Slash commands where?

    // TODO: Make 'META' from constructor stuff probs

    async run(args) {
        // TODO: Check perms
        await this.runCmd(args);
    }

    help(prefix) {
        var allAliases      = ``;
        var allRequired     = ``;
        var allOptionals    = ``;
        var usage           = `**${prefix}`+this.aliases[0];
        this.aliases.forEach(element => {
            allAliases += `\`${prefix}`+element+`\`,`;
        });
        this.reArgs.forEach(element => {
            allRequired += `**`+element.name+`**: `+element.desc+`\n`;
            usage += ` [`+element.name+`]`;
        });
        this.opArgs.forEach(element => {
            allOptionals += `**`+element.name+`**: `+element.desc+`\n`;
            usage += ` [`+element.name+`]`;
        });
        sendMessage(message.channel, createHelpEmbed(this.color, this.title, [
            { name: '__Description__', value: this.desc },
            { name: '__Aliases__', value: allAliases.substr(0,allAliases.length-1) },               // Not up to the end to get rid of extra comma
            { name: '__Required Arguments__', value: allRequired.substr(0,allRequired.length-1) },  // Not up to the end to get rid of extra newline
            { name: '__Optional Arguments__', value: allOptionals.substr(0,allOptionals.length-1) },// Not up to the end to get rid of extra newline
            { name: '__Usage__', value: usage }
        ], prefix))
    }
}
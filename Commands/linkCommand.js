export { linkCommand };
import { Discord, sendMessage } from '../bot.js';
function linkCommand(message) {
    let linkEmbed = new Discord.MessageEmbed()
        .setColor('#e91e62')
        .setTitle("Links")
        .addField('\u200B', 'Enjoying the bot? Make sure to [give feedback](https://truthordarebot.xyz/feedback) and [suggest questions](https://truthordarebot.xyz/question_submit).\n\nCheck out the website at [truthordarebot.xyz](https://truthordarebot.xyz).\n\n[Add Truth or Dare to your own server](https://discordapp.com/api/oauth2/authorize?client_id=692045914436796436&permissions=68608&scope=bot)\n\n[Join the support server](https://discord.gg/mwKZq2y)\n\n[Upvote Truth or Dare on top.gg](https://top.gg/bot/692045914436796436/vote)\n\nDonate to Truth or Dare through the [DonateBot link](https://donatebot.io/checkout/721108820339851285)')
        .setTimestamp();
    sendMessage(message.channel, linkEmbed);
}

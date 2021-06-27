export { cmd };
import { Command } from '../commandTemplate.js';
import { client, Discord, sendMessage, handler } from '../../bot.js';

const cmd = new Command({
    title: "Stats Command",
    aliases: ['stats', 's'],
    desc: 'Lists various measures and statistics about the bot and its performance.',
    type: 'c',
    requiredArgs: [],
    optionalArgs: [],

    cmd: function (args, message) {
        let serverCount = await handler.query("getServerCount");
        let upvoteCount = (await topggAPI.getBot("692045914436796436")).monthlyPoints;
        let statistics = await handler.query("getStatistics")
        let serverDifference = statistics.serversJoined - statistics.serversLeft;
        let statsEmbed = new Discord.MessageEmbed()
            .setColor("#e91e62")
            .setTitle("Truth or Dare Stats")
            .addFields({ name: "__Total Server Count__", value: serverCount }, { name: "__Top.gg Upvotes This Month__", value: upvoteCount }, { name: "__Servers Joined__", value: statistics.serversJoined }, { name: "__Servers Left__", value: statistics.serversLeft }, { name: "__Net Server Gain__", value: (serverDifference > 0) ? ("+" + serverDifference) : serverDifference }, { name: "__Commands Sent__", value: `Truth: ${statistics.truth}\nDare: ${statistics.dare}\nWould You Rather: ${statistics.wyr}\nNever Have I Ever: ${statistics.nhie}\nParanoia: ${statistics.paranoia}` }, { name: "__Number of Questions__", value: `Truth: ${client.numberTruths}\nDare: ${client.numberDares}\nWould You Rather: ${client.numberWyr}\nNever Have I Ever: ${client.numberNhie}\nParanoia: ${client.numberParanoias}` })
            .setTimestamp()
            .setFooter("All counts except total server count and top.gg upvotes are for the past hour.");
        sendMessage(message.channel, statsEmbed);
    },

    slash: function (interaction) {
        let serverCount = await handler.query("getServerCount");
        let upvoteCount = (await topggAPI.getBot("692045914436796436")).monthlyPoints;
        let statistics = await handler.query("getStatistics")
        let serverDifference = statistics.serversJoined - statistics.serversLeft;
        console.log(serverCount)
        console.log(serverDifference)
        let statsEmbed = new Discord.MessageEmbed()
            .setColor("#e91e62")
            .setTitle("Truth or Dare Stats")
            .addFields( { name: "__Total Server Count__", value: serverCount.toString() }, { name: "__Top.gg Upvotes This Month__", value: upvoteCount.toString() }, { name: "__Servers Joined__", value: statistics.serversJoined.toString() }, { name: "__Servers Left__", value: statistics.serversLeft.toString() }, { name: "__Net Server Gain__", value: (serverDifference > 0) ? ("+" + serverDifference) : serverDifference.toString() }, { name: "__Commands Sent__", value: `Truth: ${statistics.truth}\nDare: ${statistics.dare}\nWould You Rather: ${statistics.wyr}\nNever Have I Ever: ${statistics.nhie}\nParanoia: ${statistics.paranoia}` }, { name: "__Number of Questions__", value: `Truth: ${client.numberTruths}\nDare: ${client.numberDares}\nWould You Rather: ${client.numberWyr}\nNever Have I Ever: ${client.numberNhie}\nParanoia: ${client.numberParanoias}` })
            .setTimestamp()
            .setFooter("All counts except total server count and top.gg upvotes are for the past hour.");
        return interaction.editReply(statsEmbed)
    }
})
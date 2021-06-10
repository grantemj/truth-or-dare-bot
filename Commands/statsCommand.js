export { Command };
import { client, Discord, sendMessage, getServerCount, getStatistics } from '../bot.js';
async function Command(message) {
    let serverCount = await getServerCount();
    // let upvoteCount = (await topggAPI.getBot("692045914436796436")).monthlyPoints;
    let upvoteCount = "∞"
    let statistics = await getStatistics()
    let serverDifference = statistics.serversJoined - statistics.serversLeft;
    let statsEmbed = new Discord.MessageEmbed()
        .setColor("#e91e62")
        .setTitle("Truth or Dare Stats")
        .addFields({ name: "__Total Server Count__", value: serverCount }, { name: "__Top.gg Upvotes This Month__", value: upvoteCount }, { name: "__Servers Joined__", value: statistics.serversJoined }, { name: "__Servers Left__", value: statistics.serversLeft }, { name: "__Net Server Gain__", value: (serverDifference > 0) ? ("+" + serverDifference) : serverDifference }, { name: "__Commands Sent__", value: `Truth: ${statistics.truth}\nDare: ${statistics.dare}\nWould You Rather: ${statistics.wyr}\nNever Have I Ever: ${statistics.nhie}\nParanoia: ${statistics.paranoia}` }, { name: "__Number of Questions__", value: `Truth: ${client.numberTruths}\nDare: ${client.numberDares}\nWould You Rather: ${client.numberWyr}\nNever Have I Ever: ${client.numberNhie}\nParanoia: ${client.numberParanoias}` })
        .setTimestamp()
        .setFooter("All counts except total server count and top.gg upvotes are for the past hour.");
    sendMessage(message.channel, statsEmbed);
}

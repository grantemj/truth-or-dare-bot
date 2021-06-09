import { createRequire } from "module";
const require = createRequire(import.meta.url);
require('dotenv').config();
const originalLog = console.log;
console.log = function (input) {
    let date = new Date();
    originalLog(`${(date.getHours() >= 10) ? date.getHours() : "0" + date.getHours()}:${(date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()}:${(date.getSeconds() >= 10) ? date.getSeconds() : "0" + date.getSeconds()}    ${input}`);
};
const { ShardingManager } = require('discord.js-light');
const manager = new ShardingManager('./bot.js', { token: process.env.TOKEN, execArgv: ["--trace-warnings"], totalShards: parseInt(process.env.TOTALSHARDS), shardList: process.env.SHARDLIST.split(",").map(x => parseInt(x))});
const os = require('os');
var logins = 0;
manager.on('shardCreate', (shard) => {
    console.log(`Launched shard ${shard.id}`);
    shard.on('ready', () => {
        console.log('Shard ready');
    });
    shard.on('disconnect', () => {
        console.log('Shard disconnected');
    });
    shard.on('reconnecting', () => {
        console.log('Shard reconnecting');
    });
    shard.on('death', () => {
        console.log('Shard died');
    });
});
try {
    manager.spawn();
} catch (e) {
    console.log(e)
}

setInterval(() => {
    if (os.freemem() / os.totalmem() < 0.05) {
        console.log(`Out of memory, mem: ${1 - (os.freemem() / os.totalmem())}. Restarting...`);
        try {
            manager.respawnAll();
        } catch(e) {
            console.log(e)
        } finally {
            logins++;
            console.log(logins);
        }
    }
}, 600000);

import { createRequire } from "module";
const require = createRequire(import.meta.url);
require('dotenv').config()

const heapdump = require('heapdump')

var ipc = require('node-ipc')
ipc.config.id = "handler"
ipc.config.retry = 15000
ipc.config.silent = true

ipc.serve(
    () => {
        ipc.server.on('message', async (data, socket) => {
            ipc.log('Message received: ', data)
            let {operation, args, operationID} = data

            if (operation in functions) {
                let result = await functions[operation](...args)
                ipc.server.emit(socket, operationID, result)
            }
        })
    }
)

const {MongoClient} = require('mongodb')

const defaultSettings = { "muted?": false, "truth pg": true, "truth pg13": true, "truth r": false, "dare pg": true, "dare pg13": true, "dare r": false, "dare d": true, "dare irl": false, "wyr pg": true, "wyr pg13": true, "wyr r": false, "nhie pg": true, "nhie pg13": true, "nhie r": false, "paranoia pg": true, "paranoia pg13": true, "paranoia r": false, "show paranoia": "default" };

var collections = {}
async function initiateMongo() {
    let mongoClient = new MongoClient(process.env.MONGOIP, { "useUnifiedTopology": true, "poolSize": 45, "maxPoolSize": 120 });
    try {
        mongoClient.connect();
        db = mongoClient.db("todBeta");
        ["prefixes", "channelSettings", "serverChannels", "paranoiaData", "statistics", "serverCounts"].forEach(coll => {
            collections[coll] = db.collection(coll)
        })
        return true;
    }
    catch {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 1000);
        });
        return initiateMongo();
    }
}

initiateMongo().then(() => {
    ipc.server.start()
})

var db;

const functions = {
    getChannelSettings: async (id) => {
        let collection = collections.channelSettings
        let result = await collection.findOne({ "channelID": id })
        let returnData = result?.data
        return returnData || defaultSettings
    },
    setChannelSettings: async (id, value) => {
        let collection = collections.channelSettings
        return collection.findOneAndReplace({ "channelID": id }, { "channelID": id, "data": value }, { "upsert": true });
    },
    deleteChannelSettings: async (id) => {
        let collection = collections.channelSettings
        return collection.deleteOne({ "channelID": id });
    },
    getServerChannels: async (id) => {
        let collection = collections.serverChannels
        let result = await collection.findOne({ "serverID": id })
        let returnData = result?.channels || []
        return returnData
    },
    setServerChannels: async (id, value) => {
        let collection = collections.serverChannels
        return collection.findOneAndReplace({ "serverID": id }, { "serverID": id, "channels": value }, { upsert: true })
    },
    deleteServerChannels: async (id) => {
        let collection = collections.serverChannels
        return collection.deleteOne({ "serverID": id })
    },
    getPrefix: async (id) => {
        if (id in prefixes) {
            return prefixes[id]
        } else {
            let collection = collections.prefixes
            let result = await collection.findOne({ "serverID": id });
            prefixes[id] = result?.data || '+'
            return result?.data || '+'
        }
    },
    setPrefix: async (id, value) => {
        prefixes[id] = value
        let collection = collections.prefixes
        return collection.findOneAndReplace({ "serverID": id }, { "serverID": id, "data": value }, { "upsert": true });
    },
    deletePrefix: async (id) => {
        delete prefixes[id]
        let collection = collections.prefixes
        return collection.deleteOne({ "serverID": id });
    },
    getCooldown: async (id) => {
        let collection = db.collection('cooldowns');
        let result = await collection.findOne({ "serverID": id });
        return result?.data
    },
    setCooldown: async (id, value) => {
        let collection = db.collection('cooldowns');
        return collection.findOneAndReplace({ "serverID": id }, { "serverID": id, "data": value }, { "upsert": true });
    },
    getParanoiaData: async (id) => {
        let collection = collections.paranoiaData
        let result = await collection.findOne({ "userID": id });
        let returnData = result?.data;
        return returnData || [];
    },
    setParanoiaData: async (id, value) => {
        let collection = collections.paranoiaData
        return collection.findOneAndReplace({ "userID": id }, { "userID": id, "data": value }, { "upsert": true })
    },
    deleteParanoiaData: async (id) => {
        let collection = collections.paranoiaData
        return collection.deleteOne({ "userID": id });
    },
    getServerCount: async () => {
        let collection = collections.serverCounts
        let count = 0
        let found = await collection.find({})
        await found.forEach(item => {
            count += item.count
        })
        return count
    },
    updateServerCount: async (manager, count) => {
        let collection = collections.serverCounts
        return collection.findOneAndReplace({manager}, {manager, count}, {"upsert": true})
    },
    getStatistics: async () => {
        let collection = collections.statistics
        let found = await collection.find({})
        let statistics = {}
    
        await found.forEach(item => {
            for (let prop in item.statistics) {
                if (prop in statistics) {
                    statistics[prop] += item.statistics[prop]
                } else {
                    statistics[prop] = item.statistics[prop]
                }
            }
        })
    
        return statistics
    },
    setStatistics: async (shardID, statistics) => {
        let collection = collections.statistics
        return collection.findOneAndReplace({ "shardID": shardID }, { "shardID": shardID, "statistics": statistics }, {"upsert": true})
    }
}

var prefixes = {}
var dumps = 0
setInterval(() => {
    dumps++
    console.log("handler " + process.memoryUsage().heapUsed)
    heapdump.writeSnapshot("/root/dumps/handler_dump_" + dumps + ".heapsnapshot", () => {
        console.log("Heap written")
    })
}, 200000)
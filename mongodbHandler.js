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

async function initiateMongo() {
    let mongoClient = new MongoClient(process.env.MONGOIP, { "useUnifiedTopology": true, "poolSize": 45, "maxPoolSize": 70 });
    try {
        mongoClient.connect();
        db = mongoClient.db("tod");
        return true;
    }
    catch {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 10000);
        });
        return initiateMongo();
    }
}

initiateMongo().then(() => {
    ipc.server.start()
})

var db;

const functions = {
    getServerSettings: async (id) => {
        let collection = db.collection('serverSettings');
        let result = await collection.findOne({ "serverID": id });
        let returnData = result?.data;
        return returnData;
    },
    setServerSettings: async (id, value) => {
        let collection = db.collection('serverSettings');
        return collection.findOneAndReplace({ "serverID": id }, { "serverID": id, "data": value }, { "upsert": true });
    },
    deleteServerSettings: async (id) => {
        let collection = db.collection('serverSettings');
        return collection.deleteOne({ "serverID": id });
    },
    getPrefix: async (id) => {
        let collection = db.collection('prefixes');
        let result = await collection.findOne({ "serverID": id });
        return result?.data
    },
    setPrefix: async (id, value) => {
        let collection = db.collection('prefixes');
        return collection.findOneAndReplace({ "serverID": id }, { "serverID": id, "data": value }, { "upsert": true });
    },
    deletePrefix: async (id) => {
        let collection = db.collection('prefixes');
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
        let collection = db.collection('paranoiaData');
        let result = await collection.findOne({ "userID": id });
        let returnData = result?.data;
        return returnData;
    },
    deleteParanoiaData: async (id) => {
        let collection = db.collection('paranoiaData');
        return collection.deleteOne({ "userID": id });
    },
    getServerCount: async () => {
        let collection = db.collection("serverCounts")
        let count = 0
        let found = await collection.find({})
        await found.forEach(item => {
            count += item.count
        })
        return count
    },
    updateServerCount: async (manager, count) => {
        let collection = db.collection("serverCounts")
        return collection.findOneAndReplace({manager}, {manager, count}, {"upsert": true})
    },
    getStatistics: async () => {
        let collection = db.collection("statistics")
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
        let collection = db.collection("statistics")
        return collection.findOneAndReplace({ "shardID": shardID }, { "shardID": shardID, "statistics": statistics }, {"upsert": true})
    }
}

var dumps = 0
setInterval(() => {
    dumps++
    console.log("handler " + process.memoryUsage().heapUsed)
    heapdump.writeSnapshot("/root/dumps/handler_dump_" + dumps + ".heapsnapshot", () => {
        console.log("Heap written")
    })
}, 200000)
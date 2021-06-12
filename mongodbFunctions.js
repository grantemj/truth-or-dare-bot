import { createRequire } from "module";
const require = createRequire(import.meta.url);

var ipc = require('node-ipc')
ipc.config.id = "shard_0"
ipc.config.retry = 15000
ipc.config.silent = true

class MongoHandler {
    async init() {
        this.handler = await new Promise((res) => {
            ipc.connectTo("handler", () => {
                var handler = ipc.of.handler
                handler.on('connect', () => {
                    ipc.log('Connected to handler')

                    res(handler)
                })
            })
        })
    }

    async query(operation, ...args) {
        let operationID = Date.now().toString() + Math.random().toString(10).substr(2, 9)
    
        this.handler.emit('message', {
            operation,
            args,
            operationID
        })

        return await new Promise((res, rej) => {
            this.handler.once(operationID, (data) => {
                res(data)
            })
        })
    }
}

export {MongoHandler}
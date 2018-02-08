const Spawner = require('./Spawner');
const EventEmitter = require('eventemitter3');
const Eris = require('eris');
const Frontend = require('../Frontend');

class Client {
    constructor() {
        process.on('exit', this.onExit.bind(this));

        this.Emitter = new EventEmitter();
        //this.discord = new DiscordClient();
        this.spawner = new Spawner(this, {
            max: _config.discord.shards
        });
        //this.irc = new IrcClient();
        this.Helpers = require('./Helpers');

        // A discord client that *doesn't* connect to the gateway
        this.discord = new Eris(_config.discord.token, {
            restMode: true
        });

        this.frontend = new Frontend(this);
    }

    async init() {
        await this.spawner.spawnAll();
        console.init('All shards have spawned. Connecting...');
        await this.spawner.awaitBroadcast('connect');
        console.init('Shards connected');
    }

    onExit() {
        console.log('Exiting.');
        this.frontend.kill();
        this.spawner.killAll();
    }
}

module.exports = Client;
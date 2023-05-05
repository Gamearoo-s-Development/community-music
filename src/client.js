const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { token } = require('../config');
const { Player } = require('discord-player');
const { registerPlayerEvents } = require('../Events/music');
var bot;

process.on("unhandledRejection", console.error);
    process.on("uncaughtException", console.error);
    process.on("uncaughtExceptionMonitor", console.error);

class BotClient extends Client {
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
            partials: [Partials.User],
        })
        const player = new Player(this, {
            ytdlOptions: {
                highWaterMark: 1 << 25,
                quality: "highestaudio"
                
            }
        });

        
        module.exports = {
            player,
        };
        this.commands = new Collection();
        
        let music = {
            player: this.player
        }

        this.music = music;

        
    }
    start() {
        const eventsPath = path.join(__dirname, '../Events');
        const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventsFiles) {
            const filePath = path.join(eventsPath, file);

            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.run(...args));
            } else {
                this.on(event.name, (...args) => event.run(...args));
            }
        }

        this.login(token);
        
    }
}

new BotClient().start();




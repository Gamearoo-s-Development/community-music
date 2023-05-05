const { Client, ActivityType } = require("discord.js");
const { status } = require("../config");
const { Utils } = require("discord-helper.js");
const { Player } = require("discord-player");
const { registerPlayerEvents } = require("./music");
const { player } = require("../src/client");

module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    async run(client) {
        await client.user.setActivity({name: status, type: ActivityType.Playing});
        registerPlayerEvents(player, client)
        
        await client.user.setStatus("online");
        require("../Handlers'/command")(client);
        new Utils("Community Helper").logs.info("Online");
    }
}
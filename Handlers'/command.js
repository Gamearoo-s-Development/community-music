const { Client } = require("discord.js");
const { readdirSync } = require("fs");
const { beta, devGuildId } = require("../config");
const path = require('node:path');
const { Utils } = require("discord-helper.js");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    var commands = client.application.commands;

   // if (beta) commands = client.guilds.cache.get(devGuildId).commands;

    readdirSync("./Commands/").forEach(dir => {
        const commands2 = readdirSync(`./Commands/${dir}/`).filter(f => f.endsWith('.js'));

        for (const file of commands2) {
            let pull = require(`../Commands/${dir}/${file}`); 

            client.commands.set(pull.name, pull);

            let { name, options, description } = pull;

            commands?.create({
                name,
                description,
                options
            })

            new Utils("Community Music").logs.info(`Loaded Command ${name}`);
        }
    })
}
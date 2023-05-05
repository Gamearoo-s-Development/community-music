const { Player } = require("discord-player");

const canvacord = require("canvacord");
const { ActivityType, EmbedBuilder, Client } = require("discord.js");
const image = "https://is5-ssl.mzstatic.com/image/thumb/Features111/v4/a4/89/a1/a489a1cb-4543-6861-a276-4470d41d6a90/mzl.zcdmhnlk.jpg/800x800bb.jpeg";
const moment = require('moment');
const { status } = require("../config");

/**
 * 
 * @param {Player} player 
 * @param {Client} client
 */
module.exports.registerPlayerEvents = async (player, client) => {

    player.events.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });
    player.events.on("connectionError", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });

    player.events.on("playerStart", async (queue, track) => {
        clearInterval(queue.currentInt);
        var now = new Date;
        now.setSeconds(0)
        now.setHours(0)
        now.setMinutes(0)
        //queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
        await client.user.setActivity({name: track.title, type: ActivityType.Listening})
        await client.user.setStatus("dnd")

        //console.log(track)
    let final = new Date;

    console.log(final.getTime());
    console.log(now.getTime())
    final.setMinutes(0)
    final.setHours(0)
    final.setSeconds(hmsToSecondsOnly(track.duration))
    let playlist = "Not in a playlist";
        
    let embed = new EmbedBuilder().setTitle("Now Playing");

    if(track.playlist) {
        embed.setDescription(`Song: ${track.title}\n Author: ${track.author} \n Playlist: ${track.playlist.title}\n  duration: ${moment(now.getTime()).format("mm:ss")}/${moment(final.getTime()).format("mm:ss")}`)
    } else {
        embed.setDescription(`Song: ${track.title}\n Author: ${track.author} \n  duration: ${moment(now.getTime()).format("mm:ss")}/${moment(final.getTime()).format("mm:ss")}`)
    }
      

    let msg = await queue.metadata.channel.send({embeds: [embed]})


    queue.currentInt = await setInterval(() => {
        let currenttime = now.getSeconds();
        now.setSeconds(currenttime + 8);
        if(track.playlist) {
            embed.setDescription(`Song: ${track.title}\n Author: ${track.author} \n Playlist: ${track.playlist.title}\n  duration: ${moment(now.getTime()).format("mm:ss")}/${moment(final.getTime()).format("mm:ss")}`)
        } else {
            embed.setDescription(`Song: ${track.title}\n Author: ${track.author} \n  duration: ${moment(now.getTime()).format("mm:ss")}/${moment(final.getTime()).format("mm:ss")}`)
        }

        msg.edit({embeds: [embed]})
    }, 8000)

    setTimeout(() => {
        clearInterval(queue.currentInt)
    }, 1000 * hmsToSecondsOnly(track.duration))

    });

    player.events.on("")

    

    player.events.on("emptyQueue", async (queue) => {
        queue.metadata.channel.send("✅ | Queue finished!");

        clearInterval(queue.currentInt);
        await client.user.setActivity({name: status, type: ActivityType.Playing});
        
        
        await client.user.setStatus("online");

    });

};

function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}
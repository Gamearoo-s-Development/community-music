const { PermissionFlagsBits, CommandInteraction, Client, EmbedBuilder } = require("discord.js");
const { player } = require("../../src/client");


module.exports = {
    name: 'queue',
    description: 'the queue',
    perm: PermissionFlagsBits.SendMessages,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {*} extras 
     */
    async run(interaction, client, extras) {
        const queue = player.nodes.get(interaction.guild);

        if(!queue || !queue.isPlaying()) {
            await interaction.reply("Theres nothing playing");
            return;
        }

       const queueString = queue.tracks.toArray().slice(0, 10).map((song, i) => {
        return `『${i + 1}』 [${song.duration}] ${song.title} - <@${song.requestedBy.id}> `
       }).join("\n\n");

       

       const currentSong = queue.currentTrack;

        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(queueString + " \n\n **Now Playing:** " + currentSong.title + " \n\n **Queue Duration:** " + queue.durationFormatted).setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}
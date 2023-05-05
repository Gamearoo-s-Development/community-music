const { PermissionFlagsBits, CommandInteraction, Client, EmbedBuilder } = require("discord.js");
const { player } = require("../../src/client");


module.exports = {
    name: 'skip',
    description: 'Start a skip vote or skip the song',
    perm: PermissionFlagsBits.SendMessages,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {*} extras 
     */
    async run(interaction, client, extras) {
        const queue = player.nodes.get(interaction.guild);

        if(!queue) {
            await interaction.reply("Theres nothing playing");
            return;
        }

        const currentSong = queue.currentTrack;

        clearInterval(queue.currentInt)



        queue.node.skip();



        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(`Skipped **${currentSong.title}**`).setThumbnail(currentSong.thumbnail)
            ]
        })


    }
}
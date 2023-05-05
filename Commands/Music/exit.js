const { PermissionFlagsBits, CommandInteraction, Client, EmbedBuilder } = require("discord.js");
const { player } = require("../../src/client");


module.exports = {
    name: 'stop',
    description: 'stop the music',
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

        queue.delete()


        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(`Stopped all songs`)
            ]
        })
    }
}
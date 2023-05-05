const { QueryType } = require("discord-player");
const { PermissionFlagsBits, CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, Interaction, EmbedBuilder } = require("discord.js");
const { bot, player } = require("../../src/client");


module.exports = {
    name: 'play',
    description: 'Play a song',
    perm: PermissionFlagsBits.SendMessages,
    options: [
        {
            name: "search",
            description: "Search for a song",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'searchterms',
                    description: "search for a song",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: "playlist",
            description: "add a playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'url',
                    description: "url to the playlist",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: "song",
            description: "add a song",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'url',
                    description: "songs url",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Interaction} interaction 
     * @param {Client} client 
     * @param {*} extras 
     */
    async run(interaction, client, extras) {
        
        
        if(!interaction.member.voice.channel) return interaction.reply({content: 'You must be in a voice channel', ephemeral: true})

        await interaction.deferReply()
        const { options } = interaction;
        const cmd = options.getSubcommand();
        
        const queue = await player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
                   client: interaction.guild.members.me,
               requestedBy: interaction.user,
               selfDeaf: false,
               volume: 50,
               guild: interaction.guild,

                },
        });

        

        if(!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder();

        switch(cmd) {
            case "song":
                let url = options.getString('url');
                let type = QueryType.YOUTUBE_VIDEO;

                if(url.startsWith("https://open.spotify.com")) type = QueryType.SPOTIFY_SONG;
                if(url.startsWith("https://soundcloud.com/")) type = QueryType.SOUNDCLOUD_TRACK;

                const result = await player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: type,
                });

                if(result.tracks.length === 0) {
                    await interaction.editReply("No results found");
                    return;
                }

                const song = result.tracks[0];
                console.log(song)
                await queue.addTrack(song);

                embed.setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail).setFooter({text: `Duration: ${song.duration}`});
                break;
                case "playlist":
                let url2 = options.getString('url');
                let type2 = QueryType.YOUTUBE_PLAYLIST;

                if(url2.startsWith("https://open.spotify.com")) type2 = QueryType.SPOTIFY_PLAYLIST;
                if(url2.startsWith("https://soundcloud.com/")) type2 = QueryType.SOUNDCLOUD_PLAYLIST;

                const result2 = await player.search(url2, {
                    requestedBy: interaction.user,
                    searchEngine: type2,
                });

                if(result2.tracks.length === 0) {
                    await interaction.editReply("No results found");
                    return;
                }

                const song2 = result2.playlist.tracks;
                await song2.forEach(track => {
                    queue.addTrack(track);
                })
                

                embed.setDescription(`Added **[${result2.playlist.title}](${result2.playlist.url})** to the queue.`)
                .setThumbnail(song2.thumbnail).setFooter({text: `Duration: ${result2.playlist.duration}`});
                break;
                case "search":
                    let url3 = options.getString('searchterms');
                   
    
                    const result3 = await player.search(url3, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.YOUTUBE_SEARCH,
                    });
    
                    if(result3.tracks.length === 0) {
                        await interaction.editReply("No results found");
                        return;
                    }
    
                    const song3 = result3.tracks[0];
                    await queue.addTrack(song3);
    
                    embed.setDescription(`Added **[${song3.title}](${song3.url})** to the queue.`)
                    .setThumbnail(song3.thumbnail).setFooter({text: `Duration: ${song3.duration}`});

                break;

        }
        await interaction.editReply({
            embeds: [embed]
        })

        if(!queue.node.isPlaying()) await queue.node.play();

        

       

    }
}
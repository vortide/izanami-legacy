const { Utils } = require("erela.js");
const { MessageEmbed } = require("discord.js");
const ServerConfig = require("../../database/schemeServerConfig");
require("dotenv").config();

// Akeno module
const Akeno = require("../../akeno/index.js");

module.exports = {
    config: {
        name: "play",
        aliases: ["p", "pl"],
        description: "play a song",
        usage: "<YouTube URL or search query>",
        category: "music"
    },
    run: async (Izanami, message, args) => {
        // MongoDB
        const guildDatabase = await ServerConfig.findOne({ guildId: message.guild.id });

        // Check if user is in a voice channel.
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ You need to be in a voice channel to use this command.'
            }
        });

        // Call a music function
        music();

        // Music function
        function music() {
            let permissionsIzanami = voiceChannel.permissionsFor(Izanami.user);
            if (!permissionsIzanami.has("CONNECT")) return message.channel.send({
                embed: {
                    color: color.red,
                    description: '❌ Insufficient permissions.',
                    footer: {
                        text: "No 'connect' permission found."
                    }
                }
            });

            if (!permissionsIzanami.has("SPEAK")) return message.channel.send({
                embed: {
                    color: color.red,
                    description: '❌ Insufficient permissions.',
                    footer: {
                        text: "No 'speak' permission found."
                    }
                }
            });

            if (!args[0]) return message.channel.send({
                embed: {
                    color: color.red,
                    description: '❌ Please provide an URL or a song name.',
                }
            });

            const playerIzanami = Izanami.music.players.spawn({
                guild: message.guild,
                textChannel: message.channel,
                voiceChannel
            });

            if (playerIzanami && voiceChannel.id !== playerIzanami.voiceChannel.id) {
                if (guildDatabase.guildPremium) {
                    if (message.guild.members.fetch(process.env.AKENO_ID)) {
                        return Akeno.musicPlay(message, voiceChannel, args); // Akeno module
                    } else {
                        return message.channel.send({
                            embed: {
                                color: color.red,
                                description: '❌ You need to be in the same voice channel as the bot to use this command.',
                                footer: {
                                    text: "Your server has premium features. Add Akeno bot to play music simultaneously in two channels."
                                }
                            }
                        });
                    }
                } else if (!guildDatabase.guildPremium && message.guild.members.fetch(process.env.AKENO_ID)) {
                    return message.channel.send({
                        embed: {
                            color: color.red,
                            description: '❌ This is a premium feature.',
                            footer: {
                                text: "You seem to have Akeno bot in your Discord server. To use it you have to buy premium."
                            }
                        }
                    });
                } else return message.channel.send({
                    embed: {
                        color: color.red,
                        description: '❌ You need to be in the same voice channel as the bot to use this command.'
                    }
                });
            }

            Izanami.music.search(args.join(" "), message.author).then(async res => {
                if (voiceChannel.id !== playerIzanami.voiceChannel.id) return message.channel.send({
                    embed: {
                        color: color.red,
                        description: '❌ You need to be in the same voice channel as the bot to use this command.'
                    }
                });

                switch (res.loadType) {
                    case "TRACK_LOADED":
                        playerIzanami.queue.add(res.tracks[0]);
                        message.channel.send({
                            embed: {
                                color: color.orange,
                                description: `⌛ **Enqueing** [${res.tracks[0].title}](${res.tracks[0].uri}) \`${Utils.formatTime(res.tracks[0].duration, true)}\`.`,
                            }
                        });
                        if (!playerIzanami.playing) playerIzanami.play();
                        break;

                    case "SEARCH_RESULT":
                        let index = 1;
                        const tracks = res.tracks.slice(0, 5);
                        const embed = new MessageEmbed()
                            .setColor(color.orange)
                            .setAuthor("Please select a song:", message.author.displayAvatarURL)
                            .setDescription(tracks.map(video => `**${index++}** [${video.title}](${video.uri})`))
                            .setFooter("Choose a song by typing the index number. If you want to cancel type 'cancel' or wait 30 seconds.")
                        await message.channel.send(embed);

                        const collector = message.channel.createMessageCollector(m => {
                            return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                        }, { time: 30000, max: 1 });

                        collector.on("collect", m => {
                            if (/cancel/i.test(m.content)) return collector.stop("cancelled");

                            const track = tracks[Number(m.content) - 1];
                            playerIzanami.queue.add(track)
                            Izanami.channels.cache.get(message.channel.id).send({
                                embed: {
                                    color: color.orange,
                                    description: `⌛ **Enqueing** [${res.tracks[0].title}](${res.tracks[0].uri}) \`${Utils.formatTime(res.tracks[0].duration, true)}\`.`,
                                }
                            });
                            if (!playerIzanami.playing) playerIzanami.play();
                        });

                        collector.on("end", (_, reason) => {
                            if (["time", "cancelled"].includes(reason)) return message.channel.send({
                                embed: {
                                    color: color.green,
                                    description: "✅ Cancelled selection."
                                }
                            })
                        });
                        break;

                    case "PLAYLIST_LOADED":
                        res.playlist.tracks.forEach(track => playerIzanami.queue.add(track));
                        const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({ duration: acc.duration + cur.duration })).duration, true);

                        message.channel.send({
                            embed: {
                                color: color.orange,
                                description: `⌛ **Enqueing** [${res.playlist.info.name}](${res.playlist.info.uri}) playlist with \`${res.playlist.tracks.length}\` songs. \`${duration}\`.`,
                            }
                        });
                        if (!playerIzanami.playing) playerIzanami.play();
                        break;
                }
            }).catch(err => message.channel.send(err.message));
        }
    }
}
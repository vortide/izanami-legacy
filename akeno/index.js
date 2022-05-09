// Main Bot Libraries
const { Client, MessageEmbed } = require("discord.js");
const Akeno = new Client();

// Erela Client Libraries
const { ErelaClient, Utils } = require("erela.js");
const { nodes } = require("../lavalink.json");

// Login
Akeno.login(process.env.AKENO_TOKEN);

// Music initialize
Akeno.on("ready", () => {
    console.log("[CLIENT - Akeno] Connected to Discord API.");

    Akeno.music = new ErelaClient(Akeno, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("[CLIENT - Akeno] Connected to LavaLink."))
        .on("queueEnd", player => {
            player.textChannel.send({
                embed: {
                    color: color.orange,
                    description: "⚠️ Queue has ended."
                }
            });
            setTimeout(function () {
                if (player.playing) {
                    return;
                } else {
                    return Akeno.music.players.destroy(player.guild.id);
                }
            }, 240000);
        })
        .on("trackStart", ({ textChannel }, track) => textChannel.send({
            embed: {
                color: color.green,
                description: `✅ **Playing [${track.title}](${track.uri})** \`${Utils.formatTime(track.duration, true)}\`.`,
                thumbnail: {
                    url: track.displayThumbnail(track.uri)
                }
            }
        }));

    Akeno.levels = new Map()
        .set("none", 0.0)
        .set("low", 0.10)
        .set("medium", 0.15)
        .set("high", 0.25)

    Akeno.user.setActivity('music requests.', { type: 'LISTENING' });
});

module.exports.instance = function () {
    return Akeno;
}

module.exports.musicPlay = function (message, voiceChannel, args) {
    const playerAkeno = Akeno.music.players.spawn({
        guild: message.guild,
        textChannel: Akeno.channels.cache.get(message.channel.id),
        voiceChannel
    });

    Akeno.music.search(args.join(" "), message.author).then(async res => {
        if (voiceChannel.id !== playerAkeno.voiceChannel.id) return Akeno.channels.get(message.channel.id).send({
            embed: {
                color: color.red,
                description: '❌ You need to be in the same voice channel as the bot to use this command.'
            }
        });

        switch (res.loadType) {
            case "TRACK_LOADED":
                playerAkeno.queue.add(res.tracks[0]);
                Akeno.channels.cache.get(message.channel.id).send({
                    embed: {
                        color: color.orange,
                        description: `⌛ **Enqueing** [${res.tracks[0].title}](${res.tracks[0].uri}) \`${Utils.formatTime(res.tracks[0].duration, true)}\`.`,
                        thumbnail: res.tracks[0].thumbnail
                    }
                });
                if (!playerAkeno.playing) playerAkeno.play();
                break;

            case "SEARCH_RESULT":
                let index = 1;
                const tracks = res.tracks.slice(0, 5);
                const embed = new MessageEmbed()
                    .setColor(color.orange)
                    .setAuthor("Please select a song:", message.author.displayAvatarURL)
                    .setDescription(tracks.map(video => `**${index++}** [${video.title}](${video.uri})`))
                    .setFooter("Choose a song by typing the index number. If you want to cancel type 'cancel' or wait 30 seconds.");
                await Akeno.channels.cache.get(message.channel.id).send(embed);

                const collector = Akeno.channels.cache.get(message.channel.id).createMessageCollector(m => {
                    return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                }, { time: 30000, max: 1 });

                collector.on("collect", m => {
                    if (/cancel/i.test(m.content)) return collector.stop("cancelled");

                    const track = tracks[Number(m.content) - 1];
                    playerAkeno.queue.add(track)
                    Akeno.channels.cache.get(message.channel.id).send({
                        embed: {
                            color: color.orange,
                            description: `⌛ **Enqueing [${res.tracks[0].title}](${res.tracks[0].uri})** \`${Utils.formatTime(res.tracks[0].duration, true)}\`.`
                        }
                    });
                    if (!playerAkeno.playing) playerAkeno.play();
                });

                collector.on("end", (_, reason) => {
                    if (["time", "cancelled"].includes(reason)) return Akeno.channels.cache.get(message.channel.id).send({
                        embed: {
                            color: color.green,
                            description: "✅ Cancelled selection."
                        }
                    })
                });
                break;

            case "PLAYLIST_LOADED":
                res.playlist.tracks.forEach(track => playerAkeno.queue.add(track));
                const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({ duration: acc.duration + cur.duration })).duration, true);

                Akeno.channels.cache.get(message.channel.id).send({
                    embed: {
                        color: color.orange,
                        description: `⌛ **Enqueing** [${res.playlist.info.name}](${res.playlist.info.uri}) playlist with \`${res.playlist.tracks.length}\` songs. \`${duration}\`.`
                    }
                });
                if (!playerAkeno.playing) playerAkeno.play();
                break;
        }
    }).catch(err => Akeno.channels.cache.get(message.channel.id).send(err.message));
}
const AkenoModule = require("../../akeno/index.js");
const Akeno = AkenoModule.instance();

module.exports = {
    config: {
        name: "skip",
        aliases: ["s", "sk"],
        description: "Skip current song.",
        usage: "",
        category: "music"
    },
    run: async (Izanami, message) => {
        const playerAkeno = Akeno.music.players.get(message.guild.id);
        const playerIzanami = Izanami.music.players.get(message.guild.id);

        if (!playerIzanami && !playerAkeno) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ There is no bot in a channel.'
            }
        });

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ You need to be in a voice channel to use this command.'
            }
        });

        if (playerIzanami && voiceChannel.id == playerIzanami.voiceChannel.id) {
            if (playerIzanami.playing) {
                playerIzanami.stop();
                return message.channel.send({
                    embed: {
                        color: color.green,
                        description: '✅ Skipped the current song.'
                    }
                });
            } else return message.channel.send({
                embed: {
                    color: color.red,
                    description: '❌ No song is currently playing.'
                }
            });
        }

        if (playerAkeno && voiceChannel.id == playerAkeno.voiceChannel.id) {
            if (playerAkeno.playing) {
                playerAkeno.stop();
                return Akeno.channels.cache.get(message.channel.id).send({
                    embed: {
                        color: color.green,
                        description: '✅ Skipped the current song.'
                    }
                });
            } else return Akeno.channels.cache.get(message.channel.id).send({
                embed: {
                    color: color.red,
                    description: '❌ No song is currently playing.'
                }
            });
        }

        if (playerIzanami) {
            if (voiceChannel.id !== playerIzanami.voiceChannel.id) return message.channel.send({
                embed: {
                    color: color.red,
                    description: '❌ You need to be in the same voice channel as the bot to use this command.'
                }
            });
        } else if (playerAkeno) {
            if (voiceChannel.id !== playerAkeno.voiceChannel.id) return Akeno.channels.cache.get(message.channel.id).send({
                embed: {
                    color: color.red,
                    description: '❌ You need to be in the same voice channel as the bot to use this command.'
                }
            });
        }
    }
}
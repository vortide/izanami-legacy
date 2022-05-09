const AkenoModule = require("../../akeno/index.js");
const Akeno = AkenoModule.instance();

module.exports = {
    config: {
        name: "pause",
        aliases: ["resume", "rs", "ps", "paus"],
        description: "Pause or resume current song.",
        usage: "",
        category: "music"
    },
    run: async (Izanami, message) => {
        const playerAkeno = Akeno.music.players.get(message.guild.id);
        const playerIzanami = Izanami.music.players.get(message.guild.id);

        if (!playerIzanami && !playerAkeno) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ No song is currently playing.'
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
            playerIzanami.pause(playerIzanami.playing);
            return message.channel.send({
                embed: {
                    color: color.green,
                    description: `✅ Music ${playerIzanami.playing ? "resumed" : "paused"}.`
                }
            });
        }

        if (playerAkeno && voiceChannel.id == playerAkeno.voiceChannel.id) {
            playerAkeno.pause(playerAkeno.playing);
            return Akeno.channels.cache.get(message.channel.id).send({
                embed: {
                    color: color.green,
                    description: `✅ Music ${playerAkeno.playing ? "resumed" : "paused"}.`
                }
            });
        }

        if (playerIzanami && playerAkeno) {
            if (voiceChannel.id !== playerIzanami.voiceChannel.id && voiceChannel.id !== playerAkeno.voiceChannel.id) return message.channel.send({
                embed: {
                    color: color.red,
                    description: '❌ You need to be in the same voice channel as the bot to use this command.'
                }
            });
        }

        if (playerIzanami && !playerAkeno) {
            if (voiceChannel.id !== playerIzanami.voiceChannel.id) return message.channel.send({
                embed: {
                    color: color.red,
                    description: '❌ You need to be in the same voice channel as the bot to use this command.'
                }
            });
        }

        if (playerAkeno && !playerIzanami) {
            if (voiceChannel.id !== playerAkeno.voiceChannel.id) return Akeno.channels.cache.get(message.channel.id).send({
                embed: {
                    color: color.red,
                    description: '❌ You need to be in the same voice channel as the bot to use this command.'
                }
            });
        }

    }
}
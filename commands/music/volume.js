const AkenoModule = require("../../akeno/index.js");
const Akeno = AkenoModule.instance();


module.exports = {
    config: {
        name: "volume",
        aliases: ["v", "vol"],
        description: "Pause or resume current song.",
        usage: "<Number between 1 and 100>",
        category: "music"
    },
    run: async (Izanami, message, args) => {
        const playerAkeno = Akeno.music.players.get(message.guild.id);
        const playerIzanami = Izanami.music.players.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;

        if (!playerIzanami && !playerAkeno) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ There is no bot in a channel.'
            }
        });

        if (playerIzanami && voiceChannel.id == playerIzanami.voiceChannel.id) {
            if (!args[0]) return message.channel.send({
                embed: {
                    color: color.orange,
                    description: `🔊 Current volume: ${playerIzanami.volume}.`
                }
            });
        }

        if (playerAkeno && voiceChannel.id == playerAkeno.voiceChannel.id) {
            if (!args[0]) return Akeno.channels.cache.get(message.channel.id).send({
                embed: {
                    color: color.orange,
                    description: `🔊 Current volume: ${playerAkeno.volume}.`
                }
            });
        }

        if (isNaN(args[0])) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ Volume value should be an integer.'
            }
        });

        if (Number(args[0]) <= 0 || Number(args[0]) > 100) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ Volume value should be between 1 and 100.'
            }
        });

        if (playerIzanami && voiceChannel.id == playerIzanami.voiceChannel.id) {
            playerIzanami.setVolume(Number(args[0]));
            return message.channel.send({
                embed: {
                    color: color.green,
                    description: `✅ Volume set to: ${args[0]}.`
                }
            });
        }

        if (playerAkeno && voiceChannel.id == playerAkeno.voiceChannel.id) {
            playerAkeno.setVolume(Number(args[0]));
            return Akeno.channels.cache.get(message.channel.id).send({
                embed: {
                    color: color.green,
                    description: `✅ Volume set to: ${args[0]}.`
                }
            });
        }

        return message.channel.send({
            embed: {
                color: color.red,
                description: `❌ You need to be in the same voice channel as the bot to use this command.`
            }
        });
    }
}
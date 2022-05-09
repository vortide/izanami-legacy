const { Utils } = require("erela.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const AkenoModule = require("../../akeno/index.js");
const Akeno = AkenoModule.instance();

module.exports = {
    config: {
        name: "nowplaying",
        aliases: ["np", "nowp"],
        description: "Display what song is currently playing.",
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

        let string = "";
        let thumbnail = "";

        if (playerIzanami) {
            if (playerIzanami.queue[0]) {
                string += `**Current song for ${playerIzanami.voiceChannel.name}:**\n`;
                string += stripIndents`${playerIzanami.playing ? "**Playing: " : "**Paused: "} [${playerIzanami.queue[0].title}](${playerIzanami.queue[0].uri})** \`${Utils.formatTime(playerIzanami.queue[0].duration, true)}\`** | ** Requested by ${playerIzanami.queue[0].requester.username}.` + "\n\n";
                thumbnail = playerIzanami.queue[0].displayThumbnail(playerIzanami.queue[0].uri);;
            } else {
                string += `❌ ${Izanami.user.username} is not playing anything.\n\n`;
            }
        }

        if (playerAkeno) {
            if (playerAkeno.queue[0]) {
                string += `**Current song for ${playerAkeno.voiceChannel.name}:**\n`;
                string += stripIndents`${playerAkeno.playing ? "**Playing: " : "**Paused: "} [${playerAkeno.queue[0].title}](${playerAkeno.queue[0].uri})** \`${Utils.formatTime(playerAkeno.queue[0].duration, true)}\`** | ** Requested by ${playerAkeno.queue[0].requester.username}.\n\n`;
                thumbnail = playerAkeno.queue[0].displayThumbnail(playerAkeno.queue[0].uri);
            } else {
                string += `❌ ${Akeno.user.username} is not playing anything.\n\n`;
            }
        }

        const embed = new MessageEmbed()
            .setColor(color.pink)
            .setAuthor(`Now playing at ${message.guild.name}`, message.guild.iconURL)
            .setThumbnail(thumbnail)
            .setDescription(string)
        message.channel.send(embed);
    }
}
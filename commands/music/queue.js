const AkenoModule = require("../../akeno/index.js");
const Akeno = AkenoModule.instance();
const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "queue",
        aliases: ["q", "qu"],
        description: "View the current queue.",
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

        let index1 = 1;
        let index2 = 1;
        let string1 = "";
        let string2 = "";
        let thumbnail = "";

        if (playerIzanami) {
            if (playerIzanami.queue[0]) {
                string1 += `**Queue for ${playerIzanami.voiceChannel.name}:**\n${playerIzanami.playing ? "**Playing:" : "**Paused:"} [${playerIzanami.queue[0].title}](${playerIzanami.queue[0].uri}) |** Requested by ${playerIzanami.queue[0].requester.username}.\n\n`;
                if (playerIzanami.queue[1]) string1 += `**Next songs in the queue:**\n${playerIzanami.queue.slice(1, 10).map(x => `${index1++} [${x.title}](${x.uri}) | Requested by ${x.requester.username}.`).join("\n")}\n\n\n`;
                thumbnail = playerIzanami.queue[0].displayThumbnail(playerIzanami.queue[0].uri);
            } else {
                string1 += `**Queue for ${playerIzanami.voiceChannel.name}:**\n❌ No current queue for ${Izanami.user.username}.\n\n`;
            }

            var embed1 = new MessageEmbed()
                .setColor(color.pink)
                .setAuthor(`Current queue for ${message.guild.name}`, message.guild.iconURL)
                .setThumbnail(thumbnail)
                .setDescription(string1);

            message.channel.send(embed1);
        }

        if (playerAkeno) {
            if (playerAkeno.queue[0]) {
                string2 += `**Queue for ${playerAkeno.voiceChannel.name}:**\n${playerAkeno.playing ? "**Playing:" : "**Paused:"} [${playerAkeno.queue[0].title}](${playerAkeno.queue[0].uri}) |** Requested by ${playerAkeno.queue[0].requester.username}.\n\n`;
                if (playerAkeno.queue[1]) string2 += `**Next songs in the queue:**\n${playerAkeno.queue.slice(1, 10).map(x => `${index2++} [${x.title}](${x.uri}) | Requested by ${x.requester.username}.`).join("\n")}\n\n\n`;
                thumbnail = playerAkeno.queue[0].displayThumbnail(playerAkeno.queue[0].uri);
            } else {
                string2 += `**Queue for ${playerAkeno.voiceChannel.name}:**\n❌ No current queue for ${Akeno.user.username}.\n\n`;
            }

            var embed2 = new MessageEmbed()
                .setColor(color.pink)
                .setAuthor(`Current queue for ${message.guild.name}`, message.guild.iconURL)
                .setThumbnail(thumbnail)
                .setDescription(string2);

            Akeno.channels.cache.get(message.channel.id).send(embed2);
        }
    }
}
const { ErelaClient, Utils } = require("erela.js");
const { nodes } = require("../../lavalink.json");

module.exports = async (Izanami) => {
    console.log("[CLIENT - Izanami] Connected to Discord API.");

    //#region Music API
    Izanami.music = new ErelaClient(Izanami, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("[CLIENT - Izanami] Connected to LavaLink."))
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
                    return Izanami.music.players.destroy(player.guild.id);
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

    Izanami.levels = new Map()
        .set("none", 0.0)
        .set("low", 0.10)
        .set("medium", 0.15)
        .set("high", 0.25);
    //#endregion

    Izanami.user.setActivity('unstable code', { url: 'https://twitch.tv/exztasy', type: 'STREAMING' });
}
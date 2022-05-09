const AkenoModule = require("../../akeno/index.js");
const Akeno = AkenoModule.instance();
require("dotenv").config();

module.exports = async (Izanami, oldState, newState) => {
    if (newState.id === process.env.IZANAMI_ID && newState.channel === null) {
        Izanami.music.players.destroy(newState.guild.id);
    }

    if (newState.id === process.env.AKENO_ID && newState.channel === null) {
        Akeno.music.players.destroy(newState.guild.id);
    }
}
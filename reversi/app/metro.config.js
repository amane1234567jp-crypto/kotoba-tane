// web.zip（ゲーム本体）を そのまま同梱できるように
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
config.resolver.assetExts = [...config.resolver.assetExts, "zip"];
module.exports = config;

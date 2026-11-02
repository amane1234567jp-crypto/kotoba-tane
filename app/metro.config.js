// ゲーム本体（index.html）を アプリに そのまま 入れる ため、html も 「絵や 音と おなじ 素材」として あつかう
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("html", "zip");
module.exports = config;

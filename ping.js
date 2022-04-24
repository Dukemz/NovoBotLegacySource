module.exports = {
  name: 'ping',
  description: "Get the bot's latency in ms. Used to check if the bot is alive.",
  category: 'info',
  aliases: ['pong'],
  run: async (client, message, args, config) => {
    const m = await message.channel.send("🏓 Ping?");
    m.edit(`🏓 Pong! Latency: \`${m.createdTimestamp - message.createdTimestamp}ms\`. API Latency: \`${client.ws.ping}ms\`.`);
  },
};
const { MessageEmbed } = require('discord.js');
const pms = require('pretty-ms');

module.exports = {
  name: 'uptime',
  description: "View how long the bot has been online for.",
  usage: "[-i]",
  aliases: ['ut'],
  category: 'info',
  run: async (client, message, args, config) => {
    const pkg = config.pkg;
    const shuptime = pms(Date.now() - client.startup);
    const cluptime = pms(client.uptime);
    let uptmsg = cluptime === shuptime ? '' : `**Process Uptime:** \`${pms(client.uptime)}\`\n`;

    const embed = new MessageEmbed()
    .setColor('#A133D5')
    .setTitle(`${client.user.username} - Uptime (v${pkg.version})`)
    .setThumbnail(client.user.avatarURL())
    .setDescription(`${uptmsg}**Bot Uptime:** \`${shuptime}\``)
    .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
    .setTimestamp()
    if(args[0] === '-i') { embed.addField('Additional Info',
     `**Started At:** \`${toDate(new Date - client.uptime)}\`
      **Last Successful Shard Connect:** \`${toDate(client.startup)}\`
      **Last Attempted Shard Reconnect:** \`${toDate(client.lastShardReconnect) || null}\`
      **Last Shard Disconnect:** \`${toDate(client.lastShardDisconnect) || null}\``);
    }
    message.channel.send(embed);
  },
}; 
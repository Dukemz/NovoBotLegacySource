const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'credits',
  description: "View a list of other contributors and open-source packages used in the making of NovoBot.",
  category: 'info',
  run: async (client, message, _args, config) => {
    const packages = Object.keys(config.pkg.dependencies).map(x => `\`${x}\``).join(", ");
    const embed = new MessageEmbed()
      .setColor(client.c.nv[0])
      .setTitle('NovoBot - Credits')
      .setThumbnail(client.user.avatarURL())
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
      .setTimestamp()
      .addField('Misc Contributors', "There's nobody here yet. You could be here though - send us some ideas and suggestions!")
      .addField('Open Source Packages (NPM)', packages)
    message.channel.send(embed);
  },
};
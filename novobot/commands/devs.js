const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'devs',
  description: 'View info about the NovoBot team.',
  category: 'info',
  run: async (client, message) => {
    let infoEmbed = new MessageEmbed()
    .setColor(client.c.nv[0])
    .setTitle('The NovoBot Team')
    .setURL('https://discord.io/NovoBot')
    .setAuthor('Dukemz', 'https://github.com/Dukemz.png', 'https://discord.gg/A3BbAcH')
    .setDescription("Information about NovoBot's devs and major contributors.")
    .setThumbnail(client.user.avatarURL())
    .addField('`Dukemz#7766`', '**Lead Dev** - The leader behind the project. Created most of the features and is actively working on the bot.')
    .addField('`TechnoBiscuit#3540`', "**Dev** - assisted with general development.")
    .addField('`Inanis#2432`', '**Dev** - assisted with general development.')
    .addField('`novotab51#0051`', '**Founder & Graphics Designer** - Founder of the original NovoBot "brand" back in 2019, and designer of the logos/wallpapers.')
    .addField('`LJAldy#0951`', '**Key Contributor** - helped greatly with a lot of important non-programming aspects of NovoBot.')
    .setFooter("Tip: To view a list of other minor contributors, run n!credits.");
    message.channel.send(infoEmbed);    
  },
};
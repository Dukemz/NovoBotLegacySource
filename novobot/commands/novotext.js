const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'novotext',
  description: 'Format text in the "NovoBOT bot" style.',
  usage: '<word1> [word2] [word3]',
  category: 'secret',
  aliases: ['ntxt'],
  run: async (client, message, args, config) => {
    if(!args[0]) return message.reply("you need to provide at least one argument.")
    if(!args[1]) args.push("bot");
    const x = args[0].toLowerCase()
    const texta = x[0].toUpperCase() + x.slice(1)
    const textb = args[1].toUpperCase()
    if (!args[2]) {
      var textc = args[1].toLowerCase()
    } else {
      var textc = args[2].toLowerCase()
    }
    // message.channel.send(`${texta}${textb} ${textc}`)
    const fulltext = `${texta}${textb} ${textc}`.replace(/[|*_`~\\]/g, '').trim();
    if(!fulltext) return message.reply("please provide a valid string of text.");
    let NovoEMBED_embed = new MessageEmbed()
    .setColor('#A133D5')
    .setTitle("NovoText")
    .setDescription(`**${fulltext}**`)
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    .setFooter(message.guild.name, message.guild.iconURL())
    .setTimestamp()
    message.channel.send(NovoEMBED_embed)

  },
};

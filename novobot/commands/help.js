const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: "...Seriously? If it's gotten to the point where you want help with the help command, all hope is lost...",
  usage: '[command or command alias]',
  category: 'info',
  aliases: ['h'],
  run: async (client, message, args, config) => {
    // If the user doesn't provide args, list commands.
    if (!args[0]) {
      // Create categories array and clear duplicates
      // Filter out all duplicate and undefined values
      var categories = Array.from(new Set(client.commands.map(x => x.category))).filter(x => { return x !== undefined }).filter(y => y !== "secret");
      // List of misc commands
      const misc = client.commands.filter(x => !x.category).map(c => `\`${c.name}\``);
      // Actually construct the embed
      let helpEmbed = new MessageEmbed()
        .setColor('#A133D5')
        .setTitle('NovoBot - Help')
        .setURL('https://discord.gg/hutWjXe')
        //.setAuthor('(click here to join my server)', 'https://github.com/Dukemz.png', 'https://discord.gg/A3BbAcH')
        .setDescription(`NovoBot is a Discord bot created and maintained by Dukemz#7766. Use the above link to join the official NovoBot server for support, suggestions, and early access features.
          \n**Tip:** To get help on a specific command, use \`${config.prefix}help [command]\` (without the brackets).`)
        .setThumbnail(client.user.avatarURL())
        .setFooter("To view a list of people who helped create the bot, run n!devs.") // NovoBot Nightly will have some more in-dev commands (run n$help to view them.)
      // For each of the categories, throw in those commands!
      categories.forEach(e => {
        let cmds = client.commands.filter(x => x.category === e).map(c => `\`${c.name}\``);
        helpEmbed.addField(e[0].toUpperCase() + e.slice(1), cmds.join(", "));
      });
      helpEmbed.addField('Misc', misc.join(", ")) // Throw in the commands without a category.
      message.channel.send(helpEmbed);
    } else {
      // See if the commmand name can be found.
      let cmd;
      let command = args[0]
      if (client.commands.has(command)) {
        // Does a command exist with the exact name specified by the user?
        cmd = client.commands.get(command);
      } else if (client.aliases.has(command)) {
        // Does a command exist with an alias specified by the user?
        cmd = client.commands.get(client.aliases.get(command));
      } else {
        return message.channel.send(`\\❌ Couldn't find a command or alias with that name.`)
      } // If we've made it past this point, that means we've got the command. Yay!
      // Make some vars for the thingy! (This gave me several minutes of headache)
      let usage; let description; let category; let aliases;
      if (!cmd.usage) { usage = '' } else { usage = ` ${cmd.usage}` } // yes i know this is dumb leave me alone
      if (!cmd.description) description = "[This command doesn't seem to have a description.]"; else description = cmd.description;
      if (!cmd.category) { category = 'Misc' } else { category = cmd.category[0].toUpperCase() + cmd.category.slice(1) } // YES ALSO DUMB LEAVE ME ALONE SMH
      if (!cmd.aliases) { aliases = "None" } else { aliases = cmd.aliases.map(x => `\`${x}\``).join(", ") }

      let helpEmbed = new MessageEmbed()
        .setColor('#A133D5')
        .setTitle(`Command - ${config.prefix}${cmd.name}`)
        .setDescription(description)
        .addField('Usage', `\`${config.prefix}${cmd.name}${usage}\``)
        .addField('Aliases', aliases)
        .addField('Category', category)
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
        .setTimestamp()
      message.channel.send(helpEmbed);
    }
  },
};
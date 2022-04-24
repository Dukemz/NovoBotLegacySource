module.exports = {
  name: 'coins',
  description: 'Display yours or another user\'s balance.',
  aliases: ['bal', 'balance', 'credit', 'c'],
  usage: "[user]",
  category: "currency",
  run: async (client, message, args, config) => {
    const db = require('better-sqlite3')(config.db);
    
    if(!args[0]) {
      const result = db.prepare(`SELECT coins FROM users WHERE userid='${message.author.id}'`).get();
      message.reply(`you have a balance of **${result.coins} <:novocoins:707609436822437999> NovoCoins.**`);
    } else {
      let finduser = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0]);
      if(!finduser) {
        db.close();
        return message.reply("please provide a valid user.");
      }
      if(finduser.id === client.user.id) {
        db.close();
        return message.channel.send("Let's just say I'm kinda rich.");
      }
      const resulta = db.prepare(`SELECT coins FROM users WHERE userid='${finduser.id}'`).get()
      if(!resulta) {
        db.close();
        return message.reply(`**${finduser.username}** isn't a registered NovoBot user. They must run any command to become registered.`);
      }
      message.channel.send(`**${finduser.username}** has a balance of **${resulta.coins} <:novocoins:707609436822437999> NovoCoins.**`);
    }
    db.close();
  },
};
module.exports = {
  name: 'work',
  description: 'Work to earn some money! Has a 1h cooldown.',
  aliases: ['w'],
  category: "currency",
  run: async (_client, message, _args, config) => {
    const db = require('better-sqlite3')(config.db);
    const pms = require('pretty-ms');

    const usercoins = db.prepare(`SELECT coins FROM users WHERE userid='${message.author.id}'`).get();
    if(!usercoins) {
      db.close();
      return message.reply(`you don't have an account in the database. Please run \`${config.prefix}dbinit\` to create a database account.`);
    }
    // Get the timestamp of the last time a user worked.
    let result = db.prepare(`SELECT lastWork FROM users WHERE userid='${message.author.id}'`).get();
    const ts = Date.now()
    const time = Math.floor(ts - result.lastWork); // Subtract the current timestamp from the fetched one.

    // calculate minutes
    const min = Math.floor((time/1000/60) << 0);

    // How many coins should be earned?
    // const earnedCoins = Math.floor(Math.random() * 25) + 6;
    const earnedCoins = randInt(15, 5);

    if(result.lastWork === null) {
      message.reply(`welcome to the industry! You earned **${earnedCoins} <:novocoins:707609436822437999> NovoCoins** on your first job.\nYou now have **${usercoins.coins + earnedCoins} <:novocoins:707609436822437999> NovoCoins.**`);
      db.prepare(`UPDATE users SET coins='${usercoins.coins + earnedCoins}', lastWork='${Date.now()}' WHERE userid=${message.author.id}`).run()

    } else if(min >= 60) {
        const scam = Math.floor(Math.random() * 100) + 1;
        if(scam === 69) {
          db.prepare(`UPDATE users SET lastWork='${Date.now()}' WHERE userid=${message.author.id}`).run();
          db.close();
          return message.channel.send(`Oh dear... You got scammed and earned no coins this time. Sorry!\nYour current balance is **${usercoins.coins} <:novocoins:707609436822437999> NovoCoins.**`)
        }
        message.reply(`you worked again and got **${earnedCoins} <:novocoins:707609436822437999> NovoCoins**, well done! [WIP]\nYou now have **${usercoins.coins + earnedCoins} <:novocoins:707609436822437999> NovoCoins.**`)
        db.prepare(`UPDATE users SET coins='${usercoins.coins + earnedCoins}', lastWork='${Date.now()}' WHERE userid=${message.author.id}`).run();

    } else message.reply(`you need to wait **${pms(3600000 - time)}** before you can work again!`);
    
    // close database connection
    db.close();
  },
};
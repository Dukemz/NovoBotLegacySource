module.exports = {
  name: 'daily',
  description: 'Get your daily income of NovoCoins. Run this command 7 days in a row to get a bonus!',
  aliases: ["d"],
  category: "currency",
  run: async (_client, message, _args, config) => {
    const db = require('better-sqlite3')(config.db);
    const pms = require('pretty-ms');
    const emojis = require('../json/emojis.json');

    const usercoins = db.prepare(`SELECT coins FROM users WHERE userid='${message.author.id}'`).get();
    // if(!usercoins) {
    //   db.close();
    //   return message.reply(`you don't have an account in the database. Please run \`${config.prefix}createacc\` to create a database account.`);
    // }

    // Get the timestamp of the last time a user worked.
    let result = db.prepare(`SELECT lastDaily, streak FROM users WHERE userid='${message.author.id}'`).get();
    const ts = Date.now()
    const time = Math.floor(ts - result.lastDaily); // Subtract the current timestamp from the fetched one.

    // calculate hours
    hrs = Math.floor( ((time/1000/60) << 0)/60 );

    if(result.lastDaily === null) {
      message.reply(`you earned your **25 daily ${emojis.nvc} NovoCoins!** \nRun this command every day within 24 hours to increase your streak. You get a bonus at 7 days in a row. Have fun!`);
      db.prepare(`UPDATE users SET coins='${usercoins.coins + 25}', lastDaily='${Date.now()}', streak='2' WHERE userid=${message.author.id}`).run();

    } else if(hrs < 24) { // If you haven't waited long enough
      message.reply(`you need to wait **${pms(86400000 - time)}** before you can receieve your daily credits.`);

    } else if(24 <= hrs && hrs <= 48) {
      if(result.streak !== 7) {
        message.reply(`you earned your **25 daily ${emojis.nvc} NovoCoins!** \nStreak: ${emojis.daily[result.streak - 1]} **[${result.streak}/7]**`);
        db.prepare(`UPDATE users SET coins='${usercoins.coins + 25}', lastDaily='${Date.now()}', streak='${result.streak + 1}' WHERE userid=${message.author.id}`).run();
      } else { // ooh bonus coins
        // const bonus = Math.floor(Math.random() * 85) + 75;
        const bonus = randInt(110, 85);
        message.reply(`you earned your **25 daily ${emojis.nvc} NovoCoins!** \nStreak: ${emojis.daily[6]} **[7/7]** \n\nYou've completed a streak and earned **${bonus} ${emojis.nvc} NovoCoins** as a bonus! \n(Total: **${20 + bonus} ${emojis.nvc}**)`);
        db.prepare(`UPDATE users SET coins='${usercoins.coins + 25 + bonus}', lastDaily='${Date.now()}', streak='1' WHERE userid=${message.author.id}`).run();
      }
      
    } else {
      // Reset streak back to 0 (too little, too late!)
      message.reply(`you earned **20 daily ${emojis.nvc} NovoCoins!**\n(**P.S.** Your streak was reset because you didn't claim your daily in time.)`);
      db.prepare(`UPDATE users SET coins='${usercoins.coins + 20}', lastDaily='${Date.now()}', streak='2' WHERE userid=${message.author.id}`).run();
    }
    db.close();
  },
};
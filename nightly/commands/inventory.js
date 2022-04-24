const { MessageEmbed } = require('discord.js');
const itemData = require('../json/items.json');
const { nvc } = require("../json/emojis.json");
const tips = require('../json/tips.json');

module.exports = {
  name: 'inventory',
  description: "View your inventory or any of the items in it.",
  category: 'fun',
  usage: '[item position]',
  aliases: ['inv'],
  run: async (client, message, args, config) => {
    const db = require('better-sqlite3')(config.db);

    const userdata = db.prepare(`SELECT inventory, happiness FROM users WHERE userid='${message.author.id}'`).get();
    if(userdata.inventory === null) userdata.inventory = "";
    let inventory = userdata.inventory.split(",");
    // tipz
    const tipz = tips.map(x => eval(`\`${x}\``));
    const selTip = randArray(tipz); // pick a random tip

    if(args[0]) { // view specific item
      if(!inventory[0]) { // user doesn't have any items
        db.close();
        return message.reply("your inventory is empty!");
      }
      const selItem = inventory[args[0]];
      if(!selItem) { // invalid position
        db.close();
        return message.reply("please provide a valid item position.");
      }
      const xItem = itemData.find(x => x.id == selItem);
      if(!xItem.img) xItem.img = 'https://www.pinclipart.com/picdir/big/52-527970_card-missing-icon-free-vector-missing-icon-clipart.png';
      if(!xItem.description) xItem.description = '[no description found]';
      if(!xItem.type) xItem.type = "unknown";

      const itemEmbed = new MessageEmbed()
      .setColor('#A133D5')
      .setTitle(`\`[${args[0]}]\` ${xItem.name}`)
      .setThumbnail(xItem.img)
      .setDescription(xItem.description)
      .addField('Type', xItem.type[0].toUpperCase() + xItem.type.slice(1), true)
      .setFooter(selTip)
      if(!xItem.value) xItem.value = "Unknown";
      if(xItem.type === "food") {
        itemEmbed.addField('Food Points', `**${xItem.value}**`, true);
      }
      message.channel.send(itemEmbed);

    } else { // view whole inventory
      inventory = inventory.filter(o => o != '');
      const invItems = [];
      for(i = 0; i < inventory.length; i++) {
        const iter = inventory[i];
        const item = itemData.find(x => x.id == iter);
        if(item.id) invItems.push(`\`[${i}]\` **${item.name}**`);
      }
      let invLength = inventory.length;
      if(!invItems[0]) {
        invLength = 0;
        invItems.push("[empty]");
      }
      const depos = db.prepare(`SELECT coins FROM deposits WHERE userid='${message.author.id}'`).all();
      const depoMoney = depos.map(m => m.coins).reduce((a, b) => a + b, 0); // add together items in the array
      const invEmbed = new MessageEmbed()
      .setColor(randArray(client.c.ni))
      .setTitle(`${message.author.username}'s Inventory`)
      .setThumbnail(message.author.avatarURL())
      .setDescription(`The number in square brackets next to each item is its position. \nUse \`${config.prefix}inventory [item position]\` to view details on a specific item.`)
      .addField('Happiness', `**${userdata.happiness}**`, true)
      .addField('Deposits', `**${depos.length}**`, true)
      .addField('Deposit Value Total', `**${depoMoney}** ${nvc}`, true)
      
      .addField(`Items \`[${invLength}/10]\``, invItems.join("\n"))
      .setFooter(selTip)
      message.channel.send(invEmbed);
    }
    db.close();
  },
};
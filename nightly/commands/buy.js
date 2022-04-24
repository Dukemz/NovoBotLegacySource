const { MessageEmbed } = require('discord.js');
const shop = require('../json/shop.json');
const { nvc } = require("../json/emojis.json");

module.exports = {
  name: 'buy',
  description: "Purchase an item of the shop by ID.",
  category: 'currency',
  usage: '<category> <item ID>',
  run: async (client, message, args, config) => {
    if(!args[0]) return message.reply("you need to provide a category from the shop.");
    const pItem = args[1];
    if(!pItem) return message.reply("you need to provide an item ID from the shop.");
    
    // Check if the category exists
    if(!shop[args[0].toLowerCase()]) return message.reply("that isn't a valid category.");

    const db = require('better-sqlite3')(config.db);
    const userdata = db.prepare(`SELECT coins, inventory FROM users WHERE userid='${message.author.id}'`).get();

    // Get existing item data from the shop.
    const shopItems = []; // prepare empty array of items
    for(const c in shop) { // Loop through categories
      let i = 0;
      const subcategories = Object.keys(shop[c]);

      subcategories.forEach(s => { // for each subcategory...
        shop[c][s].forEach(item => { // ... get the data and add items to the list
          let is = i.toString();
          if(is.length === 1) { is = '0' + is; }
          item['id'] = is;
          item['cat'] = c;
          shopItems.push(item);
          i++;
        });
      });
    }

    // Find the item that they requested (if it exists.)
    const fetchedItem = shopItems.filter(item => item.cat === args[0].toLowerCase()).find(item => item.id.replace(/^0+/i, '') === pItem.replace(/^0+/i, ''));
    if(!fetchedItem) {
      db.close();
      return message.reply(`that isn't a valid item ID. Browse the shop to find one (it will be the number in square brackets next to its name).`);
    }
    if(!fetchedItem.img) fetchedItem.img = 'https://www.pinclipart.com/picdir/big/52-527970_card-missing-icon-free-vector-missing-icon-clipart.png';
    // Check if the item is missing required attributes
    if(isNaN(fetchedItem.cost) || !fetchedItem.item) {
      db.close();
      return message.channel.send("\\❌ Failed to purchase the item. This is likely because the item is missing some attributes. Please contact the devs if you think this is unintentional.");
    }
    const reqCoins = userdata.coins - fetchedItem.cost;
    if(reqCoins >= 0) { // The user has enough coins
      const embed = new MessageEmbed()
      .setColor('#A133D5')
      .setThumbnail(fetchedItem.img)
      .setTitle("NovoShop - Purchase Successful!")
      .setDescription(`You've purchased **${fetchedItem.name}** for **${fetchedItem.cost} ${nvc} NovoCoins!**`)
      .addField('Previous Balance', `**${userdata.coins}** ${nvc}`, true)
      .addField('Current Balance', `**${reqCoins}** ${nvc}`, true)
      .setFooter(`To view your inventory, run ${config.prefix}inventory.`)
      .addField('\u200b', '\u200b', true)

      if(userdata.inventory === null) { // The user's inventory is empty
        embed.addField('Remaining Inventory Space', "**9**", true);
        embed.addField('Item Position', '**0**', true);
        db.prepare(`UPDATE users SET coins='${reqCoins}', inventory='${fetchedItem.item}' WHERE userid='${message.author.id}'`).run();
      } else { // not empty
        const inventory = userdata.inventory.split(","); // convert the inventory string to a readable array
        // console.log(inventory)
        if(inventory[0] === "") inventory.shift();
        if(inventory.length >= 10) { // not enough inventory space
          db.close();
          return message.reply(`you don't have enough space in your inventory! Use \`${config.prefix}use <item position>\` to use an item or \`${config.prefix}discard <item position>\` to remove items you don't need.`);
        } else { // there is enough space...
          embed.addField('Remaining Inventory Space', `**${10 - inventory.length - 1}**`, true);
          embed.addField('Item Position', `**${inventory.length}**`, true);
          inventory.push(fetchedItem.item); // add the item to the array
          db.prepare(`UPDATE users SET coins='${reqCoins}', inventory='${inventory.join()}' WHERE userid='${message.author.id}'`).run();
        }
      }
      message.channel.send(embed);
    } else {
      db.close();
      return message.reply(`you need at least **${reqCoins.toString().slice(1)}** more ${nvc} **NovoCoins** to purchase **${fetchedItem.name}**!`)
    }
    db.close();
  },
};
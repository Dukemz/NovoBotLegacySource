const { MessageEmbed } = require('discord.js');
const shop = require("../json/shop.json");
const { nvc } = require("../json/emojis.json");

module.exports = {
  name: 'shop',
  aliases: ['store'],
  description: "Browse the NovoShop! Purchase items with n!buy. The number in square brackets next to an item is it's ID.",
  category: 'currency',
  usage: '[category/item ID]',
  run: async (client, message, args, config) => {
    const db = require('better-sqlite3')(config.db);
    const selCat = args[0]; // selected category/item ID can be first argument

    // Add an extra helper for user coins
    const usercoins = db.prepare(`SELECT coins FROM users WHERE userid='${message.author.id}'`).get().coins;

    const items = []; // prepare empty array of items
    for(const c in shop) { // Loop through categories
      let i = 0;
      const subcategories = Object.keys(shop[c]);

      subcategories.forEach(s => { // for each subcategory...
        shop[c][s].forEach(item => { // ... get the data and add items to the list
          let is = i.toString();
          if(is.length === 1) { is = '0' + is; }
          item['id'] = is;
          item['cat'] = c;
          items.push(item);
          i++;
        });
      });
    } // I should really use one letter variables less often so I can understand what I'm doing...

    if(selCat) {
      const selCat_u = selCat[0].toUpperCase() + selCat.slice(1).toLowerCase(); // capitalize first letter because yes
      if(shop[selCat.toLowerCase()] && !args[1]) { // Category exists but no item chosen
        const subcategories = Object.keys(shop[selCat.toLowerCase()]);
        let itemTotal = 0; // total items in this subcategory

        // Construct the base embed.
        const shopEmbed = new MessageEmbed()
        .setColor(client.c.nv[0])
        .setTitle(`NovoShop - **${usercoins}** ${nvc}`)
        .setFooter(`View information on an item with ${config.prefix}shop ${selCat.toLowerCase()} <item id> [example: ${config.prefix}shop ${selCat.toLowerCase()} 00]. The number in square brackets next to an item's name is its ID.`)

        for(i = 0; i < subcategories.length; i++) { // Loop through each subcategory
          const subCat = subcategories[i];

          const subCat_u = subCat[0].toUpperCase() + subCat.slice(1); // capitalize again lol
          const citems = []; // Make an empty array that will contain item IDs and names

          for(u = 0; u < shop[selCat.toLowerCase()][subCat].length; u++) { // Loop through items in a subcategory
            if(shop[selCat.toLowerCase()][subCat][u].id) itemTotal++; // increment the total count
            citems.push(`\`[${shop[selCat.toLowerCase()][subCat][u].id}]\` **${shop[selCat.toLowerCase()][subCat][u].name}**`); // Add their data to the list: (`[id]` **name**)
          }
          if(!citems[0]) citems.push("[empty]");
          shopEmbed.addField(subCat_u, citems.join("\n"), true); // Add a field containing subcategory data
        }
        shopEmbed.setDescription(`Currently browsing ${selCat_u}. \n**Total Items:** \`${itemTotal}\``)
        message.channel.send(shopEmbed);

      } else if(shop[selCat.toLowerCase()] && args[1]) {
        const fetchedItem = items.filter(item => item.cat === selCat.toLowerCase()).find(item => item.id.replace(/^0+/i, '') === args[1].replace(/^0+/i, '')); // Fetch item by ID (remove 0s)

        if(!fetchedItem) {
          db.close();
          return message.reply("that item ID doesn't exist in the specified category.");
        }

        // Replace attributes if missing
        if(!fetchedItem.img) fetchedItem.img = 'https://www.pinclipart.com/picdir/big/52-527970_card-missing-icon-free-vector-missing-icon-clipart.png';
        if(!fetchedItem.description) fetchedItem.description = '[no description found]';
        if(isNaN(fetchedItem.cost)) fetchedItem.cost = "Error";

        let rqtext;
        let costtext;
        let rq = usercoins - fetchedItem.cost;
        if(rq < 0) {
          rqtext = '`[Required Coins]`';
          costtext = "You don't have enough money to buy this item.";
        } else {
          rqtext = '`[Balance After Purchase]`';
          costtext = `To buy this item, use ${config.prefix}buy ${selCat.toLowerCase()} ${fetchedItem.id}.`;
        }
        rq = Math.abs(rq);

        const itemEmbed = new MessageEmbed()
        .setColor(client.c.nv[0])
        .setTitle(`NovoShop - ${fetchedItem.name} \`[${fetchedItem.id}]\``)
        .setDescription(fetchedItem.description)
        .setThumbnail(fetchedItem.img)
        .addField('`[Total Item Cost]`', `**${fetchedItem.cost}** ${nvc}`, true)
        .setFooter(costtext)
        .addField('`[Current Balance]`', `**${usercoins}** ${nvc}`, true)
        .addField(rqtext, `**${rq}** ${nvc}`);

        db.close();
        return message.channel.send(itemEmbed);
      } else { // Category does in fact NOT exist
        db.close();
        return message.reply("that category doesn't exist.");
      }

    } else {
      const categories = Object.keys(shop).map(m => `\`${m[0].toUpperCase()}${m.slice(1)}\``).join(", "); // constructs array of all categories (foodstuffs, misc, etc.)
      const shopEmbed = new MessageEmbed()
      .setTitle(`NovoShop - **${usercoins}** ${nvc}`)
      .setColor(client.c.nv[0])
      .setThumbnail(client.user.avatarURL())
      .setDescription(`Welcome to the NovoShop! \n**Categories:** ${categories} \n**Total items:** \`${items.length}\``)
      .setFooter(`Browse items in a category with ${config.prefix}shop [category].`)
      message.channel.send(shopEmbed);
    }
    db.close();
  },
};

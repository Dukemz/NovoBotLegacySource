const { MessageEmbed } = require('discord.js');
const axios = require('axios')

module.exports = {
  name: 'meme',
  description: 'Get a random meme from Reddit.',
  category: 'fun',
  run: async (client, message) => {
    const ts = Date.now();
    const m = await message.channel.send("Searching for a meme...");
    const subreddits = ["memes", "dankmemes", "me_irl"];
    const random = subreddits[Math.floor(Math.random() * subreddits.length)];
    const response = await axios.get(`https://www.reddit.com/r/${random}/hot/.json?limit=100`).catch(err => {
      return m.edit(`\\❌ Failed to get post data from Reddit, please try again later. \nHTTP Response Code: \`${err.response.status} ${err.response.statusText}\``);
    });
    if(!response.data) return;

    const index = Math.floor(Math.random() * 100);
    const post = response.data.data.children[index].data;
    const imageEmbed = new MessageEmbed()
      .setTitle(post.title)
      .setURL("https://reddit.com" + post.permalink)
      .setColor("RANDOM")
      .setAuthor(`u/${post.author}`, '', `https://reddit.com/u/${post.author}`)
      .setImage(post.url)
      .setFooter(`r/${random} • Took ${Date.now() - ts}ms`, client.user.avatarURL())
      .setTimestamp();
    m.edit("Found one!", imageEmbed);
  },
};
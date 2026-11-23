const { Telegraf } = require('telegraf');

// Set BOT_TOKEN in environment or replace below
const bot = new Telegraf(process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE');

bot.start((ctx) => {
  ctx.reply('Welcome to Unique Perspective 8!\n\nBrowse products: https://t.me/UniqueP8\nShop: https://shop.uniqueperspective8.com');
});

bot.command('products', (ctx) => {
  ctx.reply('Unique Perspective 8 Shop Channel:\nhttps://t.me/UniqueP8');
});

bot.command('shop', (ctx) => {
  ctx.reply('Main shop: https://shop.uniqueperspective8.com\nChannel: https://t.me/UniqueP8');
});

bot.command('help', (ctx) => {
  ctx.reply('/start - Welcome\n/products - Shop channel\n/shop - Website shop\n/help - Commands');
});

// Optional: post to channel (bot must be admin with post permission)
bot.command('announce', async (ctx) => {
  try {
    await bot.telegram.sendMessage('@UniqueP8', 'New update from Unique Perspective 8!');
    ctx.reply('Posted to channel.');
  } catch (e) {
    ctx.reply('Could not post. Make sure bot is admin on @UniqueP8.');
  }
});

bot.launch();
console.log('Unique Perspective 8 Telegram bot is running...');

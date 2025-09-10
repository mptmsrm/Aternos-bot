const keep_alive = require('./keep_alive.js')
const express = require('express');
const mineflayer = require('mineflayer');

// Create a simple web server to keep Replit awake
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('AFK Bot is running!');
});

app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});

// Function to create and configure the bot
function createBot() {
  console.log('Attempting to connect to Minecraft server...');

  const bot = mineflayer.createBot({
    host: "MSRMPT.aternos.me",             // Your server IP
    port: 50787,                    // Your server port
    username: "AFK_Bot",            // Bot's username
    version: "1.21",                // Server version (now 1.21)
    auth: 'offline'                 // Use offline mode
  });

  bot.on('spawn', () => {
    console.log('Bot connected to Minecraft server!');
    console.log('Bot position:', bot.entity.position);

    // Jump every 4 minutes to prevent inactivity kick
    setInterval(() => {
      console.log('Jumping to prevent inactivity kick...');
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }, 4 * 60 * 1000); // 4 minutes in milliseconds
  });

  bot.on('error', (err) => {
    console.error('Bot error:', err.message);

    // Attempt to reconnect after 30 seconds
    console.log('Attempting to reconnect in 30 seconds...');
    setTimeout(createBot, 30000);
  });

  bot.on('end', (reason) => {
    console.log('Bot disconnected from server. Reason:', reason);

    // Attempt to reconnect after 30 seconds
    console.log('Attempting to reconnect in 30 seconds...');
    setTimeout(createBot, 30000);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked from server. Reason:', reason);

    // Attempt to reconnect after 30 seconds
    console.log('Attempting to reconnect in 30 seconds...');
    setTimeout(createBot, 30000);
  });

  bot.on('message', (message) => {
    console.log('Server message:', message.toAnsi());
  });

  return bot;
}

// Start the bot
const bot = createBot();


// var username2 = process.env.username2;
// var password2 = process.env.password2;
// var shared_secret2 = process.env.shared2;

// var games2 = [730, 440, 570, 304930];  // Enter here AppIDs of the needed games
// var status2 = 1;  // 1 - online, 7 - invisible


// user2 = new steamUser();
// user2.logOn({"accountName": username2, "password": password2, "twoFactorCode": steamTotp.generateAuthCode(shared_secret2)});
// user2.on('loggedOn', () => {
// 	if (user2.steamID != null) console.log(user2.steamID + ' - Successfully logged on');
// 	user2.setPersona(status2);               
// 	user2.gamesPlayed(games2);
// });

module.exports = {
  name: "ready",
  run: async (bot) => {
    console.log(`${bot.client.user.tag} is now online!`);
  },
};

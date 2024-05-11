const config = {
    name: "restart",
    aliases: ["rs"],
    description: "Restart bot",
    usage: "[query]",
    cooldown: 3,
    permissions: [2],
    credits: "Subin",
    
}

async function onCall({ message }) {
    await message.reply("Restarting...");
    global.restart();
}

export default {
    config,
    onCall
}

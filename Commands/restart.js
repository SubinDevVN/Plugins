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
    await message.react("✅");  
    await message.reply({
            body: "Restarting..",
            sticker: "144885252352408" 
        });
    await global.restart();
}

export default {
    config,
    onCall
}

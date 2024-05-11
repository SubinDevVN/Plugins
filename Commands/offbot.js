const config = {
    name: "offbot",
    aliases: ["shutdown"],
    description: "Tắt bot",
    usage: "[query]",
    cooldown: 3,
    permissions: [2],
    credits: "Subin",
    
}

async function onCall({ message }) {  
  await message.react("✅");  
  await message.reply({
            body: "Shutdown..",
            sticker: "126362197548577" 
        });
  await global.shutdown();
    
}

export default {
    config,
    onCall
}


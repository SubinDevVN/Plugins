import { join } from "path";
import { existsSync, writeFileSync, readFileSync } from "fs";
const config = {
    name: "resetappstate",
    aliases: ["rsast"],
    description: "Reset appstate",
    usage: "[query]",
    cooldown: 3,
    permissions: [2],
    credits: "Subin",
    
}

async function onCall({ message }) {
  try {
    let ast = global.api.getAppState();
    const data = JSON.stringify(ast);
    const PATH = join(global.mainPath, 'appstate.json');
    await message.react("✅");  
    await message.reply({
            body: "Reseting..",
            sticker: "126362197548577" 
        });
    writeFileSync(PATH, data, "utf-8");
    await global.restart();
  } catch (e) {
    message.reply(`Lỗi:` + e);
    console.log(e);
  }
}

export default {
  config,
  onCall
}


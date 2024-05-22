import fs from 'fs/promises';

const config = {
    name: "calendar",
    aliases: ["cld"],
    description: "Đặt lịch hẹn",
    usage: "<tag/me><tgian><ngày/tháng/năm><nội dung>",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "Subin",
};

async function loadData() {
    try {
        const data = await fs.readFile('sb.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile('sb.json', JSON.stringify([], null, 2));
            return [];
        } else {
            throw err;
        }
    }
}

async function saveData(dataToSave) {
    try {
        const data = await loadData();
        data.push(dataToSave);
        await fs.writeFile('sb.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Lỗi khi lưu dữ liệu:', err);
    }
}

async function checkExistingSchedule(senderID, date) {
    const data = await loadData();
    return data.some(entry => entry.senderID === senderID && entry.date === date);
}

function isValidDate(date) {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
}

function isValidTime(time) {
    return /^\d{2}:\d{2}$/.test(time);
}

async function getUserNameById(userId) {
    try {
        const { Users } = global.controllers;
        const allUsers = await Users.getAll();
        const user = allUsers.find(user => user.userID === userId);
        return user ? user.info.name : null;
    } catch (err) {
        message.send(`Không tìm thấy tên của người dùng ${userId}:`, err);
        return null;
    }
}

async function onCall({ message, args }) {
    const { threadID, senderID } = message;

    const input = args.join(' ');
    const parts = input.split(',').map(part => part.trim());
    if (parts.length < 4) {
        console.log("Vui lòng sử dụng đúng định dạng <mention> hoặc me ( cho bản thân ), giờ xx:xx, dd/mm/yyyy, <nội dung>'.");
        return;
    }

    const [mentionRaw, time, date, ...contentParts] = parts;
    let mentionTag = mentionRaw.replace(/@/g, "");

    if (mentionTag.toLowerCase() === 'me') {
        mentionTag = await getUserNameById(senderID);
        if (!mentionTag) {
            message.send("Không tìm thấy tên người dùng.");
            return;
        }
    }

    if (!isValidTime(time)) {
        console.log("Vui lòng sử dụng đúng định dạng 'xx:xx'.Ví dụ 11:05");
        return;
    }

    if (!isValidDate(date)) {
        message.send("Vui lòng sử dụng đúng định dạng ngày/tháng/năm");
        return;
    }

    const content = contentParts.join(', ');

    const exists = await checkExistingSchedule(senderID, date);
    if (exists) {
        console.log('Lỗi.');
        return;
    }

    const dataToSave = {
        senderID,
        mention: mentionTag,
        date,
        time,
        content,
        boxId: threadID
    };

    await saveData(dataToSave);
}

export {
    config,
    onCall
};

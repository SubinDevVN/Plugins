import fs from 'fs/promises';
import cron from 'node-cron';
import moment from 'moment-timezone';

async function loadSchedules() {
    try {
        const data = await fs.readFile('sb.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        return [];
    }
}

async function saveSchedules(schedules) {
    try {
        const data = JSON.stringify(schedules, null, 2);
        await fs.writeFile('sb.json', data, 'utf8');
    } catch (err) {
        console.error('Lỗi khi lưu dữ liệu:', err);
    }
}

function formatDateTimeForVietnam(date) {
    return moment(date).tz("Asia/Ho_Chi_Minh").format('DD/MM/YYYY HH:mm');
}

async function sendMessage(schedule) {
    const messageContent = `${schedule.content}`;
    const mention = schedule.mention;
    const messageToSend = `${mention} ${messageContent}`;
    const tag = mention.replace(/@/g, "");

    try {
        await global.api.sendMessage({
            body: messageToSend,
            mentions: [{ tag, id: schedule.senderID }],
        }, schedule.boxId);
    } catch (error) {
        console.error(`Lỗi khi gửi tin nhắn tới ${schedule.boxId}`, error);
    }
}

async function processScheduledMessages() {
    const schedules = await loadSchedules();
    const currentTimeVietnam = moment().tz("Asia/Ho_Chi_Minh").format('DD/MM/YYYY HH:mm'); 

    const [todaysSchedules, remainingSchedules] = schedules.reduce(([todays, remaining], schedule) => {
        const scheduleDateTime = `${schedule.date} ${schedule.time}`;
        if (scheduleDateTime === currentTimeVietnam) {
            todays.push(schedule);
        } else {
            remaining.push(schedule);
        }
        return [todays, remaining];
    }, [[], []]);

    for (const schedule of todaysSchedules) {
        await sendMessage(schedule);
    }

    await saveSchedules(remainingSchedules);
}

const config = () => {
    cron.schedule('* * * * *', () => {
        processScheduledMessages(); 
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });
};

const onCall = async () => {
    await processScheduledMessages();
};

export {
    config,
    onCall
};

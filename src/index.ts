import { Bot } from "grammy";
import { config } from "dotenv";
import {
    getUpdates,
    getNotifications,
    transformNotificationData,
    getFeeds,
    transformFeedData,
} from "./message.js";
import { FeedEntity, NotificationEntity } from "crossbell.js";
import { createClient } from "redis";
import cron from "node-cron";

config();

const botToken = process.env["botToken"] || "";
const channelId = process.env["channelId"] || "";
const selfId = process.env["selfChar"];
const watchId = process.env["watchChar"];
const lastCursKey = "lastCurs";

const bot = new Bot(botToken);

async function run(lastCurs: string[]) {
    // Self notification
    if (selfId) {
        const newNotifications = await getNotifications(+selfId);
        if (newNotifications.length > 0) {
            const { list, caughtUp, newLastCur } =
                getUpdates<NotificationEntity>(newNotifications, lastCurs[0]);
            lastCurs[0] = newLastCur;
            write(transformNotificationData(list.reverse()));
        }
    }

    // if (caughtUp) {
    //     //TODO
    // } else {
    //     //TODO
    // }

    // Feed of other character
    if (watchId) {
        const newFeeds = await getFeeds(+watchId);
        if (newFeeds.length > 0) {
            const { list, caughtUp, newLastCur } = getUpdates<FeedEntity>(
                newFeeds,
                lastCurs[1]
            );
            lastCurs[1] = newLastCur;

            write(transformFeedData(list.reverse()));
        }
    }
}

async function initialize(client: any, lastCurs: string[]) {
    const value = await client.get(lastCursKey);
    if (value) {
        lastCurs = JSON.parse(value) as [];
    } else {
        lastCurs = ["", ""];
    }
    return lastCurs;
}

async function main() {
    const client = createClient();
    client.on("error", (err: any) => console.log("Redis client Error", err));
    await client.connect();

    let lastCurs = ["", ""];
    // client.set(lastCursKey, JSON.stringify(lastCurs)); // DEBUG: always start from empty

    lastCurs = await initialize(client, lastCurs);

    bot.start();
    console.log("🎉 Congrats! Bot has successfully started.");

    cron.schedule("*/3 * * * * *", async () => {
        await run(lastCurs);
        client.set(lastCursKey, JSON.stringify(lastCurs));
    });
}

async function write(msgs: string[]) {
    for (const msg of msgs) {
        try {
            await bot.api.sendMessage(channelId, msg);
        } catch (e: any) {
            console.error(e.message);
        }
    }
}

main();

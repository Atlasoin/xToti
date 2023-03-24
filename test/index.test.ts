import { FeedEntity, NotificationEntity } from "crossbell.js";
import { expect, test } from "vitest";
import {
    getFeeds,
    getUpdates,
    transformFeedData,
    transformNotificationData,
    Tx,
} from "../src/message";
import {
    oldNotificationList,
    newNotificationList,
    oldFeedList,
    newFeedList,
    tipNotificationList,
} from "./mocks";

test("correctly get notification updates", () => {
    const { newLastCur } = getUpdates(
        oldNotificationList.list as any as Tx[],
        ""
    );
    const { list } = getUpdates(
        newNotificationList.list as any as Tx[],
        newLastCur
    );
    expect(list.length).toBe(8);
});

test("correctly get notification updates", () => {
    const { newLastCur } = getUpdates(
        newNotificationList.list as any as Tx[],
        ""
    );
    const { list } = getUpdates(
        newNotificationList.list as any as Tx[],
        newLastCur
    );
    expect(list.length).toBe(0);
});

test("correctly get feed updates", () => {
    const { newLastCur } = getUpdates(oldFeedList.list as any as Tx[], "");
    const { list } = getUpdates(newFeedList.list as any as Tx[], newLastCur);
    expect(list.length).toBe(4);
});

test("correctly transform notification data", async () => {
    const res = transformNotificationData(
        newNotificationList.list as any as NotificationEntity[]
    );
});

test("correctly transform feed data", async () => {
    const res = transformFeedData(newFeedList.list as any as FeedEntity[]);
    // console.log(res);
});

test("correctly parse tip feed data", async () => {
    const res = transformNotificationData(
        tipNotificationList.list as any as NotificationEntity[]
    );
    console.log(res);
});

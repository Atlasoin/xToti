import {
    Character,
    Indexer,
    Note,
    NotificationEntity,
    CharacterEntity,
    NoteEntity,
    FeedEntity,
    TipEntity,
} from "crossbell.js";
import { ethers } from "ethers";

const indexer = new Indexer();

export async function getNotifications(charId: number) {
    try {
        const data = await indexer.getNotificationsOfCharacter(charId, {
            limit: 10,
            includeCharacterMetadata: true,
        });
        return data.list;
    } catch (e: any) {
        console.error(e.message);
        return [];
    }
}

export async function getFeeds(charId: number) {
    try {
        const data = await indexer.getFeedsOfCharacter(charId, {
            limit: 10,
        });

        return data.list;
    } catch (e: any) {
        console.error(e.message);
        return [];
    }
}

export interface Tx {
    transactionHash: string;
    logIndex: number;
}

// Get the updates after `lastCur`. Return the updated `list`, `newLastCur`
export function getUpdates<T>(list: Tx[], lastCur: string) {
    const newLastCur = list[0].transactionHash + "_" + list[0].logIndex;

    const res = [];
    let caughtUp = false;

    for (const item of list) {
        if (item.transactionHash + "_" + item.logIndex !== lastCur) {
            res.push(item);
        } else {
            caughtUp = true;
            break;
        }
    }

    return { list: res as T[], newLastCur: newLastCur, caughtUp };
}

const getCharStr = (obj: CharacterEntity) => obj.handle + "#" + obj.characterId;
const getNoteSummary = (note: NoteEntity) =>
    note.metadata?.content?.title ||
    note.metadata?.content?.content?.slice(0, 120);
const getNote = (note: NoteEntity) => note.metadata?.content?.content;

export function transformFeedData(list: FeedEntity[]) {
    const res = [];

    for (const item of list) {
        const actionType = item.type;
        let text = "";
        if (!item.character) continue;

        if (actionType === "POST_NOTE") {
            if (!item.note) continue;
            text =
                getCharStr(item.character) +
                " posts: " +
                getNoteSummary(item.note);
        } else if (actionType === "POST_NOTE_FOR_NOTE") {
            if (!item.note) continue;
            if (!item.note.toNote) continue;
            text =
                getCharStr(item.character) +
                " replies:\n" +
                getNoteSummary(item.note) +
                "\n to the note:\n" +
                getNoteSummary(item.note?.toNote);
        } else {
            // text = actionType;
            continue;
        }
        res.push(text);
    }
    return res;
}

export function transformNotificationData(list: NotificationEntity[]) {
    const res = [];

    for (const item of list) {
        const actionType = item.type; //"OPERATOR_ADDED" | "OPERATOR_REMOVED" | "LINKED" | "UNLINKED" | "NOTE_MINTED" | "NOTE_POSTED" | "MENTIONED" | "TIPPED"
        let text = "";
        if (actionType === "LINKED") {
            const linkType = item.feed?.link?.linkType;
            const fromChar = item.feed?.link?.fromCharacter;
            const toChar = item["character"];
            if (!fromChar || !toChar) continue;
            if (linkType === "follow") {
                text =
                    getCharStr(fromChar) +
                    " follows " +
                    getCharStr(toChar) +
                    "\n" +
                    "https://crossbell.io/@" +
                    fromChar.handle;
            } else if (linkType === "like") {
                const toNote = item.feed?.link?.toNote;
                if (!toNote) continue;
                const toNoteSum = getNoteSummary(toNote);

                text =
                    getCharStr(fromChar) +
                    " likes the note:\n" +
                    toNoteSum +
                    "\n" +
                    "https://crossbell.io/notes/" +
                    toNote["characterId"] +
                    "-" +
                    toNote["noteId"];
            } else {
                text =
                    getCharStr(fromChar) +
                    " " +
                    linkType +
                    " " +
                    getCharStr(toChar) +
                    "\n" +
                    "https://crossbell.io/@" +
                    fromChar.handle;
            }
        } else if (actionType === "UNLINKED") {
            text = actionType + "\n";
        } else if (actionType === "NOTE_MINTED") {
            text = actionType + "\n";
        } else if (actionType === "NOTE_POSTED") {
            if (item.feed?.type === "POST_NOTE_FOR_NOTE") {
                const note = item["feed"]["note"];
                const character = item["feed"]["character"];
                const toNote = note?.toNote;
                if (!toNote) continue;
                if (!character) continue;

                const noteContent = getNote(note);
                const toNoteSum = getNoteSummary(toNote);
                text =
                    getCharStr(character) +
                    " replies:\n  " +
                    noteContent +
                    "\n to the note:\n  " +
                    toNoteSum +
                    "\n" +
                    "https://crossbell.io/notes/" +
                    note["characterId"] +
                    "-" +
                    note["noteId"];
            }
        } else if (actionType === "TIPPED") {
            const tip = item.feed?.tip;
            if (!tip) continue;
            const character = tip?.character;
            if (!character) continue;

            const getAmount = (tip: TipEntity) => {
                if (
                    tip.tokenAddress.toLowerCase() ===
                    "0xafb95cc0bd320648b3e8df6223d9cdd05ebedc64"
                ) {
                    return ethers.formatEther(tip.amount) + " $Mira";
                } else {
                    return "?";
                }
            };
            const toNote = tip?.toNote;
            text = getCharStr(character) + " tips you " + getAmount(tip);
            if (toNote) {
                text +=
                    " for the note: \n" +
                    "https://crossbell.io/notes/" +
                    toNote["characterId"] +
                    "-" +
                    toNote["noteId"];
            }
        } else if (actionType === "MENTIONED") {
            text = actionType + "\n";
        } else if (actionType === "OPERATOR_ADDED") {
            text = actionType + "\n";
        } else if (actionType === "OPERATOR_REMOVED") {
            text = actionType + "\n";
        }
        text += "\n" + new Date(item["createdAt"]).toLocaleString();
        res.push(text);
    }

    return res;
}

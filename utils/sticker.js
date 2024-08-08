import fs from "fs";
import ff from "fluent-ffmpeg";
import webp from "node-webpmux";
import path from "node:path";
import { fileURLToPath } from "node:url";
import functions from "./function.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const config = {
    Exif : {
        packId: "https://moexti.jw.lt/",
        packName: "ʙᴇʀᴋᴀʜᴇꜱᴘᴏʀᴛ.ɪᴅ\nChatBOT: 6289649672623",
        packPublish: "Thank's to:\nAllah S.W.T",
        packEmail: "berkahesport@gmail.com",
        packWebsite: "https://tinyurl.com/berkahesportid/",
        androidApp: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
        iOSApp: "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
        emojis: [],
        isAvatar: 0
    }
  }
async function imageToWebp (media) {

    const tmpFileOut = path.join(__dirname, "../data/tmp/" + `StickerOut_ConvertImg_${Date.now()}.webp`)
    const tmpFileIn = path.join(__dirname, "../data/tmp/" + `StickerIn_ConvertImg_${Date.now()}.jpg`)

    fs.writeFileSync(tmpFileIn, media)

    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.promises.unlink(tmpFileOut)
    fs.promises.unlink(tmpFileIn)
    return buff
}

async function videoToWebp (media) {

    const tmpFileOut = path.join(__dirname, "../data/tmp/" + `StickerOut_ConvertVid_${Date.now()}.webp`)
    const tmpFileIn = path.join(__dirname, "../data/tmp/" + `StickerIn_ConvertVid_${Date.now()}.mp4`)

    fs.writeFileSync(tmpFileIn, media)

    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:10",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.promises.unlink(tmpFileOut)
    fs.promises.unlink(tmpFileIn)
    return buff
}

async function writeExifImg (media) {
    let wMedia = await imageToWebp(media)
    const tmpFileOut = path.join(__dirname, "../data/tmp/" + `StickerOut_ExifImg_${Date.now()}.webp`)
    const tmpFileIn = path.join(__dirname, "../data/tmp/" + `StickerIn_ExifImg_${Date.now()}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)
    const img = new webp.Image()
    const json = { "sticker-pack-id": config.Exif.packId, "sticker-pack-name": config.Exif.packName, "sticker-pack-publisher": config.Exif.packPublish, "sticker-pack-publisher-email": config.Exif.packEmail, "sticker-pack-publisher-website": config.Exif.packWebsite, "android-app-store-link": config.Exif.androidApp, "ios-app-store-link": config.Exif.iOSApp, "emojis": config.Exif.emojis, "is-avatar-sticker": config.Exif.isAvatar }
    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
    const exif = Buffer.concat([exifAttr, jsonBuff])
    exif.writeUIntLE(jsonBuff.length, 14, 4)
    await img.load(tmpFileIn)
    img.exif = exif
    await img.save(tmpFileOut)
    return tmpFileOut
}

async function writeExifVid (media) {
    let wMedia = await videoToWebp(media)
    const tmpFileOut = path.join(__dirname, "../data/tmp/" + `StickerOut_ExifVid_${Date.now()}.webp`)
    const tmpFileIn = path.join(__dirname, "../data/tmp/" + `StickerIn_ExifVid_${Date.now()}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)
    const img = new webp.Image()
    const json = { "sticker-pack-id": config.Exif.packId, "sticker-pack-name": config.Exif.packName, "sticker-pack-publisher": config.Exif.packPublish, "sticker-pack-publisher-email": config.Exif.packEmail, "sticker-pack-publisher-website": config.Exif.packWebsite, "android-app-store-link": config.Exif.androidApp, "ios-app-store-link": config.Exif.iOSApp, "emojis": config.Exif.emojis, "is-avatar-sticker": config.Exif.isAvatar }
    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
    const exif = Buffer.concat([exifAttr, jsonBuff])
    exif.writeUIntLE(jsonBuff.length, 14, 4)
    await img.load(tmpFileIn)
    img.exif = exif
    await img.save(tmpFileOut)
    return tmpFileOut
}

async function writeExif (media, fileName = "") { 
    let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : ""
    const tmpFileOut = path.join(__dirname, "../data/tmp/" + `${fileName+functions.getRandom("webp", 3)}`)
    const tmpFileIn = path.join(__dirname, "../data/tmp/" + `${fileName+functions.getRandom("webp", 3)}`)
    fs.writeFileSync(tmpFileIn, wMedia)
    const img = new webp.Image()
    const json = { "sticker-pack-id": config.Exif.packId, "sticker-pack-name": config.Exif.packName, "sticker-pack-publisher": config.Exif.packPublish, "sticker-pack-publisher-email": config.Exif.packEmail, "sticker-pack-publisher-website": config.Exif.packWebsite, "android-app-store-link": config.Exif.androidApp, "ios-app-store-link": config.Exif.iOSApp, "emojis": config.Exif.emojis, "is-avatar-sticker": config.Exif.isAvatar }
    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
    const exif = Buffer.concat([exifAttr, jsonBuff])
    exif.writeUIntLE(jsonBuff.length, 14, 4)
    await img.load(tmpFileIn)
    img.exif = exif
    await img.save(tmpFileOut)
    return tmpFileOut
}

export { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif}
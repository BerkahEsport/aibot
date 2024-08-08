import { WA_DEFAULT_EPHEMERAL } from "@whiskeysockets/baileys";
import axios from "axios";
import fs from "fs";
import functions from "../utils/function.js";
import {writeExif} from "../utils/sticker.js";
import languages from "../utils/languages.js";
const languageBot = languages[config.BOT_LANGUAGE ? config.BOT_LANGUAGE : "en"];
const RestAPIs = "https://skizo.tech/";

export default async (sock, m, url, apikey) => {
    const sendFile = async (jid, url, fileName = "", caption = "", quoted = "", options = {}) => {
		let { mimetype: mime, data: buffer, ext, file, filename, size } = await functions.fetchBuffer(url);
		console.log("Saved in: "+file.toString());
        if (caption == null || !caption) {
			caption = `Name file: ${typeof filename == "object" ? languageBot.notKnown : filename}\nSize file: ${size} KB`
		}
		mime = options.mime || mime
		let data = {}
        if (options.asDocument || size >= 40000) data = {
            document: buffer, 
            mimetype: mime, 
            caption: typeof caption == "object" ? functions.format(caption) : caption,
            fileName: fileName ? `${fileName}.${ext}` : `${filename+functions.getRandom("", 3)}.${ext}`
            }
        else if (options.asSticker || /webp/.test(mime)) {
            let pathFile = await writeExif({ mimetype: mime, data: buffer }, fileName)
            data = { sticker: fs.readFileSync(pathFile), mimetype: "image/webp" }
            fs.existsSync(pathFile) ? await fs.promises.unlink(pathFile) : ""
        }
        else if (/image/.test(mime)) data = {
            image: buffer, 
            fileName: fileName ? `${fileName}.${ext}` : `${filename+functions.getRandom("", 3)}.${ext}`, 
            caption : typeof caption == "object" ? functions.format(caption) :  caption, 
            mimetype: options.mime ? options.mime : "image/png"
        }
        else if (/video/.test(mime)) data = {
            video: buffer, 
            fileName: fileName ? `${fileName}.${ext}` : `${filename+functions.getRandom("", 3)}.${ext}`, 
            caption : typeof caption == "object" ? functions.format(caption) :  caption, 
            mimetype: options.mime ? options.mime : "video/mp4"
        } 
        else if (/audio/.test(mime)) data = {
            audio: buffer,
            fileName: fileName ? `${fileName}.${ext}` : `${filename+functions.getRandom("", 3)}.${ext}`, 
            caption : typeof caption == "object" ? functions.format(caption) :  caption, 
            mimetype: options.mime ? options.mime : "audio/mpeg"
        }
	let msg = await sock.sendMessage(jid, data, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL || 604800, quoted, ...options })
	data = null
	return msg
	}

    let action = 'default', json = {};

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        if (url.includes('music.youtube.com')) {
        action = 'youtubeMusic';
        } else {
        action = 'youtubeVideo';
        }
    } else if (url.includes('facebook.com')) {
        action = 'facebook';
    } else if (url.includes('instagram.com')) {
        action = 'instagram';
    } else if (url.includes('tiktok.com')) {
        action = 'tiktok';
    } else if (url.includes('threads.net')) {
        action = 'threads';
    } else if (url.includes('capcut.com')) {
        action = 'capcut';
    } else if (url.includes('github.com')) {
        action = 'github';
    } else if (url.includes('drive.google.com')) {
        action = 'googleDrive';
    } else if (url.includes('sfile.mobi')) {
        action = 'sfile';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
        action = 'twitter';
    } else if (url.includes('telegram.me') || url.includes('t.me')) {
        action = 'telegramSticker';
    } else if (url.includes('play.google.com')) {
        action = 'googlePlay';
    } else if (url.includes('mediafire.com')) {
        action = 'mediafire';
    } else if (url.includes('pinterest.com')) {
        action = 'pinterest';
    } else if (url.includes('spotify.com')) {
        action = 'spotify';
    } else if (url.includes('doodstream.com')) {
        action = 'doodStream';
    } else if (url.includes('soundcloud.com')) {
        action = 'soundcloud';
    } else if (url.includes('terabox.com')) {
        action = 'terabox';
    } else if (url.includes('mega.nz')) {
        action = 'mega';
    }
    try {
        switch (action) {
            case 'youtubeVideo':
                json = await functions.fetchJson(RestAPIs+"api/y2mate?apikey="+apikey+"&url="+url);
                let quality = bestQuality(json.video);
                await sendFile(m.from, quality.url, json?.title || "Video", "", m);
                m.react("🆗");
            break;
            case 'youtubeMusic':
                json = await functions.fetchJson(RestAPIs+"api/y2mate?apikey="+apikey+"&url="+url);
                await sendFile(m.from, json.audio["128kbps"].url, "", "", m);
                m.react("🆗");
            break;
            case 'facebook':
                json = await functions.fetchJson(RestAPIs+"api/fb?apikey="+apikey+"&url="+url);
                await sendFile(m.from, json[0].url, "", "", m);
                m.react("🆗");
            break;
            case 'instagram':
                json = await functions.fetchJson(RestAPIs+"api/instagram?apikey="+apikey+"&url="+url);
                await sendFile(m.from, json[0].url, "", "", m);
                m.react("🆗");
            break;
            case 'tiktok':
                json = await functions.fetchJson(RestAPIs+"api/tiktok?apikey="+apikey+"&url="+url);
                await sendFile(m.from, json.data.play, "", "", m);
                m.react("🆗");
            break;
            case 'threads':
                json = await functions.fetchJson("https://widipe.com/download/threads?url="+url);
                await sendFile(m.from, json.result.video_urls[0].download_url, "", "", m);
                m.react("🆗");
            break;
            case 'capcut':
                m.reply(languageBot.underDevelopment);
            break;
            case 'twitter':
                json = await functions.fetchJson(RestAPIs+"api/x?apikey="+apikey+"&url="+url);
                await sendFile(m.from, json.media[0].url, "", "", m);
                m.react("🆗");
            break;
            case 'pinterest':
                m.reply(languageBot.underDevelopment);
            break;
            case 'github':
                const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
                let [_, username, repo] = url.match(regex) || [];
                repo = repo.replace(/.git$/, '');
                const link = `https://api.github.com/repos/${username}/${repo}/zipball`;
                const response = await axios.head(link);
                const contentDisposition = response.headers['content-disposition'];
                const filename = contentDisposition.match(/attachment; filename=(.*)/)[1];
                sendFile(m.from, link, filename, "", m, {asDocument: true});
                m.react("🆗");
            break;
            case 'googleDrive':
                json = await functions.fetchJson(RestAPIs+"api/gdrive?apikey="+apikey+"&url="+url);
                await sendFile(m.from, json.downloadUrl, "", "", m);
                m.react("🆗");
            break;
            case 'sfile':
                m.reply(languageBot.underDevelopment);
            break;
            case 'telegramSticker':
                m.reply(languageBot.underDevelopment);
                break;
            case 'googlePlay':
                m.reply(languageBot.underDevelopment);
                break;
            case 'mediafire':
                m.reply(languageBot.underDevelopment);
                break;
            case 'spotify':
                m.reply(languageBot.underDevelopment);
                break;
            case 'doodStream':
                m.reply(languageBot.underDevelopment);
                break;
            case 'soundcloud':
                m.reply(languageBot.underDevelopment);
                break;
            case 'terabox':
                m.reply(languageBot.underDevelopment);
                break;
            case 'mega':
                m.reply(languageBot.underDevelopment);
            break;
            default:
                m.reply("Url yang anda masukkan tidak sesuai dengan fitur unduhan yang dimiliki.");
                m.react("❗")
            break;
        }
    } catch(e) {
        m.reply("Fitur sedang bermasalah silahkan coba beberapa saat lagi!");
        m.react("❌");
        console.log(e);
    }
};

function bestQuality(video) {
    const pixel = ["1080p", "720p", "480p", "360p", "240p", "144p"];
    for (let quality of pixel) {
        if (video[quality]) {
            return video[quality];
        }
    }
    return null;
}

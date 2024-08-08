import { promises as fs } from "fs";
import path from "path";
import axios from "axios";
import { toBuffer } from "@whiskeysockets/baileys";
import * as fileType from "file-type";
const {fileTypeFromBuffer} = fileType;
export default {
  format(object) {
    return JSON.stringify(object, null, 2)
  },
  delay(time) {
      return new Promise(res => setTimeout(res, time))
    },
  random(list) {
    return list[Math.floor(Math.random() * list.length)]
  },
  randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  getRandom(ext = "", length = "10") {
    let result = ""
    let character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    let characterLength = character.length
    for (let i = 0; i < length; i++) {
        result += character.charAt(Math.floor(Math.random() * characterLength))
    }
    return `${result}${ext ? `.${ext}` : ""}`
  },
  runtime(time) {
    let seconds = parseInt(time);
    let d = Math.floor(seconds / (3600 * 24))
    let h = Math.floor(seconds % (3600 * 24) / 3600)
    let m = Math.floor(seconds % 3600 / 60)
    let s = Math.floor(seconds % 60)
    let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
    return dDisplay + hDisplay + mDisplay + sDisplay
  },
  async clearTmp() {
    const directories = ["./data/tmp"]; // You can add certain folders to this array
    for (const directory of directories) {
      try {
        if (!await fs.stat(directory).catch(() => false)) {
          await fs.mkdir(directory, { recursive: true });
        };
        const files = await fs.readdir(directory);
        await Promise.all(files.map(async (file) => {
          const filePath = path.join(directory, file);
          try {
            await fs.unlink(filePath);
            console.log('Deleted file:', filePath);
          } catch (err) {
            console.error('Error deleting file:', err);
          };
        }));
      } catch (err) {
        console.error('Error handling directory:', err);
      }
    }
  },
  async fetchBuffer(url, options = {}, responseType = 'arraybuffer') {
    try {
      const response = await axios.get(url, {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
          ...options.headers,
        },
        responseType,
        ...options,
      });
      let buffer;
      if (responseType === 'stream') {
        buffer = await toBuffer(response.data);
      } else {
        buffer = response.data;
      }
      const headers = response.headers;
      const contentDisposition = headers['content-disposition'];
      const filenameMatch = contentDisposition?.match(/filename=(?:(?:"|')(.*?)(?:"|')|([^""\s]+))/);
      const filename = filenameMatch ? decodeURIComponent(filenameMatch[1] || filenameMatch[2]) : null;
      const fileType = await fileTypeFromBuffer(buffer);
      const mimetype = fileType?.mime || 'application/octet-stream';
      const ext = fileType?.ext || 'bin';
      let size = (Buffer.byteLength(buffer) / 1000).toFixed(2); // KB
      const file = fs.writeFile(`./data/tmp/${filename}.${ext}`, buffer)
      return { file, data: buffer, filename, mimetype, ext, size };
    } catch (error) {
      throw new Error(`Failed to fetch buffer: ${error.message}`);
    }
  },
  async fetchJson(url, options = {}) {
    try {
      const {data} = await axios.get(url, {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
          ...(options.headers ? options.headers : {}),
        },
        responseType: "json",
        ...(options && delete options.headers && options),
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch buffer: ${error.message}`);
    }
  },
}
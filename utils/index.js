import readline from "readline";
import languages from "./languages.js";
import config from "../config.js";

const languageBot = languages[config.BOT_LANGUAGE ? config.BOT_LANGUAGE : "en"];
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const isImage = (msg) => {
    return Boolean(msg?.message?.imageMessage);
}

const isAudio = (msg) => {
    return Boolean(msg?.message?.audioMessage);
}

const isPdf = (msg) => {
    return msg?.message?.documentMessage?.mimetype === 'application/pdf';
}

const isPdfWithCaption = (msg) => {
    return msg?.message?.documentWithCaptionMessage?.message.documentMessage?.mimetype === 'application/pdf';
}

const isQuotedMessage = (msg, type = 'imageMessage') => {
    return Boolean(msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage[type]);
}

const simulateTyping = async (message, sock) => {
    // View message
    await sock.readMessages([message?.key]);
    await sock.presenceSubscribe(message?.key?.remoteJid);

    // Simulare writing
    await sock.sendPresenceUpdate('composing', message?.key?.remoteJid);
}

const simulateEndPause = async (message, sock) => {
    await sock.sendPresenceUpdate('paused', message?.key?.remoteJid);
}

const formatText = (text) => {
    // Replace ** to *
    text = text.replace(/\*\*/g, '*');
    text = text.replace(/\[\^[0-9]+\^\]/g, '');
    text = text.replace(/-[a-z]/g, '');
    return text
}

const formatTextWithLinks = (text) => {
    return text
        .replace('¡1]', '[1]')
        .replace(/^(!|\[)¡?\d+\]:\s+.*\n?/gm, '')
        .replace(/^\n+/gm, '')
}

const extractLinks = (text) => {
    const links = text.match(/\[([0-9]+)\]:\s+(https?:\/\/[^\s]+)\s+""/gm)
    return (
        links?.map((link) => {
            const [index, url] = link.match(/\[([0-9]+)\]:\s+(https?:\/\/[^\s]+)\s+""/).slice(1)
            return { index, url }
        }) || []
    )
}

const parseLinksWithText = (text) => {
    const links = extractLinks(text)
    const formattedText = formatText(formatTextWithLinks(text))
    if (links.length === 0) {
        return formattedText
    }

    const linksText = links.map(({ index, url }) => {
        return `[${index}]: ${url}\n`
    })

    return `${formattedText}\n\n${linksText.join('')}`
}

const removeLatexSymbols = (input) => {
    // Remove all \frac{}{}
    let output = input.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2');
    output = output.replace(/\\times/g, '*');
    output = output.replace(/[{}]/g, '');
    return output;
};

const timeout = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(languageBot.timeOut))
        }, ms)
    })
}

const divideTextInTokens = (text, maxTokens = 10000) => {
    const tokens = text.split(' ')
    const segments = []
    let currentSegment = []

    tokens.forEach((token) => {
        if (currentSegment.length + 1 <= maxTokens) {
            currentSegment.push(token)
        } else {
            segments.push(currentSegment.join(' '))
            currentSegment = [token]
        }
    })

    if (currentSegment.length > 0) {
        segments.push(currentSegment.join(' '))
    }

    return segments
}

const removeEmojis = (text) => {
    return text.replace(/[\uD800-\uDFFF]./g, '')
}

const removeSymbols = (text, symbols = ['*']) => {
    symbols.forEach((symbol) => {
        text = text.replace(new RegExp(`\\${symbol}`, 'g'), '')
    })
    return text
}

const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
    };

const loadCookie = async () => {
    if (!config.BING_AI_COOKIES) {
        const cookie = await question(languageBot.cookieInput);
        if (cookie.startsWith("MUID=")) {
            console.log(languageBot.cookieSuccess);
            return cookie;
        } else {
            console.log(languageBot.cookieSetup);
            return "MUID=;_U=; _RwBf=;";
        }
    }
}

const loadApikey = async (m, apikey) => {
    if (!apikey && m.body.toLowerCase().startsWith("apikey")) {
        if (!m.args[0]) return m.reply(languageBot.noApikey)
        m.reply(languageBot.apikeySuccess+m.args[0]);
        return m.args[0];
    } else if (apikey) {
        if (!m.args[0]) return m.reply(languageBot.noApikey)
            m.reply(languageBot.apikeyUpdate+m.args[0]);
            return m.args[0];
    } else {
        m.reply(languageBot.apikeySetup);
        return "";
    }
}

const DeviceLink = async() => {
    const useQR = await question(languageBot.pairingSetup);
    if (useQR == 1) {
        rl.close();
        return true;
    } else if (useQR == 2) {
        return false;
    } else {
        console.log(languageBot.pairingInvalid);
        return await DeviceLink();
    }
}

const handlePhoneNumberPairing = async (sock, functions, PHONENUMBER_MCC) => {
    let phoneNumber;
    if (!!config.PAIRING_NUMBER && !sock.authState.creds.registered) {
        phoneNumber = config.PAIRING_NUMBER.replace(/[^0-9]/g, '');
        if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(languageBot.waSupport);
        phoneNumber = await question(languageBot.waInput);
        phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
        }
    } else {
        phoneNumber = await question(languageBot.waInput);
        phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
        if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(languageBot.waSupport);
        phoneNumber = await question(languageBot.waInput);
        phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
        }
    }
    await functions.delay(3000);
    let code;
    try {
        code = await sock.requestPairingCode(phoneNumber);
    } catch (error) {
        console.error(languageBot.pairingError, error);
        return;
    }
    console.log(languageBot.pairingCode + `\x1b[32m${code?.match(/.{1,4}/g)?.join("-") || code}\x1b[39m`);
    rl.close();
};
const closeRl = () => {
    rl.close()
}
export {
    isAudio,
    isImage,
    isPdf,
    isPdfWithCaption,
    simulateEndPause,
    simulateTyping,
    formatText,
    formatTextWithLinks,
    parseLinksWithText,
    timeout,
    isQuotedMessage,
    divideTextInTokens,
    removeEmojis,
    removeSymbols,
    removeLatexSymbols,
    extractUrl,
    loadCookie,
    loadApikey,
    DeviceLink,
    handlePhoneNumberPairing,
    closeRl

}

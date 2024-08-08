import baileys, { extractMessageContent, jidNormalizedUser, jidDecode, getDevice } from "@whiskeysockets/baileys";
import functions from "./function.js";
export default async function serialize(sock, m, store) {
	sock.getContentType = (object) => {
		if (object) {
			const keys = Object.keys(object);
			const key = keys.find(x => (x === 'conversation' || x.endsWith('Message') || x.includes('V2') || x.includes('V3')) && x !== 'senderKeyDistributionMessage');
			return key ? key : keys[0];
		}
	}
	sock.getName = (jid) => {
		let id = jidNormalizedUser(jid);
		if (id.endsWith('g.us')) {
			let metadata = store.groupMetadata?.[id];
			return metadata.subject;
		} else {
			let metadata = store.contacts[id];
			return metadata?.name || metadata?.verifiedName || metadata?.notify || ('@' + id.split('@')[0]);
		}
	}
	sock.decodeJid = (jid) => {
		if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
        } else return jid;
	}
	m.github = "https://github.com/BerkahEsport/botbe-bing " // source code
	if (m.message) {
		m.type = sock.getContentType(m.message) || Object.keys(m.message)[0];
		m.msg = extractMessageContent(m.message[m.type]);
		m.body = m.type === "conversation" ? m.message?.conversation
		: m.type == "imageMessage" ? m.message?.imageMessage?.caption
		: m.type == "videoMessage" ? m.message?.videoMessage?.caption
		: m.type == "extendedTextMessage" ? m.message?.extendedTextMessage?.text
		: m.type == "buttonsResponseMessage" ? m.message?.buttonsResponseMessage?.selectedButtonId
		: m.type == "listResponseMessage" ? m.message?.listResponseMessage?.singleSelectReply?.selectedRowId
		: m.type == "templateButtonReplyMessage" ? m.message?.templateButtonReplyMessage?.selectedId
		: m.type == "messageContextInfo" ? m.message?.listResponseMessage?.singleSelectReply?.selectedRowId || m.message?.buttonsResponseMessage?.selectedButtonId
		: m.type == "interactiveResponseMessage" ? (JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)).id : ""
		m.arg = m.body.trim().split(/ +/) || [];
		m.args = m.body.trim().split(/ +/).slice(1) || [];
		m.text = m.args.join` `.replace(/\[|\]/g, "");
		m.mentions = m.msg?.contextInfo?.mentionedJid || [];
		m.expiration = m.msg?.contextInfo?.expiration || 0;
		m.timestamp = (typeof m.messageTimestamp === "number" ? m.messageTimestamp : m.messageTimestamp.low ? m.messageTimestamp.low : m.messageTimestamp.high) || m.msg.timestampMs * 1000 || 0
		m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath || m.msg?.header?.hasMediaAttachment || false;
		if (m.key) {
			m.id = m.key.id;
			m.fromMe = m.key.fromMe;
			m.device = getDevice(m.id);
			m.from = m.key.remoteJid;
			m.isBaileys = m.device === "web" ? true : false;
			m.isGroup = m.from.endsWith("@g.us");
			m.sender = m.isGroup ? m.key.participant ?? m.from : m.from;
			m.isQuoted = !!m.msg?.contextInfo?.quotedMessage;
			m.isReact = !!m.reactions?.length;
		}
		if (m.isMedia) {
			m.viewOnce = m.msg?.viewOnce
			m.mime = m.msg?.mimetype
			m.size = m.msg?.fileLength
			m.height = m.msg?.height || ""
			m.width = m.msg?.width || ""
			if (/webp/i.test(m.mime)) {
				m.isAnimated = m.msg?.isAnimated
			}
		}
		if (m.isQuoted) {
			let quoted = baileys.proto.WebMessageInfo.fromObject({
				key: {
					remoteJid: m.from,
					fromMe: (m.msg.contextInfo.participant === sock.decodeJid(sock.user.id)),
					id: m.msg.contextInfo.stanzaId,
					participant: m.isGroup ? m.msg.contextInfo.participant : []
				},
				message: m.msg.contextInfo.quotedMessage
			})
			m.quoted = await serialize(sock, quoted);
		}
	}

	m.delete = async() => await sock.sendMessage(m.from, { delete: m.key });
	m.download = async() => await downloadMediaMessage(m, "buffer");

	//Reply message
	m.reply = async (text = "", options = {}) => {
		if (typeof text == "object") {
			text = JSON.stringify(text, null, 2)
		};
			const jid = options?.from ? options.from : m.from;
			const quoted = options?.quoted ? options.quoted : m;
			return await sock.sendMessage(jid, {text, ...options}, {quoted, ...options});
	}

	//React message
    m.react = async (emot) => await sock.sendMessage(m.from, { react: { text: emot, key: m.key }})

    // Log message
	m.log = (...data) => {
		data.forEach((item, index) => {
		console.log(typeof item  === "object" ? functions.format(item) : item);
		});
	}
	return m;
}

/*<============== CREDITS ==============>
	Author: @berkahesport.id
	Contact me: 62895375950107
	
	Do not delete the source code.
	It is prohibited to sell and buy
	WhatsApp BOT scripts
	without the knowledge
	of the script owner.
	
	Selling = Sin 
	
	Thank you to Allah S.W.T
<============== CREDITS ==============>*/
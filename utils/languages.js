const languages = {
    id: {
        "notAllowLocation": "Saya tidak mengizinkan pembacaan lokasi",
        "notAllowReconizeAudio": "Saya tidak mengizinkan pengenalan audio",
        "notAllowReconizeImage": "Saya tidak mengizinkan pengenalan gambar",
        "notAllowReconizePdf": "Saya tidak mengizinkan pengenalan PDF",
        "listeningToAudio": "Sedang mendengarkan audio",
        "instructionsGetIsoLanguaje": "[INSTRUKSI]: Identifikasi teks sebelum [INSTRUKSI] mengembalikan bahasa dalam format ISO di akhir dalam {} contoh {id}",
        "instructionsPdf": "Bisakah Anda memberikan kesimpulan singkat dan akurat? Jangan mencari di web dan hanya gunakan konten dokumen. Informasi faktual harus diambil secara harfiah dari dokumen. Hafalkan bagian dokumen yang menyebutkan informasi objektif, tetapi jangan menandainya secara eksplisit. Kesimpulan harus kredibel, sangat mudah dibaca, dan informatif. Harap tulis tanggapan singkat, sebaiknya tidak lebih dari 1000 karakter. Hasilkan tanggapan dalam bahasa yang telah saya gunakan sebelumnya",
        "errorProcessingAudio": "Kesalahan memproses audio, coba lagi",
        "errorInBot": "Terjadi kesalahan",
        "restartConversation": "Mulai ulang percakapan",
        "waitResponse": "Menunggu respons dari",
        "oneMessageAtTime": "Hanya satu pesan pada satu waktu",
        "waitMessage": "Sedang merespon pesan...",
        "timeOut": "Waktu tunggu terlampaui",
        "loadDeviceLink": "Sedang memuat tautan perangkat",
        "cookieInput": "Cookie Anda belum diisi di file config.js, harap isi terlebih dahulu atau masukkan cookie Anda di bawah:\n",
        "cookieSuccess": "Cookie telah berhasil disimpan sementara.",
        "cookieSetup": "Cookie yang Anda masukkan tidak benar!\nCookie diatur secara default dan hanya mendukung obrolan.",
        "pairingSetup": "Silakan ketik nomor untuk jenis tautan perangkat yang Anda inginkan:\n[1] Pindai QR di Terminal\n[2] Kirim kode untuk Pairing\nPilihan Anda: ",
        "pairingCode": "Kode pemasangan: ",
        "pairingInvalid": "Pilihan tidak valid, harap coba lagi.\n\n",
        "pairingError": "Kesalahan meminta kode pairing: ",
        "waSupport": "Mulai dengan kode WhatsApp negara Anda, Contoh: 62xxx",
        "waInput": "Silakan ketik nomor WhatsApp Anda: ",
        "sticker": "❗ Silahkan balas pesan atau kirim media gambar & ketik _sticker_ / _s_ untuk dijadikan sticker!",
        "apikeySetup": "Silahkan masukkan apikey anda, ketik _apikey [apikey anda]_\n*Contoh:* apikey botbe-bing",
        "noApikey": "Apikey tidak boleh kosong!\nKetik _apikey [apikey anda]_\n*Contoh:* apikey botbe-bing",
        "apikeySuccess": "Apikey berhasil disimpan sementara!\n*Apikey anda:* ",
        "apikeyUpdate": "Apikey berhasil diperbaharui.\n*Apikey anda sekarang:* ",
        "notKnown": "Tidak diketahui!",
        "underDevelopment": "Sedang proses pengembangan fitur!",
        "downloadExample": `Contoh Penggunaan : download https://m.youtube.com/watch?v=lINcpXmtvII&t=13s

* _Jika ingin mendownload video dari youtube, cukup kirimkan link video youtube tersebut, bot akan otomatis mendownloadnya._
* _Jika Link YouTube Music yang dikirim maka bot akan mendownloadnya dalam format audio._
* _Jika ingin mendownload video dari media sosial lainnya, kirimkan link video tersebut, bot akan otomatis mendownloadnya._

Url yang didukung :
1. Facebook (Reel, Post)
2. Instagram (Post, Reel, Stories, Audio)
3. Tiktok (Slide, Video)
4. Capcut Video
5. Github Repo
6. Google Drive
7. SFile
8. Twitter
9. YouTube (Video, Audio, Short, Sample, Playlist)
10. Sticker Pack Telegram
11. Google Play Store
12. Mediafire
13. Pinterest (Video, Image)
14. Spotify (Track, Playlist, Album)
15. Dood Stream
16. Other Adult Video
17. SoundCloud
18. TeraBox
19. Mega File
20. Threads`
    },
    en: {
        "notAllowLocation": "I do not allow reading locations",
        "notAllowReconizeAudio": "I do not allow recognizing audio",
        "notAllowReconizeImage": "I do not allow recognizing images",
        "notAllowReconizePdf": "I do not allow recognizing pdf",
        "listeningToAudio": "Listening to audio",
        "instructionsGetIsoLanguaje": "[INSTRUCTIONS]: Identifies the text before [INSTRUCTIONS] returns the language in ISO format at the end in {} example {es}",
        "instructionsPdf": "Could you provide brief and accurate conclusions? Do not search the web and use only the content of the document. Factual information must come literally from the document. Memorize the part of the document that mentions the objective information, but do not mark it explicitly. The conclusion must be credible, very readable and informative. Please write a brief response, preferably no more than 1000 characters. Generate the response in the language I have spoken before",
        "errorProcessingAudio": "Error processing audio try again",
        "errorInBot": "An error occurred",
        "restartConversation": "Restart conversation",
        "waitResponse": "Waiting for response from",
        "oneMessageAtTime": "Only one message at a time",
        "waitMessage": "Is responding to messages",
        "timeOut": "Waiting time exceeded",
        "loadDeviceLink": "Loading device link",
        "cookieInput": "Your cookies have not been filled in in the config.js file, please fill them in first or enter your cookies below:\n",
        "cookieSuccess": "The cookie has been successfully stored temporarily.",
        "cookieSetup": "The cookie you entered is incorrect!\nCookies are set by default and only supports chat.",
        "pairingSetup": "Please type the number for the type of device link you want:\n[1] Scan QR in Terminal\n[2] Send code to Pairing\nYour choice: ",
        "pairingCode": "Pairing Code: ",
        "pairingInvalid": "Invalid choice, please try again.\n\n",
        "pairingError": "Error requesting pairing code: ",
        "waSupport": "Start with your country's WhatsApp code, Example: 62xxx",
        "waInput": "Please type your WhatsApp number: ",
        "sticker": "❗ Please reply to the message or send image media & type _sticker_ / _s_ to make it a sticker!",
        "apikeySetup": "Please enter your apikey, type _apikey [your apikey]_\n*Example:* apikey botbe-bing",
        "noApikey": "Apikey cannot be empty!\nType _apikey [your apikey]_\n*Example:* apikey botbe-bing",
        "apikeySuccess": "Apikey was temporarily saved successfully!\n*Your apikey:* ",
        "apikeyUpdate": "Apikey has been updated.\n*Apikey you now:* ",
        "notKnown": "Not known",
        "underDevelopment": "Feature development in progress!",
        "downloadExample": `Example of Use: download https://m.youtube.com/watch?v=lINcpXmtvII&t=13s


* _If you want to download a video from YouTube, just send the YouTube video link, the bot will automatically download it._
* _If a YouTube Music link is sent, the bot will download it in audio format._
* _If you want to download a video from other social media, send the video link, the bot will automatically download it._

Supported URLs:
1. Facebook (Reels, Posts)
2. Instagram (Posts, Reels, Stories, Audio)
3. Tiktok (Slides, Videos)
4. Capcut Video
5. Github Repo
6. Google Drive
7. SFile
8. Twitter
9. YouTube (Video, Audio, Short, Sample, Playlist)
10. Telegram Sticker Pack
11. Google Play Store
12. Mediafire
13. Pinterest (Videos, Images)
14. Spotify (Tracks, Playlists, Albums)
15. Dood Stream
16. Other Adult Videos
17. SoundCloud
18. TeraBox
19. Mega Files
20. Threads`
        
    }
}

export default languages

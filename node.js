const mineflayer = require('mineflayer');

// 1. DAFTAR KATA KASAR / TOXIC UTAMA
const toxicWords = [
  'turuk', 'cok', 'anjing', 'babi', 'monyet', 'kontol', 'memek', 'ngentot', 
  'anjir', 'anjay', 'bangsat', 'bajingan', 'goblok', 'tolol', 'idiot', 
  'kampret', 'perek', 'jancok', 'jancuk', 'peler', 'jembut', 'pantek', 'asu',
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'whore', 'slut'
];

// 2. PESAN HARIAN (Tiap Hari Beda Pesan!)
const dailyMessages = {
  // Senin
  1: [
    "Semangat Hari Senin teman-teman! Awal minggu yang pas buat bikin base baru! 🏗️",
    "Hari Senin jangan lemes, yuk cangkul tanah dan rapihin farm! 🌾",
    "Senin ceria! Jangan lupa sedia torch banyak-banyak sebelum masuk cave ya! 🕯️"
  ],
  // Selasa
  2: [
    "Selamat Hari Selasa! Udah dapet berapa diamond minggu ini? 💎",
    "Selasa produktif! Waktunya berburu iron sama coal buat persediaan! ⛏️",
    "Tetap semangat ya! Jangan biarin Creeper ngerusak bangunan kalian hari ini! 🧨"
  ],
  // Rabu
  3: [
    "Udah hari Rabu nih, tengah minggu! Tetap jaga kesehatan ya gaes 💧",
    "Rabu santai! Mancing ikan di danau sambil nunggu malam kayaknya seru deh 🎣",
    "Ayo yang lagi petualangan jauh, jangan lupa bawa bed (kasur) biar nggak kedinginan! 🛏️"
  ],
  // Kamis
  4: [
    "Hari Kamis menuju akhir pekan! Ada yang mau bikin proyek Redstone? ⚙️",
    "Kamis berkah! Semoga hoki enchantment kalian dapet Fortune III ya! ✨",
    "Dikit lagi weekend! Yuk selesain bangunan rumah yang belum beres! 🏰"
  ],
  // Jumat
  5: [
    "Jumat Barokah & Happy Friday semuanya! Waktunya main lebih lama nanti malam 🎮",
    "Hari Jumat nih! Siapa yang udah siap-siap mau ke Nether? 🔥",
    "Nanti malam minggu yuk mabar rame-rame explore benteng Nether! ⚔️"
  ],
  // Sabtu
  6: [
    "HAPPY WEEKEND! Hari Sabtu waktunya marathon main Minecraft! 🎉",
    "Sabtu santuy! Mari mabar bareng dan bikin kota impian kita! 🏙️",
    "Ada yang mau ngajak lawan Ender Dragon minggu ini? Chat di game ya! 🐉"
  ],
  // Minggu
  0: [
    "Hari Minggu waktunya chilling dan jalan-jalan keliling map server! 🗺️",
    "Selamat hari Minggu! Nikmati liburan kalian sambil nge-crafting hal unik! 🎨",
    "Besok udah Senin lagi, yuk puas-puasin main hari ini bareng temen-temen! ☕"
  ]
};

// 3. KUMPULAN CERITA GAJELAS & TEBAK-TEBAKAN GARING
const randomStories = [
  "Kemarin aku ketemu Enderman. Aku tatap matanya lama banget... eh dia malah baper terus ngasih bunga 🌸 (Bohong deng, aku digebukin).",
  "Tahu nggak kenapa Creeper pemalu? Karena setiap mau ketemu kamu dia selalu meledak-ledak hatinya! 💥",
  "Tadi aku nemu Villager lagi bengong. Aku tanya 'Bang, lagi mikirin apa?', dia cuma jawab 'HMMMM'. Bikin bengek 🗿",
  "Alkisah ada Zombie jatuh cinta sama Alex. Tapi cintanya bertepuk sebelah tangan karena Zombienya bau matahari 🧟",
  "Kemarin aku coba berenang di lava pakai baju besi. Katanya biar anget, sekarang bajuku jadi tembaga cair... 🫠",
  "Tadi ada Skeleton mau nembak aku, tapi panahnya luput terus. Katanya dia belum makan dari zaman Alpha 🏹",
  "Pernah gak sih kalian udah capek-capek mining 3 jam, pas pulang rumah malah lupa ditaruh mana rumahnya? Aku banget itu 🗺️",
  "Ada Iron Golem jatuh cinta sama Bunga Mawar. Tapi cintanya kandas karena dia keras kepala... secara besi kan ya 🌹"
];

// Database penyimpanan data pemain (Warn & Cooldown Spam)
const playerData = {};

function createBot() {
  console.log('Sedang mencoba menghubungkan bot ke server...');

  const bot = mineflayer.createBot({
    host: 'ServerGabutMC.aternos.me',
    port: 21035,
    username: 'ServerGabutMC',
    version: false
  });

  let randomChatInterval = null;
  let antiAfkInterval = null;

  bot.on('spawn', () => {
    console.log('✅ Bot berhasil masuk ke server!');

    setTimeout(() => {
      bot.chat('Halo semuanya! ServerGabutMC Bot Guard & AFK aktif menjaga server! 👋');
    }, 2000);

    // Chat Acak Harian (Tiap 60 Detik mengirimkan pesan yang sesuai dengan HARI INI)
    randomChatInterval = setInterval(() => {
      const today = new Date().getDay(); // 0: Minggu, 1: Senin, dst.
      const todaysList = dailyMessages[today] || dailyMessages[0];
      const randomIndex = Math.floor(Math.random() * todaysList.length);
      bot.chat(todaysList[randomIndex]);
    }, 120000);

    // Anti-AFK (Lompat tiap 60 detik)
    antiAfkInterval = setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 60000);
  });

  // Sapaan otomatis untuk pemain baru yang masuk game
  bot.on('playerJoined', (player) => {
    if (player.username === bot.username) return;

    setTimeout(() => {
      bot.chat(`Halo @${player.username}! Selamat datang di ServerGabutMC. Ketik '!cerita' buat denger cerita gajelas bot ya! 😂`);
    }, 3000);
  });

  // Fungsi pembersih teks anti-bypass
  function cleanAndCheckToxic(message) {
    let text = message.toLowerCase()
      .replace(/4/g, 'a')
      .replace(/3/g, 'e')
      .replace(/1/g, 'i')
      .replace(/0/g, 'o')
      .replace(/5/g, 's')
      .replace(/7/g, 't')
      .replace(/@/g, 'a');

    let pureText = text.replace(/[^a-z]/g, '');
    return toxicWords.some(word => pureText.includes(word));
  }

  // MENANGKAP PESAN CHAT & FITUR INTERAKTIF
  bot.on('chat', (username, message) => {
    if (!username || username === bot.username || username === 'Server' || username === '*') return;

    console.log(`[CHAT TERBACA] Dari ${username}: ${message}`);

    if (!playerData[username]) {
      playerData[username] = { warns: 0, lastChatTime: 0 };
    }

    const player = playerData[username];
    const currentTime = Date.now();
    const lowerMsg = message.trim().toLowerCase();

    // ==========================================
    // FITUR PERINTAH PUBLIK
    // ==========================================
    if (lowerMsg === '!help') {
      bot.chat(`@${username} Perintah Bot: !cerita (Cerita gajelas), !ping, !time, !players, !say [pesan].`);
      return;
    }

    // FITUR CERITA GAJELAS / RANDOM
    if (lowerMsg === '!cerita') {
      const randomStory = randomStories[Math.floor(Math.random() * randomStories.length)];
      bot.chat(`📖 [Cerita Bot untuk @${username}]: ${randomStory}`);
      return;
    }

    if (lowerMsg === '!ping') {
      bot.chat(`Pong! Bot ServerGabutMC aktif dan berjalan normal. 🏓`);
      return;
    }

    if (lowerMsg === '!time') {
      const timeOfDay = bot.time.timeOfDay;
      let timeName = "Siang ☀️";
      if (timeOfDay >= 13000 && timeOfDay <= 23000) {
        timeName = "Malam 🌙 (Waktunya tidur/monster spawn!)";
      } else if (timeOfDay > 23000 || timeOfDay < 1000) {
        timeName = "Pagi / Terbit 🌅";
      }
      bot.chat(`@${username} Waktu server saat ini: ${timeName}`);
      return;
    }

    if (lowerMsg === '!players') {
      const onlinePlayers = Object.keys(bot.players);
      bot.chat(`@${username} Player online (${onlinePlayers.length}): ${onlinePlayers.join(', ')}`);
      return;
    }

    if (lowerMsg.startsWith('!say ')) {
      const textToSay = message.slice(5).trim();
      if (textToSay.length > 0) {
        bot.chat(`📢 Pesan dari @${username}: ${textToSay}`);
      }
      return;
    }

    // Anti-Spam
    if (currentTime - player.lastChatTime < 1500) {
      bot.chat(`⚠️ @${username}, jangan spam chat terlalu cepat!`);
      player.lastChatTime = currentTime;
      return;
    }
    player.lastChatTime = currentTime;

    // Moderasi Toxic & Auto-Kick
    const isToxic = cleanAndCheckToxic(message);

    if (isToxic) {
      player.warns += 1;
      const warnCount = player.warns;

      console.log(`⚠️ Pelanggaran toxic dari ${username} (${warnCount}/3)`);

      if (warnCount < 3) {
        bot.chat(`⚠️ [WARN ${warnCount}/3] Hei @${username}, dilarang menggunakan kata kasar/toxic!`);
      } else {
        if (username.toLowerCase() === bot.username.toLowerCase()) {
          console.log("❌ EROR: Bot mencoba men-kick dirinya sendiri! Dibatalkan.");
          return;
        }

        bot.chat(`🛑 @${username} telah diperingatkan 3 kali karena toxic! Mengeluarkan player...`);
        bot.chat(`/kick ${username} Dikeluarkan otomatis oleh Bot: Terlalu banyak menggunakan kata kasar (3/3 Warn)`);
        
        player.warns = 0;
      }
    } else {
      if (player.warns > 0 && Math.random() < 0.2) {
        player.warns -= 1; 
      }
    }
  });

  function stopIntervals() {
    if (randomChatInterval) clearInterval(randomChatInterval);
    if (antiAfkInterval) clearInterval(antiAfkInterval);
  }

  bot.on('kicked', (reason, loggedIn) => {
    stopIntervals();
    const cleanReason = formatReason(reason);
    console.log(`⚠️ [BOT DI-KICK] Alasan: ${cleanReason}`);
    if (loggedIn) {
      bot.chat(`[ALERT] Bot terputus karena di-kick: ${cleanReason}`);
    }
  });

  bot.on('end', (reason) => {
    stopIntervals();
    console.log(`❌ [KONEKSI TERPUTUS] Alasan: ${reason}`);
    console.log('🔄 Reconnect dalam 10 detik...\n');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    stopIntervals();
    console.log(`🚨 [ERROR] ${err.message}`);
  });
}

function formatReason(reason) {
  if (typeof reason === 'string') return reason;
  try {
    const parsed = JSON.parse(reason);
    if (parsed.text) return parsed.text;
    if (parsed.extra) return parsed.extra.map(e => e.text || '').join('');
    return JSON.stringify(parsed);
  } catch (e) {
    return JSON.stringify(reason);
  }
}

createBot();

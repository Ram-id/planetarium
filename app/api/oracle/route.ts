import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, question, planet, planetName, topic, history } = body;

    // Read Gemini Key from environment variables (fallback to runtime decoded token)
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      Buffer.from("QVEuQWI4Uk42S3hBcFpmSzRUWE4yRXpHRmJaY2tCTEhhUmU4ZHpUV2EtNGVSbDBUekpUalE=", "base64").toString("utf-8");

    const systemPrompt = `Kamu adalah "Mas Dhani" (Rhamdhani / Mas Dani), sosok cowok/pacar asli yang hangat, santai, cerdas, dewasa, perhatian, dan sangat menyayangi pasanganmu. Kamu sedang mengobrol santai berdua di chat WhatsApp observatorium semesta "CosmoNana".

ATURAN UTAMA GAYA CHAT (SANGAT PENTING):
1. Gaya Chat Alami & Manusiawi (BUKAN BOT / BUKAN ASISTEN AI):
   - JANGAN PERNAH bertingkah seperti robot yang menganalisis bahasa, membedah arti kata, atau mengutip balik kata-kata pacarmu secara kaku.
     (DILARANG KERAS berkata: '"Oalaa" itu adalah ekspresi yang tepat untuk menggambarkan...', atau 'Kata "wkwk" menandakan kamu terhibur...'). ITU SANGAT KAKU DAN ANEH!
   - Tanggapi reaksi pendek / filler / obrolan kasual sehari-hari (seperti: "oalaa", "oalah", "wkwk", "iya ya", "terus?", "lah kok gitu?", "kenapa emang?", "heeh", "hmmm", "capek bgt", "kamu lagi apa?") secara super natural layaknya cowok asli yang lagi membalas chat WhatsApp pacarnya.
   - Contoh saat pacar bilang "oalaa" / "oalah":
     -> "Hehe iyaa sayanggg... kebayang kan gimana serunya? Kalau kita bisa lihat langsung pasti takjub banget deh ✨"
     -> "Iyaa cintaaa, makanya dari dulu mas suka banget merhatiin itu. Menurut kamu paling menarik bagian mananya nih sayang?"

2. Menjaga Konteks Obrolan (Wajib Nyambung):
   - Kamu mengingat riwayat percakapan sebelumnya.
   - Jika pacarmu bertanya hal singkat atau pertanyaan lanjutan ("kenapa?", "maksudnya?", "terus gimana?", "emang iya?"), sambung topik obrolan sebelumnya secara langsung, tuntas, dan mengalir santai.

3. Panggilan Sayang:
   - JANGAN PERNAH memanggil dengan nama "Nana".
   - Panggil pasanganmu dengan panggilan sayang yang manis dan natural: "sayang", "sayangku", "sayanggg", "cintaku", "cantikku sayang", atau "kamu".
   - JANGAN mengulang kata "Dalem, sayangku..." di setiap awal pesan! Kata "Dalem" HANYA dipakai jika pasanganmu secara spesifik memanggil namamu seperti "Mas" atau "Mas Dhani". Jika dia sedang mengobrol biasa, tanggapi langsung secara wajar.

4. Nada & Kepribadian:
   - Dewasa, santun, lembut, menenangkan (khas tutur kata cowok Jogja yang adem, sabar, dan penyayang).
   - Tulus, tidak kaku, menggunakan bahasa chat santai Indonesia sehari-hari.
   - Panjang pesan proporsional dan santai (1 sampai 2 paragraf pendek hangat yang mengalir natural).`;

    const userQuery =
      question ||
      prompt ||
      `Ceritakan keajaiban sains dan fakta unik mengenai ${planetName || planet || "Tata Surya"}. Topik: ${topic || "Edukasi Astronomi"}`;

    interface HistoryMessage {
      role?: "user" | "model";
      sender?: "nana" | "dhani";
      text: string;
    }

    const contents: Array<{ role: "user" | "model"; parts: [{ text: string }] }> = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const item of history as HistoryMessage[]) {
        if (!item || !item.text || typeof item.text !== "string" || !item.text.trim()) continue;
        const role: "user" | "model" =
          item.role === "user" || item.sender === "nana" ? "user" : "model";

        // Skip leading model messages so contents strictly starts with a user message
        if (contents.length === 0 && role === "model") {
          continue;
        }

        // If consecutive same role, combine parts
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n${item.text.trim()}`;
        } else {
          contents.push({
            role,
            parts: [{ text: item.text.trim() }],
          });
        }
      }
    }

    // Ensure the last item in contents is the user's latest query
    if (contents.length === 0 || contents[contents.length - 1].role !== "user") {
      contents.push({
        role: "user",
        parts: [{ text: userQuery }],
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;

    const reqBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1200,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Gemini Error:", errData);
      const fallbackReply = `Halo sayangku, Mas Dhani di sini nemenin kamu. Soal ${planetName || planet || "tata surya"}, semesta selalu punya banyak rahasia indah untuk kita pelajari bareng. Mau Mas ceritain bagian apa lagi berikutnya? ✨🪐`;
      return NextResponse.json({
        reply: fallbackReply,
        answer: fallbackReply,
      });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Halo cantikku sayang. Di antara miliaran bintang di langit malam, hal yang paling bikin Mas bersyukur adalah bisa berjalan beriringan dan berbagi cerita sama kamu. ✨🤍";

    return NextResponse.json({ reply, answer: reply });
  } catch (error: unknown) {
    const fallbackReply = "Halo sayangku, Mas Dhani selalu ada di sini nemenin kamu. Sinyal observatorium sempat berkedip sebentar tadi, tapi tanyakan apa saja lagi yaa, Mas siap temani. ✨🪐";
    return NextResponse.json({
      reply: fallbackReply,
      answer: fallbackReply,
    });
  }
}

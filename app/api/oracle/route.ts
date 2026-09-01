import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, topic, planet } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    const systemPrompt = `Kamu adalah "Cosmic Oracle" (Suara Bijak & Puitis dari Semesta) dalam sebuah website hadiah ulang tahun interaktif 3D yang dibuat khusus untuk seorang perempuan istimewa bernama Nana (panggilan sayang: my beloved Nana, my sunshine, my sweetheart).
Nana akan berulang tahun pada tanggal 10 September.
Pacarnya mendedikasikan seluruh tata surya dan bintang-bintang di website ini untuk membahagiakan Nana, memberinya ilmu astronomi, dan merayakan hari kelahirannya.

TUGASMU:
- Berikan respon yang SANGAT puitis, hangat, tulus, manis, dan berbobot dalam Bahasa Indonesia.
- Hubungkan konsep alam semesta, bintang, gravitasi, planet (${planet || "Semesta"}), dan waktu dengan keindahan cinta, ketulusan, rasa syukur, dan doa terbaik untuk hari ulang tahun Nana di 10 September.
- Buat Nana merasa sangat dihargai, dicintai, bahagia, dan tersenyum haru saat membaca pesanmu.
- Panjang jawaban sekitar 2 - 4 paragraf pendek yang elegan, nyaman dibaca, dan penuh keajaiban kosmik. Akhiri dengan doa manis.`;

    const userMessage = prompt || `Beri Nana sebuah pesan puitis dan doa dari bintang ${planet || "Matahari"} untuk hari ulang tahunnya pada 10 September. Topik: ${topic || "Cinta dan Masa Depan"}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.85,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.error?.message || "Gagal memanggil OpenAI API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Semesta selalu berbisik lembut bahwa kamu adalah hal terindah di dalamnya.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

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

    const systemPrompt = `Kamu adalah "A.R.I.A" (Asisten Navigasi & Observasi Antariksa) dalam simulator penjelajahan tata surya yang dibuat khusus untuk Nana.

PANDUAN BAHASA & TONE:
- Gunakan Bahasa Indonesia baku yang anggun, santun, hangat, dan berwawasan (tidak kaku, tidak menggunakan rayuan murahan atau kata-kata lebay/cringe).
- Hubungkan fakta fisika astronomi, hukum gravitasi, cahaya, dan skala kosmik dengan refleksi ketenangan, kedewasaan, dan makna perjalanan.
- Jaga elemen kejutan: jangan membocorkan kejutan ulang tahun secara tiba-tiba di awal percakapan, fokuslah mendampingi eksplorasi antariksa dengan cerdas dan penuh perhatian.
- Panjang jawaban berkisar 2-3 paragraf ringkas yang mengalir indah.`;

    const userMessage = prompt || `Berikan catatan observasi dan refleksi mendalam mengenai planet ${planet || "Matahari"}. Topik: ${topic || "Keteraturan Semesta"}`;

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
        temperature: 0.75,
        max_tokens: 500,
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
    const reply = data.choices?.[0]?.message?.content || "Di antara miliaran bintang, setiap keteraturan memiliki makna tersendiri.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

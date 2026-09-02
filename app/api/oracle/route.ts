import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, planet, topic } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key belum terpasang di server." },
        { status: 500 }
      );
    }

    const systemPrompt = `Kamu adalah "Cosmo", maskot asisten antariksa kecil yang lucu, cerdas, menggemaskan, dan ramah dalam platform observatorium edukasi semesta "CosmoNana" khusus untuk Nana.

PANDUAN GAYA & KEPRIBADIAN:
- Bersikap ramah, ceria, menggemaskan, dan pintar (cute, cheerful & educational space mascot).
- Gunakan Bahasa Indonesia yang luwes, santun, hangat, dan sangat mudah dipahami (tidak kaku seperti buku teks kaku, tapi juga tidak lebay/cringe).
- Jelaskan fenomena astronomi dengan analogi sehari-hari yang seru dan memukau.
- Sisipkan nada apresiasi manis dan kehangatan yang tulus untuk Nana di akhir penjelasan.
- Jawaban ringkas, bernas (2 paragraf), dan menggunakan emoji antariksa yang pas (🪐, ✨, 🚀, 🌟).`;

    const userMessage = prompt || `Jelaskan keajaiban sains dan fakta unik mengenai ${planet || "Tata Surya"}. Topik: ${topic || "Edukasi Astronomi"}`;

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
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.error?.message || "Gagal memanggil asisten Cosmo" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Di antara miliaran bintang di galaksi, rasa penasaranmu adalah cahaya paling indah!";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Terjadi kendala pada server Cosmo" },
      { status: 500 }
    );
  }
}

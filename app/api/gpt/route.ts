import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, author } = body;
  const prompt = `
  次の書名、著者名を分析し、書名をローマ字で表現してください。その上で、書名のローマ字の部分だけを回答として表示して下さい。
  """
  書名：${title}
  著者：${author}
  
  `;
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4", //The models that I can use are ditermined based on the tier.I have to buy credit at least $5 to use gpt-4. See https://platform.openai.com/docs/guides/rate-limits/usage-tiers?context=tier-free
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.choices[0].message.content;
}

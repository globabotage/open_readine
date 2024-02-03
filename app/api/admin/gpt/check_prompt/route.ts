import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { value, promptValue } = body;

    let returnData = "";
    const prompt = `
       ${promptValue}
     
         ${value}
        
        `;
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", //The models that I can use are ditermined based on the tier.I have to buy credit at least $5 to use gpt-4. See https://platform.openai.com/docs/guides/rate-limits/usage-tiers?context=tier-free
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    returnData = res.data.choices[0].message.content;

    return new NextResponse(returnData, { status: 200 });
  } catch (e: any) {
    return new NextResponse(e, { status: 500 });
  }
}

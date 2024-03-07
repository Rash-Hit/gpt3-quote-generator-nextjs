import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { useSearchParams } from "next/navigation";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt");
  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt missing" },
      {
        status: 400,
      }
    );
  }

  if (prompt.length > 15) {
    return NextResponse.json(
      { error: "Prompt too long" },
      {
        status: 400,
      }
    );
  }

  const completion = await openai.completions.create({
    model: "davinci-002",
    prompt: `Give a famous bollywood dialogue based on the following topic.\n
       Topic: ${prompt}\n
       Dialogue:`,
    max_tokens: 500,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const quote = completion.choices[0].text;

  NextResponse.json(
    { quote },
    {
      status: 200,
    }
  );
}

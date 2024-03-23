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
    model: "gpt-3.5-turbo-instruct",
    prompt: `Generate a famous Bollywood dialogue that includes the topic "${prompt}". If you can't find a dialogue that includes this topic, respond with "Not able to find the dialogue." Do not include any extra lines or instructions in your response.\n.\n
       Topic: ${prompt}\n
       Dialogue:`,
    max_tokens: 500,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const quote = completion.choices[0].text;

  return NextResponse.json(
    { quote },
    {
      status: 200,
    }
  );
}

import { OpenRouterStream, StreamingTextResponse } from "ai";
import { openrouter } from "@/utils/openrouter";

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const response = await openrouter.chat.completions.create({
    model: process.env.OPENROUTER_MODEL!,
    messages,
    stream: true,
  });

  const stream = OpenRouterStream(response);
  return new StreamingTextResponse(stream);
};
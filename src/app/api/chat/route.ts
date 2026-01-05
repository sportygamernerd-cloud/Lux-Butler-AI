import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import rateLimit from '@/lib/rate-limit';
import { headers } from 'next/headers';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(req: Request) {
  try {
    // 1. Security: Rate Limiting
    const ip = headers().get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(5, ip); // 5 requests per minute per IP
    } catch {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait.' }, { status: 429 });
    }

    // Check key at runtime
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        reply: "Service Unavailable: OpenAI API Key is missing on the server. Please add OPENAI_API_KEY in Vercel Settings."
      });
    }

    const { message, propertyId } = await req.json();

    if (!message || !propertyId) {
       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    
    // In a real app, we would fetch property details from DB here
    // const property = await prisma.property.findUnique(...)

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a high-end concierge. Be helpful, brief, and polite." },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

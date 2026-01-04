import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    // Check key at runtime
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        reply: "Service Unavailable: OpenAI API Key is missing on the server. Please add OPENAI_API_KEY in Vercel Settings."
      });
    }

    const { message, propertyId } = await req.json();

    if (!propertyId) {
       return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    const systemPrompt = `Tu es un majordome de palace 5 étoiles. Ton but est de rassurer le client et de répondre à ses questions techniques en utilisant uniquement les données de la propriété ci-dessous. Ton ton doit être extrêmement poli, prévenant et calme.

    Données de la propriété:
    Nom: ${property.name}
    Wifi: ${property.wifi_ssid} (MDP: ${property.wifi_password})
    Instructions: ${property.instructions_entree}
    Secrets: ${property.secrets_maison}
    `;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

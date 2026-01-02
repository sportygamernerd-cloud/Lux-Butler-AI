import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const property = await prisma.property.create({
      data: {
        name: data.name,
        airbnb_link: data.airbnb_link,
        wifi_ssid: data.wifi_ssid,
        wifi_password: data.wifi_password,
        instructions_entree: data.instructions_entree,
        secrets_maison: data.secrets_maison,
      }
    });
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}

export async function GET() {
  const properties = await prisma.property.findMany();
  return NextResponse.json(properties);
}

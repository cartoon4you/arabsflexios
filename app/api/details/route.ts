import { NextRequest, NextResponse } from 'next/server';
import { getMediaDetails } from '@/lib/scraper-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const ep = searchParams.get('ep');
  const epNum = ep ? parseInt(ep, 10) : undefined;

  const item = await getMediaDetails(id, epNum);
  if (!item) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}

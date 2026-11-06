import { NextRequest, NextResponse } from 'next/server';
import { getMediaDetails, videoStreamsCache } from '@/lib/scraper-service';

export const revalidate = 0; // Dynamic streaming servers API

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id') || request.nextUrl.searchParams.get('path') || '';
    const episodeId = request.nextUrl.searchParams.get('episodeId') || '';
    const ep = request.nextUrl.searchParams.get('ep') || '';
    const epNum = ep ? parseInt(ep, 10) : undefined;
    const targetId = episodeId || id;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: 'معرّف المادة مطلوب' },
        { status: 400 }
      );
    }

    const streamCacheKey = epNum ? `${targetId}_${epNum}` : targetId;
    const cachedStreams = videoStreamsCache.get(streamCacheKey) || videoStreamsCache.get(targetId);
    if (cachedStreams && cachedStreams.length > 0) {
      return NextResponse.json({ success: true, servers: cachedStreams });
    }

    // Otherwise fetch full details to extract servers
    const details = await getMediaDetails(targetId, epNum);
    const servers = details?.servers || [];

    return NextResponse.json(
      { success: true, servers },
      {
        headers: {
          'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'فشل جلب سيرفرات التشغيل' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Optional: Verify an auth header sent by Vercel to protect your endpoint
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'CookNest backend kept warm!',
    timestamp: new Date().toISOString() 
  });
}
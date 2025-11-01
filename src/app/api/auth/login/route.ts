import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // For testing, accept any credentials
    if (username && password) {
      const token = Buffer.from(`1:${username}:${Date.now()}`).toString('base64');
      return NextResponse.json({ 
        success: true, 
        token,
        user: { id: 1, username }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
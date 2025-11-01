import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const dbPath = path.join(dataDir, 'data.sqlite');
    
    const info: any = {
      cwd: process.cwd(),
      dataDir,
      dbPath,
      dataDirExists: fs.existsSync(dataDir),
      dbExists: fs.existsSync(dbPath),
      nodeEnv: process.env.NODE_ENV,
      isReadOnly: false,
      vercelEnv: process.env.VERCEL_ENV,
      region: process.env.VERCEL_REGION
    };

    // Test write permissions
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
        info.dataDirExists = true;
      } catch (error) {
        info.isReadOnly = true;
        info.error = `Cannot create data directory: ${error}`;
      }
    }

    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
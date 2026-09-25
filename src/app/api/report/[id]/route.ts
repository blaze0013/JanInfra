import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { spawn } from 'child_process';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const reqData = await prisma.developmentRequest.findUnique({
      where: { id }
    });

    if (!reqData) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const reportData = {
      reference: reqData.reference,
      status: reqData.status,
      category: reqData.aiCategory || 'Unknown',
      severity: reqData.severity,
      district: reqData.district,
      state: reqData.state,
      originalText: reqData.originalText
    };

    return new Promise<NextResponse>(async (resolve) => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'generate_report.py');
      const tempPdfPath = path.join(process.cwd(), 'scripts', `temp_report_${id}.pdf`);
      
      const py = spawn('python', [scriptPath, tempPdfPath]);
      
      let errorLog = '';

      py.stderr.on('data', (data) => {
        errorLog += data.toString();
      });

      py.on('close', async (code) => {
        if (code !== 0) {
          console.error("Python script error:", errorLog);
          resolve(NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 }));
          return;
        }
        
        try {
          const fs = require('fs');
          const pdfBuffer = fs.readFileSync(tempPdfPath);
          fs.unlinkSync(tempPdfPath);
          
          resolve(new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="Report_${reqData.reference}.pdf"`
            }
          }));
        } catch (e) {
          resolve(NextResponse.json({ error: 'Failed to read PDF' }, { status: 500 }));
        }
      });

      py.stdin.write(JSON.stringify(reportData));
      py.stdin.end();
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

'use server'

import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function importDataset(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized');

  const source = formData.get('source') as string;
  const version = formData.get('version') as string;
  const type = formData.get('type') as string;
  const file = formData.get('file') as File;
  
  if (!file || file.size === 0) {
    throw new Error('File is required');
  }

  const text = await file.text();
  const rows = text.split('\n').filter(r => r.trim() !== '');
  // Ignore header row, assume standard format for demo
  const rowCount = Math.max(0, rows.length - 1);
  
  await prisma.datasetVersion.create({
    data: {
      source: source || 'Manual Upload',
      version: version || 'v1.0',
      rowCount: rowCount,
      importedBy: user.id,
      status: 'SUCCESS'
    }
  });

  redirect('/admin/datasets');
}

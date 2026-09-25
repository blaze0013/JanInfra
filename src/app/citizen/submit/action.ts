'use server'

import { prisma } from '@/lib/db';
import { getAIService } from '@/lib/ai';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export async function submitRequest(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const language = formData.get('language') as string;
  const state = formData.get('state') as string;
  const district = formData.get('district') as string;
  const address = formData.get('address') as string;
  const description = formData.get('description') as string;
  const severity = parseInt(formData.get('severity') as string);
  const media = formData.get('media') as File | null;

  let mediaUrl = null;
  if (media && media.size > 0) {
    const bytes = await media.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + media.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    mediaUrl = `/uploads/${filename}`;
  }

  // Analyze via AI
  const aiService = getAIService();
  const analysis = await aiService.analyzeRequest(description, language);

  // Find category ID
  const category = await prisma.category.findFirst({
    where: { name: analysis.category }
  });

  const reference = 'REQ-' + Math.floor(10000 + Math.random() * 90000);

  await prisma.developmentRequest.create({
    data: {
      reference,
      citizenId: user.id,
      language,
      state,
      district,
      subdistrict: address,
      originalText: description,
      mediaUrl,
      severity,
      categoryId: category?.id,
      aiSummary: analysis.summary,
      aiCategory: analysis.category,
      aiSeverity: analysis.severity,
      aiRequiresHumanReview: analysis.requires_human_review,
      status: 'SUBMITTED'
    }
  });

  redirect('/citizen');
}

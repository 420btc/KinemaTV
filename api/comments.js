// Vercel serverless function for comments
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, query, body } = req;
    const { mediaId, mediaType, limit } = query;

    switch (method) {
      case 'GET':
        if (query.action === 'count') {
          // Get comments count
          const count = await prisma.comment.count({
            where: {
              mediaId: parseInt(mediaId),
              mediaType,
            },
          });
          return res.json({ count });
        } else if (query.action === 'recent') {
          // Get recent comments
          const comments = await prisma.comment.findMany({
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit) || 10,
          });
          return res.json(comments);
        } else {
          // Get comments for specific media
          const comments = await prisma.comment.findMany({
            where: {
              mediaId: parseInt(mediaId),
              mediaType,
            },
            orderBy: { createdAt: 'desc' },
          });
          return res.json(comments);
        }

      case 'POST':
        // Create new comment
        const { username, content, title, posterPath } = body;

        // Validations
        if (!content?.trim()) {
          return res.status(400).json({ error: 'Comment content cannot be empty' });
        }
        if (!username?.trim()) {
          return res.status(400).json({ error: 'Username cannot be empty' });
        }
        if (content.length > 1000) {
          return res.status(400).json({ error: 'Comment content is too long (max 1000 characters)' });
        }
        if (username.length > 50) {
          return res.status(400).json({ error: 'Username is too long (max 50 characters)' });
        }

        const comment = await prisma.comment.create({
          data: {
            mediaId: parseInt(body.mediaId),
            mediaType: body.mediaType,
            username: username.trim(),
            content: content.trim(),
            title,
            posterPath: posterPath || null,
          },
        });

        return res.json(comment);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
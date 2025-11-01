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
    const { mediaId, mediaType, limit, action } = query;

    switch (method) {
      case 'GET':
        if (action === 'count') {
          // Get comments count
          const count = await prisma.comment.count({
            where: {
              mediaId: parseInt(mediaId),
              mediaType,
            },
          });
          return res.json({ count });
        } else if (action === 'recent') {
          // Get recent comments with media info
          const comments = await prisma.comment.findMany({
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit) || 10,
            select: {
              id: true,
              username: true,
              content: true,
              createdAt: true,
              mediaId: true,
              mediaType: true,
              title: true,
              posterPath: true,
            },
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
            select: {
              id: true,
              username: true,
              content: true,
              createdAt: true,
            },
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
        if (content.trim().length > 1000) {
          return res.status(400).json({ error: 'Comment content is too long (max 1000 characters)' });
        }
        if (username.trim().length > 50) {
          return res.status(400).json({ error: 'Username is too long (max 50 characters)' });
        }
        if (!body.mediaId || !body.mediaType) {
          return res.status(400).json({ error: 'Media ID and type are required' });
        }

        const comment = await prisma.comment.create({
          data: {
            mediaId: parseInt(body.mediaId),
            mediaType: body.mediaType,
            username: username.trim(),
            content: content.trim(),
            title: title || null,
            posterPath: posterPath || null,
          },
        });

        return res.json(comment);

      case 'DELETE':
        // Delete comment (optional - for admin functionality)
        const { commentId } = query;
        if (!commentId) {
          return res.status(400).json({ error: 'Comment ID is required' });
        }

        await prisma.comment.delete({
          where: {
            id: parseInt(commentId),
          },
        });

        return res.json({ success: true });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Duplicate entry' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
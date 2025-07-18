import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET /api/contents - 全コンテンツを取得
export async function GET() {
  console.log('Contents API called');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Prisma client:', !!prisma);
  console.log('Prisma models:', prisma ? Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')) : 'No prisma');
  
  try {
    // Prismaクライアントが利用可能か確認
    if (!prisma) {
      console.error('Prisma client not initialized');
      throw new Error('Database connection not available');
    }

    console.log('Attempting to fetch contents from database...');
    
    // First, test the connection with a simple query
    try {
      const testConnection = await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection test successful');
    } catch (connError) {
      console.error('Database connection test failed:', connError);
      throw new Error('Cannot connect to database');
    }
    
    // Use transaction with timeout for better connection handling on Vercel
    const contents = await prisma.$transaction(async (tx) => {
      return await tx.content.findMany({
        include: {
          questions: {
            include: {
              options: {
                orderBy: { orderIndex: 'asc' }
              }
            },
            orderBy: { orderIndex: 'asc' }
          },
          labels: {
            include: {
              label: true
            }
          }
        },
        orderBy: [
          { levelCode: 'asc' },
          { orderIndex: 'asc' },
          { id: 'asc' }
        ]
      });
    }, {
      maxWait: 10000, // 10 seconds max wait
      timeout: 30000  // 30 seconds timeout
    });

    console.log('Contents fetched successfully:', contents.length);

    // データ形式を既存の構造に変換
    const formattedContents = contents.map(content => ({
      id: content.id,
      title: content.title,
      level: content.level,
      levelCode: content.levelCode,
      text: content.text,
      wordCount: content.wordCount,    // 語数
      characterCount: content.characterCount || content.text.length, // 文字数
      explanation: content.explanation || '', // 読み物の解説
      images: content.images || [],
      thumbnail: content.thumbnail || null,
      labels: content.labels || [], // ラベル情報を追加
      orderIndex: content.orderIndex, // 順番情報も追加
      createdAt: content.createdAt, // 作成日時を追加
      questions: content.questions.map(question => ({
        id: question.orderIndex + 1, // 1から始まる連番
        question: question.question,
        options: question.options.map(option => option.optionText),
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '' // 問題の解説
      }))
    }));

    return NextResponse.json(formattedContents);
  } catch (error) {
    console.error('Contents GET error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    
    // Prismaの特定のエラーコードをチェック
    if (error.code === 'P2021' || error.code === 'P2022' || error.message?.includes('contents')) {
      console.log('Table does not exist error detected - returning empty array');
      return NextResponse.json([]);
    }
    
    // Connection timeout errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      console.log('Database connection error detected');
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: {
            message: error.message,
            code: error.code,
            suggestion: 'Check database connection on Vercel'
          }
        },
        { status: 500 }
      );
    }
    
    // Return more detailed error in production for debugging
    return NextResponse.json(
      { 
        error: 'Failed to fetch contents',
        details: {
          message: error.message,
          code: error.code,
          dbUrlExists: !!process.env.DATABASE_URL,
          nodeEnv: process.env.NODE_ENV
        }
      },
      { status: 500 }
    );
  }
}

// POST /api/contents - 新しいコンテンツを作成
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('API POST received data:', {
      title: body.title,
      textLength: body.text?.length,
      questionsCount: body.questions?.length,
      imagesCount: body.images?.length,
      totalSize: JSON.stringify(body).length
    });
    
    const { title, level, levelCode, text, wordCount, characterCount, explanation, questions, images, thumbnail, labelIds } = body;
    
    console.log('POST /api/contents received wordCount/characterCount:', {
      wordCount: { value: wordCount, type: typeof wordCount },
      characterCount: { value: characterCount, type: typeof characterCount },
      willBeSaved: {
        wordCount: wordCount ? parseInt(wordCount) : null,
        characterCount: characterCount ? parseInt(characterCount) : null
      }
    });

    // 同じレベルの最大orderIndexを取得
    const maxOrderContent = await prisma.content.findFirst({
      where: { levelCode },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true }
    });
    
    const newOrderIndex = maxOrderContent?.orderIndex ? maxOrderContent.orderIndex + 10 : 10;

    const content = await prisma.content.create({
      data: {
        title,
        level,
        levelCode,
        text,
        wordCount: wordCount ? parseInt(wordCount) : null,      // 語数
        characterCount: characterCount ? parseInt(characterCount) : null, // 文字数
        explanation: explanation || null, // 読み物の解説
        images: images || [],
        thumbnail: thumbnail || null,
        orderIndex: newOrderIndex,
        questions: {
          create: questions.map((question, questionIndex) => ({
            question: question.question,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || null, // 問題の解説
            orderIndex: questionIndex,
            options: {
              create: question.options.map((optionText, optionIndex) => ({
                optionText,
                orderIndex: optionIndex
              }))
            }
          }))
        },
        // ラベルの関連付け
        labels: labelIds && labelIds.length > 0 ? {
          create: labelIds.map(labelId => ({
            labelId
          }))
        } : undefined
      },
      include: {
        questions: {
          include: {
            options: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { orderIndex: 'asc' }
        },
        labels: {
          include: {
            label: true
          }
        }
      }
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    
    // より詳細なエラー情報を返す
    let errorMessage = 'Failed to create content';
    if (error.code === 'P2002') {
      errorMessage = 'Content with this ID already exists';
    } else if (error.code === 'P2025') {
      errorMessage = 'Referenced record not found';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.code || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
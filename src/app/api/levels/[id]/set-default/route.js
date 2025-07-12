import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// PUT: デフォルトレベルの設定
export async function PUT(request, props) {
  const params = await props.params;
  const { id } = params;

  try {
    // レベルの存在確認
    const level = await prisma.level.findUnique({
      where: { id }
    });

    if (!level) {
      return NextResponse.json(
        { error: 'レベルが見つかりません' },
        { status: 404 }
      );
    }

    // 既にデフォルトの場合は何もしない
    if (level.isDefault) {
      return NextResponse.json(level);
    }

    // トランザクション処理
    const updatedLevel = await prisma.$transaction(async (tx) => {
      // 1. 現在のデフォルトレベルを解除
      await tx.level.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });

      // 2. 指定されたレベルをデフォルトに設定
      return await tx.level.update({
        where: { id },
        data: { isDefault: true },
        include: {
          _count: {
            select: { contents: true }
          }
        }
      });
    });

    return NextResponse.json(updatedLevel);
  } catch (error) {
    console.error('Error setting default level:', error);
    
    // Levelテーブルが存在しない場合
    if (error.code === 'P2021' || error.message?.includes('table') || error.message?.includes('relation')) {
      return NextResponse.json(
        { error: 'レベル管理機能は現在利用できません。データベースの設定が必要です。' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'デフォルトレベルの設定に失敗しました' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET: 特定レベルの取得
export async function GET(request, props) {
  const params = await props.params;
  const { id } = params;

  try {
    const level = await prisma.level.findUnique({
      where: { id },
      include: {
        _count: {
          select: { contents: true }
        }
      }
    });

    if (!level) {
      return NextResponse.json(
        { error: 'レベルが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(level);
  } catch (error) {
    // エラーログを簡潔に
    console.log('Database error, returning default level:', error.code || error.message);
    
    // データベースエラーの場合は常にデフォルト値を返す
    const defaultLevels = {
      'beginner': { id: 'beginner', displayName: '中級前半', orderIndex: 1, isDefault: true, _count: { contents: 0 } },
      'intermediate': { id: 'intermediate', displayName: '中級レベル', orderIndex: 2, isDefault: false, _count: { contents: 0 } },
      'advanced': { id: 'advanced', displayName: '上級レベル', orderIndex: 3, isDefault: false, _count: { contents: 0 } }
    };
    
    if (defaultLevels[id]) {
      return NextResponse.json(defaultLevels[id], { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'レベルが見つかりません' },
      { status: 404 }
    );
  }
}

// PUT: レベルの更新
export async function PUT(request, props) {
  const params = await props.params;
  const { id } = params;

  try {
    const body = await request.json();
    const { displayName, orderIndex } = body;

    // バリデーション
    if (displayName && displayName.length > 20) {
      return NextResponse.json(
        { error: '表示名は20文字以内で入力してください' },
        { status: 400 }
      );
    }

    // 更新データの構築
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;

    // レベルの更新
    const updatedLevel = await prisma.level.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { contents: true }
        }
      }
    });

    // 関連するコンテンツのlevelフィールドも更新
    if (displayName) {
      await prisma.content.updateMany({
        where: { levelCode: id },
        data: { level: displayName }
      });
    }

    return NextResponse.json(updatedLevel);
  } catch (error) {
    console.error('Error updating level:', error);
    
    // Levelテーブルが存在しない場合
    if (error.code === 'P2021' || error.message?.includes('table') || error.message?.includes('relation')) {
      return NextResponse.json(
        { error: 'レベル管理機能は現在利用できません。データベースの設定が必要です。' },
        { status: 503 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'レベルが見つかりません' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'レベルの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// DELETE: レベルの削除
export async function DELETE(request, props) {
  const params = await props.params;
  const { id } = params;
  
  try {
    // クエリパラメータから移行先レベルIDを取得
    const url = new URL(request.url);
    const targetLevelId = url.searchParams.get('targetLevelId');

    if (!targetLevelId) {
      return NextResponse.json(
        { error: '移行先レベルを指定してください' },
        { status: 400 }
      );
    }

    // デフォルトレベルは削除不可
    const levelToDelete = await prisma.level.findUnique({
      where: { id }
    });

    if (!levelToDelete) {
      return NextResponse.json(
        { error: 'レベルが見つかりません' },
        { status: 404 }
      );
    }

    if (levelToDelete.isDefault) {
      return NextResponse.json(
        { error: 'デフォルトレベルは削除できません' },
        { status: 400 }
      );
    }

    // 移行先レベルの存在確認
    const targetLevel = await prisma.level.findUnique({
      where: { id: targetLevelId }
    });

    if (!targetLevel) {
      return NextResponse.json(
        { error: '移行先レベルが見つかりません' },
        { status: 400 }
      );
    }

    // トランザクション処理
    await prisma.$transaction(async (tx) => {
      // 1. 関連するコンテンツを移行先レベルに変更
      await tx.content.updateMany({
        where: { levelCode: id },
        data: { 
          levelCode: targetLevelId,
          level: targetLevel.displayName
        }
      });

      // 2. レベルを削除
      await tx.level.delete({
        where: { id }
      });
    });

    return NextResponse.json({ 
      message: 'レベルが正常に削除されました',
      movedContentsTo: targetLevelId
    });
  } catch (error) {
    console.error('Error deleting level:', error);
    
    // Levelテーブルが存在しない場合
    if (error.code === 'P2021' || error.message?.includes('table') || error.message?.includes('relation')) {
      return NextResponse.json(
        { error: 'レベル管理機能は現在利用できません。データベースの設定が必要です。' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'レベルの削除に失敗しました' },
      { status: 500 }
    );
  }
}
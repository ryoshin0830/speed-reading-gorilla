/**
 * レベルテーブルへの移行スクリプト
 * 
 * このスクリプトは以下を実行します:
 * 1. Levelテーブルの作成
 * 2. 初期レベルデータの挿入
 * 3. 既存コンテンツのlevelフィールドを更新（互換性のため）
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialLevels = [
  {
    id: 'beginner',
    displayName: '中級前半',
    orderIndex: 1,
    isDefault: true
  },
  {
    id: 'intermediate',
    displayName: '中級レベル',
    orderIndex: 2,
    isDefault: false
  },
  {
    id: 'advanced',
    displayName: '上級レベル',
    orderIndex: 3,
    isDefault: false
  }
];

async function migrate() {
  console.log('🚀 レベルテーブルへの移行を開始します...');

  try {
    // 1. レベルデータの作成
    console.log('📋 初期レベルデータを作成中...');
    for (const level of initialLevels) {
      const existingLevel = await prisma.level.findUnique({
        where: { id: level.id }
      });

      if (!existingLevel) {
        await prisma.level.create({
          data: level
        });
        console.log(`✅ レベル「${level.displayName}」を作成しました`);
      } else {
        console.log(`ℹ️  レベル「${level.displayName}」は既に存在します`);
      }
    }

    // 2. 既存コンテンツのlevelフィールドを更新
    console.log('\n📝 既存コンテンツのレベル表示名を更新中...');
    
    // 各レベルコードに対応するコンテンツを更新
    const levelMappings = {
      'beginner': '中級前半',
      'intermediate': '中級レベル',
      'advanced': '上級レベル'
    };

    for (const [levelCode, displayName] of Object.entries(levelMappings)) {
      const updateResult = await prisma.content.updateMany({
        where: { levelCode },
        data: { level: displayName }
      });
      
      if (updateResult.count > 0) {
        console.log(`✅ ${updateResult.count}件のコンテンツのレベル表示名を「${displayName}」に更新しました`);
      }
    }

    // 3. 統計情報の表示
    console.log('\n📊 移行結果の統計:');
    const levels = await prisma.level.findMany({
      include: {
        _count: {
          select: { contents: true }
        }
      },
      orderBy: { orderIndex: 'asc' }
    });

    for (const level of levels) {
      console.log(`- ${level.displayName}: ${level._count.contents}件のコンテンツ`);
    }

    console.log('\n✨ 移行が正常に完了しました！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプトの実行
migrate().catch((error) => {
  console.error('移行スクリプトの実行に失敗しました:', error);
  process.exit(1);
});
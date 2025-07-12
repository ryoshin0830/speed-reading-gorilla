const { PrismaClient } = require('@prisma/client');

async function setupLevelTable() {
  // Vercel環境変数から接続文字列を取得
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    console.log('Setting up Level table...');

    // Levelテーブルが存在するかチェック
    try {
      const existingLevels = await prisma.level.count();
      console.log(`Found ${existingLevels} existing levels`);
      
      if (existingLevels > 0) {
        console.log('Level table already has data. Skipping initialization.');
        return;
      }
    } catch (error) {
      console.log('Level table might not exist. Will create it with schema push.');
    }

    // 初期レベルデータを作成
    console.log('Creating initial levels...');
    const levels = [
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

    // レベルを作成
    for (const level of levels) {
      try {
        await prisma.level.create({
          data: level
        });
        console.log(`✓ Created level: ${level.id} - ${level.displayName}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Level ${level.id} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('\nLevel table setup completed successfully!');
    console.log('You can now use the level management features.');
  } catch (error) {
    console.error('Error setting up Level table:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 実行
setupLevelTable();
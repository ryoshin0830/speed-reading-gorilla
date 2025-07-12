const { PrismaClient } = require('@prisma/client');

async function migrateWithData() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting migration with existing data...');

    // 1. まずLevelテーブルを作成（存在しない場合）
    console.log('Creating Level table if not exists...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS levels (
        id VARCHAR(255) PRIMARY KEY,
        "displayName" VARCHAR(255) NOT NULL,
        "orderIndex" INTEGER NOT NULL,
        "isDefault" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. 初期レベルデータを挿入
    console.log('Inserting initial levels...');
    const levels = [
      { id: 'beginner', displayName: '中級前半', orderIndex: 1, isDefault: true },
      { id: 'intermediate', displayName: '中級レベル', orderIndex: 2, isDefault: false },
      { id: 'advanced', displayName: '上級レベル', orderIndex: 3, isDefault: false }
    ];

    for (const level of levels) {
      try {
        await prisma.$executeRaw`
          INSERT INTO levels (id, "displayName", "orderIndex", "isDefault")
          VALUES (${level.id}, ${level.displayName}, ${level.orderIndex}, ${level.isDefault})
          ON CONFLICT (id) DO NOTHING
        `;
        console.log(`✓ Level ${level.id} created or already exists`);
      } catch (error) {
        console.log(`Level ${level.id} might already exist, continuing...`);
      }
    }

    // 3. 既存のコンテンツのlevelCodeを確認して、存在しないレベルをデフォルトに更新
    console.log('Checking existing content level codes...');
    const invalidContents = await prisma.$queryRaw`
      SELECT id, "levelCode" FROM contents 
      WHERE "levelCode" NOT IN ('beginner', 'intermediate', 'advanced')
    `;
    
    if (invalidContents.length > 0) {
      console.log(`Found ${invalidContents.length} contents with invalid level codes, updating to 'beginner'...`);
      await prisma.$executeRaw`
        UPDATE contents 
        SET "levelCode" = 'beginner'
        WHERE "levelCode" NOT IN ('beginner', 'intermediate', 'advanced')
      `;
    }

    // 4. 外部キー制約を追加（存在しない場合）
    console.log('Adding foreign key constraint if not exists...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE contents 
        ADD CONSTRAINT "contents_levelCode_fkey" 
        FOREIGN KEY ("levelCode") 
        REFERENCES levels(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
      `;
      console.log('✓ Foreign key constraint added');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('Foreign key constraint already exists');
      } else {
        console.error('Error adding foreign key:', error.message);
      }
    }

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 実行
migrateWithData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateInitialLevels() {
  console.log('Starting level migration...');

  try {
    // Check if levels already exist
    const existingLevels = await prisma.level.count();
    if (existingLevels > 0) {
      console.log('Levels already exist. Skipping migration.');
      return;
    }

    // Create initial levels
    const levels = [
      { id: 'beginner', displayName: '中級前半', orderIndex: 1, isDefault: true },
      { id: 'intermediate', displayName: '中級レベル', orderIndex: 2, isDefault: false },
      { id: 'advanced', displayName: '上級レベル', orderIndex: 3, isDefault: false }
    ];

    console.log('Creating initial levels...');
    for (const level of levels) {
      await prisma.level.create({
        data: level
      });
      console.log(`Created level: ${level.id} - ${level.displayName}`);
    }

    console.log('Level migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateInitialLevels();
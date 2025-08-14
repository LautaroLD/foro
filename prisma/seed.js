import { PrismaClient } from '@prisma/client';
import { categories } from './categoriesData.js';
import { tags } from './tagsData.js';
import slugify from 'slugify';

const prisma = new PrismaClient();

const load = async () => {
  try {
    // 1. Vaciar y resetear identidades con TRUNCATE
    await prisma.$executeRaw`
      TRUNCATE TABLE "Category", "Tag" RESTART IDENTITY CASCADE
    `;
    console.log('Truncated Category and Tag, reset IDs to 1');

    // 2. Insertar datos de categorías
    await Promise.all(
      categories.map(async (category) => {
        const newCategory = await prisma.category.create({
          data: {
            name: category.name,
            slug: slugify(category.name, { lower: true, strict: true }),
          },
        });
        return newCategory;
      })
    );
    console.log('Added categories data');

    // 3. Insertar datos de etiquetas
    await Promise.all(
      tags.map(async (tag) => {
        const newTag = await prisma.tag.create({
          data: {
            name: tag.name,
            slug: slugify(tag.name, { lower: true, strict: true }),
          },
        });
        return newTag;
      })
    );
    console.log('Added tags data');
  } catch (e) {
    console.error('Error during seed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();

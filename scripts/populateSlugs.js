// scripts/populateSlugs.js
const slugify = require('slugify');
const { PrismaClient } = require('@prisma/client');

// Ajusta si tu exportación de prisma es default o nombrada
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Empezando actualización de slugs…');

  // Categories
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  console.log(`→ ${categories.length} categorías encontradas`);
  for (const { id, name } of categories) {
    const slug = slugify(name, { lower: true, strict: true });
    await prisma.category.update({ where: { id }, data: { slug } });
    console.log(`   • Category: "${name}" → "${slug}"`);
  }

  // Tags
  const tags = await prisma.tag.findMany({ select: { id: true, name: true } });
  console.log(`→ ${tags.length} tags encontradas`);
  for (const { id, name } of tags) {
    const slug = slugify(name, { lower: true, strict: true });
    await prisma.tag.update({ where: { id }, data: { slug } });
    console.log(`   • Tag: "${name}" → "${slug}"`);
  }

  console.log('✅ ¡Slugs actualizados correctamente!');
}

main()
  .catch(err => {
    console.error('❌ Error en el script:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

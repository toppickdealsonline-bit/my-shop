import { PrismaClient } from "@prisma/client";
import fs from "fs";
const prisma = new PrismaClient();

async function main() {
  const raw = fs.readFileSync(
    new URL("./products.json", import.meta.url),
    "utf8"
  );
  const products = JSON.parse(raw);
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
      },
      create: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
      },
    });
  }
  console.log("Seeded", products.length, "products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

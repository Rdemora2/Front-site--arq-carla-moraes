const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const sizes = [320, 640, 1024, 1920];
const formats = ["avif", "webp", "jpg"];

const QUALITY_SETTINGS = {
  avif: { quality: 80, effort: 6 },
  webp: { quality: 85 },
  jpg: { quality: 85, mozjpeg: true },
};

async function optimizeImage(inputPath, outputDir = null) {
  try {
    const basename = path.basename(inputPath, path.extname(inputPath));
    const dir = outputDir || path.dirname(inputPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`\n📸 Processando: ${basename}`);
    console.log("─".repeat(60));

    const metadata = await sharp(inputPath).metadata();
    console.log(
      `   Tamanho original: ${metadata.width}x${metadata.height} (${(metadata.size / 1024).toFixed(2)} KB)`
    );

    for (const size of sizes) {
      if (size > metadata.width) {
        console.log(`   ⏭️  Pulando ${size}w (maior que original)`);
        continue;
      }

      for (const format of formats) {
        const outputPath = path.join(dir, `${basename}-${size}w.${format}`);

        const imageProcessor = sharp(inputPath)
          .resize(size, null, {
            withoutEnlargement: true,
            fit: "inside",
          })
          .toFormat(format, QUALITY_SETTINGS[format]);

        await imageProcessor.toFile(outputPath);

        const stats = fs.statSync(outputPath);
        console.log(
          `   ✓ ${format.toUpperCase()} ${size}w → ${(stats.size / 1024).toFixed(2)} KB`
        );
      }
    }

    console.log(`✅ Concluído: ${basename}\n`);
  } catch (error) {
    console.error(`❌ Erro ao processar ${inputPath}:`, error.message);
  }
}

async function findImages(
  dir,
  extensions = [".jpg", ".jpeg", ".png", ".webp"]
) {
  const images = [];

  async function scan(directory) {
    const files = await readdir(directory);

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        await scan(fullPath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (
          extensions.includes(ext) &&
          !file.includes("-320w") &&
          !file.includes("-640w") &&
          !file.includes("-1024w") &&
          !file.includes("-1920w")
        ) {
          images.push(fullPath);
        }
      }
    }
  }

  await scan(dir);
  return images;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🖼️  OTIMIZADOR DE IMAGENS - Carla Moraes Site
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Uso:
  node scripts/optimize-images.js <caminho>
  node scripts/optimize-images.js --all
  node scripts/optimize-images.js --hero

Exemplos:
  # Otimizar uma imagem específica
  node scripts/optimize-images.js public/images/components/hero/Frances-hero.webp

  # Otimizar todas as imagens do hero
  node scripts/optimize-images.js --hero

  # Otimizar todas as imagens do projeto
  node scripts/optimize-images.js --all

  # Otimizar pasta específica
  node scripts/optimize-images.js public/images/projects/

Formatos gerados: AVIF, WebP, JPG
Tamanhos: 320w, 640w, 1024w, 1920w
`);
    process.exit(0);
  }

  const target = args[0];

  if (target === "--all") {
    console.log("🚀 Otimizando TODAS as imagens do projeto...\n");
    const images = await findImages("public/images");
    console.log(`📊 Encontradas ${images.length} imagens para processar\n`);

    for (const image of images) {
      await optimizeImage(image);
    }
  } else if (target === "--hero") {
    console.log("🚀 Otimizando imagens do Hero...\n");
    const heroPath = "public/images/components/hero";
    if (fs.existsSync(heroPath)) {
      const images = await findImages(heroPath);
      console.log(`📊 Encontradas ${images.length} imagens no Hero\n`);

      for (const image of images) {
        await optimizeImage(image);
      }
    } else {
      console.error(`❌ Pasta não encontrada: ${heroPath}`);
      process.exit(1);
    }
  } else if (target === "--projects") {
    console.log("🚀 Otimizando imagens dos Projetos...\n");
    const projectsPath = "public/images/projects";
    if (fs.existsSync(projectsPath)) {
      const images = await findImages(projectsPath);
      console.log(`📊 Encontradas ${images.length} imagens em Projetos\n`);

      for (const image of images) {
        await optimizeImage(image);
      }
    } else {
      console.error(`❌ Pasta não encontrada: ${projectsPath}`);
      process.exit(1);
    }
  } else {
    if (fs.existsSync(target)) {
      const stats = fs.statSync(target);

      if (stats.isDirectory()) {
        console.log(`🚀 Otimizando imagens da pasta: ${target}\n`);
        const images = await findImages(target);
        console.log(`📊 Encontradas ${images.length} imagens\n`);

        for (const image of images) {
          await optimizeImage(image);
        }
      } else {
        await optimizeImage(target);
      }
    } else {
      console.error(`❌ Arquivo ou pasta não encontrada: ${target}`);
      process.exit(1);
    }
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log("✨ OTIMIZAÇÃO CONCLUÍDA COM SUCESSO!");
  console.log("═".repeat(60));
  console.log(`
📊 Próximos passos:
1. Verifique as imagens geradas em cada pasta
2. Atualize os componentes para usar OptimizedImage
3. Teste o carregamento em diferentes dispositivos
`);
}

main().catch(console.error);

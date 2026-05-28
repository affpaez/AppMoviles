import { PrismaClient, Rol } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpiando datos existentes...')
  await prisma.itemExtra.deleteMany()
  await prisma.itemPedido.deleteMany()
  await prisma.pago.deleteMany()
  await prisma.tarjeta.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.descuento.deleteMany()
  await prisma.extra.deleteMany()
  await prisma.ingrediente.deleteMany()
  await prisma.producto.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.usuario.deleteMany()

  console.log('Creando usuario admin...')
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin Cafetería',
      correo: 'admin@cafeteria.com',
      contrasena: await bcrypt.hash('admin123', 10),
      rol: Rol.ADMIN,
    },
  })
  console.log(`  Admin: ${admin.correo} / admin123`)

  const estudiante = await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez',
      correo: 'juan@correo.com',
      celular: '3001234567',
      contrasena: await bcrypt.hash('123456', 10),
      rol: Rol.ESTUDIANTE,
    },
  })
  console.log(`  Estudiante: ${estudiante.correo} / 123456`)

  console.log('Creando categorías...')
  const categorias = await Promise.all([
    prisma.categoria.create({ data: { nombre: 'Cafés' } }),
    prisma.categoria.create({ data: { nombre: 'Bebidas' } }),
    prisma.categoria.create({ data: { nombre: 'Sándwiches' } }),
    prisma.categoria.create({ data: { nombre: 'Repostería' } }),
    prisma.categoria.create({ data: { nombre: 'Desayunos' } }),
  ])
  const [cafeCat, bebidasCat, sandwichesCat, reposteriaCat, desayunosCat] = categorias

  console.log('Creando productos con ingredientes y extras...')

  // --- CAFÉS ---
  await prisma.producto.create({
    data: {
      nombre: 'Café Americano',
      descripcion: 'Café negro clásico preparado con granos 100% colombianos',
      precio: 3500,
      disponible: true,
      esPopular: true,
      calorias: 5,
      gramos: 250,
      proteinas: 0,
      carbohidratos: 1,
      grasas: 0,
      categoriaId: cafeCat.id,
      ingredientes: { create: [{ nombre: 'Café molido' }, { nombre: 'Agua caliente' }] },
      extras: {
        create: [
          { nombre: 'Leche entera', precio: 1000 },
          { nombre: 'Leche deslactosada', precio: 1000 },
          { nombre: 'Crema batida', precio: 1500 },
          { nombre: 'Jarabe de vainilla', precio: 800 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Cappuccino',
      descripcion: 'Espresso con leche vaporizada y espuma cremosa',
      precio: 5500,
      disponible: true,
      esPopular: true,
      esProductoDelDia: true,
      calorias: 120,
      gramos: 300,
      proteinas: 6,
      carbohidratos: 12,
      grasas: 5,
      categoriaId: cafeCat.id,
      ingredientes: { create: [{ nombre: 'Espresso' }, { nombre: 'Leche vaporizada' }, { nombre: 'Espuma de leche' }] },
      extras: {
        create: [
          { nombre: 'Shot extra de espresso', precio: 1200 },
          { nombre: 'Canela en polvo', precio: 500 },
          { nombre: 'Chocolate rallado', precio: 800 },
          { nombre: 'Leche de almendras', precio: 1500 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Latte',
      descripcion: 'Espresso suave con abundante leche cremosa',
      precio: 5200,
      disponible: true,
      esPopular: true,
      calorias: 150,
      gramos: 350,
      proteinas: 8,
      carbohidratos: 14,
      grasas: 6,
      categoriaId: cafeCat.id,
      ingredientes: { create: [{ nombre: 'Espresso' }, { nombre: 'Leche cremosa' }] },
      extras: {
        create: [
          { nombre: 'Jarabe de caramelo', precio: 800 },
          { nombre: 'Jarabe de avellana', precio: 800 },
          { nombre: 'Leche de soya', precio: 1500 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Mocha',
      descripcion: 'Espresso con chocolate y leche, cubierto con crema batida',
      precio: 6200,
      disponible: true,
      calorias: 250,
      gramos: 350,
      proteinas: 7,
      carbohidratos: 30,
      grasas: 12,
      categoriaId: cafeCat.id,
      ingredientes: { create: [{ nombre: 'Espresso' }, { nombre: 'Chocolate' }, { nombre: 'Leche' }, { nombre: 'Crema batida' }] },
      extras: { create: [{ nombre: 'Malvaviscos', precio: 1200 }, { nombre: 'Chispas de chocolate', precio: 800 }] },
    },
  })

  // --- BEBIDAS ---
  await prisma.producto.create({
    data: {
      nombre: 'Jugo de Naranja Natural',
      descripcion: 'Jugo de naranja recién exprimido',
      precio: 4000,
      disponible: true,
      esPopular: true,
      calorias: 110,
      gramos: 350,
      proteinas: 2,
      carbohidratos: 26,
      grasas: 0,
      categoriaId: bebidasCat.id,
      ingredientes: { create: [{ nombre: 'Naranjas naturales' }] },
      extras: { create: [{ nombre: 'Jugo de zanahoria', precio: 1000 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Limonada Natural',
      descripcion: 'Limonada fresca con un toque de hierbabuena',
      precio: 3800,
      disponible: true,
      calorias: 70,
      gramos: 350,
      proteinas: 0,
      carbohidratos: 18,
      grasas: 0,
      categoriaId: bebidasCat.id,
      ingredientes: { create: [{ nombre: 'Limón' }, { nombre: 'Hierbabuena' }, { nombre: 'Azúcar' }] },
      extras: { create: [{ nombre: 'Jengibre', precio: 800 }, { nombre: 'Miel', precio: 1000 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Chocolate Caliente',
      descripcion: 'Chocolate caliente cremoso con leche',
      precio: 4800,
      disponible: true,
      calorias: 280,
      gramos: 300,
      proteinas: 8,
      carbohidratos: 35,
      grasas: 12,
      categoriaId: bebidasCat.id,
      ingredientes: { create: [{ nombre: 'Chocolate' }, { nombre: 'Leche' }, { nombre: 'Crema' }] },
      extras: { create: [{ nombre: 'Malvaviscos', precio: 1000 }, { nombre: 'Canela', precio: 500 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Agua de Coco',
      descripcion: 'Agua de coco natural bien fría',
      precio: 3500,
      disponible: true,
      calorias: 45,
      gramos: 330,
      proteinas: 0,
      carbohidratos: 9,
      grasas: 0,
      categoriaId: bebidasCat.id,
      ingredientes: { create: [{ nombre: 'Agua de coco natural' }] },
      extras: {},
    },
  })

  // --- SÁNDWICHES ---
  await prisma.producto.create({
    data: {
      nombre: 'Sándwich de Pollo',
      descripcion: 'Pechuga de pollo desmechada con lechuga, tomate y mayonesa en pan artesanal',
      precio: 8500,
      disponible: true,
      esPopular: true,
      calorias: 420,
      gramos: 280,
      proteinas: 28,
      carbohidratos: 35,
      grasas: 18,
      categoriaId: sandwichesCat.id,
      ingredientes: {
        create: [
          { nombre: 'Pan artesanal' },
          { nombre: 'Pechuga de pollo' },
          { nombre: 'Lechuga' },
          { nombre: 'Tomate' },
          { nombre: 'Mayonesa' },
        ],
      },
      extras: {
        create: [
          { nombre: 'Queso mozzarella', precio: 1500 },
          { nombre: 'Tocineta', precio: 2000 },
          { nombre: 'Aguacate', precio: 1500 },
          { nombre: 'Huevo', precio: 1000 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Sándwich Vegetariano',
      descripcion: 'Pan integral con queso fresco, aguacate, pepino, zanahoria y aderezo de yogur',
      precio: 7800,
      disponible: true,
      calorias: 320,
      gramos: 250,
      proteinas: 14,
      carbohidratos: 38,
      grasas: 14,
      categoriaId: sandwichesCat.id,
      ingredientes: {
        create: [
          { nombre: 'Pan integral' },
          { nombre: 'Queso fresco' },
          { nombre: 'Aguacate' },
          { nombre: 'Pepino' },
          { nombre: 'Zanahoria' },
          { nombre: 'Aderezo de yogur' },
        ],
      },
      extras: { create: [{ nombre: 'Huevo', precio: 1000 }, { nombre: 'Hummus', precio: 1500 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Sándwich Club',
      descripcion: 'Triple capa con pavo, tocineta, lechuga, tomate y mayonesa',
      precio: 9500,
      disponible: true,
      calorias: 520,
      gramos: 320,
      proteinas: 32,
      carbohidratos: 40,
      grasas: 22,
      categoriaId: sandwichesCat.id,
      ingredientes: {
        create: [
          { nombre: 'Pan tostado' },
          { nombre: 'Pavo' },
          { nombre: 'Tocineta' },
          { nombre: 'Lechuga' },
          { nombre: 'Tomate' },
          { nombre: 'Mayonesa' },
        ],
      },
      extras: { create: [{ nombre: 'Queso suizo', precio: 1500 }, { nombre: 'Papas', precio: 2000 }] },
    },
  })

  // --- REPOSTERÍA ---
  await prisma.producto.create({
    data: {
      nombre: 'Croissant de Mantequilla',
      descripcion: 'Croissant hojaldrado horneado diariamente',
      precio: 3200,
      disponible: true,
      esPopular: true,
      calorias: 230,
      gramos: 80,
      proteinas: 5,
      carbohidratos: 25,
      grasas: 13,
      categoriaId: reposteriaCat.id,
      ingredientes: { create: [{ nombre: 'Masa hojaldrada' }, { nombre: 'Mantequilla' }] },
      extras: { create: [{ nombre: 'Mermelada de fresa', precio: 800 }, { nombre: 'Crema de avellanas', precio: 1200 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Brownie de Chocolate',
      descripcion: 'Brownie denso y húmedo con trozos de chocolate',
      precio: 3800,
      disponible: true,
      esPopular: true,
      calorias: 350,
      gramos: 100,
      proteinas: 4,
      carbohidratos: 42,
      grasas: 18,
      categoriaId: reposteriaCat.id,
      ingredientes: { create: [{ nombre: 'Chocolate' }, { nombre: 'Harina' }, { nombre: 'Huevo' }, { nombre: 'Mantequilla' }] },
      extras: { create: [{ nombre: 'Helado de vainilla', precio: 2000 }, { nombre: 'Crema batida', precio: 1500 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Pastel de Zanahoria',
      descripcion: 'Pastel esponjoso de zanahoria con frosting de queso crema',
      precio: 4500,
      disponible: true,
      calorias: 380,
      gramos: 120,
      proteinas: 5,
      carbohidratos: 45,
      grasas: 20,
      categoriaId: reposteriaCat.id,
      ingredientes: { create: [{ nombre: 'Zanahoria' }, { nombre: 'Harina' }, { nombre: 'Queso crema' }, { nombre: 'Nueces' }] },
      extras: {},
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Galleta con Chispas de Chocolate',
      descripcion: 'Galleta grande y suave con chispas de chocolate',
      precio: 2500,
      disponible: true,
      calorias: 200,
      gramos: 60,
      proteinas: 3,
      carbohidratos: 28,
      grasas: 10,
      categoriaId: reposteriaCat.id,
      ingredientes: { create: [{ nombre: 'Masa de galleta' }, { nombre: 'Chispas de chocolate' }] },
      extras: {},
    },
  })

  // --- DESAYUNOS ---
  await prisma.producto.create({
    data: {
      nombre: 'Huevos Revueltos',
      descripcion: 'Huevos revueltos con pan tostado y mantequilla',
      precio: 6500,
      disponible: true,
      calorias: 340,
      gramos: 220,
      proteinas: 20,
      carbohidratos: 25,
      grasas: 16,
      categoriaId: desayunosCat.id,
      ingredientes: { create: [{ nombre: 'Huevos' }, { nombre: 'Pan' }, { nombre: 'Mantequilla' }, { nombre: 'Sal' }] },
      extras: {
        create: [
          { nombre: 'Tocineta', precio: 2000 },
          { nombre: 'Queso', precio: 1500 },
          { nombre: 'Jugo de naranja', precio: 3000 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Arepa con Queso',
      descripcion: 'Arepa blanca asada con queso mozzarella derretido',
      precio: 5000,
      disponible: true,
      esPopular: true,
      calorias: 290,
      gramos: 180,
      proteinas: 12,
      carbohidratos: 30,
      grasas: 14,
      categoriaId: desayunosCat.id,
      ingredientes: { create: [{ nombre: 'Harina de maíz' }, { nombre: 'Queso mozzarella' }, { nombre: 'Mantequilla' }] },
      extras: { create: [{ nombre: 'Suero', precio: 1000 }, { nombre: 'Huevo', precio: 1500 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Pan con Huevo y Salchicha',
      descripcion: 'Pan tostado con huevo frito y salchicha',
      precio: 7200,
      disponible: true,
      calorias: 450,
      gramos: 250,
      proteinas: 22,
      carbohidratos: 30,
      grasas: 24,
      categoriaId: desayunosCat.id,
      ingredientes: { create: [{ nombre: 'Pan' }, { nombre: 'Huevos' }, { nombre: 'Salchicha' }, { nombre: 'Mantequilla' }] },
      extras: { create: [{ nombre: 'Queso', precio: 1500 }, { nombre: 'Frijoles', precio: 2000 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Yogur con Granola y Frutas',
      descripcion: 'Yogur natural con granola casera, fresas y banano',
      precio: 5800,
      disponible: true,
      calorias: 280,
      gramos: 250,
      proteinas: 10,
      carbohidratos: 40,
      grasas: 8,
      categoriaId: desayunosCat.id,
      ingredientes: { create: [{ nombre: 'Yogur natural' }, { nombre: 'Granola' }, { nombre: 'Fresas' }, { nombre: 'Banano' }] },
      extras: { create: [{ nombre: 'Miel', precio: 1000 }, { nombre: 'Almendras', precio: 1500 }] },
    },
  })

  console.log('\n✅ Seed completado exitosamente!')
  console.log(`  - ${categorias.length} categorías`)
  console.log(`  - 17 productos`)
  console.log(`  - 2 usuarios (admin@cafeteria.com / admin123, juan@correo.com / 123456)`)
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

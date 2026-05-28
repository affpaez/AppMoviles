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
      precio: 35,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
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
          { nombre: 'Leche entera', precio: 10 },
          { nombre: 'Leche deslactosada', precio: 10 },
          { nombre: 'Crema batida', precio: 15 },
          { nombre: 'Jarabe de vainilla', precio: 8 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Cappuccino',
      descripcion: 'Espresso con leche vaporizada y espuma cremosa',
      precio: 55,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
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
          { nombre: 'Shot extra de espresso', precio: 12 },
          { nombre: 'Canela en polvo', precio: 5 },
          { nombre: 'Chocolate rallado', precio: 8 },
          { nombre: 'Leche de almendras', precio: 15 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Latte',
      descripcion: 'Espresso suave con abundante leche cremosa',
      precio: 55,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
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
          { nombre: 'Jarabe de caramelo', precio: 8 },
          { nombre: 'Jarabe de avellana', precio: 8 },
          { nombre: 'Leche de soya', precio: 15 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Mocha',
      descripcion: 'Espresso con chocolate y leche, cubierto con crema batida',
      precio: 65,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=300&fit=crop',
      calorias: 250,
      gramos: 350,
      proteinas: 7,
      carbohidratos: 30,
      grasas: 12,
      categoriaId: cafeCat.id,
      ingredientes: { create: [{ nombre: 'Espresso' }, { nombre: 'Chocolate' }, { nombre: 'Leche' }, { nombre: 'Crema batida' }] },
      extras: { create: [{ nombre: 'Malvaviscos', precio: 12 }, { nombre: 'Chispas de chocolate', precio: 8 }] },
    },
  })

  // --- BEBIDAS ---
  await prisma.producto.create({
    data: {
      nombre: 'Jugo de Naranja Natural',
      descripcion: 'Jugo de naranja recién exprimido',
      precio: 40,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop',
      esPopular: true,
      esProductoDelDia: true,
      calorias: 110,
      gramos: 350,
      proteinas: 2,
      carbohidratos: 26,
      grasas: 0,
      categoriaId: bebidasCat.id,
      ingredientes: { create: [{ nombre: 'Naranjas naturales' }] },
      extras: { create: [{ nombre: 'Jugo de zanahoria', precio: 10 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Limonada Natural',
      descripcion: 'Limonada fresca con un toque de hierbabuena',
      precio: 38,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop',
      calorias: 70,
      gramos: 350,
      proteinas: 0,
      carbohidratos: 18,
      grasas: 0,
      categoriaId: bebidasCat.id,
      ingredientes: { create: [{ nombre: 'Limón' }, { nombre: 'Hierbabuena' }, { nombre: 'Azúcar' }] },
      extras: { create: [{ nombre: 'Jengibre', precio: 8 }, { nombre: 'Miel', precio: 10 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Chocolate Caliente',
      descripcion: 'Chocolate caliente cremoso con leche',
      precio: 48,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f526?w=400&h=300&fit=crop',
      calorias: 280,
      gramos: 300,
      proteinas: 8,
      carbohidratos: 35,
      grasas: 12,
      categoriaId: bebidasCat.id,
      ingredientes: { create: [{ nombre: 'Chocolate' }, { nombre: 'Leche' }, { nombre: 'Crema' }] },
      extras: { create: [{ nombre: 'Malvaviscos', precio: 10 }, { nombre: 'Canela', precio: 5 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Agua de Coco',
      descripcion: 'Agua de coco natural bien fría',
      precio: 35,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1527685891950-74fbd6a43a50?w=400&h=300&fit=crop',
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
      precio: 85,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1606755962773-d3245690a171?w=400&h=300&fit=crop',
      esPopular: true,
      esProductoDelDia: true,
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
          { nombre: 'Queso mozzarella', precio: 15 },
          { nombre: 'Tocineta', precio: 20 },
          { nombre: 'Aguacate', precio: 15 },
          { nombre: 'Huevo', precio: 10 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Sándwich Vegetariano',
      descripcion: 'Pan integral con queso fresco, aguacate, pepino, zanahoria y aderezo de yogur',
      precio: 78,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
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
      extras: { create: [{ nombre: 'Huevo', precio: 10 }, { nombre: 'Hummus', precio: 15 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Sándwich Club',
      descripcion: 'Triple capa con pavo, tocineta, lechuga, tomate y mayonesa',
      precio: 95,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1567234669003-dce7a7c8889d?w=400&h=300&fit=crop',
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
      extras: { create: [{ nombre: 'Queso suizo', precio: 15 }, { nombre: 'Papas', precio: 20 }] },
    },
  })

  // --- REPOSTERÍA ---
  await prisma.producto.create({
    data: {
      nombre: 'Croissant de Mantequilla',
      descripcion: 'Croissant hojaldrado horneado diariamente',
      precio: 32,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop',
      esPopular: true,
      esProductoDelDia: true,
      calorias: 230,
      gramos: 80,
      proteinas: 5,
      carbohidratos: 25,
      grasas: 13,
      categoriaId: reposteriaCat.id,
      ingredientes: { create: [{ nombre: 'Masa hojaldrada' }, { nombre: 'Mantequilla' }] },
      extras: { create: [{ nombre: 'Mermelada de fresa', precio: 8 }, { nombre: 'Crema de avellanas', precio: 12 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Brownie de Chocolate',
      descripcion: 'Brownie denso y húmedo con trozos de chocolate',
      precio: 38,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
      esPopular: true,
      calorias: 350,
      gramos: 100,
      proteinas: 4,
      carbohidratos: 42,
      grasas: 18,
      categoriaId: reposteriaCat.id,
      ingredientes: { create: [{ nombre: 'Chocolate' }, { nombre: 'Harina' }, { nombre: 'Huevo' }, { nombre: 'Mantequilla' }] },
      extras: { create: [{ nombre: 'Helado de vainilla', precio: 20 }, { nombre: 'Crema batida', precio: 15 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Pastel de Zanahoria',
      descripcion: 'Pastel esponjoso de zanahoria con frosting de queso crema',
      precio: 45,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',
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
      precio: 25,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1499636136210-6c1e5e5a8c5f?w=400&h=300&fit=crop',
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
      precio: 65,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
      calorias: 340,
      gramos: 220,
      proteinas: 20,
      carbohidratos: 25,
      grasas: 16,
      categoriaId: desayunosCat.id,
      ingredientes: { create: [{ nombre: 'Huevos' }, { nombre: 'Pan' }, { nombre: 'Mantequilla' }, { nombre: 'Sal' }] },
      extras: {
        create: [
          { nombre: 'Tocineta', precio: 20 },
          { nombre: 'Queso', precio: 15 },
          { nombre: 'Jugo de naranja', precio: 30 },
        ],
      },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Arepa con Queso',
      descripcion: 'Arepa blanca asada con queso mozzarella derretido',
      precio: 50,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&h=300&fit=crop',
      esPopular: true,
      esProductoDelDia: true,
      calorias: 290,
      gramos: 180,
      proteinas: 12,
      carbohidratos: 30,
      grasas: 14,
      categoriaId: desayunosCat.id,
      ingredientes: { create: [{ nombre: 'Harina de maíz' }, { nombre: 'Queso mozzarella' }, { nombre: 'Mantequilla' }] },
      extras: { create: [{ nombre: 'Suero', precio: 10 }, { nombre: 'Huevo', precio: 15 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Pan con Huevo y Salchicha',
      descripcion: 'Pan tostado con huevo frito y salchicha',
      precio: 72,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1603073086760-0e6f5b9e84c3?w=400&h=300&fit=crop',
      calorias: 450,
      gramos: 250,
      proteinas: 22,
      carbohidratos: 30,
      grasas: 24,
      categoriaId: desayunosCat.id,
      ingredientes: { create: [{ nombre: 'Pan' }, { nombre: 'Huevos' }, { nombre: 'Salchicha' }, { nombre: 'Mantequilla' }] },
      extras: { create: [{ nombre: 'Queso', precio: 15 }, { nombre: 'Frijoles', precio: 20 }] },
    },
  })

  await prisma.producto.create({
    data: {
      nombre: 'Yogur con Granola y Frutas',
      descripcion: 'Yogur natural con granola casera, fresas y banano',
      precio: 58,
      disponible: true,
      imagenUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
      calorias: 280,
      gramos: 250,
      proteinas: 10,
      carbohidratos: 40,
      grasas: 8,
      categoriaId: desayunosCat.id,
      ingredientes: { create: [{ nombre: 'Yogur natural' }, { nombre: 'Granola' }, { nombre: 'Fresas' }, { nombre: 'Banano' }] },
      extras: { create: [{ nombre: 'Miel', precio: 10 }, { nombre: 'Almendras', precio: 15 }] },
    },
  })

  console.log('Creando descuentos...')
  await prisma.descuento.create({
    data: {
      codigo: 'BIENVENIDO',
      porcentaje: 10,
      activo: true,
    },
  })
  console.log(`  Descuento: BIENVENIDO (10%)`)

  const fechaExp = new Date()
  fechaExp.setDate(fechaExp.getDate() + 30)
  await prisma.descuento.create({
    data: {
      codigo: 'DESCUENTO10',
      porcentaje: 15,
      activo: true,
      fechaExpiracion: fechaExp,
    },
  })
  console.log(`  Descuento: DESCUENTO10 (15%, expira ${fechaExp.toLocaleDateString()})`)

  console.log('Creando tarjetas de ejemplo...')
  await prisma.tarjeta.create({
    data: {
      usuarioId: estudiante.id,
      ultimosDigitos: '1234',
      nombreTitular: 'Juan Pérez',
      fechaExp: '12/26',
      marca: 'Visa',
    },
  })
  await prisma.tarjeta.create({
    data: {
      usuarioId: estudiante.id,
      ultimosDigitos: '5678',
      nombreTitular: 'Juan Pérez',
      fechaExp: '10/27',
      marca: 'Mastercard',
      pagoPorDefecto: true,
    },
  })
  console.log(`  - 2 tarjetas para ${estudiante.correo} (Visa ****1234, Mastercard ****5678 [defecto])`)

  console.log('\n✅ Seed completado exitosamente!')
  console.log(`  - ${categorias.length} categorías`)
  console.log(`  - 17 productos`)
  console.log(`  - 2 usuarios (admin@cafeteria.com / admin123, juan@correo.com / 123456)`)
  console.log(`  - 2 descuentos (BIENVENIDO 10%, DESCUENTO10 15%)`)
  console.log(`  - 2 tarjetas para juan@correo.com`)
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

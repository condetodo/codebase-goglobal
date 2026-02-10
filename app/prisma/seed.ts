import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 12);

  // --- Admin User ---
  const admin = await prisma.user.upsert({
    where: { email: "admin" },
    update: { role: "ADMIN" },
    create: {
      name: "Admin",
      email: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("User seeded:", admin.email);

  // --- Shows ---
  const showsData = [
    { name: "Dark Secrets", description: "Thriller psicológico sobre secretos familiares" },
    { name: "City Lights", description: "Drama urbano sobre la vida en la gran ciudad" },
    { name: "The Last Journey", description: "Película de aventura y drama" },
    { name: "Wild Nature", description: "Documental sobre la vida salvaje" },
    { name: "Midnight Stories", description: "Miniserie de suspenso" },
    { name: "Ocean Depths", description: "Serie documental sobre el océano" },
    { name: "Desert Dreams", description: "Película dramática ambientada en el desierto" },
  ];

  const shows: Record<string, string> = {};
  for (const s of showsData) {
    const existing = await prisma.show.findFirst({ where: { name: s.name } });
    if (existing) {
      shows[s.name] = existing.id;
    } else {
      const show = await prisma.show.create({
        data: { name: s.name, description: s.description },
      });
      shows[s.name] = show.id;
    }
  }
  console.log("Shows seeded:", Object.keys(shows).length);

  // --- Vendors ---
  const vendorsData = [
    { voiceTalent: "Estudio Alpha", email: "alpha@studio.com", vendorType: "Studio" },
    { voiceTalent: "Voice Studio Beta", email: "beta@voicestudio.com", vendorType: "Studio" },
    { voiceTalent: "Sound Masters", email: "info@soundmasters.com", vendorType: "Studio" },
    { voiceTalent: "Adaptation Pro", email: "contact@adaptationpro.com", vendorType: "Scriptwriter" },
    { voiceTalent: "Voice Experts", email: "hello@voiceexperts.com", vendorType: "Voice Talent" },
    { voiceTalent: "Audio Studio", email: "studio@audiostudio.com", vendorType: "Studio" },
    { voiceTalent: "QA Specialists", email: "qa@specialists.com", vendorType: "QA" },
  ];

  const vendors: Record<string, string> = {};
  for (const v of vendorsData) {
    const vendor = await prisma.vendor.upsert({
      where: { email: v.email },
      update: {},
      create: {
        voiceTalent: v.voiceTalent,
        email: v.email,
        vendorType: v.vendorType,
        language: "Spanish LA",
        active: true,
      },
    });
    vendors[v.voiceTalent] = vendor.id;
  }
  console.log("Vendors seeded:", Object.keys(vendors).length);

  // --- Orders ---
  const ordersData = [
    {
      orderNumber: "ORD-2024-001",
      productType: "miniserie",
      showName: "Dark Secrets",
      language: "es-AR",
      status: "en_proceso",
      episodeCount: 6,
      createdBy: "María González",
      createdAt: new Date("2024-01-15T10:30:00Z"),
    },
    {
      orderNumber: "ORD-2024-002",
      productType: "serie",
      showName: "City Lights",
      language: "es-MX",
      status: "completada",
      episodeCount: 12,
      createdBy: "Carlos Mendoza",
      createdAt: new Date("2024-01-10T14:20:00Z"),
    },
    {
      orderNumber: "ORD-2024-003",
      productType: "pelicula",
      showName: "The Last Journey",
      language: "es-AR",
      status: "pendiente",
      episodeCount: 1,
      createdBy: "Ana Rodríguez",
      createdAt: new Date("2024-01-20T09:15:00Z"),
    },
    {
      orderNumber: "ORD-2024-004",
      productType: "documental",
      showName: "Wild Nature",
      language: "es-AR",
      status: "en_proceso",
      episodeCount: 8,
      createdBy: "María González",
      createdAt: new Date("2024-01-18T16:45:00Z"),
    },
    {
      orderNumber: "ORD-2024-005",
      productType: "serie",
      showName: "City Lights",
      language: "es-MX",
      status: "en_proceso",
      episodeCount: 10,
      createdBy: "Carlos Mendoza",
      createdAt: new Date("2024-01-22T11:00:00Z"),
    },
    {
      orderNumber: "ORD-2024-006",
      productType: "miniserie",
      showName: "Midnight Stories",
      language: "es-AR",
      status: "cancelada",
      episodeCount: 4,
      createdBy: "Ana Rodríguez",
      createdAt: new Date("2024-01-12T13:30:00Z"),
    },
    {
      orderNumber: "ORD-2024-007",
      productType: "serie",
      showName: "Ocean Depths",
      language: "es-AR",
      status: "pendiente",
      episodeCount: 0,
      createdBy: "María González",
      createdAt: new Date("2024-01-25T08:20:00Z"),
    },
    {
      orderNumber: "ORD-2024-008",
      productType: "pelicula",
      showName: "Desert Dreams",
      language: "es-MX",
      status: "en_proceso",
      episodeCount: 1,
      createdBy: "Carlos Mendoza",
      createdAt: new Date("2024-01-19T15:10:00Z"),
    },
  ];

  const orders: Record<string, string> = {};
  for (const o of ordersData) {
    const order = await prisma.order.upsert({
      where: { orderNumber: o.orderNumber },
      update: {},
      create: {
        orderNumber: o.orderNumber,
        productType: o.productType,
        showId: shows[o.showName],
        language: o.language,
        status: o.status,
        episodeCount: o.episodeCount,
        createdBy: o.createdBy,
        createdAt: o.createdAt,
      },
    });
    orders[o.orderNumber] = order.id;
  }
  console.log("Orders seeded:", Object.keys(orders).length);

  // --- Episodes ---
  interface EpisodeSeed {
    orderId: string;
    episodeNumber: number;
    title: string;
    duration: number;
    status: string;
    showName: string;
    assignedVendors: { vendorName: string; phase: string; minutesWorked: number }[];
  }

  const episodesData: EpisodeSeed[] = [
    // ORD-2024-001 (Dark Secrets) - 6 episodes
    { orderId: orders["ORD-2024-001"], episodeNumber: 1, title: "Dark Secrets - Episodio 1", duration: 45, status: "en_produccion", showName: "Dark Secrets", assignedVendors: [
      { vendorName: "Estudio Alpha", phase: "adaptación", minutesWorked: 45 },
      { vendorName: "Voice Studio Beta", phase: "adaptación", minutesWorked: 42 },
    ]},
    { orderId: orders["ORD-2024-001"], episodeNumber: 2, title: "Dark Secrets - Episodio 2", duration: 48, status: "en_produccion", showName: "Dark Secrets", assignedVendors: [
      { vendorName: "Estudio Alpha", phase: "adaptación", minutesWorked: 48 },
    ]},
    { orderId: orders["ORD-2024-001"], episodeNumber: 3, title: "Dark Secrets - Episodio 3", duration: 45, status: "pendiente", showName: "Dark Secrets", assignedVendors: [] },
    { orderId: orders["ORD-2024-001"], episodeNumber: 4, title: "Dark Secrets - Episodio 4", duration: 46, status: "pendiente", showName: "Dark Secrets", assignedVendors: [] },
    { orderId: orders["ORD-2024-001"], episodeNumber: 5, title: "Dark Secrets - Episodio 5", duration: 44, status: "pendiente", showName: "Dark Secrets", assignedVendors: [] },
    { orderId: orders["ORD-2024-001"], episodeNumber: 6, title: "Dark Secrets - Episodio 6", duration: 47, status: "pendiente", showName: "Dark Secrets", assignedVendors: [] },

    // ORD-2024-002 (City Lights) - 12 episodes
    { orderId: orders["ORD-2024-002"], episodeNumber: 1, title: "City Lights - Episodio 1", duration: 22, status: "completado", showName: "City Lights", assignedVendors: [
      { vendorName: "Sound Masters", phase: "adaptación", minutesWorked: 22 },
      { vendorName: "Adaptation Pro", phase: "adaptación", minutesWorked: 20 },
      { vendorName: "Voice Experts", phase: "voice recording", minutesWorked: 25 },
      { vendorName: "Audio Studio", phase: "sound editing", minutesWorked: 22 },
      { vendorName: "QA Specialists", phase: "QA", minutesWorked: 22 },
    ]},
    { orderId: orders["ORD-2024-002"], episodeNumber: 2, title: "City Lights - Episodio 2", duration: 22, status: "completado", showName: "City Lights", assignedVendors: [
      { vendorName: "Sound Masters", phase: "adaptación", minutesWorked: 22 },
      { vendorName: "Adaptation Pro", phase: "adaptación", minutesWorked: 21 },
    ]},
    { orderId: orders["ORD-2024-002"], episodeNumber: 3, title: "City Lights - Episodio 3", duration: 22, status: "completado", showName: "City Lights", assignedVendors: [
      { vendorName: "Sound Masters", phase: "adaptación", minutesWorked: 22 },
    ]},
    { orderId: orders["ORD-2024-002"], episodeNumber: 4, title: "City Lights - Episodio 4", duration: 22, status: "en_produccion", showName: "City Lights", assignedVendors: [
      { vendorName: "Sound Masters", phase: "adaptación", minutesWorked: 22 },
      { vendorName: "Adaptation Pro", phase: "adaptación", minutesWorked: 20 },
      { vendorName: "Voice Experts", phase: "voice recording", minutesWorked: 24 },
    ]},
    { orderId: orders["ORD-2024-002"], episodeNumber: 5, title: "City Lights - Episodio 5", duration: 22, status: "en_produccion", showName: "City Lights", assignedVendors: [
      { vendorName: "Sound Masters", phase: "adaptación", minutesWorked: 22 },
    ]},
    { orderId: orders["ORD-2024-002"], episodeNumber: 6, title: "City Lights - Episodio 6", duration: 22, status: "pendiente", showName: "City Lights", assignedVendors: [] },
    { orderId: orders["ORD-2024-002"], episodeNumber: 7, title: "City Lights - Episodio 7", duration: 22, status: "pendiente", showName: "City Lights", assignedVendors: [] },
    { orderId: orders["ORD-2024-002"], episodeNumber: 8, title: "City Lights - Episodio 8", duration: 22, status: "pendiente", showName: "City Lights", assignedVendors: [] },
    { orderId: orders["ORD-2024-002"], episodeNumber: 9, title: "City Lights - Episodio 9", duration: 22, status: "pendiente", showName: "City Lights", assignedVendors: [] },
    { orderId: orders["ORD-2024-002"], episodeNumber: 10, title: "City Lights - Episodio 10", duration: 22, status: "pendiente", showName: "City Lights", assignedVendors: [] },
    { orderId: orders["ORD-2024-002"], episodeNumber: 11, title: "City Lights - Episodio 11", duration: 22, status: "pendiente", showName: "City Lights", assignedVendors: [] },
    { orderId: orders["ORD-2024-002"], episodeNumber: 12, title: "City Lights - Episodio 12", duration: 22, status: "pendiente", showName: "City Lights", assignedVendors: [] },

    // ORD-2024-003 (The Last Journey) - 1 episode
    { orderId: orders["ORD-2024-003"], episodeNumber: 1, title: "The Last Journey", duration: 120, status: "pendiente", showName: "The Last Journey", assignedVendors: [] },

    // ORD-2024-004 (Wild Nature) - 8 episodes
    { orderId: orders["ORD-2024-004"], episodeNumber: 1, title: "Wild Nature - Episodio 1", duration: 50, status: "en_produccion", showName: "Wild Nature", assignedVendors: [
      { vendorName: "Estudio Alpha", phase: "adaptación", minutesWorked: 50 },
    ]},
    { orderId: orders["ORD-2024-004"], episodeNumber: 2, title: "Wild Nature - Episodio 2", duration: 52, status: "pendiente", showName: "Wild Nature", assignedVendors: [] },
    { orderId: orders["ORD-2024-004"], episodeNumber: 3, title: "Wild Nature - Episodio 3", duration: 48, status: "pendiente", showName: "Wild Nature", assignedVendors: [] },
    { orderId: orders["ORD-2024-004"], episodeNumber: 4, title: "Wild Nature - Episodio 4", duration: 51, status: "pendiente", showName: "Wild Nature", assignedVendors: [] },
    { orderId: orders["ORD-2024-004"], episodeNumber: 5, title: "Wild Nature - Episodio 5", duration: 49, status: "pendiente", showName: "Wild Nature", assignedVendors: [] },
    { orderId: orders["ORD-2024-004"], episodeNumber: 6, title: "Wild Nature - Episodio 6", duration: 50, status: "pendiente", showName: "Wild Nature", assignedVendors: [] },
    { orderId: orders["ORD-2024-004"], episodeNumber: 7, title: "Wild Nature - Episodio 7", duration: 53, status: "pendiente", showName: "Wild Nature", assignedVendors: [] },
    { orderId: orders["ORD-2024-004"], episodeNumber: 8, title: "Wild Nature - Episodio 8", duration: 47, status: "pendiente", showName: "Wild Nature", assignedVendors: [] },

    // ORD-2024-005 (City Lights S2) - 2 of 10 episodes
    { orderId: orders["ORD-2024-005"], episodeNumber: 1, title: "City Lights - Temporada 2 - Episodio 1", duration: 22, status: "en_produccion", showName: "City Lights", assignedVendors: [
      { vendorName: "Sound Masters", phase: "adaptación", minutesWorked: 22 },
    ]},
    { orderId: orders["ORD-2024-005"], episodeNumber: 2, title: "City Lights - Temporada 2 - Episodio 2", duration: 22, status: "pendiente", showName: "City Lights", assignedVendors: [] },

    // ORD-2024-006 (Midnight Stories) - 1 of 4 episodes
    { orderId: orders["ORD-2024-006"], episodeNumber: 1, title: "Midnight Stories - Episodio 1", duration: 30, status: "cancelado", showName: "Midnight Stories", assignedVendors: [] },

    // ORD-2024-008 (Desert Dreams) - 1 episode
    { orderId: orders["ORD-2024-008"], episodeNumber: 1, title: "Desert Dreams", duration: 95, status: "en_produccion", showName: "Desert Dreams", assignedVendors: [
      { vendorName: "Estudio Alpha", phase: "adaptación", minutesWorked: 95 },
      { vendorName: "Voice Studio Beta", phase: "adaptación", minutesWorked: 90 },
      { vendorName: "Voice Experts", phase: "voice recording", minutesWorked: 100 },
    ]},
  ];

  let episodeCount = 0;
  let assignmentCount = 0;
  for (const ep of episodesData) {
    const episode = await prisma.episode.create({
      data: {
        orderId: ep.orderId,
        episodeNumber: ep.episodeNumber,
        title: ep.title,
        duration: ep.duration,
        status: ep.status,
        showId: shows[ep.showName],
      },
    });
    episodeCount++;

    // Create assignments for this episode
    for (const av of ep.assignedVendors) {
      await prisma.assignment.create({
        data: {
          episodeId: episode.id,
          vendorId: vendors[av.vendorName],
          phase: av.phase,
          minutesWorked: av.minutesWorked,
          isOverride: false,
        },
      });
      assignmentCount++;
    }
  }
  console.log(`Episodes seeded: ${episodeCount}`);
  console.log(`Assignments seeded: ${assignmentCount}`);

  // --- Order Vendor Assignments (for ORD-2024-001 and ORD-2024-002) ---
  // ORD-2024-001: adaptación + voice recording phases
  const ova1 = await prisma.orderVendorAssignment.create({
    data: {
      orderId: orders["ORD-2024-001"],
      phase: "adaptación",
      deadline: new Date("2024-03-01T23:59:00Z"),
    },
  });
  await prisma.orderVendorAssignmentItem.createMany({
    data: [
      { orderVendorAssignmentId: ova1.id, vendorId: vendors["Estudio Alpha"], estimatedMinutes: 270 },
      { orderVendorAssignmentId: ova1.id, vendorId: vendors["Voice Studio Beta"], estimatedMinutes: 270 },
    ],
  });

  const ova2 = await prisma.orderVendorAssignment.create({
    data: {
      orderId: orders["ORD-2024-001"],
      phase: "voice recording",
      deadline: new Date("2024-04-01T23:59:00Z"),
    },
  });
  await prisma.orderVendorAssignmentItem.createMany({
    data: [
      { orderVendorAssignmentId: ova2.id, vendorId: vendors["Voice Experts"], estimatedMinutes: 300 },
    ],
  });

  // ORD-2024-002: adaptación + voice recording + sound editing + QA
  const ova3 = await prisma.orderVendorAssignment.create({
    data: {
      orderId: orders["ORD-2024-002"],
      phase: "adaptación",
      deadline: new Date("2024-02-15T23:59:00Z"),
    },
  });
  await prisma.orderVendorAssignmentItem.createMany({
    data: [
      { orderVendorAssignmentId: ova3.id, vendorId: vendors["Sound Masters"], estimatedMinutes: 264 },
      { orderVendorAssignmentId: ova3.id, vendorId: vendors["Adaptation Pro"], estimatedMinutes: 264 },
    ],
  });

  const ova4 = await prisma.orderVendorAssignment.create({
    data: {
      orderId: orders["ORD-2024-002"],
      phase: "voice recording",
      deadline: new Date("2024-03-15T23:59:00Z"),
    },
  });
  await prisma.orderVendorAssignmentItem.createMany({
    data: [
      { orderVendorAssignmentId: ova4.id, vendorId: vendors["Voice Experts"], estimatedMinutes: 300 },
    ],
  });

  const ova5 = await prisma.orderVendorAssignment.create({
    data: {
      orderId: orders["ORD-2024-002"],
      phase: "sound editing",
      deadline: new Date("2024-04-01T23:59:00Z"),
    },
  });
  await prisma.orderVendorAssignmentItem.createMany({
    data: [
      { orderVendorAssignmentId: ova5.id, vendorId: vendors["Audio Studio"], estimatedMinutes: 264 },
    ],
  });

  const ova6 = await prisma.orderVendorAssignment.create({
    data: {
      orderId: orders["ORD-2024-002"],
      phase: "QA",
      deadline: new Date("2024-04-15T23:59:00Z"),
    },
  });
  await prisma.orderVendorAssignmentItem.createMany({
    data: [
      { orderVendorAssignmentId: ova6.id, vendorId: vendors["QA Specialists"], estimatedMinutes: 264 },
    ],
  });

  console.log("Order vendor assignments seeded");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

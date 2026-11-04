import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

function validate(body) {
  const name = body?.name?.trim();
  const description = body?.description?.trim() || "";
  const price = Number(body?.price);
  const stock = Number(body?.stock);
  const imageUrl = body?.imageUrl?.trim() || null;

  if (!name) return { error: "Name is required" };
  if (!Number.isFinite(price) || price <= 0) return { error: "Price must be greater than 0" };
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be a whole number, 0 or more" };

  // Price comes in as a normal amount (19.99) and is stored in cents (1999)
  return { data: { name, description, price: Math.round(price * 100), stock, imageUrl } };
}

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(products);
}

export async function POST(request) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const body = await request.json().catch(() => null);
  const result = validate(body);
  if (result.error) return Response.json({ error: result.error }, { status: 400 });

  const product = await prisma.product.create({ data: result.data });
  return Response.json(product, { status: 201 });
}

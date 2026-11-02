import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

export async function PUT(request, { params }) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => null);

  const name = body?.name?.trim();
  const description = body?.description?.trim() || "";
  const price = Number(body?.price);
  const stock = Number(body?.stock);
  const imageUrl = body?.imageUrl?.trim() || null;

  if (!name) return Response.json({ error: "Name is required" }, { status: 400 });
  if (!Number.isFinite(price) || price <= 0)
    return Response.json({ error: "Price must be greater than 0" }, { status: 400 });
  if (!Number.isInteger(stock) || stock < 0)
    return Response.json({ error: "Stock must be a whole number, 0 or more" }, { status: 400 });

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name, description, price: Math.round(price * 100), stock, imageUrl },
    });
    return Response.json(product);
  } catch {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const { id } = await params;

  const used = await prisma.orderItem.count({ where: { productId: id } });
  if (used > 0) {
    return Response.json(
      { error: "This product is in existing orders and can't be deleted. Set its stock to 0 instead." },
      { status: 409 }
    );
  }

  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ message: "Deleted" });
  } catch {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
}

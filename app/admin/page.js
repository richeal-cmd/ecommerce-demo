import Link from "next/link";

export default function AdminHome() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Admin dashboard</h1>
      <ul className="list-disc space-y-1 pl-5">
        <li><Link href="/admin/products" className="underline">Manage products</Link></li>
        <li><Link href="/admin/orders" className="underline">Validate orders (coming in Step 5)</Link></li>
      </ul>
    </div>
  );
}

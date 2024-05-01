import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div>
        <h2 className="mb-3 text-2xl font-semibold">
          Demo Links
        </h2>
        <ul className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
          <li>
            <Link href="/api/products">/api/products</Link>
          </li>
          <li>
            <Link href="/product-checker">/product-checker</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}

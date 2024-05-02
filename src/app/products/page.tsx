import { getProducts } from "@/repository/products";

export default async function Products() {
  let products = await getProducts();
  return (
    <div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="border text-left p-2">ID</th>
              <th className="border text-left p-2">Product Code</th>
              <th className="border text-left p-2">Name</th>
            </tr>
          </thead>
          <tbody>
            { products.map((product: any) => (
              <tr key={product.id}>
                  <td className="border text-left p-2">{product.product_id}</td>
                  <td className="border text-left p-2">{product.product_code}</td>
                  <td className="border text-left p-2">{product.long_descript}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}
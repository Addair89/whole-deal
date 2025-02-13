import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../AuthContext";
import SellerSideBar from "../SellerSideBar";
import { Loader } from "../../../Loader";
import { AddProductForm } from "./AddProductForm";
import { EditProductForm } from "./EditProductForm";

export const Products = () => {
  const { customer } = useContext(AuthContext);
  if (!customer) {
    return <div>No customer data available</div>;
  }

  interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    seller_id: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [showEditForm, setShowEditForm] = useState<Boolean>(false);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/sellers/delete-product/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddProduct = async (
    product: Omit<Product, "id" | "seller_id">
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sellers/add-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...product, seller_id: customer.id }),
        }
      );
      if (!response.ok) throw new Error("Failed to add product");
      const newProduct = await response.json();
      console.log(newProduct);
      setProducts([...products, newProduct.product]);
      console.log(products);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditForm = (product: Product) => {
    console.log("Edit product:", product);
    setEditProduct(product);
    setShowEditForm(true);
  };

  const handleEditProduct = async (product: Product) => {
    console.log("Updating product:", product);
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sellers/edit-product/${
          product.id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      console.log("Edit product result:", result);
      setShowEditForm(false);
      setEditProduct(null);
      // Optionally, refresh the product list or update the state
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === product.id ? product : p))
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  useEffect(() => {
    if (!customer?.id) return; // Ensure customer.id exists before making the request
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/sellers/all-products/${customer.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        console.log(data);
        setProducts(data.products || []);
        setLoading(false);
        console.log(
          "Seller All Products Dashboard Fetched products:",
          products
        );
        console.log(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <section className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-slate-950 to-white">
      <SellerSideBar />
      <div className="flex-1 p-6 ml-[15%] relative">
        <div className="flex justify-between items-center">
          <h1 className="text-6xl m-10 text-slate-50">All PRODUCTS</h1>
          <button
            onClick={toggleForm}
            className="m-10 bg-slate-950 text-slate-100 p-2 rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-950 hover:border hover:border-slate-950"
          >
            Add New Product
          </button>
        </div>
        <div className="bg-slate-100/50 p-4 rounded-md shadow-md">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="bg-slate-100 p-10">No products available.</div>
          ) : (
            <ul>
              {products.map((product) => (
                <li
                  key={product.id}
                  className="border-b bg-slate-100 p-10 flex gap-10 relative"
                >
                  <span
                    onClick={() => handleDeleteProduct(product.id)}
                    className="absolute top-0 right-0 mt-4 mr-3 w-[7rem] text-center bg-slate-950/30 text-slate-100 p-2 rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-950 hover:border hover:border-slate-950"
                  >
                    Delete
                  </span>
                  <span
                    onClick={() => handleEditForm(product)}
                    className="absolute bottom-0 right-0 mb-4 mr-3 w-[7rem] text-center bg-slate-950/30 text-slate-100 p-2 rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-950 hover:border hover:border-slate-950"
                  >
                    Edit
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-gray-700">${product.price}</p>
                  </div>
                  <p className="text-gray-600">{product.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={toggleForm}
          className="m-10 bg-slate-950 text-slate-100 p-2 rounded-lg cursor-pointer hover:bg-slate-100 hover:text-slate-950 hover:border hover:border-slate-950"
        >
          Add New Product
        </button>
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={toggleForm}
            ></div>
            <AddProductForm handleAddProduct={handleAddProduct} />
          </div>
        )}
        {showEditForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowEditForm(false)}
            ></div>
            <EditProductForm
              editProduct={editProduct}
              handleEditProduct={handleEditProduct}
            />
          </div>
        )}
      </div>
    </section>
  );
};

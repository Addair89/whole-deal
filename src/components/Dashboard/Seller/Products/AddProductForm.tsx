import React from "react";

interface Product {
  id: string;
  seller_id: string;
  name: string;
  price: number;
  description: string;
}

interface ProductFormProps {
  handleAddProduct: (product: Omit<Product, "id" | "seller_id">) => void;
}

export const AddProductForm: React.FC<ProductFormProps> = ({
  handleAddProduct,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const newProduct = {
          name: formData.get("name") as string,
          price: parseFloat(formData.get("price") as string),
          description: formData.get("description") as string,
        };
        handleAddProduct(newProduct);
      }}
      className="p-4 w-2xl bg-black/70 rounded-md shadow-md absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]"
    >
      <div>
        <label className="block text-sm font-medium text-white">Name</label>
        <input
          name="name"
          type="text"
          required
          className="mt-1 block p-2 w-full font-bold text-white bg-[#9a9a9a] rounded-md"
        />
      </div>
      <div>
        <label className="block text-md font-medium text-white">Price</label>
        <input
          name="price"
          type="number"
          step="0.01"
          required
          className="mt-1 block p-2 w-full font-bold text-white bg-[#9a9a9a] rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">
          Description
        </label>
        <textarea
          name="description"
          required
          className="mt-1 p-2 font-bold text-white block w-full bg-[#9a9a9a] rounded-md"
        ></textarea>
      </div>
      <button type="submit" className="mt-4 btn">
        Submit
      </button>
    </form>
  );
};

import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  seller_id: number;
}

interface EditProductFormProps {
  editProduct: Product | null;

  handleEditProduct: (product: Product) => void;
}

export const EditProductForm = ({
  editProduct,
  handleEditProduct,
}: EditProductFormProps) => {
  if (!editProduct) return <div>No product selected</div>;

  const [formData, setFormData] = useState<Product>({ ...editProduct });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleEditProduct(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 w-2xl bg-black/70 rounded-md shadow-md absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]"
    >
      <div>
        <label className="block text-sm font-medium text-white">Name</label>
        <input
          className="mt-1 block p-2 w-full font-bold text-white bg-[#9a9a9a] rounded-md"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">Price</label>
        <input
          className="mt-1 block p-2 w-full font-bold text-white bg-[#9a9a9a] rounded-md"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">
          Description
        </label>
        <textarea
          name="description"
          className="mt-1 block p-2 w-full font-bold text-white bg-[#9a9a9a] rounded-md"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <button className="mt-4 btn" type="submit">
        Save
      </button>
    </form>
  );
};

import React from "react";
import { Loader } from "../../../Loader";

interface Product {
  id: string;
  seller_id: string;
  name: string;
  price: number;
  description: string;
}

interface ProductFormProps {
  handleAddProduct: (product: Omit<Product, "id" | "seller_id">) => void;
  loading: boolean;
}

export const AddProductForm: React.FC<ProductFormProps> = ({
  handleAddProduct,
  loading,
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
      className="p-4 w-2xl bg-PBG-100 rounded-md shadow-PS absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]"
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-PT-100">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              className="mt-1 block p-2 w-full font-bold text-PT-100 bg-SBG-100 rounded-md"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-PT-100">
              Price
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              className="mt-1 block p-2 w-full font-bold text-PT-100 bg-SBG-100 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-PT-100">
              Description
            </label>
            <textarea
              name="description"
              required
              className="mt-1 p-2 font-bold text-PT-100 block w-full bg-SBG-100 rounded-md"
            ></textarea>
          </div>
          <button
            type="submit"
            className="mt-4 bg-SBG-100 text-PT-100 p-2 rounded-lg cursor-pointer hover:bg-DBG-100 hover:text-SBG-100 shadow-PS "
          >
            Submit
          </button>
        </>
      )}
    </form>
  );
};

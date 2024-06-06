"use server";

import { db } from "./db";

export const addProduct = async (formData: Product) => {
  const { data, error } = await db.from("products").insert([
    {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      image: formData.image,
      category: formData.category,
      stock: formData.stock,
      slug: formData.slug,
    },
  ]);
  if (error) {
    console.error("Error creating reservation:", error.message);
  } else {
    console.log("Reservation created:", data);
  }
};

export const deleteProduct = async (id: string) => {
  const { data, error } = await db.from("products").delete().eq("id", id);
  if (error) {
    console.error("Error deleting product:", error.message);
  } else {
    console.log("Product deleted:", data);
  }
};

export const addOrder = async (formData: Order) => {
  try {
    const res = await db.from("orders").insert([
      {
        customer_details: formData.customer_details,
        shipping_details: formData.shipping_details,
        amount_total: formData.amount_total,
        amount_subtotal: formData.amount_subtotal,
        status: formData.status,
      },
    ]);

    return true;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const deleteOrder = async (id: string) => {
  const { data, error } = await db.from("orders").delete().eq("id", id);
  if (error) {
    console.error("Error deleting product:", error.message);
  } else {
    console.log("Product deleted:", data);
  }
};

import api from "./api";


function normalizeProduct(product) {

  return {

    ...product,

    id: product.product_id || product.id,

    product_id: product.product_id || product.id,

    stock: product.stock_qty ?? product.stock ?? 0,

    store:
      product.store_name ||
      product.store ||
      "Local store",

    category:
      product.category_name ||
      product.category ||
      "General",

    image:
      product.image_url ||
      product.image ||
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"

  };

}





// ================= CREATE PRODUCT =================

export async function createProduct(product) {

  const response = await api.post(
    "/api/products",
    product
  );

  return response.data;

}






// ================= UPDATE PRODUCT =================

export async function updateProduct(productId, product) {

  const response = await api.patch(
    `/api/products/${productId}`,
    product
  );

  return response.data.product;

}






// ================= DELETE PRODUCT =================

export async function deleteProduct(productId) {

  const response = await api.delete(
    `/api/products/${productId}`
  );

  return response.data.product;

}






// ================= GET ALL PRODUCTS =================

export async function getProducts(storeId = null) {


  const response = await api.get(
    "/api/products",
    {

      params:
        storeId
          ? { store_id: storeId }
          : {}

    }
  );


  return response.data.map(
    normalizeProduct
  );

}






// ================= GET SINGLE PRODUCT =================

export async function getProductById(id) {


  const response = await api.get(
    `/api/products/${id}`
  );


  return normalizeProduct(
    response.data
  );

}






// ================= RESERVABLE PRODUCTS =================

export async function getReservableProducts() {


  const response = await api.get(
    "/api/products/reservable"
  );


  return response.data.map(
    normalizeProduct
  );

}






// ================= RELATED PRODUCTS =================

export async function getRelatedProducts(productId) {


  const response = await api.get(
    "/api/products"
  );


  return response.data

    .filter(
      product =>
        product.product_id !== Number(productId)
    )

    .slice(0,4)

    .map(
      normalizeProduct
    );

}






// ================= WISHLIST PRODUCTS =================

export async function getWishlistProducts() {


  const response = await api.get(
    "/api/wishlist"
  );


  return response.data.map(
    product => ({

      ...normalizeProduct(product),

      wishlist_id:
        product.wishlist_id,

      id:
        product.product_id || product.id

    })
  );

}
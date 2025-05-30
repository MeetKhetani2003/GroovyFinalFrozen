import { useProductStore } from '@/zustand/apis/ProductStore';

export const useProducts = () => {
  const {
    setProduct,
    getSingleProduct,
    createProduct,
    getPaginatedProducts,
    setProducts,
    deleteProduct,
    updateProduct,
  } = useProductStore();
  const create = async (product) => {
    try {
      const response = await createProduct(product);
      return response.data;
    } catch (error) {
      console.error('Error in createProduct hook:', error);
      throw error;
    }
  };

  const getAllProductsPaginated = async (page, limit) => {
    try {
      const response = await getPaginatedProducts(page, limit);
      setProducts(response.data.products);
      return response.data;
    } catch (error) {
      console.error('Error in getPaginatedProducts hook:', error);
      throw error;
    }
  };

  const getOneProduct = async (id) => {
    try {
      const response = await getSingleProduct(id);
      setProduct(response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getSingleProduct hook:', error);
      throw error;
    }
  };
  const update = async (id, product) => {
    try {
      const response = await updateProduct(id, product);
      return response.data;
    } catch (error) {
      console.error('Error in updateProduct hook:', error);
      throw error;
    }
  };
  const deleteProd = async (id) => {
    try {
      const response = await deleteProduct(id);
      return response.data;
    } catch (error) {
      console.error('Error in deleteProduct hook:', error);
      throw error;
    }
  };
  return { create, getAllProductsPaginated, getOneProduct, update, deleteProd };
};

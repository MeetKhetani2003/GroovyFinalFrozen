/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable simple-import-sort/imports */
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { debounce } from 'lodash';
import { SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '@/hooks/cartHook';
import { useProductStore } from '@/zustand/apis/ProductStore';
import MenuProductcard from '@/components/molicuels/MenuProductcard';

import productsJson from '../../src/assets/jsons/Products.json'; // only for data source

const Menu = () => {
  const navigate = useNavigate();
  const {
    setProducts,
    totalProducts,
    setTotalProducts,
    products: storeProducts,
  } = useProductStore();

  const [categories, setCategories] = useState(['All Categories']);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(20);
  const { addPacketToCart } = useCart();

  const [filters, setFilters] = useState({
    category: 'All Categories',
    pricemin: 0,
    pricemax: 1000,
    search: '',
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce for search
  const debouncedSearchHandler = useCallback(
    debounce((value) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        search: value,
      }));
    }, 500),
    []
  );

  const handleSearchClick = () => {
    debouncedSearchHandler(debouncedSearch);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      debouncedSearchHandler(debouncedSearch);
    }
  };

  // Load categories from JSON once
  useEffect(() => {
    const uniqueCategories = [
      'All Categories',
      ...new Set(productsJson.map((product) => product.category)),
    ];
    setCategories(uniqueCategories);
    console.log('Categories set:', uniqueCategories);
  }, []);

  // Read category filter from query params on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const initialCategory = queryParams.get('category') || 'All Categories';

    setFilters((prevFilters) => ({
      ...prevFilters,
      category: initialCategory,
    }));
    setCurrentPage(1);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Filtering + pagination
  useEffect(() => {
    const fetchProducts = () => {
      try {
        setLoading(true);
        let filteredProducts = productsJson;

        // Category filter
        if (filters.category !== 'All Categories') {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === filters.category
          );
        }

        // Search filter
        if (filters.search) {
          filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        // Price filter
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.packetPrice >= filters.pricemin &&
            product.packetPrice <= filters.pricemax
        );

        // Pagination
        const startIndex = (currentPage - 1) * pageLimit;
        const paginatedProducts = filteredProducts.slice(
          startIndex,
          startIndex + pageLimit
        );

        // setTotalProducts(filteredProducts.length);
        setProducts(paginatedProducts);

        console.log('Products fetched successfully:', paginatedProducts);
      } catch (error) {
        console.error('Error processing products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters, pageLimit, setProducts, setTotalProducts]);

  // Category change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);

    if (name === 'category') {
      const newQueryParams = new URLSearchParams(window.location.search);
      if (value === 'All Categories') {
        newQueryParams.delete('category');
      } else {
        newQueryParams.set('category', value);
      }
      navigate(`?${newQueryParams.toString()}`);
    }
  };

  const totalPages = Math.ceil(totalProducts / pageLimit);

  return (
    <div className='mx-8 lg:max-w-[1400px] lg:mx-auto pt-20 min-h-screen'>
      {/* Search + Filters */}
      <div className='flex justify-between gap-4 items-center mb-6'>
        <input
          type='text'
          name='search'
          value={debouncedSearch}
          onChange={(e) => setDebouncedSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className='w-1/2 p-2 border rounded-md'
          placeholder='Search products'
        />
        <div className='w-1/2 rounded-lg shadow-lg'>
          <select
            name='category'
            value={filters.category}
            onChange={handleFilterChange}
            className='w-full p-2 border rounded-md'
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSearchClick}
          className='ml-2 p-2 bg-blue-500 rounded-md text-white'
        >
          <SearchIcon className='h-5 w-5' />
        </button>
      </div>

      {/* Products Grid */}
      <div>
        <div className='max-w-7xl mx-auto md:ml-6'>
          <div className='grid grid-cols-1 min-h-[50vh] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-20 mt-24'>
            {loading ? (
              <div>Loading...</div>
            ) : Array.isArray(storeProducts) && storeProducts.length <= 0 ? (
              <div>Products of this category are not available</div>
            ) : (
              Array.isArray(storeProducts) &&
              storeProducts.map((product) => (
                <MenuProductcard
                  onAddToCart={() => addPacketToCart(product._id.$oid, 1)}
                  to={`/product/${product._id.$oid}`}
                  key={product._id.$oid}
                  img={product.thumbnail}
                  title={product.name}
                  heading={product.category}
                  price={`₹${product.packetPrice} / ${product.packetQuantity}${product.packetUnit}`}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <div className='flex justify-center mt-6'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;

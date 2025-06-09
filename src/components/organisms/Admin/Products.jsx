import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
} from '@mui/material';
import { debounce } from 'lodash';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState, useCallback, useRef } from 'react';

import { useProducts } from '@/hooks/ProductHook';
import { useProductStore } from '@/zustand/apis/ProductStore';

const Products = () => {
  const { products, setProducts, totalCount } = useProductStore(); // Added totalCount
  const { getAllProductsPaginated, update, deleteProd } = useProducts();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState(null);

  // Use ref to track renders and detect loops
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
    console.log(`Products component rendered ${renderCount.current} times`);
  });

  const debouncedSetSearchQuery = useCallback(
    debounce((value) => {
      console.log('Setting search query:', value);
      setSearchQuery(value);
    }, 300),
    []
  );

  // Fetch products when page, rowsPerPage, or searchQuery changes
  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(
          'Fetching products for page:',
          page + 1,
          'limit:',
          rowsPerPage,
          'search:',
          searchQuery
        );
        const response = await getAllProductsPaginated(page + 1, rowsPerPage, {
          search: searchQuery,
        });
        if (isMounted) {
          // Ensure products is always an array
          setFilteredProducts(response?.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message || error);
        if (isMounted) {
          setFilteredProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [page, rowsPerPage, searchQuery, getAllProductsPaginated]); // Dependencies

  // Remove separate filtering useEffect since API handles search
  useEffect(() => {
    setFormData(currentProduct);
  }, [currentProduct]);

  const handleChangePage = useCallback((event, newPage) => {
    console.log('Changing to page:', newPage);
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log('Changing rows per page to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  }, []);

  const handleEditClick = useCallback((product) => {
    console.log('Opening dialog for product:', product);
    setCurrentProduct(product);
    setOpen(true);
  }, []);

  const handleDeleteClick = useCallback(
    async (productId) => {
      try {
        console.log('Deleting product:', productId);
        await deleteProd(productId);
        setProducts(products.filter((product) => product._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },
    [deleteProd, products, setProducts]
  );

  const handleCloseDialog = useCallback(() => {
    console.log('Closing dialog');
    setOpen(false);
    setCurrentProduct(null);
    setFormData(null);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    console.log(`Updating formData ${field}: ${value}`);
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!formData || !formData._id) {
      console.log('No valid formData to save');
      return;
    }

    try {
      const updatedProductData = {
        name: formData.name ?? '',
        stockQuantity: parseFloat(formData.stockQuantity) || 0,
        packetQuantity: parseFloat(formData.packetQuantity) || 0,
        packetPrice: parseFloat(formData.packetPrice) || 0,
        stockUnit: formData.stockUnit ?? '',
        packetUnit: formData.packetUnit ?? '',
      };
      console.log('Saving product:', updatedProductData);
      await update(formData._id, updatedProductData);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === formData._id
            ? { ...product, ...updatedProductData }
            : product
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }, [formData, update, setProducts, handleCloseDialog]);

  if (loading) {
    return <div className='text-center mt-24 text-xl'>Loading...</div>;
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className='text-center mt-24 text-xl'>No products available</div>
    );
  }

  return (
    <Paper>
      <h1 className='text-3xl font-semibold mb-6'>Product List</h1>
      <TextField
        label='Search Products'
        variant='outlined'
        fullWidth
        margin='normal'
        value={searchQuery ?? ''}
        onChange={(e) => debouncedSetSearchQuery(e.target.value)}
      />
      <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ whiteSpace: 'nowrap' }}>SR No.</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>
                Product Name
              </TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>
                Stock Quantity
              </TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>
                Packet Quantity
              </TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>Thumbnail</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>Price</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>
                Sold Packets
              </TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{product.name ?? 'N/A'}</TableCell>
                  <TableCell>
                    {product.stockQuantity ?? 0} {product.stockUnit ?? ''}
                  </TableCell>
                  <TableCell>
                    {product.packetQuantity ?? 0} {product.packetUnit ?? ''}
                  </TableCell>
                  <TableCell>
                    <img
                      src={product.thumbnail ?? ''}
                      alt='Product Thumbnail'
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => (e.target.src = 'fallback-image.jpg')}
                    />
                  </TableCell>
                  <TableCell>{product.packetPrice ?? 0}</TableCell>
                  <TableCell>{product.soldPackets ?? 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(product)}>
                      <Pencil />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(product._id)}>
                      <Trash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[8, 16, 24, 300]}
        component='div'
        count={totalCount || filteredProducts.length} // Use totalCount from store
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {formData && (
            <>
              <TextField
                label='Product Name'
                fullWidth
                margin='normal'
                value={formData.name ?? ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <TextField
                label='Stock Quantity'
                fullWidth
                margin='normal'
                type='number'
                value={formData.stockQuantity ?? ''}
                onChange={(e) =>
                  handleInputChange('stockQuantity', e.target.value)
                }
              />
              <TextField
                label='Packet Quantity'
                fullWidth
                margin='normal'
                type='number'
                value={formData.packetQuantity ?? ''}
                onChange={(e) =>
                  handleInputChange('packetQuantity', e.target.value)
                }
              />
              <TextField
                label='Price'
                fullWidth
                margin='normal'
                type='number'
                value={formData.packetPrice ?? ''}
                onChange={(e) =>
                  handleInputChange('packetPrice', e.target.value)
                }
              />
              <TextField
                label='Stock Unit'
                fullWidth
                margin='normal'
                value={formData.stockUnit ?? ''}
                onChange={(e) => handleInputChange('stockUnit', e.target.value)}
              />
              <TextField
                label='Packet Unit'
                fullWidth
                margin='normal'
                value={formData.packetUnit ?? ''}
                onChange={(e) =>
                  handleInputChange('packetUnit', e.target.value)
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Products;

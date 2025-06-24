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
  const { products, setProducts, totalCount, getUniqueCategories, categories } =
    useProductStore();
  const { getAllProductsPaginated, update, deleteProd } = useProducts();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [detailedImagesFiles, setDetailedImagesFiles] = useState([]);

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

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await getUniqueCategories();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [getUniqueCategories]);

  useEffect(() => {
    let isMounted = true;

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
      isMounted = false;
    };
  }, [page, rowsPerPage, searchQuery, getAllProductsPaginated]);

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
    setPage(0);
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
    setThumbnailFile(null);
    setDetailedImagesFiles([]);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    console.log(`Updating formData ${field}: ${value}`);
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((event, type) => {
    const files = event.target.files;
    if (type === 'thumbnail') {
      setThumbnailFile(files[0] || null);
    } else if (type === 'detailedImages') {
      setDetailedImagesFiles(Array.from(files));
    }
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!formData || !formData._id) {
      console.log('No valid formData to save');
      return;
    }

    try {
      const formDataToSend = new FormData();
      const updatedProductData = {
        name: formData.name ?? '',
        stockQuantity: parseFloat(formData.stockQuantity) || 0,
        stockUnit: formData.stockUnit ?? '',
        packetQuantity: parseFloat(formData.packetQuantity) || 0,
        packetUnit: formData.packetUnit ?? '',
        packetPrice: parseFloat(formData.packetPrice) || 0,
        soldPackets: parseInt(formData.soldPackets) || 0,
        boxQuantity: parseInt(formData.boxQuantity) || 0,
        category: formData.category ?? '',
        description: formData.description ?? '',
        packagingType: formData.packagingType ?? '',
        friesType: formData.friesType ?? '',
        feature: formData.feature ?? '',
        selfLife: formData.selfLife ?? '',
        storageMethod: formData.storageMethod ?? '',
        temprature: formData.temprature ?? '',
        usageApplication: formData.usageApplication ?? '',
        refrigerationRequired: Boolean(formData.refrigerationRequired),
        countryOfOrigin: formData.countryOfOrigin ?? '',
        application: formData.application ?? '',
        frozenTemprature: formData.frozenTemprature ?? '',
        ingrediants: formData.ingrediants ?? '',
        form: formData.form ?? '',
      };

      Object.keys(updatedProductData).forEach((key) => {
        formDataToSend.append(key, updatedProductData[key]);
      });

      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }
      detailedImagesFiles.forEach((file, index) => {
        formDataToSend.append('detailedImages', file);
      });

      console.log('Saving product with ID:', formData._id);
      await update(formData._id, formDataToSend);
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
  }, [
    formData,
    update,
    setProducts,
    handleCloseDialog,
    thumbnailFile,
    detailedImagesFiles,
  ]);

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
              <TableCell style={{ whiteSpace: 'nowrap' }}>Category</TableCell>
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
                  <TableCell>{product.category ?? 'N/A'}</TableCell>
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
        count={totalCount || filteredProducts.length}
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
                  handleInputChange('stockQuantity', parseFloat(e.target.value))
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
                label='Packet Quantity'
                fullWidth
                margin='normal'
                type='number'
                value={formData.packetQuantity ?? ''}
                onChange={(e) =>
                  handleInputChange(
                    'packetQuantity',
                    parseFloat(e.target.value)
                  )
                }
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
              <TextField
                label='Packet Price'
                fullWidth
                margin='normal'
                type='number'
                value={formData.packetPrice ?? ''}
                onChange={(e) =>
                  handleInputChange('packetPrice', parseFloat(e.target.value))
                }
              />
              <TextField
                label='Sold Packets'
                fullWidth
                margin='normal'
                type='number'
                value={formData.soldPackets ?? ''}
                onChange={(e) =>
                  handleInputChange('soldPackets', parseInt(e.target.value))
                }
              />
              <TextField
                label='Box Quantity'
                fullWidth
                margin='normal'
                type='number'
                value={formData.boxQuantity ?? ''}
                onChange={(e) =>
                  handleInputChange('boxQuantity', parseInt(e.target.value))
                }
              />
              <TextField
                label='Category'
                fullWidth
                margin='normal'
                select
                SelectProps={{
                  native: true,
                  'aria-label': 'Select product category',
                }}
                value={formData.category ?? ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {categories
                  .filter((category) => category !== 'All Categories')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </TextField>
              <TextField
                label='Description'
                fullWidth
                margin='normal'
                value={formData.description ?? ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
              <TextField
                label='Packaging Type'
                fullWidth
                margin='normal'
                value={formData.packagingType ?? ''}
                onChange={(e) =>
                  handleInputChange('packagingType', e.target.value)
                }
              />
              <TextField
                label='Fries Type'
                fullWidth
                margin='normal'
                value={formData.friesType ?? ''}
                onChange={(e) => handleInputChange('friesType', e.target.value)}
              />
              <TextField
                label='Feature'
                fullWidth
                margin='normal'
                value={formData.feature ?? ''}
                onChange={(e) => handleInputChange('feature', e.target.value)}
              />
              <TextField
                label='Shelf Life'
                fullWidth
                margin='normal'
                value={formData.selfLife ?? ''}
                onChange={(e) => handleInputChange('selfLife', e.target.value)}
              />
              <TextField
                label='Storage Method'
                fullWidth
                margin='normal'
                value={formData.storageMethod ?? ''}
                onChange={(e) =>
                  handleInputChange('storageMethod', e.target.value)
                }
              />
              <TextField
                label='Temperature'
                fullWidth
                margin='normal'
                value={formData.temprature ?? ''}
                onChange={(e) =>
                  handleInputChange('temprature', e.target.value)
                }
              />
              <TextField
                label='Usage Application'
                fullWidth
                margin='normal'
                value={formData.usageApplication ?? ''}
                onChange={(e) =>
                  handleInputChange('usageApplication', e.target.value)
                }
              />
              <TextField
                label='Refrigeration Required'
                fullWidth
                margin='normal'
                select
                SelectProps={{ native: true }}
                value={formData.refrigerationRequired ?? false}
                onChange={(e) =>
                  handleInputChange(
                    'refrigerationRequired',
                    e.target.value === 'true'
                  )
                }
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </TextField>
              <TextField
                label='Country of Origin'
                fullWidth
                margin='normal'
                value={formData.countryOfOrigin ?? ''}
                onChange={(e) =>
                  handleInputChange('countryOfOrigin', e.target.value)
                }
              />
              <TextField
                label='Application'
                fullWidth
                margin='normal'
                value={formData.application ?? ''}
                onChange={(e) =>
                  handleInputChange('application', e.target.value)
                }
              />
              <TextField
                label='Frozen Temperature'
                fullWidth
                margin='normal'
                value={formData.frozenTemprature ?? ''}
                onChange={(e) =>
                  handleInputChange('frozenTemprature', e.target.value)
                }
              />
              <TextField
                label='Ingredients'
                fullWidth
                margin='normal'
                value={formData.ingrediants ?? ''}
                onChange={(e) =>
                  handleInputChange('ingrediants', e.target.value)
                }
              />
              <TextField
                label='Form'
                fullWidth
                margin='normal'
                value={formData.form ?? ''}
                onChange={(e) => handleInputChange('form', e.target.value)}
              />

              <input
                type='file'
                accept='image/*'
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                style={{ marginTop: '16px' }}
              />
              <input
                type='file'
                accept='image/*'
                multiple
                onChange={(e) => handleFileChange(e, 'detailedImages')}
                style={{ marginTop: '16px' }}
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

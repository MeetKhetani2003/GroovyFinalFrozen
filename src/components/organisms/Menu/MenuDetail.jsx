import { useState, useEffect } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import { useParams } from 'react-router-dom';

import products from '../../../assets/jsons/Products.json'; // 👈 Import JSON file

import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';

const DetailedImages = () => {
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchProductFromJson();
  }, [id]);

  const fetchProductFromJson = () => {
    try {
      setLoading(true);

      // ✅ Find product by id (since _id might be an object in JSON)
      const foundProduct = products.find(
        (p) => p._id?.$oid === id || p._id === id
      );

      if (foundProduct) {
        setProduct(foundProduct);

        if (
          foundProduct.detailedImages &&
          foundProduct.detailedImages.length > 0
        ) {
          setMainImage(foundProduct.detailedImages[0]);
        }
        console.log('Product loaded from JSON:', foundProduct);
      } else {
        console.warn('Product not found in JSON for id:', id);
      }
    } catch (error) {
      console.error('Error loading product from JSON:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFieldName = (field) => {
    const fieldMap = {
      boxQuantity: 'Box Size',
      packagingType: 'Packaging Type',
      selfLife: 'Shelf Life',
      storageMethod: 'Storage Method',
      temprature: 'Temperature',
    };
    return (
      fieldMap[field] ||
      field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    );
  };

  const detailFields = [
    'boxQuantity',
    'packagingType',
    'selfLife',
    'storageMethod',
    'temprature',
  ];

  if (loading) {
    return (
      <p className='text-center py-10 text-lg font-semibold'>
        Loading product details...
      </p>
    );
  }

  if (!product) {
    return (
      <p className='text-center py-10 text-lg font-semibold text-red-500'>
        No product found.
      </p>
    );
  }

  return (
    <div className='max-w-7xl mx-auto p-5 sm:p-10'>
      <div className='flex flex-col lg:flex-row gap-8 pt-28'>
        {/* Product Images Section */}
        <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-1/2'>
          <div className='flex sm:flex-col gap-2 sm:gap-4 order-2 sm:order-1 overflow-x-auto sm:overflow-visible whitespace-nowrap sm:whitespace-normal'>
            {Array.isArray(product.detailedImages) &&
              product.detailedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onMouseEnter={() => setMainImage(image)}
                  className={`w-16 h-16 sm:w-[100px] sm:h-[100px] object-cover cursor-pointer border-2 flex-shrink-0 ${
                    mainImage === image ? 'border-black' : 'border-transparent'
                  }`}
                />
              ))}
          </div>
          <div className='w-full flex-1 order-1 sm:order-2'>
            <InnerImageZoom
              src={mainImage}
              zoomSrc={mainImage}
              zoomType='click'
              zoomScale={1.8}
              moveType='drag'
              fullscreenOnMobile={true}
              mobileBreakpoint={640}
              className='w-full max-w-lg h-auto'
              fadeDuration={150}
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className='w-full'>
          <h1 className='text-4xl font-bold mb-6 text-gray-900'>
            {product.name}
          </h1>
          <div className='flex items-center gap-4 mb-8'>
            <p className='text-3xl font-semibold text-gray-900'>
              {`₹${product.packetPrice} / ${product.packetQuantity}${product.packetUnit}`}
            </p>
            <p className='text-lg text-gray-600 bg-gray-100 px-3 py-1 rounded-full'>
              {product.category}
            </p>
          </div>

          <div className='mb-10'>
            <h2 className='text-2xl font-semibold mb-6 text-gray-900'>
              {product.detailedDescription || 'Product Details'}
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              {product.description}
            </p>
          </div>
          <div className='mb-10'>
            <h3 className='text-2xl font-semibold mb-6 text-gray-900'>
              Product Details
            </h3>
            <table className='w-full bg-white border-collapse'>
              <tbody>
                {detailFields.map((field) => (
                  <tr key={field}>
                    <td className='border px-4 py-2 font-semibold w-1/3'>
                      {formatFieldName(field)}
                    </td>
                    <td className='border px-4 py-2'>
                      {field === 'boxQuantity'
                        ? `${product[field]} Packets`
                        : product[field] || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedImages;

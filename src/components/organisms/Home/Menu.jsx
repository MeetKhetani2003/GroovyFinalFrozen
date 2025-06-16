import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { assets } from '@/utils/AssetImport';

// Use an environment variable for the base URL (e.g., set in .env)
const BASE_URL = 'https://groovy-final-frozen.vercel.app';
// const BASE_URL = 'http://localhost:5173';

const categories = [
  {
    name: 'Ready to Eat Gujarati Sabji',
    imageUrl: assets.undhiyu,
    redirectUrl: `${BASE_URL}/menu?category=GUJARATI+READY+TO+EAT+SUBJI`,
  },
  // {
  //   name: 'Ready to Eat North Indian Sabji',
  //   imageUrl: assets.paneer,
  //   redirectUrl: `${BASE_URL}/menu?category=NORTH+INDIAN+READY+TO+EAT+SUBJI`,
  // },
  {
    name: 'Ready to Eat Rice',
    imageUrl: assets.rice,
    redirectUrl: `${BASE_URL}/menu?category=READY+TO+EAT+RICE`,
  },
  {
    name: 'Ready to Eat Dal',
    imageUrl: assets.dal,
    redirectUrl: `${BASE_URL}/menu?category=DAL`,
  },
  {
    name: 'Ready to Eat Soup',
    imageUrl: assets.soup,
    redirectUrl: `${BASE_URL}/menu?category=+READY+TO+COOK+SOUP`,
  },
  {
    name: 'Ready to Eat South Special',
    imageUrl: assets.south,
    redirectUrl: `${BASE_URL}/menu?category=Ready+to+Eat+South+Special`,
  },
  {
    name: 'Ready to Cook Tava Special',
    imageUrl: assets.tava,
    redirectUrl: `${BASE_URL}/menu?category=TAVA+SPECIAL`,
  },
  {
    name: 'Ready to Cook Gravy Base',
    imageUrl: assets.gravyBase,
    redirectUrl: `${BASE_URL}/menu?category=Ready+to+Cook+Gravy+Base`,
  },
  {
    name: 'Ready to Cook Snacks',
    imageUrl: assets.snacks,
    redirectUrl: `${BASE_URL}/menu?category=READY+TO+COOK+SNACKS`,
  },
  {
    name: 'Ready to Cook Starters',
    imageUrl: assets.starter,
    redirectUrl: `${BASE_URL}/menu?category=STARTER`,
  },
  {
    name: 'Sauces',
    imageUrl: assets.sauce,
    redirectUrl: `${BASE_URL}/menu?category=Sauces`,
  },
  {
    name: 'Dried Powder',
    imageUrl: assets.driedPowder,
    redirectUrl: `${BASE_URL}/menu?category=DRIED+POWDER`,
  },
  {
    name: 'Spices And Masala',
    imageUrl: assets.spice,
    redirectUrl: `${BASE_URL}/menu?category=SPICES+AND+MASALA`,
  },
];

const Menu = () => {
  const navigate = useNavigate();

  // Fallback image in case an image fails to load
  const handleImageError = (e) => {
    e.target.src =
      'https://via.placeholder.com/310x310.png?text=Image+Not+Found'; // Fallback image
  };

  // Handle redirects (standardized for both card and button)
  const handleRedirect = (redirectUrl) => {
    // If redirectUrl is an external URL, navigate to it directly
    if (redirectUrl.startsWith('http')) {
      window.location.href = redirectUrl; // External navigation
    } else {
      navigate(redirectUrl); // Internal navigation
    }
  };

  return (
    <div className='mx-8 lg:max-w-[1400px] lg:mx-auto mt-20'>
      <h1 className='text-5xl uppercase font-semibold font-serif text-center'>
        Our Categories
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-24'>
        {categories.map((category) => (
          <div
            key={category.name} // Use a unique key (category.name is unique)
            className='bg-gray-200 rounded-lg shadow-lg overflow-hidden'
            role='button' // Accessibility: indicate that this is a clickable element
            tabIndex={0} // Accessibility: make it focusable
            onClick={() => handleRedirect(category.redirectUrl)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRedirect(category.redirectUrl);
              }
            }}
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className='w-full h-[310px] object-cover'
              onError={handleImageError}
            />
            <div className='p-4'>
              <h3 className='text-xl font-semibold text-center'>
                {category.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleRedirect(category.redirectUrl);
                }}
                className='mt-4 bg-main hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full transform hover:scale-105 transition-all duration-300'
                aria-label={`Explore more about ${category.name}`} // Accessibility: describe the button's purpose
              >
                Explore More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;

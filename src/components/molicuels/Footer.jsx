import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { assets } from '@/utils/AssetImport';

import Logo from '../atoms/Logo';

const Footer = () => {
  const handleMenuClick = () => {
    const link = document.createElement('a');
    link.href = assets.brochure; // Assumes brochure.pdf is imported in assets
    link.download = 'GroovyCafe_Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className='relative mt-20'>
        <img
          className='max-h-80 w-screen object-cover'
          src={assets.footer}
          alt='Footer background'
        />
        <div className='absolute bottom-0 h-[18rem] lg:h-80 z-10 w-full bg-[#000000b6] p-6'>
          <div className='flex items-center flex-col justify-center lg:gap-6 gap-5'>
            <Logo />
            <div className='flex gap-6'>
              <a
                href='https://www.instagram.com/groovyfoodsindia?igsh=MWczamdrMXc0bWkyMg=='
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaInstagram
                  size={20}
                  className='hover:text-main text-white cursor-pointer'
                />
              </a>
              <a
                href='https://www.facebook.com/share/16XdDCyDWq/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaFacebook
                  size={20}
                  className='hover:text-main text-white cursor-pointer'
                />
              </a>
              <a
                href='https://youtube.com/@groovyfoodsindia?si=khxpbeEeKb9Nx6T0'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaYoutube
                  size={20}
                  className='hover:text-main text-white cursor-pointer'
                />
              </a>
              <FaWhatsapp
                size={20}
                className='hover:text-main text-white cursor-pointer'
              />
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-0'>
              <Link
                to='/'
                className='border-r border-white lg:px-8 px-2 hover:text-main text-white text-center font-montserrat'
              >
                Home
              </Link>
              <button
                onClick={handleMenuClick}
                className='border-r border-white lg:px-8 px-2 hover:text-main text-white text-center font-montserrat'
              >
                Download Brochure
              </button>
              <Link
                to='/about'
                className='border-r border-white lg:px-8 px-2 hover:text-main text-white text-center font-montserrat'
              >
                About us
              </Link>
              <Link
                to='/contact'
                className='px-2 lg:px-8 hover:text-main text-white text-center font-montserrat'
              >
                Contact us
              </Link>
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-0'>
              <p className='px-8 border-r border-white md:border-r md:border-white hover:text-main text-white text-center font-montserrat'>
                Monday-Sunday: 10:00 AM to 08:00 PM
              </p>
              <p className='px-8 hover:text-main text-white text-center font-montserrat'>
                Groovy Multi Services Pvt. Ltd.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center py-4 bg-[#8d8d05]'>
        <p className='text-white text-center font-montserrat'>
          © 2023 Groovy Cafe. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;

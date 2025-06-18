import RecipeCard from '@/components/molicuels/RecipeCard';

// Define an array of video data with YouTube links and other details
const recipes = [
  {
    videoId: 'yW-b7efjyQGgqw',
    heading: 'Ready to Eat Veg Kofta',
    // description: '2021-08-27  No Comments',
  },
  {
    videoId: 'TxvqhxzTp4U',
    heading: 'Ready to Eat Kashmiri Dum Aloo',
    // description: '2021-08-27  No Comments',
  },
  {
    videoId: 'H6sy8LKAzAk',
    heading: 'Ready to Eat Paneer Bhurji',
    // description: '2021-08-27  No Comments',
  },
  {
    videoId: 'Dlv-FIr5l18',
    heading: 'Ready to Eat Desi Chana Masala',
    // description: '2021-08-27  No Comments',
  },
  {
    videoId: 'yqdHGH5jdPw',
    heading: 'Ready to Cook Rajma Masala',
    // description: '2021-08-27  No Comments',
  },
  {
    videoId: 'zCNpkQphvDw',
    heading: 'Ready to Eat Paneet Lababdar',
    // description: '2021-08-27  No Comments',
  },
];

const RecipeContainer = () => {
  return (
    <div className='mt-20 mx-8 lg:max-w-7xl lg:mx-auto'>
      <h1 className='text-5xl uppercase font-semibold font-serif text-center'>
        recipes & tips
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 mt-24'>
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            videoId={recipe.videoId}
            heading={recipe.heading}
            dec={recipe.description}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeContainer;

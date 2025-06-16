import RecipeCard from '@/components/molicuels/RecipeCard';

// Define an array of video data with YouTube links and other details
const recipes = [
  {
    videoId: 'yW-GF7Tpf10',
    heading: 'Sweet orange yellow from Australia',
    description: '2021-08-27  No Comments',
  },
  {
    videoId: 'TxvqhxzTp4U',
    heading: 'Sweet orange yellow from Australia',
    description: '2021-08-27  No Comments',
  },
  {
    videoId: 'H6sy8LKAzAk',
    heading: 'Sweet orange yellow from Australia',
    description: '2021-08-27  No Comments',
  },
  {
    videoId: 'Dlv-FIr5l18',
    heading: 'Sweet orange yellow from Australia',
    description: '2021-08-27  No Comments',
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

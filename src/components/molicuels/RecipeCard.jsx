const RecipeCard = ({ videoId, heading, dec }) => {
  return (
    <div>
      <div>
        <iframe
          className='w-full min-h-64 object-cover rounded-2xl shadow-xl shadow-gray-100'
          src={`https://www.youtube.com/embed/${videoId}`}
          title={heading}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        ></iframe>
        <p className='mt-7 uppercase font-serif text-xl text-center'>
          {heading}
        </p>
        <p className='text-gray-600 text-center font-montserrat'>{dec}</p>
      </div>
    </div>
  );
};

export default RecipeCard;

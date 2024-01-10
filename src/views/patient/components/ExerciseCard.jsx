import { useState } from 'react';

const ExerciseCard = ({ name, description, steps, image }) => {
  // State to toggle view
  const [detailedView, setDetailedView] = useState(false);

  // Event handler to toggle view
  const handleViewClick = () => {
    setDetailedView(!detailedView);
  };
  const stepsList = steps.split('\n');

  return (
    <div className="card w-96 bg-base-100 border-[1px]">
      <figure className="">
        <img
          src={image}
          alt="Exercise Image"
          className="rounded-xl object-contain w-full h-auto"
        />
      </figure>
      <div className="card-body">
        {detailedView ? (
          <div>
            <h2 className="card-title">{name} steps</h2>

            <ul className="list-disc list-inside ">
              {stepsList.map((item, index) => (
                <li key={index} className="text-dark-teal">
                  {item}
                </li>
              ))}
            </ul>

            <div className="card-actions justify-end">
              <button className="btn " onClick={handleViewClick}>
                Less
              </button>
            </div>
          </div>
        ) : (
          // Default view
          <div>
            <h2 className="card-title">{name}</h2>
            <p>{description}</p>
            <div className="card-actions justify-end">
              <button className="btn" onClick={handleViewClick}>
                More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;

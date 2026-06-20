import { useContext } from "react";
import './FoodDisplay.css';
import { StoreContext } from "../../context/StoreContext";
import Fooditem from '../Fooditem/FoodItem'

const FoodDisplay = ( {category } ) => { // Destructure category from props
  const { food_list } = useContext(StoreContext);

 

  return (
    <div className="food-display" id="food-display">
      <h2> Top dishes near you </h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          console.log(category, item.category);

          if (category === "All" || category === item.category) {
            return (
              <Fooditem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null; // Added this to avoid returning undefined from the map function
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;

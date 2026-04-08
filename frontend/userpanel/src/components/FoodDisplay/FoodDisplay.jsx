import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({category, searchText}) => {

  const { foodList } = useContext(StoreContext);

  // const filteredFoods = foodList.filter(food => (
  //   (category === 'All' || food.category === category) && food.name.toLowerCase().includes(searchText.toLowerCase())
  // ));

  const filteredFoods = foodList.filter(food => {
  const name = food.name ? food.name.toLowerCase() : "";
  const search = searchText ? searchText.toLowerCase() : "";
  const currentCategory = category || "All";

  return (
    (currentCategory === "All" || food.category === currentCategory) &&
    name.includes(search)
  );
});

  // console.log(filteredFoods);
  
  // console.log("Category:", category);
  // console.log("SearchText:", searchText);
  // console.log("FoodList:", foodList);

  return (
    <div className="container">
      <div className="row">
        {
          filteredFoods.length > 0 ? (
            filteredFoods.map((food, index) => {
              return(
              <FoodItem key={index} 
              name={food.name} 
              description={food.description} 
              price={food.price} 
              category={food.category} 
              imageUrl={food.imageUrl} 
              id={food.id}/>
              )
            })
          ) : (
            <div className="text-center mt-4">
              <h4>No Food found.</h4>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default FoodDisplay

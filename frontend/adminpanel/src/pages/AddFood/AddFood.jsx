import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { addFood } from '../../services/foodService';
import { toast } from 'react-toastify';

const AddFood = () => {

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Biryani'
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if(!image){
      toast.error('Please select an image.')
      return;
    }

    try{
      await addFood(data, image);
      toast.success('Food Added Successfully');
      setData({name : '', description : '', category : 'Biryani', price : ''})
      setImage(null);
    }
    catch(error){
      toast.error('Error adding food.')
    }
  }

  return (
    <div className="mx-2 mt-2">
  <div className="row">
    <div className="card col-md-4">
      <div className="card-body">
        <h2 className="mb-4">Add Food</h2>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              <img src={image ? URL.createObjectURL(image) : assets.upload} alt="Upload" width={98}/>
            </label>
            <input type="file" className="form-control" id="image" hidden onChange={(e) => setImage(e.target.files[0])} name='image'/>
          </div>
          <div className="mb-3">
            <label htmlFor="name"  className="form-label">Name</label>
            <input type="text" className="form-control" id="name" placeholder='Chicken Biryani' name='name' onChange={onChangeHandler} value={data.name} required />
          </div>
          <div className="mb-3">
            <label htmlFor="description"  className="form-label">Food Description</label>
            <textarea className="form-control" id="description" rows="3" placeholder='Write content here...' required name='description' onChange={onChangeHandler} value={data.description}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select name="category" id="category" className='form-control' onChange={onChangeHandler} value={data.category}>
              <option value="Biryani">Biryani</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Cake">Cake</option>
              <option value="Ice Cream">Ice Cream</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="number" className="form-control" id="price" required name='price'  placeholder = '&#8377;200' onChange={onChangeHandler} value={data.price}/>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  </div>
</div>
  )
}

export default AddFood;
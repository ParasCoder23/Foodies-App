import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { addFood, addFoodWithUrl } from '../../services/foodService';
import { toast } from 'react-toastify';

const AddFood = () => {

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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
    if(!image && !imageUrl){
      toast.error('Please select an image or use AI to fetch one.')
      return;
    }

    try{
      if(imageUrl){
        // Use the backend endpoint that accepts an image URL
        await addFoodWithUrl(data, imageUrl);
      } else {
        await addFood(data, image);
      }
      toast.success('Food Added Successfully');
      setData({name : '', description : '', category : 'Biryani', price : ''})
      setImage(null);
      setImageUrl(null);
    }
    catch(error){
      toast.error('Error adding food.')
    }
  }

  const useAiImage = async () => {
    if(!data.name || data.name.trim().length === 0){
      toast.error('Please enter a food name to search an image');
      return;
    }
    try {
      toast.info('Fetching image...');
      const query = data.name.trim();

      // Client-side Wikipedia search (no keys)
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&origin=*`;
      const searchResp = await fetch(searchUrl);
      const searchJson = await searchResp.json();
      const searchResults = searchJson?.query?.search;
      if (searchResults && searchResults.length > 0) {
        const pageId = searchResults[0].pageid;
        const imageUrlReq = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pageids=${pageId}&piprop=original&origin=*`;
        const imgResp = await fetch(imageUrlReq);
        const imgJson = await imgResp.json();
        const page = imgJson?.query?.pages?.[pageId];
        const original = page?.original;
        if (original && original.source) {
          setImageUrl(original.source + `?t=${Date.now()}`);
          setImage(null);
          toast.success('Image set.');
          return;
        }
      }

      // If we reach here, no image found on Wikipedia
      toast.error('No suitable image found on Wikipedia for this term.');
    } catch (err) {
      console.error('Error fetching image from Wikipedia', err);
      toast.error('Failed to fetch image.');
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
                      <img
                        src={image ? URL.createObjectURL(image) : (imageUrl ? imageUrl : assets.upload)}
                        alt={imageUrl ? `Preview for ${data.name}` : 'Upload'}
                        width={220}
                        height={140}
                        style={{ objectFit: 'cover', borderRadius: 6 }}
                        crossOrigin="anonymous"
                        onError={() => {
                          // If external image fails to load, clear the URL so placeholder shows and notify user
                          if(imageUrl){
                            setImageUrl(null);
                            toast.error('Unable to load preview image. You can try again or upload a local image.');
                          }
                        }}
                      />
            </label>
            {/* Preview URL removed by request - preview image only */}
                    <input type="file" className="form-control" id="image" hidden onChange={(e) => { setImage(e.target.files[0]); setImageUrl(null); }} name='image'/>
                    <div className="mt-2">
                      <button type="button" className="btn btn-outline-secondary me-2" onClick={() => document.getElementById('image').click()}>Choose from local</button>
                      <button type="button" className="btn btn-outline-info" onClick={useAiImage}>Use AI (Image)</button>
                    </div>
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
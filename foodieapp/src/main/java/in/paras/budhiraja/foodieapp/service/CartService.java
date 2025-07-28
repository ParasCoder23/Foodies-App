package in.paras.budhiraja.foodieapp.service;

import in.paras.budhiraja.foodieapp.io.CartRequest;
import in.paras.budhiraja.foodieapp.io.CartResponse;

public interface CartService {

   CartResponse addToCart(CartRequest request);
}

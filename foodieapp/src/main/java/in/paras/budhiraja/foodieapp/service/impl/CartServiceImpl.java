package in.paras.budhiraja.foodieapp.service.impl;

import in.paras.budhiraja.foodieapp.entity.CartEntity;
import in.paras.budhiraja.foodieapp.io.CartRequest;
import in.paras.budhiraja.foodieapp.io.CartResponse;
import in.paras.budhiraja.foodieapp.repository.CartRepository;
import in.paras.budhiraja.foodieapp.service.CartService;
import in.paras.budhiraja.foodieapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserService userService;

    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = userService.findByUserId();
    // Ensure we operate on a single cart per user by merging duplicates if present
    CartEntity cart = ensureSingleCartForUser(loggedInUserId);
        Map<String, Integer> cartItems = cart.getItems();
        cartItems.put(request.getFoodId(), cartItems.getOrDefault(request.getFoodId(), 0) + 1);
        cart.setItems(cartItems);
        cart = cartRepository.save(cart);
        return convertToResponse(cart);
    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId = userService.findByUserId();
    CartEntity entity = ensureSingleCartForUser(loggedInUserId);
        return convertToResponse(entity);
    }

    @Override
    public void clearCart() {
        String loggedInUserId = userService.findByUserId();
        cartRepository.deleteByUserId(loggedInUserId);
    }

    @Override
    public CartResponse removeFromCart(CartRequest request) {
        String loggedInUserId = userService.findByUserId();
    CartEntity entity = ensureSingleCartForUser(loggedInUserId);
    if(entity == null) throw new RuntimeException("Cart is not found !!!");
        Map<String, Integer> cartItems = entity.getItems();
        if(cartItems.containsKey(request.getFoodId())){
            int currentQty = cartItems.get(request.getFoodId());
            if(currentQty > 0){
                cartItems.put(request.getFoodId(), currentQty - 1);
            }
            else{
                cartItems.remove(request.getFoodId());
            }
            entity = cartRepository.save(entity);
        }
        return convertToResponse(entity);
    }

    /**
     * Ensure there is exactly one CartEntity for the given user. If multiple documents exist
     * we merge their items into one and delete duplicates.
     */
    private CartEntity ensureSingleCartForUser(String userId){
        List<CartEntity> carts = cartRepository.findAllByUserId(userId);
        if(carts == null || carts.isEmpty()){
            return new CartEntity(null, userId, new HashMap<>());
        }
        if(carts.size() == 1) return carts.get(0);

        // Merge all carts into the first one
        CartEntity primary = carts.get(0);
        Map<String, Integer> merged = primary.getItems() == null ? new HashMap<>() : new HashMap<>(primary.getItems());
        for(int i=1;i<carts.size();i++){
            CartEntity c = carts.get(i);
            if(c.getItems() != null){
                c.getItems().forEach((k,v) -> merged.put(k, merged.getOrDefault(k,0) + v));
            }
        }
        primary.setItems(merged);
        // Save primary and delete others
        CartEntity saved = cartRepository.save(primary);
        for(int i=1;i<carts.size();i++){
            cartRepository.deleteById(carts.get(i).getId());
        }
        return saved;
    }

    private CartResponse convertToResponse(CartEntity cartEntity){
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();
    }
}

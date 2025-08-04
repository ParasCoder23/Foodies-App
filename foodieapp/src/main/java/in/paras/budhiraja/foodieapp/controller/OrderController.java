package in.paras.budhiraja.foodieapp.controller;

import com.razorpay.RazorpayException;
import in.paras.budhiraja.foodieapp.io.OrderRequest;
import in.paras.budhiraja.foodieapp.io.OrderResponse;
import in.paras.budhiraja.foodieapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request) throws RazorpayException {
        OrderResponse response = service.createOrderWithPayment(request);
        return response;
    }

    @PostMapping("/verify")
    public void verifyPayment(@RequestBody Map<String, String > paymentData){
        service.verifyPayment(paymentData, "Paid");
    }

    @GetMapping
    public List<OrderResponse> getOrders(){
        return service.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId){
        service.removeOrder(orderId);
    }

    // Admin Panel
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers(){
        return service.getOrdersOfAllUsers();
    }

    // Admin Panel
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status){
        service.updateOrderStatus(orderId, status);
    }
}

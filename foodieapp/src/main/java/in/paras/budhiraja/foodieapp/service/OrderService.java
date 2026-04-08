package in.paras.budhiraja.foodieapp.service;

import com.razorpay.RazorpayException;
import in.paras.budhiraja.foodieapp.io.OrderRequest;
import in.paras.budhiraja.foodieapp.io.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {

    OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException;

    void verifyPayment(Map<String, String> paymentData, String status);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(String orderId, String status);
}

package in.paras.budhiraja.foodieapp.service;

import in.paras.budhiraja.foodieapp.io.UserRequest;
import in.paras.budhiraja.foodieapp.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);
}

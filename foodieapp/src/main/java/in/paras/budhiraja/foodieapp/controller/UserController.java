package in.paras.budhiraja.foodieapp.controller;

import in.paras.budhiraja.foodieapp.io.UserRequest;
import in.paras.budhiraja.foodieapp.io.UserResponse;
import in.paras.budhiraja.foodieapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request){

        return userService.registerUser(request);
    }

}

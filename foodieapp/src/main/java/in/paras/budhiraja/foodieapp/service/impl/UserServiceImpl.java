package in.paras.budhiraja.foodieapp.service.impl;

import in.paras.budhiraja.foodieapp.entity.UserEntity;
import in.paras.budhiraja.foodieapp.io.UserRequest;
import in.paras.budhiraja.foodieapp.io.UserResponse;
import in.paras.budhiraja.foodieapp.repository.UserRepository;
import in.paras.budhiraja.foodieapp.service.AuthenticationFacade;
import in.paras.budhiraja.foodieapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    @Override
    public String findByUserId() {
        String loggedInUserEmail = authenticationFacade.getAuthentication().getName();
        UserEntity loggedInUser = userRepository.findByEmail(loggedInUserEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return loggedInUser.getId();
    }

    private UserEntity convertToEntity(UserRequest request){
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
    }

    private UserResponse convertToResponse(UserEntity registerUser){
        return UserResponse.builder()
                .id(registerUser.getId())
                .email(registerUser.getEmail())
                .name(registerUser.getName())
                .build();
    }
}

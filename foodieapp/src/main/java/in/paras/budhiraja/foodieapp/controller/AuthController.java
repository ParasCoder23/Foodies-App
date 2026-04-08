package in.paras.budhiraja.foodieapp.controller;

import in.paras.budhiraja.foodieapp.io.AuthenticationRequest;
import in.paras.budhiraja.foodieapp.io.AuthenticationResponse;
import in.paras.budhiraja.foodieapp.service.AppUserDetailsService;
import in.paras.budhiraja.foodieapp.util.jwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import java.util.Map;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AppUserDetailsService userDetailsService;

    @Autowired
    private jwtUtil jwtutil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request){
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String jwtToken = jwtutil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthenticationResponse(request.getEmail(), jwtToken));
        } catch (AuthenticationException ex){
            return ResponseEntity.status(401).body(Map.of("error", "authentication_failed", "message", ex.getMessage()));
        } catch (Exception ex){
            return ResponseEntity.status(500).body(Map.of("error", "internal_error", "message", ex.getMessage()));
        }
    }
}

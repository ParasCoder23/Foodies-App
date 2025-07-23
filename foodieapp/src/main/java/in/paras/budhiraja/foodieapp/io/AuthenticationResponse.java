package in.paras.budhiraja.foodieapp.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class AuthenticationResponse {

    private String email;
    private String token;
}

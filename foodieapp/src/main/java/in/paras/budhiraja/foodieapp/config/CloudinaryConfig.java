package in.paras.budhiraja.foodieapp.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary getCloudinary(){
        Map config = new HashMap();

        String cloudName = System.getenv("cloud_name");
        config.put("cloud_name", cloudName);

        String api_key = System.getenv("api_key");
        config.put("api_key", api_key);

        String api_secret = System.getenv("api_secret");
        config.put("api_secret", api_secret);

        config.put("secure", true);

        return new Cloudinary(config);
    }

}

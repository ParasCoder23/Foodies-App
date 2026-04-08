package in.paras.budhiraja.foodieapp.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Bean
    public Cloudinary getCloudinary(){
        Map config = new HashMap();

    // Prefer the names you provided (AP_KEY, CLOUD_NAME, API_SECRET), then other common variants
    String cloudName = firstNonNullEnv("CLOUD_NAME", "CLOUDINARY_CLOUD_NAME", "cloud_name");
    String api_key = firstNonNullEnv("AP_KEY", "CLOUDINARY_API_KEY", "api_key");
    String api_secret = firstNonNullEnv("API_SECRET", "CLOUDINARY_API_SECRET", "api_secret");

        if(cloudName == null || api_key == null || api_secret == null){
            log.warn("Cloudinary configuration incomplete. Found cloudName={}, api_key={}, api_secret={}", cloudName != null, api_key != null, api_secret != null);
        }

        config.put("cloud_name", cloudName);
        config.put("api_key", api_key);
        config.put("api_secret", api_secret);

        config.put("secure", true);

        return new Cloudinary(config);
    }

    private String firstNonNullEnv(String... keys){
        for(String k: keys){
            String v = System.getenv(k);
            if(v != null && !v.isBlank()) return v;
        }
        return null;
    }

}

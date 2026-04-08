package in.paras.budhiraja.foodieapp.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class MongoConfig {

    @Bean
    @Primary
    public MongoClient mongoClient() {
        // Prefer explicit env var MONGODB_URL; fall back to a sensible localhost default for dev
        String uri = System.getenv("MONGODB_URL");
        if (uri == null || uri.isBlank()) {
            uri = "mongodb://127.0.0.1:27017/foodies";
        }

        // Sanitize and create client
        String cleaned = sanitizeUri(uri);
        return MongoClients.create(cleaned);
    }

    private String sanitizeUri(String uri){
        if(uri == null) return null;
        String s = uri.trim();
        // remove wrapping quotes if present
        if((s.startsWith("\"") && s.endsWith("\"")) || (s.startsWith("'") && s.endsWith("'"))){
            s = s.substring(1, s.length()-1);
        }
    // remove any stray backslashes which often appear when copying env values between shells
    s = s.replace("\\", "");
        return s;
    }
}

package in.paras.budhiraja.foodieapp.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Sanitize the Mongo connection URI early during environment processing so that
 * Spring Boot's auto-configuration uses a cleaned value (no surrounding quotes
 * and no accidental backslash escapes). This prevents the auto-created MongoClient
 * from receiving an incorrectly escaped URI and attempting SRV lookups with
 * malformed hostnames/options.
 */
public class MongoUriEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROP = "spring.data.mongodb.uri";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // Prefer explicit environment variable first (MONGODB_URL), then existing property
        String envVal = System.getenv("MONGODB_URL");
        String configured = null;
        if (envVal != null && !envVal.isBlank()) configured = envVal;
        else configured = environment.getProperty(PROP);

        if (configured == null || configured.isBlank()) return;

        String cleaned = sanitizeUri(configured);
        Map<String, Object> m = new HashMap<>();
        m.put(PROP, cleaned);
        // Insert with highest precedence so auto-config reads the sanitized value
        environment.getPropertySources().addFirst(new MapPropertySource("sanitized-mongo-uri", m));
    }

    // Aggressively remove accidental escaping and surrounding quotes
    private String sanitizeUri(String uri){
        if(uri == null) return null;
        String s = uri.trim();
        if((s.startsWith("\"") && s.endsWith("\"")) || (s.startsWith("'") && s.endsWith("'"))){
            s = s.substring(1, s.length()-1);
        }
        // Remove all stray backslashes which commonly appear when env values are copied with escapes
        s = s.replace("\\", "");
        return s;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}

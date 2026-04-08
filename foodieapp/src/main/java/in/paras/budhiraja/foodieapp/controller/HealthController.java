package in.paras.budhiraja.foodieapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.bson.Document;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Value("${spring.data.mongodb.uri:}")
    private String springDataMongoUri;

    @GetMapping("/api/health")
    public ResponseEntity<?> health(){
        Map<String, Object> status = new HashMap<>();
        status.put("app", "ok");

        // The effective URI is provided via spring.data.mongodb.uri (application.properties).
        // That property is mapped to ${MONGODB_URL:mongodb://127.0.0.1:27017/foodies} in application.properties.
        String envMongo = System.getenv("MONGODB_URL");
        String configuredUri = (springDataMongoUri != null && !springDataMongoUri.isBlank()) ? springDataMongoUri : null;

        if (configuredUri != null) {
            configuredUri = sanitizeUri(configuredUri);
            status.put("mongo_uri_source", (envMongo != null && !envMongo.isBlank()) ? "env:MONGODB_URL" : "spring.property");
            status.put("mongo_uri_redacted", redactMongoUri(configuredUri));
        } else {
            status.put("mongo_uri_source", "none_found");
        }

        // First try the application's MongoTemplate (uses configured MongoClient)
        try{
            Object res = mongoTemplate.getDb().runCommand(new Document("ping", 1));
            boolean mongoOk = res != null;
            status.put("mongodb", mongoOk ? "ok" : "failed");
            status.put("mongodb_checked_with", "configured_client");
            return ResponseEntity.ok(status);
    } catch(Exception primaryEx){
            // Primary failed; surface the error (no automatic fallback) so we don't mask configuration problems.
                status.put("mongodb", "failed");
                status.put("mongodb_error", primaryEx.getMessage());
        }

        return ResponseEntity.ok(status);
    }

    private String redactMongoUri(String uri){
        if(uri == null) return null;
        try{
            // redact password in forms like mongodb://user:pass@host and mongodb+srv://user:pass@host
            return uri.replaceAll("(mongodb(?:\\+srv)?://[^/:]+):([^@]+)@", "$1:<redacted>@");
        } catch(Exception ex){
            return "<redact_failed>";
        }
    }

    private String sanitizeUri(String uri){
        if(uri == null) return null;
        String s = uri.trim();
        if((s.startsWith("\"") && s.endsWith("\"")) || (s.startsWith("'") && s.endsWith("'"))){
            s = s.substring(1, s.length()-1);
        }
    // remove stray backslashes to avoid malformed options like retryWrites\=true
    s = s.replace("\\", "");
        return s;
    }
}

package in.paras.budhiraja.foodieapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ImageSearchService {

    private final RestTemplate restTemplate;

    @Value("${GOOGLE_API_KEY:}")
    private String apiKey;

    @Value("${GOOGLE_CSE_ID:}")
    private String cseId;

    public ImageSearchService(RestTemplateBuilder builder){
        this.restTemplate = builder.build();
    }

    public boolean isConfigured(){
        return apiKey != null && !apiKey.isBlank() && cseId != null && !cseId.isBlank();
    }

    public Optional<String> searchFirstImage(String query){
        if(!isConfigured()){
            return Optional.empty();
        }
        try{
            String q = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String url = "https://www.googleapis.com/customsearch/v1?key=" + apiKey + "&cx=" + cseId + "&searchType=image&q=" + q + "&num=1";
            Map resp = restTemplate.getForObject(url, Map.class);
            if(resp != null && resp.containsKey("items")){
                Object itemsObj = resp.get("items");
                if(itemsObj instanceof List){
                    List items = (List) itemsObj;
                    if(!items.isEmpty()){
                        Object first = items.get(0);
                        if(first instanceof Map){
                            Object link = ((Map) first).get("link");
                            if(link != null) return Optional.of(link.toString());
                        }
                    }
                }
            }
        } catch(Exception ex){
            // swallow and return empty
        }
        return Optional.empty();
    }
}

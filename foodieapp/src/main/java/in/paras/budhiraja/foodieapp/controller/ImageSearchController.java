package in.paras.budhiraja.foodieapp.controller;

import in.paras.budhiraja.foodieapp.service.ImageSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ImageSearchController {

    private final ImageSearchService imageSearchService;

    public ImageSearchController(ImageSearchService imageSearchService) {
        this.imageSearchService = imageSearchService;
    }

    @GetMapping("/api/images/search")
    public ResponseEntity<?> searchImage(@RequestParam String q){
        if(!imageSearchService.isConfigured()){
            // 204 No Content indicates server-side search not configured
            return ResponseEntity.noContent().build();
        }
        return imageSearchService.searchFirstImage(q)
                .map(url -> ResponseEntity.ok(Map.of("imageUrl", url)))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
}

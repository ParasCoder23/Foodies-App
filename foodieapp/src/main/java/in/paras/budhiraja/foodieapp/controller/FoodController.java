package in.paras.budhiraja.foodieapp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.paras.budhiraja.foodieapp.io.FoodRequest;
import in.paras.budhiraja.foodieapp.io.FoodResponse;
import in.paras.budhiraja.foodieapp.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin("*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("image")MultipartFile file){
        String data = this.foodService.upload(file);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/image")
    public ResponseEntity<String> deleteImage(@RequestParam("publicID")String id){
        foodService.deleteFile(id);
        return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
    }

    @PostMapping
    public FoodResponse addFood(@RequestPart("food") String foodString,
                                @RequestPart("file") MultipartFile file) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest request = null;
        try{
            request = objectMapper.readValue(foodString, FoodRequest.class);
        }
        catch (JsonProcessingException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON Format!!");
        }
        FoodResponse response = foodService.addFood(request, file);
        return response;
    }

    @PostMapping("/url")
    public FoodResponse addFoodWithUrl(@RequestBody FoodRequest request){
        return foodService.addFoodWithImageUrl(request);
    }

    @GetMapping
    public List<FoodResponse> readFoods(){
        return foodService.readFoods();
    }

    @GetMapping("/{id}")
    public FoodResponse readFood(@PathVariable String id){
        return foodService.readFood(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable String id){
        try{
            foodService.deleteFood(id);
            return ResponseEntity.noContent().build();
        } catch(Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "delete_failed", "message", ex.getMessage()));
        }
    }

}

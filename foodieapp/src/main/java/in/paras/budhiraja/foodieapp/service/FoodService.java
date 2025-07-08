package in.paras.budhiraja.foodieapp.service;

import in.paras.budhiraja.foodieapp.io.FoodRequest;
import in.paras.budhiraja.foodieapp.io.FoodResponse;
import in.paras.budhiraja.foodieapp.repository.FoodRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    public String upload(MultipartFile file);

    public boolean deleteFile(String fileName);

    FoodResponse addFood(FoodRequest request, MultipartFile file);

    List<FoodResponse> readFoods();

    FoodResponse readFood(String id);

    void deleteFood(String id);
}

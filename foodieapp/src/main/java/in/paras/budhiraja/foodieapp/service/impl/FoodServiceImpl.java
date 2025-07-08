package in.paras.budhiraja.foodieapp.service.impl;

import com.cloudinary.Cloudinary;
import in.paras.budhiraja.foodieapp.entity.FoodEntity;
import in.paras.budhiraja.foodieapp.io.FoodRequest;
import in.paras.budhiraja.foodieapp.io.FoodResponse;
import in.paras.budhiraja.foodieapp.repository.FoodRepository;
import in.paras.budhiraja.foodieapp.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService{

    @Autowired
    public Cloudinary cloudinary;

    @Autowired
    private FoodRepository foodRepository;

    @Override
    public String upload(MultipartFile file) {
        try {
            Map data = this.cloudinary.uploader().upload(file.getBytes(), Map.of());
            return (String) data.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Image Uploading Failed!!");
        }
    }

    @Override
    public boolean deleteFile(String fileName) {
        try {
            this.cloudinary.uploader().destroy(fileName, Map.of());
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file");
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity newFoodEntity = convertToEntity(request);
        String imageUrl = upload(file);
        newFoodEntity.setImageUrl(imageUrl);
        newFoodEntity = foodRepository.save(newFoodEntity);
        return convertToResponse(newFoodEntity);
    }

    @Override
    public List<FoodResponse> readFoods() {
        List<FoodEntity> databaseEntries = foodRepository.findAll();
        return databaseEntries.stream().map(object -> convertToResponse(object)).collect(Collectors.toList());
    }

    @Override
    public FoodResponse readFood(String id) {
        FoodEntity existingFood = foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found for the id : " + id));
        return convertToResponse(existingFood);
    }

    @Override
    public void deleteFood(String id) {
        FoodResponse response = readFood(id);
        String imageUrl = response.getImageUrl();
        String fileNameWithExtension = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        String fileName = fileNameWithExtension.split("\\.")[0];
        boolean isFileDeleted = deleteFile(fileName);
        if(isFileDeleted){
            foodRepository.deleteById(response.getId());
        }
    }

    private FoodEntity convertToEntity(FoodRequest request){
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity entity){
        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .build();
    }

}

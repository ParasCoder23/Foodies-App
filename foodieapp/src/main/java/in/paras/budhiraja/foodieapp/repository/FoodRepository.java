package in.paras.budhiraja.foodieapp.repository;

import in.paras.budhiraja.foodieapp.entity.FoodEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends MongoRepository<FoodEntity, String> {
}

package in.paras.budhiraja.foodieapp.repository;

import in.paras.budhiraja.foodieapp.entity.CartEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CartRepository extends MongoRepository<CartEntity, String> {

    Optional<CartEntity> findByUserId(String userId);

    // Return all cart documents for the same user (used to detect/merge duplicates)
    List<CartEntity> findAllByUserId(String userId);

    void deleteByUserId(String userId);
}

package in.paras.budhiraja.foodieapp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "carts")
public class CartEntity {

    @Id
    private String id;
    private String userId;
    private Map<String, Integer> items = new HashMap<>();

    public CartEntity(String userId, Map<String, Integer> items){
        this.items = items;
        this.userId = userId;
    }

    public CartEntity(String userId, String loggedInUserId, HashMap<String, Integer> items) {
        this.items = items;
        this.id = userId;
        this.userId = loggedInUserId;
    }
}

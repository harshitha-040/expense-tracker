package com.harshitha.expense_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.harshitha.expense_tracker.entity.Category;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserIdOrUserIdIsNull(Long userId);
    List<Category> findByTypeAndUserIdOrUserIdIsNull(String type, Long userId);
}

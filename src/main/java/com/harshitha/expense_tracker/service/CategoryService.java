package com.harshitha.expense_tracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.harshitha.expense_tracker.entity.Category;
import com.harshitha.expense_tracker.entity.User;
import com.harshitha.expense_tracker.repository.CategoryRepository;
import com.harshitha.expense_tracker.repository.UserRepository;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Category> getCategoriesForUser(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email).orElse(null);
        Long userId = (user != null) ? user.getId() : null;
        return categoryRepository.findByUserIdOrUserIdIsNull(userId);
    }

    public Category addCategory(Category category, String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        category.setUser(user);
        return categoryRepository.save(category);
    }
}

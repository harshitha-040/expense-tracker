package com.harshitha.expense_tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.harshitha.expense_tracker.entity.Category;
import com.harshitha.expense_tracker.service.CategoryService;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getCategories(@RequestParam String email) {
        return categoryService.getCategoriesForUser(email);
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category, @RequestParam String email) {
        return categoryService.addCategory(category, email);
    }
}

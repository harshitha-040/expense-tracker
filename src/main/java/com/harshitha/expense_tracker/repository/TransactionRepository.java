package com.harshitha.expense_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.harshitha.expense_tracker.entity.Transaction;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdAndDeletedAtIsNull(Long userId);
    List<Transaction> findByUserIdAndTypeAndDeletedAtIsNull(Long userId, String type);
    List<Transaction> findByUserIdAndCategoryIdAndDeletedAtIsNull(Long userId, Long categoryId);
}

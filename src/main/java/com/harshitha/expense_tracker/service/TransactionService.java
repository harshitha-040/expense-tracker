package com.harshitha.expense_tracker.service;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.harshitha.expense_tracker.dto.TransactionRequest;
import com.harshitha.expense_tracker.entity.Transaction;
import com.harshitha.expense_tracker.entity.User;
import com.harshitha.expense_tracker.entity.Category;
import com.harshitha.expense_tracker.repository.TransactionRepository;
import com.harshitha.expense_tracker.repository.UserRepository;
import com.harshitha.expense_tracker.repository.CategoryRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public String addTransaction(TransactionRequest request, String userEmail) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setTitle(request.getTitle());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setNotes(request.getNotes());

        transactionRepository.save(transaction);
        return "Transaction Added Successfully";
    }

    public List<Transaction> getAllTransactions(String userEmail) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findByUserIdAndDeletedAtIsNull(user.getId());
    }

    public String deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id).orElse(null);
        if (transaction != null) {
            transaction.setDeletedAt(java.time.LocalDateTime.now());
            transactionRepository.save(transaction);
            return "Transaction Deleted Successfully";
        }
        return "Transaction not found";
    }

    public Transaction updateTransaction(Long id, TransactionRequest request) {
        Transaction existingTransaction = transactionRepository.findById(id).orElse(null);
        if (existingTransaction != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            existingTransaction.setTitle(request.getTitle());
            existingTransaction.setAmount(request.getAmount());
            existingTransaction.setType(request.getType());
            existingTransaction.setCategory(category);
            existingTransaction.setTransactionDate(request.getTransactionDate());
            existingTransaction.setNotes(request.getNotes());

            return transactionRepository.save(existingTransaction);
        }
        return null;
    }
    
    public BigDecimal getTotalExpense(String userEmail) {
        return getAllTransactions(userEmail).stream()
                .filter(t -> t.getType().equalsIgnoreCase("EXPENSE"))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public BigDecimal getTotalIncome(String userEmail) {
        return getAllTransactions(userEmail).stream()
                .filter(t -> t.getType().equalsIgnoreCase("INCOME"))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public BigDecimal getBalance(String userEmail) {
        return getTotalIncome(userEmail).subtract(getTotalExpense(userEmail));
    }
}

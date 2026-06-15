package com.harshitha.expense_tracker.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.harshitha.expense_tracker.dto.TransactionRequest;
import com.harshitha.expense_tracker.entity.Transaction;
import com.harshitha.expense_tracker.service.TransactionService;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/add")
    public String addTransaction(@RequestBody TransactionRequest request, @RequestParam String email) {
        return transactionService.addTransaction(request, email);
    }

    @GetMapping("/all")
    public List<Transaction> getAllTransactions(@RequestParam String email) {
        return transactionService.getAllTransactions(email);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteTransaction(@PathVariable Long id) {
        return transactionService.deleteTransaction(id);
    }

    @PutMapping("/update/{id}")
    public Transaction updateTransaction(@PathVariable Long id, @RequestBody TransactionRequest request) {
        return transactionService.updateTransaction(id, request);
    }

    @GetMapping("/totals")
    public Map<String, BigDecimal> getTotals(@RequestParam String email) {
        return Map.of(
            "income", transactionService.getTotalIncome(email),
            "expense", transactionService.getTotalExpense(email),
            "balance", transactionService.getBalance(email)
        );
    }
}

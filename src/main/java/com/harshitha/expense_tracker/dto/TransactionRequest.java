package com.harshitha.expense_tracker.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {
    private String title;
    private BigDecimal amount;
    private String type; // INCOME or EXPENSE
    private Long categoryId;
    private LocalDate transactionDate;
    private String notes;
}

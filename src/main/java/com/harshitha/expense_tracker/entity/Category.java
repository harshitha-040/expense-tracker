package com.harshitha.expense_tracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // NULL means system category

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // INCOME or EXPENSE

    private String icon;

    @Column(name = "color_hex")
    private String colorHex;
}

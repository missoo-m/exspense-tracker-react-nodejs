package com.example.expensetracker.repository;

import com.example.expensetracker.model.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {

    List<News> findByTypeOrderByDateDesc(String type);
}


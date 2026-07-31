package com.example.programming.dto;


import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ImportResult {

    private int totalRows;
    private int importedRows;
    private int skippedRows;

    private List<ImportError> errors = new ArrayList<>();
}
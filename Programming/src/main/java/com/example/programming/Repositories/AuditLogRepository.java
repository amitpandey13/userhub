package com.example.programming.Repositories;

import com.example.programming.dto.AuditLogDto;
import com.example.programming.entities.AuditLog;
import com.example.programming.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Integer> {

     Page<AuditLog> findAll(Pageable pageable);
    Page<AuditLog> findByAction(
            AuditAction action,
            Pageable pageable
    );

    @Query("""
SELECT a
FROM AuditLog a
WHERE
(:search IS NULL OR
LOWER(a.performedBy.name) LIKE LOWER(CONCAT('%',:search,'%'))
OR LOWER(a.targetUser.name) LIKE LOWER(CONCAT('%',:search,'%'))
OR LOWER(a.description) LIKE LOWER(CONCAT('%',:search,'%')))
AND
(:action IS NULL OR a.action = :action)
""")
    Page<AuditLog> searchAuditLogs(

            @Param("search") String search,

            @Param("action") AuditAction action,

            Pageable pageable

    );


}
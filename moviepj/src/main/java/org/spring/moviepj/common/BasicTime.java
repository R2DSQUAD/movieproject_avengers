package org.spring.moviepj.common;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@EntityListeners(value = AuditingEntityListener.class)
public class BasicTime {

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createTime; // create_time

    @UpdateTimestamp
    @Column(insertable = false)
    private LocalDateTime updateTime;

}

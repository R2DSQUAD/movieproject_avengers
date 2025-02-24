package org.spring.moviepj.repository;

import java.util.Optional;

import org.spring.moviepj.entity.MemberEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, String> {
    @EntityGraph(attributePaths = { "memberRoleList" })
    @Query("select m from MemberEntity m where m.email = :email")
    MemberEntity getWithRoles(@Param("email") String email);

    Optional<MemberEntity> findByEmail(String email);

}
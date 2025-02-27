package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.entity.CinemaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CinemaRepository extends JpaRepository<CinemaEntity, Long> {

    CinemaEntity findByCinemaName(String cinemaName);

    List<CinemaEntity> findByRegion(String region);

    // radius * 1000 컨트롤러에서 radius 값을 km로 받아와 m로 전환
    @Query(value = "SELECT * FROM cinema_tb WHERE ST_Distance_Sphere(POINT(lon, lat), POINT(:lon, :lat)) <= :radius * 1000", nativeQuery = true)
    List<CinemaEntity> findNearbyCinemas(double lat, double lon, double radius);

    public Page<CinemaEntity> findByCinemaNameContaining(String cinemaName, Pageable pageable);

    public Page<CinemaEntity> findByRegionContaining(String region, Pageable pageable);

}

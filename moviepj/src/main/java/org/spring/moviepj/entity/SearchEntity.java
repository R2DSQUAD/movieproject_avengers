
package org.spring.moviepj.entity;

import java.util.List;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.util.HangulUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Index;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "search_tb", indexes = {
    @Index(name = "idx_movie_cd", columnList = "movieCd"),
    @Index(name = "idx_movie_nm", columnList = "movieNm"),
    @Index(name = "idx_movie_nm_chosung", columnList = "movieNmChosung")
})
public class SearchEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "search_id")
    private Long id;

    @Column(nullable = false)
    private String movieCd; // 영화진흥원 영화목록

    @Column(nullable = false)
    private String movieNm; // 영화진흥원 영화목록

    private String movieNmChosung; // 영화 초성

    private String openDt; // 영화진흥원 영화목록

    private String directors; // 영화진흥원 영화목록

    private String genreAlt; // 영화진흥원 영화목록

    private String watchGradeNm; // 영화진흥원 영화상세정보 -> movieCd 랑 비교해서 가져오기

    private String runTime; // tmdb디테일 -> movieNm,openDt 비교해서 가져오기

    @Column(columnDefinition = "TEXT")
    private String overview; // tmdb이미지 -> movieNm,openDt 비교해서 가져오기

    private String poster_path; // tmdb이미지 -> movieNm,openDt 비교해서 가져오기

    private String backdrop_path; // tmdb이미지 -> movieNm,openDt 비교해서 가져오기

    @OneToMany(mappedBy = "searchEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<SearchTrailerEntity> searchTrailerEntities; // tmdb트레일러 -> movieNm,openDt 비교해서 가져오기

    //영화 이름 초성으로 저장
    @PrePersist
    @PreUpdate
    public void updateChosung() {
        if (this.movieNm != null && !this.movieNm.trim().isEmpty()) {
            this.movieNmChosung = HangulUtils.getChosung(this.movieNm); // 초성 변환 후 저장
        }
    }
}
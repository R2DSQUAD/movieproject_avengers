package org.spring.moviepj.dto.movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class results {
  private String iso6391;   // 언어 코드 (예: "ko")
    private String iso31661;  // 국가 코드 (예: "KR")
    private String name;      // 영상 제목
    private String key;       // YouTube 영상 키
    private String site;      // 영상 사이트 (예: "YouTube")
    private int size;         // 해상도 (예: 1080)
    private String type;      // 영상 종류 (예: "Featurette")
    private boolean official; // 공식 영상 여부
    private String publishedAt; // 공개 날짜 (ISO-8601 형식)
    private String id;        // 고유 ID
}

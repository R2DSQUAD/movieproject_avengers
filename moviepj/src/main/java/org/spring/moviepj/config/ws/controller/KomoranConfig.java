package org.spring.moviepj.config.ws.controller;

import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;

import org.spring.moviepj.config.ws.repository.HelpMessageRepository;
import org.spring.moviepj.repository.CinemaRepository;
import org.spring.moviepj.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.*;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class KomoranConfig {

  // 기본 사용
//  사용자 사전 사용
//  문장 내에서 사용자 사전에 포함된 단어가 출현하면 사용자 사전에 정의된 품사를 우선적으로 갖게 됩니다.
//  주로 사람이름, 영화제목, 브랜드명, 지명 등과 같이 고유명사를 인식하는데 활용할 수 있습니다.
//  기분석 사전보다 우선 순위가 낮습니다.
//  //KOMORAN에서 기본으로 제공되는 LIGHT 모델 사용
//  Komoran komoran = new Komoran(DEFAULT_MODEL.LIGHT);
////사용자 사전 적용. 원하는 위치에 사용자 사전 파일을 생성한 후 경로만 지정해주면 됩니다.
//komoran.setUserDic("dic.user")
//komoran.setUserDic("user_data/dic.user")

  //.dic : 각종 사전(Dictionary) 파일
  //private String DEPT_DIC="dept.dic";
  //private String DIC_DIR="static/files/";
  private String USER_DIC="user.dic";
  // private String USER_DIC = "src/main/resources/static/files/dic.user";



  @Autowired
  MovieRepository movieRepository;

  @Autowired
  CinemaRepository cinemaRepository;

  @Autowired
  HelpMessageRepository helpMessageRepository;

  @Bean
  Komoran komoran() {
    userDic();
    Komoran komoran=new Komoran(DEFAULT_MODEL.LIGHT);
    komoran.setUserDic(USER_DIC);  // 사용자 사전
    return komoran;
  }

  //부서테이블(부서명), 멤버테이블(이름)
  private void userDic() {

    Set<String> keys = new HashSet<>();  // 주머니 번호 구글

    //기존에 수동으로 등록된 파일에서 고유명사만 추출
    try {
      File file=new File(USER_DIC);
      if(file.exists()) {
        BufferedReader br = new BufferedReader(new FileReader(file));
        String data = null;
        while ((data = br.readLine()) != null) {
          if (data.startsWith("#"))//주석라인제거
            continue;
          String[] str = data.split("\\t");
          keys.add(str[0]);
        }
        br.close();
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    // 검색할 키워드만 추출

    //영화 이름
    movieRepository.findAll().forEach(e -> {
      keys.add(e.getMovieNm());
    });

    cinemaRepository.findAll().forEach(e-> {
      keys.add(e.getCinemaName());
    });

    helpMessageRepository.findAll().forEach(e-> {
      keys.add(e.getMessage());
    });
    

    //버스 노선 번호
    
    
    keys.add("안녕");
    keys.add("영화관");
    keys.add("영화관 조회");
    keys.add("영화관 위치");
    keys.add("영화");
    keys.add("영화 조회");
    keys.add("조회");
    keys.add("목록");
    keys.add("도움말");
    keys.add("괜찮아");
    keys.add("힘내라");

    //저장된 명단을 고유명사로 파일에 등록
    try {
      BufferedWriter bw = new BufferedWriter(new FileWriter(USER_DIC));
      keys.forEach(key -> {
        try {
          bw.write(key + "\tNNP\n");
          System.out.println(key);
        } catch (IOException e1) {
          e1.printStackTrace();
        }
      });
      bw.close();
    } catch (IOException e1) {
      e1.printStackTrace();
    }
  }
}

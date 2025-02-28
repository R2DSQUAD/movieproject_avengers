import React, { useState, useEffect } from 'react';

const Komoran = () => {
  const [message, setMessage] = useState('');
  const [chatContent, setChatContent] = useState('');
  const [response, setResponse] = useState('');
  const [movieDetails, setMovieDetails] = useState(null);
  const [cinemaList, setCinemaList] = useState([]); // 영화관 리스트 상태 관리
  const [mapLoaded, setMapLoaded] = useState(false); // 지도 로딩 상태

  // 카카오맵 API 동적으로 로드하는 함수
  const loadKakaoMapScript = () => {
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=190b60adafceaaa9f23691a7db8a0b39&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => { // 카카오맵이 완전히 로드된 후에 콜백 함수 실행
        setMapLoaded(true); // 카카오맵 로드 완료 후 상태 변경
      });
    };
    script.onerror = () => console.error("카카오맵 API 로드 실패");
    document.head.appendChild(script);
  };

  useEffect(() => {
    loadKakaoMapScript(); // 컴포넌트 로드 시 카카오맵 스크립트 로드
  }, []);

  useEffect(() => {
    if (cinemaList.length > 0 && mapLoaded) {
      loadMap(cinemaList);  // 카카오맵 API가 로드된 후에 지도 로드
    }
  }, [cinemaList, mapLoaded]);

  const btnMsgSendClicked = () => {
    const questionText = message.trim();
    if (questionText === "" || questionText.length < 2) return;

    sendMessage(questionText);

    const messageHtml = inputTagString(questionText);
    setChatContent(prevContent => prevContent + messageHtml);

    setMessage('');
  };

  const inputTagString = (text) => {
    const now = new Date();
  
    // 시간 AM/PM 처리
    let hours = now.getHours();
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12; // 12시간제로 변환
    hours = hours ? hours : 12; // 0이면 12로 표시
    const minutes = now.getMinutes();
    
    // '00'과 같은 형식을 유지하려면, 두 자릿수로 출력되도록 분을 처리
    const time = `${ampm} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  
    return ` 
      <div class="msg user flex end">
        <div class="message">
          <div class="part" >
            <p>${text}</p>
          </div>
          <div class="time">${time}</div>
        </div>
      </div>
    `;
  };

  const sendMessage = async (message) => {
    try {
      const response = await fetch('http://localhost:8090/botController', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          message: message,
        }),
      });

      const responseData = await response.json();
      setResponse(responseData.answer.content);

      // 영화관 조회일 경우 cinemaList 업데이트
      if (responseData.answer.keyword === '영화관' && responseData.answer.cinemaList) {
        setCinemaList(responseData.answer.cinemaList);
        setMovieDetails(null); // 영화관 검색 시 영화 데이터 숨기기
      } else {
        setMovieDetails(responseData.answer.movie);
        setCinemaList([]); // 영화 데이터 검색 시 영화관 데이터 숨기기
      }

      showMessage(responseData.answer.content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const showMessage = (messageHtml) => {
    setChatContent(prevContent => prevContent + messageHtml);
    const chatContentElement = document.getElementById("chat-content");
    chatContentElement.scrollTop = chatContentElement.scrollHeight;
  };

  // 카카오맵 API로 지도 로드
  const loadMap = (cinemas) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('카카오맵 API가 로드되지 않았습니다.');
      return;
    }

    const container = document.getElementById('map'); // 지도가 표시될 HTML 요소
    const options = {
      center: new window.kakao.maps.LatLng(cinemas[0].lat, cinemas[0].lon), // 첫 번째 영화관을 중심으로 설정
      level: 7,
    };

    const map = new window.kakao.maps.Map(container, options); // 지도 객체 생성

    cinemas.forEach(cinema => {
      const position = new window.kakao.maps.LatLng(cinema.lat, cinema.lon); // 영화관 위치
      const marker = new window.kakao.maps.Marker({
        position: position,
      });

      marker.setMap(map); // 마커 지도에 표시

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${cinema.cinemaName}<br>${cinema.address}</div>`,
      });

      // 마커에 클릭 이벤트 추가
      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });
    });
  };

  return (
    <div>
      <button onClick={btnMsgSendClicked}>Send</button>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ color: 'white', backgroundColor: '#333', border: '1px solid #444', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}
      />
      <div id="chat-content" dangerouslySetInnerHTML={{ __html: chatContent }} style={{ color: 'white', marginTop: '20px' }} />

      {/* 영화 데이터가 있을 때만 영화 정보 표시 */}
      {movieDetails && movieDetails.movieNm && (
        <div className="movie-details" style={{ color: 'white', marginTop: '20px' }}>
          <img
            src={movieDetails.poster_path ? movieDetails.poster_path : 'path_to_default_image.jpg'}
            alt={movieDetails.movieNm}
            style={{ width: '200px', height: '300px', objectFit: 'cover' }}
          />
          <p><strong>영화 이름:</strong> {movieDetails.movieNm}</p>
          <p><strong>개봉일:</strong> {movieDetails.openDt}</p>
          <p><strong>누적 관객수:</strong> {movieDetails.audiAcc}명</p>
          <p><strong>줄거리:</strong> {movieDetails.overview}</p>
        </div>
      )}

      {/* 영화관 데이터가 있을 때만 영화관 정보 표시 */}
      {cinemaList.length > 0 && (
        <div id="map" style={{ width: '600px', height: '600px', marginTop: '20px' }}></div>
      )}
    </div>
  );
};

export default Komoran;

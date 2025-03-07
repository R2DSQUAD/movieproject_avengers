import React, { useState, useEffect, useRef } from "react";
import "../../css/Komoran.css";

const Komoran = () => {
  const [message, setMessage] = useState("");
  const [chatContent, setChatContent] = useState("");
  const [response, setResponse] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);
  const [cinemaList, setCinemaList] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isKomoranOpen, setIsKomoranOpen] = useState(true);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapInstance, setMapInstance] = useState(false);
  
  const bodyRef = useRef(null);
  const mapRef = useRef(null); // Add map ref

  // ✅ 카카오맵 API 동적 로드
  useEffect(() => {
    loadKakaoMapScript();

    const autoSendMessage = async () => {
      try {
        await sendMessage("안녕");
      } catch (e) {
        console.error("자동 메시지 전송 오류", e);
      }
    };

    autoSendMessage();
  }, []);

  // ✅ 카카오맵 API 로드
  const loadKakaoMapScript = () => {
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=190b60adafceaaa9f23691a7db8a0b39&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
        console.log("카카오맵 API 로드 성공");
      });
    };
    script.onerror = () => console.error("카카오맵 API 로드 실패");
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [chatContent]);

  useEffect(() => {
    if (isMapModalOpen && cinemaList.length > 0 && mapLoaded) {
      loadMap(cinemaList);
    }
  }, [isMapModalOpen, cinemaList, mapLoaded]);

  const btnMsgSendClicked = async () => {
    const questionText = message.trim();
    if (questionText === "" || questionText.length < 2) return;

    sendMessage(questionText);

    const messageHtml = inputTagString(questionText);
    setChatContent((prevContent) => prevContent + messageHtml);

    setMessage("");
  };

  // ✅ 모달 열기
  const toggleMapModal = () => {
    setIsMapModalOpen((prev) => !prev);
  };

  // ✅ 채팅 메시지 HTML 생성
  const inputTagString = (text) => {
    const now = new Date();

    // 시간 AM/PM 처리
    let hours = now.getHours();
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes();
    const time = `${ampm} ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

    return `
      <div class="msg user flex end">
        <div class="message">
          <div class="part">
            <p>${text}</p>
          </div>
          <div class="time">${time}</div>
        </div>
      </div>
    `;
  };

  // ✅ 서버로 메시지 전송
  const sendMessage = async (message) => {
    try {
      const response = await fetch("http://localhost:8090/botController", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          message: message,
        }),
      });

      const responseData = await response.json();
      setResponse(responseData.answer.content);

      if (
        responseData.answer.cinemaList &&
        responseData.answer.cinemaList.length > 0
      ) {
        setCinemaList(responseData.answer.cinemaList);
        setMovieDetails(null);
      } else {
        setMovieDetails(responseData.answer.movie);
        setCinemaList([]);
      }

      showMessage(responseData.answer.content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // ✅ 봇 응답 메시지 표시
  const showMessage = (messageHtml) => {
    if (messageHtml) {
      setChatContent((prevContent) => {
        const newContent = prevContent + messageHtml;
        return newContent;
      });

      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }
  };

  // 카카오맵 API로 지도 로드
  const loadMap = (cinemas) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    const container = mapRef.current;
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(cinemas[0].lat, cinemas[0].lon),
      level: 7,
    };

    const map = new window.kakao.maps.Map(container, options);
    setMapInstance(map); // Store the map instance.

    cinemas.forEach((cinema) => {
      const position = new window.kakao.maps.LatLng(cinema.lat, cinema.lon);
      const marker = new window.kakao.maps.Marker({
        position: position,
      });

      marker.setMap(map);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${cinema.cinemaName}<br>${cinema.address}</div>`,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        infowindow.open(map, marker);
      });
    });
  };

  // ✅ 채팅창 토글 (닫아도 데이터 유지)
  const toggleKomoran = () => {
    setIsKomoranOpen((prev) => !prev);
  };

  return (
    <>
      <div className={`komoran-container ${isKomoranOpen ? "open" : "closed"}`}>
        <div className="komoran-header">
          <div className="header-title">영화 길잡이</div>
          <div className="header-buttons">
            <button className="close-button" onClick={toggleKomoran}>
              ×
            </button>
          </div>
        </div>

        <div className="komoran-body" ref={bodyRef}>
          <div
            id="chat-content"
            dangerouslySetInnerHTML={{ __html: chatContent }}
            style={{ color: "white", marginTop: "20px" }}
          ></div>

          {movieDetails && movieDetails.movieNm && (
            <div
              className="movie-details"
              style={{ color: "white", marginTop: "20px" }}
            >
              <img
                src={
                  movieDetails.poster_path
                    ? movieDetails.poster_path
                    : "path_to_default_image.jpg"
                }
                alt={movieDetails.movieNm}
                style={{ width: "200px", height: "300px", objectFit: "cover" }}
              />

              <p>
                <strong>영화 이름:</strong> {movieDetails.movieNm}
              </p>
              <p>
                <strong>개봉일:</strong> {movieDetails.openDt}
              </p>
              <p>
                <strong>누적 관객수:</strong> {movieDetails.audiAcc}명
              </p>
              <p>
                <strong>줄거리:</strong> {movieDetails.overview}
              </p>
            </div>
          )}

          {cinemaList.length > 0 && (
            <>
              <button className="map-modal-button" onClick={toggleMapModal}>
                영화관 정보
              </button>
              {isMapModalOpen && (
                <>
                  <div className="modal-overlay" onClick={toggleMapModal} />
                  <div className="map-modal">
                    <div className="map-modal-header">
                    </div>
                    <div id="map" ref={mapRef} />
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={btnMsgSendClicked}>Send</button>
        </div>
      </div>
      <div className="chat-float-button" onClick={toggleKomoran}>
        채팅
      </div>
    </>
  );
};

export default Komoran;
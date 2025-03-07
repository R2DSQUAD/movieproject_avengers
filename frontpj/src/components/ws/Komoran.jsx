import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../css/Komoran.css";

// 지도 영역 렌더링 컴포넌트
const MapPlaceholder = React.memo(({ mapRef, isKomoranOpen, cinemas, lastLocation, markers, onMapRendered }) => {
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.style.width = "500px";
      mapRef.current.style.height = "300px";
      mapRef.current.style.display = isKomoranOpen ? "block" : "none";

      if (window.kakao?.maps) {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 기본 위치 (서울)
          level: 7,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);

        if (cinemas.length > 0) {
          const { lat, lon } = cinemas[0];
          map.setCenter(new window.kakao.maps.LatLng(lat, lon));

          cinemas.forEach((cinema) => {
            const position = new window.kakao.maps.LatLng(cinema.lat, cinema.lon);
            const marker = new window.kakao.maps.Marker({ position });
            marker.setMap(map);

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div>${cinema.cinemaName}<br>${cinema.address}</div>`,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.open(map, marker);
            });
          });
        } else if (lastLocation) {
          const { lat, lon } = lastLocation;
          map.setCenter(new window.kakao.maps.LatLng(lat, lon));

          markers.forEach((markerInfo) => {
            const position = new window.kakao.maps.LatLng(markerInfo.lat, markerInfo.lon);
            const marker = new window.kakao.maps.Marker({ position });
            marker.setMap(map);

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div>${markerInfo.cinemaName}<br>${markerInfo.address}</div>`,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.open(map, marker);
            });
          });
        }

        // 지도가 렌더링된 후 스크롤을 조정합니다.
        if (onMapRendered) {
          onMapRendered();
        }
      }
    }
  }, [mapRef, isKomoranOpen, cinemas, lastLocation, markers, onMapRendered]);

  return <div id="map" ref={mapRef}></div>;
});

// 채팅 메시지 컴포넌트 (불필요한 리렌더링 최소화를 위해 React.memo 사용)
const Message = React.memo(({ sender, content, isLastBotMessage, isLatestMap, isFirstMessage, mapRef, isKomoranOpen, cinemas, lastLocation, markers, onMapRendered, showTime }) => {
  const renderContent = () => {
    if (content === "map") {
      if (!isLatestMap) {
        return <p>지도가 업데이트 되었습니다.</p>;
      }
      return <MapPlaceholder mapRef={mapRef} isKomoranOpen={isKomoranOpen} cinemas={cinemas} lastLocation={lastLocation} markers={markers} onMapRendered={onMapRendered} />;
    }
    return <p className="message-content" dangerouslySetInnerHTML={{ __html: content }}></p>;
  };

  return (
    <div className={`${sender}-chat`} style={isFirstMessage ? { display: "none" } : {}}>
      {showTime && <div className="time-display"><p>{showTime}</p></div>}
      <div className="message">
        <div className="part">
          {sender === "bot" && isLastBotMessage && (
            <div className="chat-body-logo">
              <img src="/image/logo.png" alt="logo" id="logo" />
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
});

const Komoran = () => {
  const [message, setMessage] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);
  const [cinemaList, setCinemaList] = useState([]);
  const [lastLocation, setLastLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isKomoranOpen, setIsKomoranOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [lastBotMessageIndex, setLastBotMessageIndex] = useState(null);
  const bodyRef = useRef(null);
  const mapRef = useRef(null); // Ref to track the map div

  // 카카오맵 스크립트 로드
  const loadKakaoMapScript = useCallback(() => {
    if (window.kakao?.maps) {
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
  }, []);

  // 채팅 영역 스크롤 자동 조정
  const scrollToBottom = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 초기 로드 시 카카오맵 스크립트 로드 및 인사말 전송
  useEffect(() => {
    loadKakaoMapScript();
    handleSendMessage("안녕");
  }, [loadKakaoMapScript]);

  // 영화 정보 또는 영화관 목록이 변경되면 해당 내용을 채팅에 표시
  useEffect(() => {
    if (movieDetails) {
      const { poster_path, movieNm, openDt, audiAcc, overview } = movieDetails;
      const posterImage = poster_path
        ? `<img src="${poster_path}" alt="${movieNm} 포스터" class="movie-poster" />`
        : "포스터 이미지 없음";

      showMessage(posterImage);
      showMessage(`영화 이름: ${movieNm}`);
      showMessage(`개봉일: ${openDt}`);
      showMessage(`누적 관객수: ${Number(audiAcc).toLocaleString("ko-KR")}명`);
      showMessage(`줄거리: ${overview}`);
    }
    if (cinemaList.length > 0 && mapLoaded) {
      // 일정 시간 딜레이를 준 후 지도를 렌더링
      setTimeout(() => {
        showMessage("map");
      }, 100); // 10ms 지연
    }
  }, [movieDetails, cinemaList, mapLoaded]);

  // 메시지 추가 (bot)
  const showMessage = useCallback((msgContent) => {
    if (!msgContent) return;
    setMessages((prev) => {
      const newMessages = [...prev, { sender: "bot", content: msgContent, time: new Date() }];
      setLastBotMessageIndex(newMessages.length - 1);
      return newMessages;
    });
  }, []);

  // 백엔드로 메시지 전송
  const sendMessageToBackend = useCallback(
    async (msg) => {
      try {
        const response = await fetch("http://localhost:8090/botController", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ message: msg }),
        });
        const responseData = await response.json();
        const { answer } = responseData;

        // 상태 초기화 전에 마지막 위치와 마커 저장
        if (cinemaList.length > 0) {
          const { lat, lon } = cinemaList[0];
          setLastLocation({ lat, lon });
          setMarkers(cinemaList.map(cinema => ({
            lat: cinema.lat,
            lon: cinema.lon,
            cinemaName: cinema.cinemaName,
            address: cinema.address
          })));
        }

        // 상태 초기화
        setCinemaList([]);
        setMovieDetails(null);

        if (Array.isArray(answer.message)) {
          answer.message.forEach((msgObj) => showMessage(msgObj.message));
        } else {
          showMessage(answer.message);
        }

        if (answer.cinemaList && answer.cinemaList.length > 0) {
          setCinemaList(answer.cinemaList);
        } else if (answer.movie) {
          setMovieDetails(answer.movie);
        }
        if (answer.content) {
          showMessage(answer.content);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [cinemaList, showMessage]
  );

  // 메시지 전송 (사용자 입력)
  const handleSendMessage = useCallback(
    async (msg) => {
      const trimmedMsg = msg.trim();
      if (trimmedMsg.length < 2) return;
      setMessages((prev) => [...prev, { sender: "user", content: trimmedMsg, time: new Date() }]);
      setMessage("");

      // mapRef 초기화
      if (mapRef.current) {
        mapRef.current.innerHTML = ""; // 내용 비우기
        mapRef.current.style.width = "0px"; // 초기 스타일 설정
        mapRef.current.style.height = "0px"; // 초기 스타일 설정
      }

      await sendMessageToBackend(trimmedMsg);
    },
    [sendMessageToBackend]
  );

  // 채팅 입력 버튼 클릭 시 처리
  const handleButtonClick = () => {
    handleSendMessage(message);
  };

  // 채팅창 열고 닫기 토글
  const toggleKomoran = () => {
    setIsKomoranOpen((prev) => !prev);
  };

  // 현재 시간 계산
  const getTime = (date) => {
    const now = date || new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12 || 12;
    const minutes = now.getMinutes();
    return `${ampm} ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  return (
    <>
      <div className={`komoran-container ${isKomoranOpen ? "open" : "closed"}`}>
        <div className="komoran-header">
          <div className="chat-header-logo">
            <img src="/image/logo.png" alt="logo" id="logo" />
          </div>
          <div className="header-title">영화 길잡이</div>
        </div>

        <div className="komoran-body" ref={bodyRef}>
          <div id="default">
            <div className="default-img">
              <img src="/image/logo.png" alt="logo" id="logo" />
            </div>
            <p>
              <b>영화 길잡이에 문의하기</b>
            </p>
          </div>
          {messages.map((msg, index) => {
            let isLatestMap = false;
            if (msg.content === "map") {
              const lastMapIndex = messages
                .map((m) => m.content)
                .lastIndexOf("map");
              isLatestMap = index === lastMapIndex;
            }

            const isFirstMessage = index === 0 && msg.content === "안녕";

            const showTime = index === 0 || (index > 0 && getTime(msg.time) !== getTime(messages[index - 1].time));

            // isLastBotMessage 설정
            const isLastBotMessage = msg.sender === "bot" && (index === messages.length - 1 || messages[index + 1]?.sender === "user");

            return (
              <React.Fragment key={index}>
                {showTime && (
                  <div className="time-display">
                    <p>{getTime(msg.time)}</p>
                  </div>
                )}
                <Message
                  sender={msg.sender}
                  content={msg.content}
                  isLastBotMessage={isLastBotMessage}
                  isLatestMap={isLatestMap}
                  isFirstMessage={isFirstMessage}
                  mapRef={mapRef}
                  isKomoranOpen={isKomoranOpen}
                  cinemas={cinemaList}
                  lastLocation={lastLocation}
                  markers={markers}
                  onMapRendered={scrollToBottom}
                />
              </React.Fragment>
            );
          })}
        </div>

        <div className="message-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(message);
              }
            }}
          />
          <button onClick={handleButtonClick}>전송</button>
        </div>
      </div>

      <div className="chat-float-button" onClick={toggleKomoran}>
        채팅
      </div>
    </>
  );
};

export default Komoran;
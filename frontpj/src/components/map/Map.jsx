/* global kakao */ // 전역 변수 선언

import { useEffect, useState } from "react";
import axios from "axios";

const Map = () => {
  const [map, setMap] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [markers, setMarkers] = useState([]); // 영화관 마커 관리
  const [myLocationMarker, setMyLocationMarker] = useState(null); // 내 위치 마커 관리
  const [scriptLoaded, setScriptLoaded] = useState(false); // ✅ 스크립트 중복 방지

  useEffect(() => {
    if (scriptLoaded) return; // ✅ 이미 로드되었으면 다시 로드하지 않음

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=508065e1afa2b73e19715edac2e24be9&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao) {
        kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new kakao.maps.LatLng(36.5, 127.5), // 전국 중심 좌표
            level: 13, // 전국이 보이도록 확대 수준 조정
          };
          setMap(new kakao.maps.Map(container, options));
        });
      } else {
        console.error("Kakao map API did not load correctly.");
      }
    };
    document.body.appendChild(script);
    setScriptLoaded(true); // ✅ 스크립트 로드 완료 상태 저장
  }, []);

  const loadCinemas = async () => {
    if (!map) return; // ✅ map이 없으면 실행하지 않음
    try {
      const res = await axios.get("http://localhost:8090/api/cinemas");
      setCinemas(res.data);
      clearMarkers();
      plotMarkers(res.data);

      // 전국이 보이도록 지도 확대 조정
      map.setCenter(new kakao.maps.LatLng(36.5, 127.5));
      map.setLevel(13);
    } catch (error) {
      console.error("Failed to load cinemas:", error);
    }
  };

  const findNearbyCinemas = async () => {
    if (!map) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await axios.get(
          `http://localhost:8090/api/cinemas/nearby?lat=${latitude}&lon=${longitude}`
        );
        setCinemas(res.data);
        clearMarkers(); // 기존 영화관 마커 삭제 후 새 마커 추가
        plotMarkers(res.data);

        // 내 위치를 중심으로 지도 이동 & 확대 조정
        map.setCenter(new kakao.maps.LatLng(latitude, longitude));
        map.setLevel(6);
      } catch (error) {
        console.error("Failed to load nearby cinemas:", error);
      }
    });
  };

  const findMyLocation = () => {
    if (!map) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // 기존 내 위치 마커 삭제
        if (myLocationMarker) {
          myLocationMarker.setMap(null);
        }

        const marker = new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(latitude, longitude),
          title: "내 위치",
          image: new kakao.maps.MarkerImage(
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
            new kakao.maps.Size(40, 40),
            { offset: new kakao.maps.Point(20, 40) }
          ),
        });

        setMyLocationMarker(marker);

        // 내 위치를 중심으로 지도 이동 & 확대
        map.setCenter(new kakao.maps.LatLng(latitude, longitude));
        map.setLevel(5);

        console.log(`내 위치: 위도 ${latitude}, 경도 ${longitude}`);
      },
      (error) => {
        console.error("위치 정보를 가져오는 데 실패했습니다.", error);
      },
      {
        enableHighAccuracy: true, // ✅ GPS 사용 강제 (더 정확한 위치)
        timeout: 10000, // 10초 내로 가져오지 못하면 실패 처리
        maximumAge: 0, // 항상 최신 위치 가져오기
      }
    );
  };

  const plotMarkers = (cinemas) => {
    if (!map) return;
    const newMarkers = cinemas.map(({ lat, lon, cinemaName, address }) => {
      const markerPosition = new kakao.maps.LatLng(lat, lon);
      const marker = new kakao.maps.Marker({
        map,
        position: markerPosition,
        title: cinemaName,
      });

      // 인포윈도우 생성
      const infowindow = new kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px;">
            <h4>${cinemaName} 메가박스</h4>
            <p>도로명주소: ${address}</p>
            <p>전화번호: 0000-0000</p> <!-- 모두 동일함 -->
          </div>
        `,
      });

      // 마커 클릭 시 인포윈도우 열기
      kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });

      return marker;
    });
    setMarkers(newMarkers);
  };

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null)); // 기존 영화관 마커 삭제
    setMarkers([]);
  };

  return (
    <div>
      <button onClick={loadCinemas}>전국 영화관 찾기</button>
      {/* <button onClick={findNearbyCinemas}>내 주변 영화관 찾기</button> */}
      <button onClick={findMyLocation}>내 위치 찾기</button>
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default Map;

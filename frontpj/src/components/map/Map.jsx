/* global kakao */
import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/map.css"

const Map = () => {
  const [map, setMap] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [allCinemas, setAllCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null); // 사용자 위치

  // Haversine 공식을 사용하여 두 지점 간의 거리 계산 (단위: km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);
    const R = 6371; // 지구 반지름 (km)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 컴포넌트 마운트 시 사용자 위치 요청
  useEffect(() => {
    getCurrentPosition()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      })
      .catch((error) => {
        console.error("사용자 위치를 가져오지 못했습니다.", error);
      });
  }, []);

  // Kakao 지도 스크립트 로딩
  useEffect(() => {
    if (scriptLoaded) return;
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=508065e1afa2b73e19715edac2e24be9&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao) {
        kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new kakao.maps.LatLng(36.5, 127.5),
            level: 13,
          };
          const newMap = new kakao.maps.Map(container, options);
          setMap(newMap);
        });
      } else {
        console.error("Kakao map API did not load correctly.");
      }
    };
    document.body.appendChild(script);
    setScriptLoaded(true);
  }, [scriptLoaded]);

  // 맵이 준비된 후 영화관 데이터 로드
  useEffect(() => {
    if (!map) return;
    loadCinemas();
  }, [map]);

  // 사용자 위치 업데이트 시 오버레이 갱신 (거리 표기 업데이트)
  useEffect(() => {
    if (map && cinemas.length > 0 && userLocation) {
      clearMarkers();
      plotMarkers(cinemas);
    }
  }, [userLocation]);

  // 지도 zoom 레벨 변화에 따라 오버레이 표시 제어 (zoom level 10 이하일 때만 오버레이 표시)
  useEffect(() => {
    if (!map) return;
    const zoomListener = () => {
      const level = map.getLevel();
      overlays.forEach((overlay) => {
        overlay.setMap(level <= 10 ? map : null);
      });
    };
    kakao.maps.event.addListener(map, "zoom_changed", zoomListener);
    return () => {
      kakao.maps.event.removeListener(map, "zoom_changed", zoomListener);
    };
  }, [map, overlays]);

  // 영화관 데이터 로드
  const loadCinemas = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8090/api/cinemas");
      const cinemaData = res.data;
      setCinemas(cinemaData);
      setAllCinemas(cinemaData);
      clearMarkers();
      plotMarkers(cinemaData);
      map.setCenter(new kakao.maps.LatLng(36.5, 127.5));
      map.setLevel(13);
    } catch (error) {
      console.error("Failed to load cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  // 근처 영화관 찾기 (거리순 정렬)
  const findNearbyCinemas = async () => {
    if (!map) return;
    setLoading(true);
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });

      const res = await axios.get(
        `http://localhost:8090/api/cinemas/nearby?lat=${latitude}&lon=${longitude}`
      );
      let nearbyCinemaData = res.data;
      // 사용자 위치 기준으로 가까운 순 정렬
      nearbyCinemaData.sort((a, b) =>
        calculateDistance(latitude, longitude, a.lat, a.lon) -
        calculateDistance(latitude, longitude, b.lat, b.lon)
      );
      setCinemas(nearbyCinemaData);
      setAllCinemas(nearbyCinemaData);
      clearMarkers();
      plotMarkers(nearbyCinemaData);
      map.setCenter(new kakao.maps.LatLng(latitude, longitude));
      map.setLevel(8);
    } catch (error) {
      console.error("Failed to load nearby cinemas:", error);
      if (error.message === "Geolocation is not supported by this browser.") {
        alert("Geolocation is not supported by this browser.");
      } else if (error.message === "User denied Geolocation permission") {
        alert("User denied Geolocation permission.");
      } else {
        alert("Failed to load nearby cinemas.");
      }
    } finally {
      setLoading(false);
    }
  };

  // getCurrentPosition을 Promise로 래핑
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(new Error("User denied Geolocation permission"));
          } else {
            reject(new Error("Geolocation error"));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // 내 위치 찾기 (내 위치 업데이트)
  const findMyLocation = () => {
    if (!map) return;
    setLoading(true);
    getCurrentPosition()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        const latlng = new kakao.maps.LatLng(latitude, longitude);
        map.setCenter(latlng);
        map.setLevel(6);
        console.log(`내 위치: 위도 ${latitude}, 경도 ${longitude}`);
      })
      .catch((error) => {
        console.error("위치 정보를 가져오는 데 실패했습니다.", error);
        if (error.message === "Geolocation is not supported by this browser.") {
          alert("Geolocation is not supported by this browser.");
        } else if (error.message === "User denied Geolocation permission") {
          alert("User denied Geolocation permission.");
        } else {
          alert("Failed to load My Location.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 마커 및 커스텀 오버레이 표시 (마커 클릭 이벤트 제거)
  const plotMarkers = (cinemaList) => {
    if (!map) return;
    const newMarkers = [];
    const newOverlays = [];

    cinemaList.forEach(({ lat, lon, cinemaName, address }) => {
      const markerPosition = new kakao.maps.LatLng(lat, lon);
      const marker = new kakao.maps.Marker({
        map,
        position: markerPosition,
        title: cinemaName,
      });
      newMarkers.push(marker);

      // 오버레이 내용: 영화관 이름, 주소, 사용자 위치 기준 거리 (userLocation이 있을 경우)
      let overlayContent = `<div style="padding:5px; background:#fff; border:1px solid #ccc; font-size:12px;">
        <strong>${cinemaName} Frame In</strong><br/>
        ${address}<br/>`;
      if (userLocation) {
        overlayContent += `${calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          lat,
          lon
        ).toFixed(2)} km`;
      }
      overlayContent += `</div>`;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: markerPosition,
        content: overlayContent,
        yAnchor: 1.5,
      });
      // 현재 zoom 레벨이 5 이하일 때만 오버레이 표시
      if (map.getLevel() <= 10) {
        customOverlay.setMap(map);
      }
      newOverlays.push(customOverlay);
    });

    setMarkers(newMarkers);
    setOverlays(newOverlays);
  };

  // 기존 마커와 오버레이 제거
  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    overlays.forEach((overlay) => overlay.setMap(null));
    setMarkers([]);
    setOverlays([]);
  };

  // 리스트 클릭 시 해당 위치로 이동
  const handleCinemaClick = (lat, lon) => {
    if (map) {
      const moveLatLon = new kakao.maps.LatLng(parseFloat(lat), parseFloat(lon));
      map.panTo(moveLatLon);
      setTimeout(() => {
        map.setLevel(3);
      }, 500);
    }
  };

  // 사용자 위치가 있을 경우, 전체 영화관 목록을 내 위치 기준 가까운 순으로 정렬
  const sortedCinemas = userLocation
    ? [...allCinemas].sort(
        (a, b) =>
          calculateDistance(userLocation.latitude, userLocation.longitude, a.lat, a.lon) -
          calculateDistance(userLocation.latitude, userLocation.longitude, b.lat, b.lon)
      )
    : allCinemas;

  return (
    <div className="map-container">
      <div className="map-buttons">
      <button onClick={findNearbyCinemas} disabled={loading}>
        내 주변 영화관 찾기 🎞
      </button>
      <button onClick={findMyLocation} disabled={loading}>
        내 위치 찾기 📍
      </button>
      </div>

      {loading && <div>Loading...</div>}

      <div id="map" style={{ width: "100%", height: "400px", marginTop: "10px" }}></div>

      {/* 전체 영화관 목록 (거리 표시 포함 및 내 위치 기준 가까운 순 정렬) */}
      {sortedCinemas.length > 0 && (
        <div
          className="map-list"
        >
          <h3>🗺️ 전체 영화관 목록
          </h3>
          <ul>
            {sortedCinemas.map((cinema, index) => (
              <li
                key={index}
                onClick={() => handleCinemaClick(cinema.lat, cinema.lon)}
              >
                <strong>{cinema.cinemaName} Frame In</strong>
                <span>📍 {cinema.address}</span>
                {userLocation && (
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {calculateDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      cinema.lat,
                      cinema.lon
                    ).toFixed(2)}{" "}
                    km
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Map;

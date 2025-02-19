
import React, { useState, useEffect } from "react";

const Trailer = () => {
  const [videoId, setVideoId] = useState(null);
  const apiKey = "AIzaSyBzigrNvoSwaxwi7n58sudW3l1h_FStoy0";
  const searchQuery = "검은 수녀들"; // 예고편을 가져올 영화 제목

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        // YouTube API 호출
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuery + " 예고편"
          )}&key=${apiKey}`
        );
        const data = await response.json();

        // 검색된 결과에서 첫 번째 영상 ID 추출
        if (data.items && data.items.length > 0) {
          const trailerId = data.items[0].id.videoId;
          setVideoId(trailerId);
        }
      } catch (error) {
        console.error("Error fetching YouTube trailer:", error);
      }
    };

    fetchTrailer();
  }, []);

  return (
    <div>
      <h1>검은 수녀들 예고편</h1>
      {videoId ? (
        <div>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>예고편을 불러오는 중...</p>
      )}
    </div>
  );
};

export default Trailer;

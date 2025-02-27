import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/admin/Cinemas.css";

const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    region: "",
    cinemaName: "",
    lat: "",
    lon: "",
    address: ""
  });

  // 검색과 페이징 관련 상태
  const [searchType, setSearchType] = useState("cinemaName"); // 검색 기준 (영화관 이름 또는 지역)
  const [searchValue, setSearchValue] = useState(""); // 검색어
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10; // 한 페이지당 10개씩 표시

  useEffect(() => {
    fetchCinemas();
  }, [page, searchType, searchValue]); // 페이지, 검색 기준, 검색어에 따라 영화관 데이터 재조회

  // 검색 엔드포인트를 호출하여 페이징 처리된 데이터를 가져옵니다.
  const fetchCinemas = async () => {
    try {
      const response = await axios.get("http://localhost:8090/admin/cinemas/search", {
        params: {
          page: page,
          size: size,
          [searchType]: searchValue, // 동적으로 검색 기준을 선택하여 보내기
        },
      });
      setCinemas(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("영화관 데이터 가져오기 실패:", error);
    }
  };

  // 검색 폼 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0); // 새로운 검색 시 첫 페이지로 이동
    fetchCinemas();
  };

  // 수정 버튼 클릭 시 해당 영화관의 데이터를 모달에 세팅
  const handleEditClick = (cinema) => {
    setSelectedCinema(cinema);
    setFormData({
      region: cinema.region || "null",
      cinemaName: cinema.cinemaName || "null",
      lat: cinema.lat !== null ? cinema.lat : "null",
      lon: cinema.lon !== null ? cinema.lon : "null",
      address: cinema.address || "null"
    });
    setShowModal(true);
  };

  // 입력 값 변경 시 formData 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 API 호출
  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...formData,
        lat: formData.lat === "null" ? null : parseFloat(formData.lat),
        lon: formData.lon === "null" ? null : parseFloat(formData.lon)
      };
      await axios.post(`http://localhost:8090/admin/update/${selectedCinema.id}`, updatedData);
      fetchCinemas();
      setShowModal(false);
    } catch (error) {
      console.error("업데이트 실패:", error);
    }
  };

  // 삭제 API 호출
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8090/admin/delete/${selectedCinema.id}`);
      fetchCinemas();
      setShowModal(false);
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 처음 페이지로 이동
  const handleFirstPage = () => {
    setPage(0);
  };

  // 마지막 페이지로 이동
  const handleLastPage = () => {
    setPage(totalPages - 1);
  };

  // 현재 페이지 기준 ±2 범위의 페이지 번호 계산
  const startPage = Math.max(0, page - 2);
  const endPage = Math.min(totalPages - 1, page + 2);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="cinema-management">
      <h2>영화관 관리</h2>

      {/* 검색 폼 */}
      <form onSubmit={handleSearchSubmit}>
        <label>
          검색 기준:
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="cinemaName">영화관 이름</option>
            <option value="region">지역</option>
          </select>
        </label>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="검색어 입력"
        />
        <button type="submit">검색</button>
      </form>

      {/* 영화관 테이블 */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>지역</th>
            <th>이름</th>
            <th>위도</th>
            <th>경도</th>
            <th>주소</th>
            <th>보기</th>
          </tr>
        </thead>
        <tbody>
          {cinemas.map((cinema) => (
            <tr key={cinema.id}>
              <td>{cinema.id}</td>
              <td>{cinema.region || "null"}</td>
              <td>{cinema.cinemaName || "null"}</td>
              <td>{cinema.lat !== null ? cinema.lat : "null"}</td>
              <td>{cinema.lon !== null ? cinema.lon : "null"}</td>
              <td>{cinema.address || "null"}</td>
              <td>
                <button onClick={() => handleEditClick(cinema)}>수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이징 컨트롤 */}
      <div className="pagination">
        <button onClick={handleFirstPage} disabled={page === 0}>
          &lt;&lt;
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            disabled={pageNumber === page}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button onClick={handleLastPage} disabled={page === totalPages - 1}>
          &gt;&gt;
        </button>
      </div>

      {/* 수정/삭제 모달 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>영화관 수정</h3>
            <label>
              지역:
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
              />
            </label>
            <label>
              이름:
              <input
                type="text"
                name="cinemaName"
                value={formData.cinemaName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              위도:
              <input
                type="text"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
              />
            </label>
            <label>
              경도:
              <input
                type="text"
                name="lon"
                value={formData.lon}
                onChange={handleInputChange}
              />
            </label>
            <label>
              주소:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleUpdate}>수정 완료</button>
              <button onClick={handleDelete}>삭제</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cinemas;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/admin/Cinemas.css";
import jwtAxios from "../../../util/jwtUtil";

const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    region: "",
    cinemaName: "",
    lat: "",
    lon: "",
    address: "",
  });

  const [searchType, setSearchType] = useState("cinemaName");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  useEffect(() => {
    fetchCinemas();
  }, [page, searchType, searchValue]); // 페이지, 검색 기준, 검색어에 따라 영화관 데이터 재조회

  const fetchCinemas = async () => {
    try {
      const response = await jwtAxios.get(
        "http://localhost:8090/admin/cinemas/search",
        {
          params: {
            page: page,
            size: size,
            [searchType]: searchValue,
          },
        }
      );

      if (response.data && response.data.content) {
        setCinemas(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setCinemas([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("영화관 데이터 가져오기 실패:", error);
      // 에러 발생 시 빈 배열 설정하여 map 에러 방지
      setCinemas([]);
    }
  };

  // 검색 폼 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0); // 새로운 검색 시 첫 페이지로 이동
    fetchCinemas();
  };

  // 수정 버튼
  const handleEditClick = (cinema) => {
    setSelectedCinema(cinema);
    setFormData({
      region: cinema.region || "null",
      cinemaName: cinema.cinemaName || "null",
      lat: cinema.lat !== null ? cinema.lat : "null",
      lon: cinema.lon !== null ? cinema.lon : "null",
      address: cinema.address || "null",
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
        lon: formData.lon === "null" ? null : parseFloat(formData.lon),
      };
      await jwtAxios.post(
        `http://localhost:8090/admin/update/${selectedCinema.id}`,
        updatedData
      );
      fetchCinemas();
      setShowModal(false);
    } catch (error) {
      console.error("업데이트 실패:", error);
    }
  };

  // 삭제 API 호출
  const handleDelete = async () => {
    try {
      await jwtAxios.delete(
        `http://localhost:8090/admin/delete/${selectedCinema.id}`
      );
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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="cinema-management">
      <h2>영화관 관리</h2>

      {/* 검색 폼 */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="cinemaName">영화관 이름</option>
          <option value="region">지역</option>
        </select>
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
                <span onClick={() => handleEditClick(cinema)}>수정</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이징 컨트롤 */}
      <div className="pagination">
        <button onClick={() => handlePageChange(0)} disabled={page === 0}>
          처음
        </button>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          이전
        </button>

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={page === pageNum ? "active" : ""}
          >
            {pageNum + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
        >
          다음
        </button>
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page === totalPages - 1}
        >
          마지막
        </button>
      </div>

      {/* 수정/삭제 모달 */}
      {showModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>영화관 수정</h3>
            <div>
              <span>지역</span>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <span>이름</span>
              <input
                type="text"
                name="cinemaName"
                value={formData.cinemaName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <span>위도</span>
              <input
                type="text"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <span>경도</span>
              <input
                type="text"
                name="lon"
                value={formData.lon}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <span>주소</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleDelete}>삭제</button>
              <button onClick={handleUpdate}>수정</button>
              <span
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✖
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cinemas;

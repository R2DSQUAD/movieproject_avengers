import { useState, useEffect, useRef } from "react";

// easeOutExpo 함수 정의
export const easeOutExpo = (t) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

// 점차 느려지는 count-up 함수
export const useCountUp = (num, duration) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrame = Math.round(duration / frameRate);
  const currentNumber = useRef(0); // currentNumber를 useRef로 설정

  useEffect(() => {
    const counter = setInterval(() => {
      const progressRate = easeOutExpo(++currentNumber.current / totalFrame);
      setCount(Math.round(num * progressRate));

      // 진행 완료시 interval 해제
      if (progressRate === 1) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter); // 클린업 함수 추가
  }, [num, duration]);

  return count;
};

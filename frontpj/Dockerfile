# 1. Node.js 기반 이미지 사용
FROM node:20-alpine AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package.json package-lock.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. React 빌드
RUN npm run build

# 7. Nginx를 사용해 정적 파일 서빙
FROM nginx:alpine

# 8. 빌드된 파일을 Nginx의 기본 HTML 폴더로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 9. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

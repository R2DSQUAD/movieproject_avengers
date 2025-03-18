# 1. JDK 17 이미지 사용
FROM openjdk:17-jdk-slim

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 정확한 JAR 파일 복사
COPY build/libs/app.jar app.jar  

# 4. 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

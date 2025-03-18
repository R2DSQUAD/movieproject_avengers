# 1. JDK 17 이미지 사용
FROM openjdk:17-jdk-slim

# 2. 타임존 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 정확한 JAR 파일 복사
COPY build/libs/app.jar app.jar  

# 5. 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

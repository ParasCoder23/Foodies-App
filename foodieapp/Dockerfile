### Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy maven wrapper and pom
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Copy source
COPY src ./src

# Ensure mvnw is executable and build the application producing a jar
RUN chmod +x ./mvnw || true
RUN ./mvnw -B -DskipTests package

### Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the fat jar produced by spring-boot-maven-plugin
COPY --from=build /app/target/foodieapp-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Use a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup || true
USER appuser

ENTRYPOINT ["sh","-c","java -Xms256m -Xmx512m -Djava.security.egd=file:/dev/./urandom -jar /app/app.jar"]

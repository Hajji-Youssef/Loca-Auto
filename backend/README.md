# Backend (Locaauto)

Notes for building locally:

- The project was developed against Java 17, but the build has been adjusted to work on newer JDKs when necessary.
- To build:

```bash
mvn -f backend/pom.xml clean package -DskipTests
```

- If you run into Lombok/annotation-processing issues, ensure your IDE has Lombok enabled.

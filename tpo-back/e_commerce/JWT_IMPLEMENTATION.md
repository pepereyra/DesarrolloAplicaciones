# Implementación de JWT (JSON Web Token)

## 📋 Resumen

Se implementó autenticación y autorización mediante JWT en la API Spring Boot del e-commerce.

## 🔧 Cambios Realizados

### 1. Dependencias Agregadas (`pom.xml`)

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT Dependencies -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

### 2. Configuración JWT (`application.properties`)

```properties
# JWT Configuration
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
# 86400000 ms = 24 horas
```

### 3. Archivos Creados/Modificados

#### Nuevos Archivos de Configuración:

- **`config/SecurityConfig.java`**: Configuración de Spring Security ✅ NUEVO
  - Define endpoints públicos: `/api/auth/**`, `/api/productos/**`, `/swagger-ui/**`
  - Protege endpoints: `/api/carrito/**`, `/api/favoritos/**`, `/api/usuarios/**`
  - Configura autenticación stateless (sin sesión HTTP - SessionCreationPolicy.STATELESS)
  - Implementa BCrypt para encriptación de contraseñas
  - Configura AuthenticationManager y AuthenticationProvider (DaoAuthenticationProvider)
  - Habilita CORS con `.cors(cors -> cors.configure(http))`
  - Deshabilita CSRF (no necesario para API REST stateless)

- **`config/JwtAuthenticationFilter.java`**: Filtro de autenticación ✅ NUEVO
  - Extiende `OncePerRequestFilter` (se ejecuta una vez por request)
  - Intercepta TODAS las peticiones HTTP antes de llegar a los controllers
  - Extrae token JWT del header `Authorization: Bearer {token}`
  - Valida el token usando JwtService
  - Si es válido, autentica al usuario en SecurityContextHolder
  - Si no hay token o es inválido, continúa sin autenticar (endpoints públicos seguirán funcionando)

#### Servicios Actualizados:

- **`service/JwtService.java`**: Servicio JWT completo ✅ REEMPLAZADO
  - ANTES: Mock implementation con tokens falsos
  - AHORA: Implementación real con JJWT 0.12.3
  - `generateToken(extraClaims, userDetails)`: Genera tokens JWT con HS384
  - `extractUsername(token)`: Extrae email del token
  - `isTokenValid(token, userDetails)`: Valida token y verifica expiración
  - `extractClaim(token, claimsResolver)`: Extrae claims personalizados
  - `validateToken(token)`: Método de compatibilidad para validación simple
  - `getUserIdFromToken(token)`: Extrae userId del payload

- **`service/UsuarioService.java`**: Implementa `UserDetailsService` ✅ ACTUALIZADO
  - AGREGADO: `implements UserDetailsService`
  - AGREGADO: `loadUserByUsername(email)`: Carga usuario para Spring Security
  - Convierte Usuario entity a Spring Security UserDetails
  - Mantiene métodos originales: getAllUsuarios(), getUsuarioById(), save()

- **`service/AuthService.java`**: Servicio de autenticación ✅ ACTUALIZADO
  - AGREGADO: Inyección de `PasswordEncoder` y `AuthenticationManager`
  - ACTUALIZADO: `login()` ahora usa AuthenticationManager para validar credenciales
  - ACTUALIZADO: `register()` encripta contraseña con BCrypt
  - AGREGADO: `generateUserId()` - genera ID único de 10 caracteres usando UUID
  - ACTUALIZADO: Generación de JWT con claims adicionales (userId, role)
  - Mantiene estructura de respuesta: AuthResponse(token, usuario)

## 🔐 Cómo Funciona

### Flujo de Autenticación

1. **Registro** (`POST /api/auth/register`)
   ```json
   {
     "email": "usuario@email.com",
     "password": "contraseña123",
     "nombre": "Juan",
     "apellido": "Pérez"
   }
   ```
   - Encripta la contraseña con BCrypt
   - Crea el usuario en la BD
   - Genera y devuelve un JWT

2. **Login** (`POST /api/auth/login`)
   ```json
   {
     "email": "usuario@email.com",
     "password": "contraseña123"
   }
   ```
   - Valida credenciales
   - Genera y devuelve un JWT

3. **Respuesta de Auth**
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "123",
       "firstName": "Juan",
       "lastName": "Pérez",
       "email": "usuario@email.com",
       "role": "user"
     }
   }
   ```

### Uso del Token

**En cada petición a endpoints protegidos**, el frontend debe enviar:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚪 Endpoints Públicos vs Protegidos

### Públicos (no requieren token):
- ✅ `/api/auth/**` - Login y registro
- ✅ `/api/productos/**` - Listar productos
- ✅ `/swagger-ui/**` - Documentación API
- ✅ `/v3/api-docs/**` - OpenAPI spec

### Protegidos (requieren token JWT):
- 🔒 `/api/carrito/**` - Gestión del carrito
- 🔒 `/api/favoritos/**` - Gestión de favoritos
- 🔒 `/api/usuarios/**` - Gestión de usuarios

## 🧪 Probar la Implementación

### 1. Compilar el proyecto
```powershell
.\mvnw.cmd clean install
```

### 2. Ejecutar la aplicación
```powershell
.\mvnw.cmd spring-boot:run
```

### 3. Probar con PowerShell

#### Registro:
```powershell
$body = '{"nombre":"Test","apellido":"User","email":"test@test.com","password":"pass123"}'
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -ContentType "application/json" -Body $body
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9.eyJyb2xlIjoidXNlciIsInVzZXJJZCI6ImQyN2JkNmQ5Y2MiLCJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzYyMTQ1OTkzLCJleHAiOjE3NjIyMzI2NDl9.nFnjhQEOhntIkObLhvTN1S0XABTcWdXHZdNK8w90atZTJyukaYkAEVeKjH232yFC",
  "usuario": {
    "id": "d27bd6d9cc",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@test.com",
    "role": "user"
  }
}
```

#### Login:
```powershell
$loginBody = '{"email":"test@test.com","password":"pass123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token
$userId = $loginResponse.usuario.id
```

#### Probar endpoint protegido:
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:8080/api/carrito/$userId" -Method GET -Headers $headers
```

#### Probar endpoint público (sin token):
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/productos" -Method GET
```

### 4. Probar con Postman/Thunder Client

#### Registro:
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "password123",
  "nombre": "Test",
  "apellido": "User"
}
```

#### Login:
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "password123"
}
```

#### Usar endpoint protegido:
```http
GET http://localhost:8080/api/carrito/{usuarioId}
Authorization: Bearer {TOKEN_AQUI}
```

## 🔑 Estructura del Token JWT

```
Header.Payload.Signature
```

**Header** incluye:
```json
{
  "alg": "HS384",
  "typ": "JWT"
}
```

**Payload** incluye:
```json
{
  "sub": "usuario@email.com",
  "userId": "d27bd6d9cc",
  "role": "user",
  "iat": 1762145993,
  "exp": 1762232393
}
```

**Campos del Payload**:
- `sub` (subject): Email del usuario (usado para autenticación)
- `userId`: ID único del usuario en la base de datos
- `role`: Rol del usuario (user, admin)
- `iat` (issued at): Timestamp de cuándo se emitió el token
- `exp` (expiration): Timestamp de cuándo expira el token (24 horas después de iat)

**Verificación**: Puedes copiar el token en https://jwt.io para ver su contenido decodificado.

## ⚠️ Importante

- ✅ Las contraseñas ahora se encriptan con BCrypt (algoritmo de hash seguro con salt automático)
- ✅ Los tokens expiran en 24 horas (86400000 ms)
- ✅ El secret key debe mantenerse privado (está en `.gitignore` vía application.properties)
- ✅ CORS está configurado para permitir localhost (en SecurityConfig y CorsConfig)
- ✅ IDs de usuario se generan automáticamente como UUID de 10 caracteres
- ⚠️ **IMPORTANTE**: No se pueden crear usuarios con el mismo email (constraint unique en BD)
- ⚠️ **FIX APLICADO**: Se corrigió error "Identifier must be manually assigned" agregando generación automática de ID en AuthService.register()

## 🐛 Errores Solucionados Durante la Implementación

### 1. Error: `Identifier of entity 'Usuario' must be manually assigned`
**Causa**: La entidad Usuario tiene `@Id` sin `@GeneratedValue`, y el ID es tipo String.

**Solución**: Agregado método `generateUserId()` en AuthService que genera un ID único de 10 caracteres usando UUID:
```java
private String generateUserId() {
    return java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 10);
}
```

### 2. Error: CORS 403 Forbidden en endpoints públicos
**Causa**: SecurityConfig no tenía CORS habilitado correctamente.

**Solución**: Agregado `.cors(cors -> cors.configure(http))` en SecurityFilterChain.

### 3. Deprecation Warning: MySQL8Dialect
**Causa**: Hibernate 6.x deprecó MySQL8Dialect.

**Nota**: Funciona correctamente, solo es un warning. Se puede cambiar a `org.hibernate.dialect.MySQLDialect` en application.properties para eliminar el warning.

## 🚀 Próximos Pasos

1. ✅ **COMPLETADO**: Implementar JWT con Spring Security
2. ✅ **COMPLETADO**: Encriptar contraseñas con BCrypt
3. ✅ **COMPLETADO**: Proteger endpoints según lógica de negocio
4. ⏳ **TODO**: Cambiar el `jwt.secret` en producción por una clave más segura y gestionada por variables de entorno
5. ⏳ **TODO**: Implementar refresh tokens para renovar sesiones sin re-login
6. ⏳ **TODO**: Agregar roles específicos (ADMIN, USER) con `@PreAuthorize("hasRole('ADMIN')")`
7. ⏳ **TODO**: Implementar logout con blacklist de tokens (Redis/Base de datos)
8. ⏳ **TODO**: Agregar rate limiting para endpoints de autenticación

## 📊 Resultado de Pruebas

### ✅ Tests Realizados Exitosamente:

1. **Registro de Usuario**
   - ✅ POST `/api/auth/register` → Retorna token JWT válido
   - ✅ Contraseña encriptada con BCrypt
   - ✅ Usuario guardado en BD con ID generado automáticamente
   - ✅ Carrito creado automáticamente para el usuario

2. **Login de Usuario**
   - ✅ POST `/api/auth/login` → Retorna token JWT válido
   - ✅ Validación de credenciales con AuthenticationManager
   - ✅ Token contiene claims: userId, role, email

3. **Endpoints Públicos**
   - ✅ GET `/api/productos` → Funciona sin token

4. **Endpoints Protegidos**
   - ✅ GET `/api/carrito/{userId}` → Requiere token válido
   - ✅ GET `/api/favoritos/{userId}` → Requiere token válido
   - ⚠️ Retornan 404 si no existen datos (correcto, no es error de autenticación)

5. **Validación de Token**
   - ✅ Token válido → 200 OK
   - ✅ Sin token → 403 Forbidden
   - ✅ Token inválido → 403 Forbidden
   - ✅ Token expirado → 403 Forbidden

## 📚 Referencias

- [JJWT Documentation](https://github.com/jwtk/jjwt)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/)

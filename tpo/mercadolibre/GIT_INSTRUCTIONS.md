# Instrucciones para Git y GitHub

## Configuración Inicial

1. **Verificar instalación de Git**:
```bash
git --version
```

2. **Configurar datos de usuario**:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

## Inicializar y Subir el Proyecto

1. **Inicializar repositorio** (si no está inicializado):
```bash
git init
```

2. **Ver estado de archivos**:
```bash
git status
```

3. **Agregar archivos al staging**:
```bash
git add .
```

4. **Crear commit con los cambios**:
```bash
git commit -m "Primer commit: Proyecto MercadoLibre clone con sistema de autenticación"
```

5. **Vincular con repositorio remoto** (reemplaza URL_DEL_REPO con tu URL de GitHub):
```bash
git remote add origin URL_DEL_REPO
```

6. **Verificar conexión remota**:
```bash
git remote -v
```

7. **Subir cambios al repositorio**:
```bash
git push -u origin master
```

## Actualizar Cambios

1. **Ver cambios pendientes**:
```bash
git status
```

2. **Agregar nuevos cambios**:
```bash
git add .
```

3. **Crear commit**:
```bash
git commit -m "Descripción de los cambios realizados"
```

4. **Subir actualizaciones**:
```bash
git push
```

## Estructura del Proyecto

- `/src`: Código fuente
  - `/components`: Componentes React (Login, Register)
  - `/context`: Contexto de autenticación
  - `/styles`: Archivos CSS
- `db.json`: Base de datos JSON para usuarios y productos
- `package.json`: Dependencias y scripts

## Notas Importantes

- No subir `node_modules/` (ya está en .gitignore)
- Mantener las credenciales sensibles fuera del repositorio
- Hacer commits frecuentes y con mensajes descriptivos
- Asegurarse de que el servidor JSON esté corriendo antes de probar la autenticación
# ServiHogar

Plataforma web que conecta clientes con trabajadores del hogar verificados (gasfitería, electricidad, limpieza, etc.).

## ¿Necesita base de datos?

**No para esta demo.** Todo funciona de forma **local** en el navegador usando `localStorage`
(ver `assets/js/datos.js`). Un trabajador que se registra y publica un servicio queda
visible para cualquier cliente que inicie sesión **en el mismo navegador**.

> Para un sistema real multi-dispositivo (que cada usuario vea los datos desde su propio
> equipo) sí haría falta un backend con base de datos (por ejemplo Node + MongoDB/MySQL o
> Firebase). La capa `DB` de `datos.js` está aislada, por lo que migrar a una API más
> adelante solo implicaría reemplazar esas funciones.

## Cómo ejecutar

Abre `index.html` en el navegador, o sirve la carpeta con un servidor estático:

```bash
python -m http.server 8123
# luego abre http://localhost:8123
```

## Cuentas de ejemplo

| Rol        | Correo                      | Contraseña |
|------------|-----------------------------|------------|
| Cliente    | cliente@servihogar.com      | 123456     |
| Trabajador | trabajador@servihogar.com   | 123456     |

## Funcionalidades

- **Registro con verificación de trabajador**: DNI, categoría, experiencia, descripción y
  declaración de veracidad. Incluye validaciones (teléfono de 9 dígitos, DNI de 8 dígitos,
  correo válido, contraseña mínima, DNI/correo únicos, etc.).
- **Apartados distintos por rol**: el trabajador ve "Mis publicaciones" y puede **Publicar**;
  el cliente ve "Servicios disponibles" y puede **Buscar** y **Contactar**.
- **Publicaciones**: el trabajador publica servicios (`app-publicar.html`) que el cliente ve
  en el inicio y en la búsqueda.
- **Chat funcional**: los mensajes se guardan por par de usuarios. Cada quien ve sus mensajes
  como emisor (derecha) y los del otro como receptor (izquierda).

## Estructura

- `index.html`, `como-funciona.html`, `sobre-nosotros.html`, `login.html`, `registro.html` — sitio público.
- `app-*.html` — aplicación interna (inicio, buscar, publicar, chat, historial, perfil).
- `assets/js/datos.js` — capa de datos local compartida (usuarios, publicaciones, chats, seed).
- `assets/js/registro.js`, `app.js`, `app-interno.js`, `perfil.js` — lógica por página.
- `assets/css/` — estilos.

/* ============================================================
   ServiHogar — Capa de datos local (localStorage)
   ------------------------------------------------------------
   Todo el proyecto funciona de forma LOCAL en el navegador.
   No se necesita una base de datos general: los datos de
   usuarios, publicaciones y chats se guardan en localStorage,
   por lo que un trabajador que se registra y publica un
   servicio puede ser visto al iniciar sesión como cliente
   en el mismo navegador.
   ============================================================ */
(function () {
  "use strict";

  const K_USUARIOS = "servihogar_usuarios";
  const K_SESION = "servihogar_sesion";
  const K_PUBLICACIONES = "servihogar_publicaciones";
  const K_CHATS = "servihogar_chats";
  const K_OCULTO = "servihogar_chats_ocultos";
  const K_SEED = "servihogar_seed_v1";

  function leer(clave, porDefecto) {
    try {
      return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }
  function guardar(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function normCorreo(c) {
    return (c || "").trim().toLowerCase();
  }
  function claveChat(correoA, correoB) {
    return [normCorreo(correoA), normCorreo(correoB)].sort().join("|");
  }

  const DB = {
    // ---------- Usuarios ----------
    getUsuarios() {
      return leer(K_USUARIOS, []);
    },
    getUsuarioPorCorreo(correo) {
      const c = normCorreo(correo);
      return this.getUsuarios().find((u) => normCorreo(u.correo) === c) || null;
    },
    addUsuario(usuario) {
      const usuarios = this.getUsuarios();
      usuario.id = usuario.id || uid();
      usuarios.push(usuario);
      guardar(K_USUARIOS, usuarios);
      return usuario;
    },
    autenticar(correo, contrasena) {
      const c = normCorreo(correo);
      return (
        this.getUsuarios().find(
          (u) => normCorreo(u.correo) === c && u.contrasena === contrasena
        ) || null
      );
    },

    // ---------- Sesión ----------
    getSesion() {
      return leer(K_SESION, null);
    },
    setSesion(usuario) {
      guardar(K_SESION, usuario);
    },
    cerrarSesion() {
      localStorage.removeItem(K_SESION);
    },

    // ---------- Publicaciones (servicios de trabajadores) ----------
    getPublicaciones() {
      return leer(K_PUBLICACIONES, []);
    },
    addPublicacion(pub) {
      const pubs = this.getPublicaciones();
      pub.id = pub.id || uid();
      pub.ts = pub.ts || Date.now();
      pubs.unshift(pub);
      guardar(K_PUBLICACIONES, pubs);
      return pub;
    },
    getPublicacionesDe(correoTrabajador) {
      const c = normCorreo(correoTrabajador);
      return this.getPublicaciones().filter(
        (p) => normCorreo(p.trabajadorCorreo) === c
      );
    },
    eliminarPublicacion(id) {
      guardar(
        K_PUBLICACIONES,
        this.getPublicaciones().filter((p) => p.id !== id)
      );
    },

    // ---------- Chats ----------
    // Momento (timestamp) desde el cual el usuario indicado vació el chat.
    // Los mensajes anteriores quedan ocultos SOLO para ese usuario.
    getCorteOculto(clave, correo) {
      const oculto = leer(K_OCULTO, {});
      return (oculto[clave] && oculto[clave][normCorreo(correo)]) || 0;
    },
    // El primer argumento es el usuario que ve el chat (se filtra para él)
    getMensajes(viewerCorreo, otroCorreo) {
      const todos = leer(K_CHATS, {});
      const clave = claveChat(viewerCorreo, otroCorreo);
      const msgs = todos[clave] || [];
      const corte = this.getCorteOculto(clave, viewerCorreo);
      return corte ? msgs.filter((m) => m.ts > corte) : msgs;
    },
    addMensaje(deCorreo, paraCorreo, texto, imagen) {
      const todos = leer(K_CHATS, {});
      const clave = claveChat(deCorreo, paraCorreo);
      if (!todos[clave]) todos[clave] = [];
      const msg = {
        de: normCorreo(deCorreo),
        para: normCorreo(paraCorreo),
        texto: texto || "",
        imagen: imagen || null,
        ts: Date.now(),
      };
      todos[clave].push(msg);
      guardar(K_CHATS, todos);
      return msg;
    },
    // Vaciar el chat SOLO para el usuario indicado (el contacto sigue
    // viendo sus mensajes). La conversación se mantiene en la lista.
    vaciarMensajes(usuarioCorreo, otroCorreo) {
      const todos = leer(K_CHATS, {});
      const clave = claveChat(usuarioCorreo, otroCorreo);
      const msgs = todos[clave] || [];
      // Corte = ts del último mensaje actual; así se ocultan todos los
      // mensajes existentes y los nuevos (ts mayor) sí se mostrarán.
      const corte = msgs.length ? msgs[msgs.length - 1].ts : Date.now();
      const oculto = leer(K_OCULTO, {});
      if (!oculto[clave]) oculto[clave] = {};
      oculto[clave][normCorreo(usuarioCorreo)] = corte;
      guardar(K_OCULTO, oculto);
    },
    // Lista de conversaciones del usuario indicado (un objeto por cada
    // otra persona con la que ha intercambiado mensajes)
    getConversacionesDe(correo) {
      const c = normCorreo(correo);
      const todos = leer(K_CHATS, {});
      const convs = [];
      Object.keys(todos).forEach((clave) => {
        const partes = clave.split("|");
        if (partes.indexOf(c) === -1) return;
        const otroCorreo = partes[0] === c ? partes[1] : partes[0];
        const otro = this.getUsuarioPorCorreo(otroCorreo);
        const corte = this.getCorteOculto(clave, c);
        const mensajes = corte ? todos[clave].filter((m) => m.ts > corte) : todos[clave];
        convs.push({
          correo: otroCorreo,
          nombre: otro
            ? otro.nombre + " " + (otro.apellido || "")
            : otroCorreo,
          tipo: otro ? otro.tipo : "cliente",
          ultimo: mensajes.length ? mensajes[mensajes.length - 1] : null,
        });
      });
      convs.sort(
        (a, b) => (b.ultimo ? b.ultimo.ts : 0) - (a.ultimo ? a.ultimo.ts : 0)
      );
      return convs;
    },

    // ---------- Utilidades ----------
    iniciales(usuario) {
      if (!usuario || !usuario.nombre) return "?";
      const a = usuario.nombre.trim()[0] || "";
      const b = usuario.apellido ? usuario.apellido.trim()[0] : "";
      return (a + b).toUpperCase();
    },
    capitalizar(txt) {
      if (!txt) return "";
      return txt.charAt(0).toUpperCase() + txt.slice(1);
    },
  };

  // ============================================================
  //  SEED — Cuentas y datos de ejemplo para facilitar el testeo
  // ============================================================
  function sembrar() {
    if (localStorage.getItem(K_SEED)) return;

    const usuarios = DB.getUsuarios();
    const existe = (correo) => usuarios.some((u) => normCorreo(u.correo) === correo);

    // --- Cuenta de ejemplo: TRABAJADOR (verificado) ---
    const trabajador = {
      id: "demo-trabajador",
      nombre: "Carlos",
      apellido: "Quispe",
      telefono: "987654321",
      correo: "trabajador@servihogar.com",
      distrito: "Miraflores",
      tipo: "trabajador",
      contrasena: "123456",
      dni: "45678912",
      categoria: "gasfitería",
      experiencia: "8",
      descripcion:
        "Gasfitero certificado con 8 años de experiencia en instalaciones y reparaciones de agua y desagüe.",
      verificado: true,
    };

    // --- Cuenta de ejemplo: CLIENTE ---
    const cliente = {
      id: "demo-cliente",
      nombre: "Ana",
      apellido: "Rodríguez",
      telefono: "912345678",
      correo: "cliente@servihogar.com",
      distrito: "San Isidro",
      tipo: "cliente",
      contrasena: "123456",
    };

    if (!existe(trabajador.correo)) usuarios.push(trabajador);
    if (!existe(cliente.correo)) usuarios.push(cliente);

    // Un segundo trabajador de ejemplo para poblar la búsqueda
    const trabajadora2 = {
      id: "demo-trabajadora2",
      nombre: "Rosa",
      apellido: "Flores",
      telefono: "956781234",
      correo: "rosa@servihogar.com",
      distrito: "Surco",
      tipo: "trabajador",
      contrasena: "123456",
      dni: "41258963",
      categoria: "limpieza",
      experiencia: "5",
      descripcion: "Servicio de limpieza profunda del hogar, puntual y de confianza.",
      verificado: true,
    };
    if (!existe(trabajadora2.correo)) usuarios.push(trabajadora2);

    guardar(K_USUARIOS, usuarios);

    // --- Publicaciones de ejemplo ---
    const pubs = DB.getPublicaciones();
    if (pubs.length === 0) {
      guardar(K_PUBLICACIONES, [
        {
          id: "pub-1",
          trabajadorCorreo: trabajador.correo,
          trabajadorNombre: "Carlos Quispe",
          categoria: "gasfitería",
          titulo: "Instalación y reparación de tuberías de agua",
          descripcion:
            "Detección de fugas, desatoros, cambio de tuberías y grifería. Trabajo garantizado por 6 meses.",
          distrito: "Miraflores",
          precio: "S/ 80",
          ts: Date.now() - 7200000,
        },
        {
          id: "pub-2",
          trabajadorCorreo: trabajadora2.correo,
          trabajadorNombre: "Rosa Flores",
          categoria: "limpieza",
          titulo: "Limpieza profunda de departamentos",
          descripcion:
            "Limpieza de pisos, ventanas, cocina a fondo, baños y organización general. Por horas o jornada completa.",
          distrito: "Surco",
          precio: "S/ 120",
          ts: Date.now() - 18000000,
        },
      ]);
    }

    // --- Conversación de ejemplo cliente <-> trabajador ---
    if (DB.getMensajes(cliente.correo, trabajador.correo).length === 0) {
      DB.addMensaje(cliente.correo, trabajador.correo, "Hola Carlos, necesito reparar una fuga en el baño.");
      DB.addMensaje(trabajador.correo, cliente.correo, "Hola Ana, claro. ¿Para qué día lo necesitas?");
      DB.addMensaje(cliente.correo, trabajador.correo, "Si puedes este sábado por la mañana sería ideal.");
    }

    localStorage.setItem(K_SEED, "1");
  }

  sembrar();

  // Exponer en el ámbito global
  window.DB = DB;
})();

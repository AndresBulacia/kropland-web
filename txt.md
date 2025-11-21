kropland-web/
│
├── 📁 admin/                          # Aplicación web (Vite + React + TypeScript)
│   │
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── mock.ts               # API endpoints simulados para desarrollo
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📁 actividades/
│   │   │   │   ├── ActividadCard.css
│   │   │   │   ├── ActividadCard.tsx
│   │   │   │   ├── ActividadForm.css
│   │   │   │   └── ActividadForm.tsx
│   │   │   │
│   │   │   ├── 📁 calendario/
│   │   │   │   ├── calendarioView.tsx
│   │   │   │   └── EventoCalendario.tsx
│   │   │   │
│   │   │   ├── 📁 clientes/
│   │   │   │   ├── ClienteCard.css
│   │   │   │   ├── ClienteCard.tsx
│   │   │   │   ├── ClienteForm.css
│   │   │   │   ├── ClienteForm.tsx
│   │   │   │   ├── ClienteList.tsx
│   │   │   │   └── ImportCSV.css
│   │   │   │
│   │   │   ├── 📁 common/
│   │   │   │   ├── ActivityList.css
│   │   │   │   ├── ActivityList.tsx
│   │   │   │   ├── Badge.css
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.css
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.css
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── Input.css
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── Modal.css
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── SearchBar.css
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SimpleChart.css
│   │   │   │   ├── SimpleChart.tsx
│   │   │   │   ├── StatCard.css
│   │   │   │   └── StatCard.tsx
│   │   │   │
│   │   │   ├── 📁 fincas/
│   │   │   │   ├── ActividadesList.tsx
│   │   │   │   ├── ActividadesForm.tsx
│   │   │   │   ├── Cronograma.tsx
│   │   │   │   ├── FincaCard.css
│   │   │   │   ├── FincaCard.tsx
│   │   │   │   ├── FincaCardDetail.tsx
│   │   │   │   ├── FincaForm.css
│   │   │   │   ├── FincaForm.tsx
│   │   │   │   ├── MapaFinca.tsx
│   │   │   │   └── ResumenEconomico.tsx
│   │   │   │
│   │   │   ├── 📁 informes/
│   │   │   │   ├── calculadoraCaldo.tsx
│   │   │   │   └── ExportarInformes.tsx
│   │   │   │
│   │   │   ├── 📁 layout/
│   │   │   │   ├── AppLayout.css
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Header.css
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── MobileNav.css
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   ├── Sidebar.css
│   │   │   │   └── Sidebar.tsx
│   │   │   │
│   │   │   ├── 📁 mapa/
│   │   │   │   ├── FincaMarker.tsx
│   │   │   │   └── MapaGeneral.tsx
│   │   │   │
│   │   │   ├── 📁 visitas/
│   │   │   │   ├── VisitaCard.tsx
│   │   │   │   ├── VisitaForm.tsx
│   │   │   │   └── VisitaList.tsx
│   │   │   │
│   │   │   ├── OfflineIndicator.css
│   │   │   ├── OfflineIndicator.tsx   # Indicador de estado offline/online
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── SyncStatus.css         
│   │   │   └── SyncStatus.tsx         # Indicador de sincronización
│   │   │
│   │   ├── 📁 hooks/                  # Custom React hooks
│   │   │   ├── useActividades.ts      # Hook para gestión de actividades
│   │   │   ├── useAuth.ts             # Hook para gestión de sesión
│   │   │   ├── useClientes.ts         # Hook para gestión de clientes
│   │   │   ├── useEstadisticas.ts     # Hook para gestión de estadisticas
│   │   │   ├── useFincas.ts           # Hook para gestión de fincas
│   │   │   └── useVisitas.ts          # Hook para gestión de visitas
│   │   │
│   │   ├── 📁 lib/
│   │   │   ├── dateUtils.ts
│   │   │   ├── db.ts                  # IndexedDB - base de datos local
│   │   │   ├── demoData.ts
│   │   │   ├── fakeApi.ts
│   │   │   ├── helpers.ts
│   │   │   ├── offline.ts             # Detección de conectividad
│   │   │   ├── storage.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useResponsive.ts
│   │   │   ├── utils.ts               # Utilidades generales
│   │   │   └── validators.ts
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── AdminDashboard.css
│   │   │   ├── AdminDashboard.tsx
│   │   │   │
│   │   │   ├── CalendarioPage.css
│   │   │   ├── CalendarioPage.tsx
│   │   │   │
│   │   │   ├── ClienteDetailPage.css
│   │   │   ├── ClienteDetailPage.tsx
│   │   │   │
│   │   │   ├── ClientesPage.css
│   │   │   ├── ClientesPage.tsx
│   │   │   │
│   │   │   ├── Dashboard.tsx
│   │   │   │
│   │   │   ├── FincasDetailPage.css
│   │   │   ├── FincasDetailPage.tsx
│   │   │   │
│   │   │   ├── FincasPage.css
│   │   │   ├── FincasPage.tsx
│   │   │   │
│   │   │   ├── InformesPage.css
│   │   │   ├── InformesPage.tsx
│   │   │   │
│   │   │   ├── InicioPage.css
│   │   │   ├── InicioPage.tsx
│   │   │   │
│   │   │   ├── LoginPage.css
│   │   │   ├── LoginPage.tsx
│   │   │   │
│   │   │   ├── MapaPage.tsx
│   │   │   ├── MapaPage.css
│   │   │   │
│   │   │   ├── NotFoundPage.tsx
│   │   │   │
│   │   │   ├── VisitasPage.css
│   │   │   └── VisitasPage.tsx
│   │   │
│   │   ├── 📁 store/                  # Estado global (si necesitas Zustand/Redux)
│   │   │   └── authStore.ts           # Store de autenticación
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── globals.css            # Estilos globales
│   │   │   └── variables.css          # Variables CSS (colores, fonts)
│   │   │
│   │   ├── 📁 types/
│   │   │   ├── actividad.ts
│   │   │   ├── client.d.ts
│   │   │   ├── cliente.ts
│   │   │   ├── finca.d.ts
│   │   │   ├── finca.ts
│   │   │   ├── index.ts
│   │   │   ├── visit.d.ts
│   │   │   └── visita.ts
│   │   │
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css                  # Estilos principales
│   │   ├── main.tsx                   # Entry point (Vite)
│   │   └── vite-env.d.ts              # Tipos de Vite
│   │
│   ├── 📁 public/
│   │   ├── Kropland-logo.svg
│   │   ├── manifest.json              # PWA manifest (configuración de app)
│   │   ├── service-worker.js          # Service Worker (offline capabilities)
│   │   └── vite.svg
│   │
│   ├── .gitignore                     # Archivos a ignorar en Git
│   ├── eslint.config.js               # Configuración de ESLint
│   ├── index.html                     # HTML principal (Vite)
│   ├── package-lock.json
│   ├── package.json                   # Dependencias del proyecto
│   ├── README.md                      # Documentación del proyecto
│   ├── tsconfig.app.json              # Config TypeScript para la app
│   ├── tsconfig.json                  # Configuración TypeScript
│   ├── tsconfig.node.json             # Config TypeScript para Node
│   └── vite.config.ts                 # Configuración de Vite
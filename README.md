# Pruebas de Contrato en Microservicios - Reserva de Salas

 Sistema compuesto por tres servicios independientes con pruebas de contrato implementadas con Pact para validar esas comunicaciones.

 ## Servicios

- **servicio-reservacion** (`services/reservation-service`, puerto 3001) — es el
  proveedor. Crea reservas, las almacena, permite consultarlas por usuario
  y verifica si una reserva existe y está activa.
- **portal-usuario** (`services/user-portal`, puerto 3002) — consumidor.
  Permite a un usuario consultar sus reservas y crear una nueva.
- **servicio-admin** (`services/admin-service`, puerto 3003) — consumidor.
  Permite verificar si una reserva específica existe y está activa.

## Requisitos

- Node.js 20+ y npm
- Docker Desktop

---

## 1. Instalar dependencias

```
cd services\reservation-service
npm install
cd ..\..

cd services\user-portal
npm install
cd ..\..

cd services\admin-service
npm install
cd ..\..
```

## 2. Levantar el sistema con Docker

```
docker compose up -d --build
```

Verificar (PowerShell):

```powershell
curl http://localhost:3001/health
curl http://localhost:3002/api/reservas/U100
curl http://localhost:3003/api/verificar/R-1001
```

Bajar todo: `docker compose down`

## 3. Ejecutar las pruebas de los consumidores

Genera automáticamente los contratos en `pacts\`:

```
cd services\user-portal
npx jest test/ --runInBand
cd ..\..

cd services\admin-service
npx jest test/ --runInBand
cd ..\..
```

## 4. Verificar el servicio-reservacion contra los contratos

```
cd services\reservation-service
npx jest test/provider.pact.test.js --runInBand
cd ..\..
```

Esto levanta el proveedor real, prepara cada estado de prueba definido en
`test/states.js`, y compara sus respuestas contra lo que cada contrato
en `pacts\` espera.

> **Orden importante:** primero el paso 3 (genera los contratos), después el
> paso 4 (los verifica). Si lo haces al revés, no habrá nada que verificar.

## Estados de prueba (provider states)

| Estado | Prepara |
|--------|---------|
| `el usuario U100 tiene una reserva activa` | Una reserva activa para U100 |
| `el usuario U200 no tiene reservas` | Store vacío para U200 |
| `la reserva R-1001 existe y está activa` | Reserva `R-1001` activa |
| `la reserva no existe` | Store vacío |
| `el sistema está listo para crear una reserva` | Store limpio |

## Endpoints del servicio-reservacion

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/reservations` | Crea una reserva. `400` si `hours <= 0`. |
| GET | `/reservations?userId=U100` | Reservas de un usuario (`[]` si no tiene). |
| GET | `/reservations/:id/estado` | `{ reservationId, valid }`. |

## Ramas del Repositorio

```
main
├── feature/reservation-service     # Servicio de Reservas + estados de prueba
├── feature/user-portal             # Portal de Usuario + contratos 1 y 2
├── feature/admin-service           # Servicio de Administración + contrato 3
├── chore/docker-compose            # docker-compose.yml, Dockerfiles, .gitignore
└── docs/readme                     # README y documentación
```

## Principales dificultades encontradas

- **Orden de arranque de los contenedores:**
    portal-usuario y servicio-admin a veces levantaban antes de que servicio-reservacion estuviera listo para recibir peticiones; se solucionó agregando un `healthcheck` al proveedor y `depends_on` con `condition: service_healthy` en los otros dos.
- **Comunicación entre contenedores en Docker:**
    al principio los consumidores intentaban llegar al proveedor usando `localhost`, lo cual falla dentro de contenedores separados; se resolvió usando el nombre del servicio definido en `docker-compose.yml` (`servicio-reservacion`) como hostname, y una variable de entorno (`RESERVATION_SERVICE_URL`) para no dejarlo hardcodeado.

## Video

https://drive.google.com/file/d/1KL0uCx6EYsJ_HM3rkkyw31z2G0Qpdypq/view?usp=sharing
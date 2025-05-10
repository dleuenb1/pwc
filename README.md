# Serwer WWW - Konfiguracja Nginx (1.26.0)

## Opis ogólny:
Moduł serwera WWW korzysta z Nginx w wersji 1.26.0 działającego jako serwer reverse-proxy oraz serwer plików statycznych. Zapewnia następujące funkcjonalności:

- Udostępnianie zasobów frontendowych (plików statycznych).
- Reverse-proxy dla backendowego API napisanego we frameworku Flask.

## Struktura komunikacji:
```
Użytkownik (przeglądarka)
    │
    ├──→ Nginx (port HTTP 80)
            │
            ├── /front/ → serwowanie plików statycznych
            │
            └── /api/ → przekierowanie ruchu do Flask API (127.0.0.1:5454)
```

## Szczegóły techniczne konfiguracji Nginx:

### SSL/TLS:
- Protokoły: TLSv1.2, TLSv1.3
- Obecnie SSL nieaktywne, serwer gotowy do wdrożenia SSL po dostarczeniu certyfikatu.

### Lokalizacja plików konfiguracyjnych:
- Główny plik konfiguracji: `/etc/nginx/nginx.conf`
- Plik definicji lokalizacji (sites-available): `/etc/nginx/sites-available/default`


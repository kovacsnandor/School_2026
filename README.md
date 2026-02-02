# Projekt: 14_School_2026
## Frontend
- MInta alkalmazás a school adatbázishoz


## Backend

Célja:
- Legyen a komplett minta
  - Migrációra
  - Kontrollerekre
  - Endpointokra
  - Be és kijelentkezés megvalósítására
  - Tesztekre

# Git
## Kényszerített pull (fetch): 
- Rá akarjuk húzni a távoli repót a munkánkra (mindent felülír)
1. Lehúzzuk az összes változást, de ezt még nem hajtja végre (eredet lekérés) Szaggatott le nyíl
```console
git fetch origin
```
2. Áganként felülírhatjuk saját kódunkat a letöltött tartalommal
```console
git reset --hard origin/<ág_neve>
```
3. Ha csináltál új fájlokat, mappákat ebben az ágban, akkor ezt külön le kell takarítani
```console
git clean -fd
```
### Egy lépésben
- Az ág nevét be kell írni
```console
git fetch origin && git reset --hard origin/<ág_neve> && git clean -fd
```
- Az ág nevét automatikusan kifigyeli
```console
git fetch origin && git reset --hard origin/$(git branch --show-current) && git clean -fd
``` 

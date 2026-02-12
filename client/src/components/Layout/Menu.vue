<template>
  <div>
    <nav class="navbar navbar-expand-md bg-primary" data-bs-theme="dark">
      <div class="container-fluid">
        <!-- <a class="navbar-brand" href="#">Navbar</a> -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Főoldal</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/about">Rólunk</RouterLink>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Adatok
              </a>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink class="dropdown-item" to="/adatok/sport"
                    >Sportok</RouterLink
                  >
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/adatok/schoolclass"
                    >Osztályok</RouterLink
                  >
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/adatok/student"
                    >Tanulók</RouterLink
                  >
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <RouterLink class="dropdown-item" to="/adatok/plaingsport"
                    >Sportolás</RouterLink
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
          </ul>
          <form class="d-flex" role="search">
            <input
              id="search"
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              v-model="searchWordInput"
            />

            <label for="search" class="form-label m-0">
              <i @click="onClickSearchButton" class="bi bi-search fs-4 my-pointer"></i>
            </label>
          </form>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useSearchStore } from "@/stores/searchStore";
export default {
  data() {
    return {
      searchWordInput: "",
      timeout: null,
    };
  },
  watch: {
    //Keresőszó késleltetés
    // searchWordInput(value) {
    //   //töröljük az éppen futó setTimeout-ot
    //   //hogy újraindíthassuk
    //   clearTimeout(this.timeout);
    //   //x-re kattintva kiürül az kereső input
    //   if (value === "") {
    //     this.setSearchWord("");
    //     return;
    //   }
    //   //500ms késleltetés után tárolja
    //   this.timeout = setTimeout(() => {
    //     this.setSearchWord(value);
    //   }, 1000);
    // },

    searchWordInput(value){
      if (!value) {
        this.resetSearchWord();
      }
    },
    searchWord(value){
      this.searchWordInput = value;
    }
  },
  computed: {
    ...mapState(useSearchStore, ['searchWord']),
  },
  methods: {
    ...mapActions(useSearchStore, ["resetSearchWord", "setSearchWord"]),
    onClickSearchButton(){
      this.setSearchWord(this.searchWordInput);
    }
  },
};
</script>

<style scoped>
/* 1. A sima .active ÉS a router által adott osztály is legyen sárga */
.nav-link.active,
.nav-link.router-link-exact-active {
  color: #ffff00 !important;
  font-weight: bold;
  border-bottom: 2px solid yellow;
}

/* 2. Az "Adatok" gomb sárgítása, ha az alatta lévő listában van aktív elem */
/* Azt mondjuk: "Színezd a .nav-item-et, ha van benne aktív router-link" */
.nav-item:has(.dropdown-item.router-link-active) .nav-link.dropdown-toggle {
  color: #ffff00 !important;
  font-weight: bold;
  border-bottom: 2px solid yellow;
}

/* 3. A lenyíló menüben a konkrét aktív elem (pl. Sportok) kijelölése */
.dropdown-item.router-link-active {
  /* background-color: #ffff00 !important; */
  /* color: #000 !important; */
  background-color: transparent !important; /* Levesszük a teli hátteret */
  color: #ffff00 !important; /* Csak a szöveg lesz sárga */
  font-weight: bold;
}

.tight-icon {
  line-height: 1 !important;
  display: inline-flex;
  vertical-align: middle;
}

.navbar {
  position: relative;
  z-index: 1060 !important; /* A Bootstrap modalok 1050-nél kezdődnek */
}

.dropdown-menu {
  z-index: 1060 !important;
}
</style>

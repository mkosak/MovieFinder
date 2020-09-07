import Vue from 'vue';
import Vuex from 'vuex';
import API from './../api.js';

Vue.use(Vuex);

// localStorage helpers
const saveToLocalStorage = (item, value) => {
  let savedResults = getFromLocalStorage('searchResultsHistory') ? getFromLocalStorage('searchResultsHistory') : [];
  
  savedResults.push(value);

  localStorage.setItem(item, JSON.stringify(savedResults));
};
const getFromLocalStorage = (item) => {
  let res = (localStorage.getItem(item)) ? JSON.parse(localStorage.getItem(item)) : false;

  return res;
};

// initial state
const state = () => ({
  isLoading: false,
  form: {},
  movies: [],
  resultsHistory: []
});

// getters
const getters = {
  getLoading: (state) => {
    return state.isLoading;
  },
  getSearchTerm: (state) => {
    return state.form.searchTerm;
  },
  getMovies: (state) => {
    return state.movies;
  },
  getResultsHistory: (state) => {
    // get results from store first otherwise load from localStorage
    if (state.resultsHistory.lenght) {
      return state.resultsHistory;
    } else {
      return getFromLocalStorage('searchResultsHistory');
    }
  }
};

// actions
const actions = {
  addLoading({ commit }, isLoading) {
    commit('setLoading', isLoading);
  },
  addForm({ commit }, form) {
    commit('setForm', form);
  },
  async searchMovies({ commit }, term) {
    const res = await API.get(`?s=${term}`);

    commit('setMovies', res.data.Search);
  },
  addResultsHistory({ commit, getters }, results) {
    commit('setResultsHistory', { term: getters.getSearchTerm, results });
  },
  addMoveis({ commit }, movies) {
    commit('setMovies', movies);
  }
};

// mutations
const mutations = {
  setLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
  setForm(state, form) {
    state.form = Object.assign({}, state.form, form);
  },
  setMovies(state, movies) {
    state.movies = movies;
  },
  setResultsHistory(state, history) {
    const results = { term: history.term, results: history.results };
    state.resultsHistory.push(results);

    // save results to localStorage
    saveToLocalStorage('searchResultsHistory', results);
  },
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
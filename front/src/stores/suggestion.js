import { defineStore } from 'pinia'

export const useSuggestionStore = defineStore('suggestion', {
  state: () => ({
    text: ''
  }),
  actions: {
    setSuggestion(text) {
      this.text = text
    }
  }
}) 
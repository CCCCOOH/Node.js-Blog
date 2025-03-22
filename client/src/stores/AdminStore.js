import { defineStore } from 'pinia'

export const AdminStore = defineStore("admin", {
  state: () => {
    return {
      id: "",
      account: "",
      token: "",
    }
  },
  actions: {},
  getters: {}
})
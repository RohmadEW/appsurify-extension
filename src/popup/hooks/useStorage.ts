export const LocalStorage = {
  getAllItems: async () => await chrome.storage.local.get(),
  getItem: async (key: string) => (await chrome.storage.local.get(key))[key],
  setItem: async (key: string, val: any) =>
    await chrome.storage.local.set({ [key]: val }),
  removeItems: async (keys: string) => await chrome.storage.local.remove(keys)
}

export const useStorage = () => ({ ...LocalStorage })

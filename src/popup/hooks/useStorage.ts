export const LocalStorage = {
  getAllItems: async () => await chrome.storage.local.get(),
  getItem: async (key: string) => (await chrome.storage.local.get(key))[key],
  setItem: async (key: string, val: any) =>
    await chrome.storage.local.set({ [key]: val }),
  removeItem: async (keys: string) => await chrome.storage.local.remove(keys),
  // Remove all items from storage
  clear: async () => await chrome.storage.local.clear()
}

export const useStorage = () => ({ ...LocalStorage })

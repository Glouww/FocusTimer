const storageHelper = {
  async getEndTime() {
    const data = await chrome.storage.local.get("endTime");
    return data.endTime;
  },

  async setEndTime(endTime){
    await chrome.storage.local.set({ endTime });
  },

  async getRemainingTime(){
    const data = await chrome.storage.local.get("remainingTime");
    return data.remainingTime;
  },

  async setRemainingTime(remainingTime){
    await chrome.storage.local.set({ remainingTime });
  },

  async clear() {
    await chrome.storage.local.remove(["endTime", "remainingTime"]);
  }
};

export default storageHelper;
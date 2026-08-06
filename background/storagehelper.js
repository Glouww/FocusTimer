const storageHelper = {

  // User-defined duration functions
  async setUserDuration(userDuration) {
    await chrome.storage.local.set({ userDuration });
  },

  async getUserDuration() {
    const data = await chrome.storage.local.get({ userDuration: 60});
    return data.userDuration;
  },

  // Timer methods
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
  },

  
  /*      ***popup timer polling methods***      */

  // Timer Status Methods
  async getStatus() {
    const data = await chrome.storage.local.get("timerStatus");
    return data.timerStatus;
  },

  async setStatus(timerStatus) {
    await chrome.storage.local.set({ timerStatus });
  },

};

export default storageHelper;
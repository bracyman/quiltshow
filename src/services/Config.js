
class Config {

    apiHost() { return process.env.REACT_APP_API_URL || "http://localhost:8080" };


    MAX_STORAGE_TIME() { return 1000 * 60 * 60; }         // one hour
}

export default new Config();
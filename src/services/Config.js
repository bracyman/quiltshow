
class Config {

    apiHost() { return "http://localhost:8080" };


    MAX_STORAGE_TIME() { return 1000 * 60 * 60; }         // one hour
}

export default new Config();
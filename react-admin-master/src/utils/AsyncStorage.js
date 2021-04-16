export default class Storage {
    static set = async (name, data, callBack) => {
        try {
            await AsyncStorage.setItem(name, JSON.stringify(data), callBack);
        } catch (e) {
            //console.log(e);
        }
    };

    static get = async (name, isParse = true) => {
        return new Promise(async (resolve, reject) => {
            try {
                const value = await AsyncStorage.getItem(name);
                if (isParse) {
                    resolve(JSON.parse(value));
                } else {
                    resolve(value);
                }
            } catch (e) {
                reject(e);
            }
        });
    };

    static delete = async name => {
        try {
            return await AsyncStorage.removeItem(name);
        } catch (e) {
            return e;
        }
    };

    static mulDelete = async name => {
        try {
            return await AsyncStorage.multiRemove(name);
        } catch (e) {
            return e;
        }
    };
}

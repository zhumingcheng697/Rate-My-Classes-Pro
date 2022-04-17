import Realm from "realm";
import config from "react-native-config";

export default new Realm.App({ id: config.REALM_APP_ID });

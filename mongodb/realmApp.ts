import Realm from "./Realm";
import config from "react-native-config";

const realmId = config.REALM_APP_ID || process.env.REALM_APP_ID!;

export default new Realm.App({ id: realmId });

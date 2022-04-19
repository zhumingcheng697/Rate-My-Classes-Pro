import Realm from "./Realm";
import { REALM_APP_ID } from "react-native-dotenv";

export default new Realm.App({ id: REALM_APP_ID });

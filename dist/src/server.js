"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("../config/database"));
const user_1 = __importDefault(require("./routes/api/user"));
const app = (0, express_1.default)();
(0, database_1.default)();
// Express configuration
app.set("port", process.env.PORT || 3002);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
//console.log("config => ", config)
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'tokens, Authorization, X-API-KEY, Origin, X-Requested-With,' +
        'Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.get('/', (req, res) => {
    // Podemos acceder a la petición HTTP
    res.status(200).json({
        status: 200,
        message: "Server running successfully"
    });
});
app.use("/api/user", user_1.default);
// Una vez definidas nuestras rutas podemos iniciar el servidor
const port = app.get("port");
const server = app.listen(port, () => console.log(`Server started on port ${port} - environment ${config_1.default.get("environment")}`));
/**
 *
 * //Data Encryption Function
  encryptData(text) {
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(16);
    var key = CryptoJS.PBKDF2(this.encryptSecretKey, salt, {
      keySize: keySize / 32,
      iterations: 100,
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    var result = CryptoJS.enc.Base64.stringify(
      salt.concat(iv).concat(encrypted.ciphertext)
    );

    return result;
  }

  //Funcion para realizar la desencriptacion
  decrypt(ciphertextB64) {
    var key = CryptoJS.enc.Utf8.parse(this.encryptSecretKey);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);

    var decrypted = CryptoJS.AES.decrypt(ciphertextB64, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
 *
 *
 */
exports.default = server;
//# sourceMappingURL=server.js.map
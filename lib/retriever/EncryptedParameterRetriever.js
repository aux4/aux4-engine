class EncryptedParameterRetriever {
  async lookup(command, parameters, name, proxy) {
    const encryptedParameterName = `encrypted${name.substring(0, 1).toUpperCase()}${name.substring(1)}`;
    const encryptedValue = await proxy[encryptedParameterName];
    if (!encryptedValue) return undefined;

    const aux4EncryptModule = getModule();
    if (!aux4EncryptModule) return undefined;

    const Crypto = aux4EncryptModule.Crypto;
    const secret = await parameters.secret;
    const crypto = new Crypto(secret);

    return crypto.decrypt(encryptedValue);
  }
}

function getModule() {
  try {
    return require("@aux4/encrypt");
  } catch (e) {
    return undefined;
  }
}

module.exports = EncryptedParameterRetriever;

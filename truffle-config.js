const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'coast donkey reform dose patient video powder people tide extend retreat setup';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4500000,
      gasPrice: 10000000000,
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/a619a941117a4f4b8ac9f9ec09ec8942')
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};

App = {
  web3Provider: null,
  contracts: {},
  emptyAddress: "0x0000000000000000000000000000000000000000",
  sku: 0,
  upc: 0,
  metamaskAccountID: "0x0000000000000000000000000000000000000000",
  ownerID: "0x0000000000000000000000000000000000000000",
  originFarmerID: "0x0000000000000000000000000000000000000000",
  originFarmName: null,
  originFarmInformation: null,
  originFarmLatitude: null,
  originFarmLongitude: null,
  productNotes: null,
  productPrice: 0,
  distributorID: "0x0000000000000000000000000000000000000000",
  retailerID: "0x0000000000000000000000000000000000000000",
  consumerID: "0x0000000000000000000000000000000000000000",

  init: async function() {
    App.readForm();
    /// Setup access to blockchain
    return await App.initWeb3();
  },

  readForm: function() {
    App.sku = $("#sku").val();
    App.upc = parseInt($("#upc").val(), 10);
    App.ownerID = $("#ownerID").val();
    App.originFarmerID = $("#originFarmerID").val();
    App.originFarmName = $("#originFarmName").val();
    App.originFarmInformation = $("#originFarmInformation").val();
    App.originFarmLatitude = $("#originFarmLatitude").val();
    App.originFarmLongitude = $("#originFarmLongitude").val();
    App.productID = $("#productID").val();
    App.productNotes = $("#productNotes").val();
    App.productPrice = $("#productPrice").val();
    App.itemState = $("#itemState").val();
    App.distributorID = $("#distributorID").val();
    App.retailerID = $("#retailerID").val();
    App.consumerID = $("#consumerID").val();

    console.log(
      App.sku,
      App.upc,
      App.ownerID,
      App.originFarmerID,
      App.originFarmName,
      App.originFarmInformation,
      App.originFarmLatitude,
      App.originFarmLongitude,
      App.productID,
      App.productNotes,
      App.productPrice,
      App.itemState,
      App.distributorID,
      App.retailerID,
      App.consumerID
    );
  },

  initWeb3: async function() {
    /// Find or Inject Web3 Provider
    /// Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:8545"
      );
    }

    App.getMetaskAccountID();

    return App.initSupplyChain();
  },

  getMetaskAccountID: function() {
    web3 = new Web3(App.web3Provider);

    // Retrieving accounts
    web3.eth.getAccounts(function(err, res) {
      if (err) {
        console.log("Error:", err);
        return;
      }
      console.log("getMetaskID:", res);
      App.metamaskAccountID = res[0];
    });
  },

  initSupplyChain: function() {
    /// Source the truffle compiled smart contracts
    var jsonSupplyChain = "../../build/contracts/SupplyChain.json";

    /// JSONfy the smart contracts
    $.getJSON(jsonSupplyChain, function(data) {
      console.log("data", data);
      var SupplyChainArtifact = data;
      App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
      App.contracts.SupplyChain.setProvider(App.web3Provider);

      App.fetchItemBufferOne();
      App.fetchItemBufferTwo();
      App.fetchEvents();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $("button").on("click", App.handleButtonClick);
  },

  handleButtonClick: async function(event) {
    event.preventDefault();

    App.getMetaskAccountID();

      var processId = parseInt($(event.target).data("id"));
      console.log("processId", processId);

      switch (processId) {
          case 1:
              return await App.harvestItem(event);
          case 2:
              return await App.processItem(event);
          case 3:
              return await App.packItem(event);
          case 4:
              return await App.sellItem(event);
          case 5:
              return await App.buyItem(event);
          case 6:
              return await App.shipItem(event);
          case 7:
              return await App.receiveItem(event);
          case 8:
              return await App.purchaseItem(event);
          case 9:
              return await App.fetchItemBufferOne(event);
          case 10:
              return await App.fetchItemBufferTwo(event);
          case 11:
              return await App.addFarmer(event);
          case 12:
              return await App.addDistributor(event);
          case 13:
              return await App.addRetailer(event);
          case 14:
              return await App.addConsumer(event);
      }
  },

  harvestItem: function(event) {
    event.preventDefault();
    App.readForm();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.harvestItem(
          App.upc,
          App.metamaskAccountID,
          App.originFarmName,
          App.originFarmInformation,
          App.originFarmLatitude,
          App.originFarmLongitude,
          App.productNotes
        );
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("harvestItem", result);
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  processItem: function(event) {
    event.preventDefault();
    App.readForm();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.processItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("processItem", result);
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  packItem: function(event) {
    event.preventDefault();
    App.readForm();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.packItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("packItem", result);
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  sellItem: function(event) {
    event.preventDefault();
    App.readForm();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.sellItem(App.upc, App.productPrice, {
          from: App.metamaskAccountID
        });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("sellItem", result);
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  buyItem: function(event) {
    event.preventDefault();
    App.readForm();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.buyItem(App.upc, {
          from: App.metamaskAccountID,
          value: App.productPrice
        });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("buyItem", result);
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  shipItem: function(event) {
    event.preventDefault();
    App.readForm();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.shipItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("shipItem", result);
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  receiveItem: function(event) {
    event.preventDefault();
    App.readForm();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.receiveItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("receiveItem", result);
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  purchaseItem: function(event) {
    event.preventDefault();
    App.readForm();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.purchaseItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("purchaseItem", result);
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  fetchItemBufferOne: function() {
    App.upc = $("#upc").val();
    console.log("upc", App.upc);

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.fetchItemBufferOne(App.upc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferOne", result);
        App.populateDataFromBufferOne(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  fetchItemBufferTwo: function() {
    App.upc = $("#upc").val();
    console.log("upc", App.upc);

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.fetchItemBufferTwo.call(App.upc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferTwo", result);
        App.populateDataFromBufferTwo(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

    addFarmer: function() {
        App.account = $("#account").val();

        App.contracts.SupplyChain.deployed()
            .then(function(instance) {
                return instance.addFarmer(App.account);
            })
            .catch(function(err) {
                console.log(err.message);
            });
    },

    addDistributor: function() {
        App.account = $("#account").val();

        App.contracts.SupplyChain.deployed()
            .then(function(instance) {
                return instance.addDistributor(App.account);
            })
            .catch(function(err) {
                console.log(err.message);
            });
    },

    addRetailer: function() {
        App.account = $("#account").val();

        App.contracts.SupplyChain.deployed()
            .then(function(instance) {
                return instance.addRetailer(App.account);
            })
            .catch(function(err) {
                console.log(err.message);
            });
    },

    addConsumer: function() {
        App.account = $("#account").val();

        App.contracts.SupplyChain.deployed()
            .then(function(instance) {
                return instance.addConsumer(App.account);
            })
            .catch(function(err) {
                console.log(err.message);
            });
    },

  populateDataFromBufferOne: function(data) {
    $("#sku").val(data[0]);
    $("#upc").val(data[1]);
    $("#ownerID").val(data[2]);
    $("#originFarmerID").val(data[3]);
    $("#originFarmName").val(data[4]);
    $("#originFarmInformation").val(data[5]);
    $("#originFarmLatitude").val(data[6]);
    $("#originFarmLongitude").val(data[7]);
  },

  populateDataFromBufferTwo: function(data) {
    $("#productID").val(data[2]);
    $("#productNotes").val(data[3]);
    $("#productPrice").val(data[4]);
    $("#itemState").val(data[5]);
    $("#distributorID").val(data[6]);
    $("#retailerID").val(data[7]);
    $("#consumerID").val(data[8]);
  },

  fetchEvents: function() {
    if (
      typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function"
    ) {
      App.contracts.SupplyChain.currentProvider.sendAsync = function() {
        return App.contracts.SupplyChain.currentProvider.send.apply(
          App.contracts.SupplyChain.currentProvider,
          arguments
        );
      };
    }

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        var events = instance.allEvents(function(err, log) {
          if (!err)
            $("#ftc-events").append(
              "<li>" + log.event + " - " + log.transactionHash + "</li>"
            );
        });
      })
      .catch(function(err) {
        console.log(err.message);
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

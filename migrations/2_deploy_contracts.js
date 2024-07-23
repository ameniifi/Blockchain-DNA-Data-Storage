const DNAStorage = artifacts.require("DNAStorage");

module.exports = function (deployer) {
  deployer.deploy(DNAStorage);
};

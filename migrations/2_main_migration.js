var BazaaarSwapEtherProxyHero_v1 = artifacts.require("./BazaaarSwapEtherProxyHero_v1.sol");

module.exports = function(deployer) {
  Ratios = [
    10000,  //ratioBase
    1000,   //feeRatio
    100,    //referralRatio
    500,    //assetRoyaltyRatio
    600     //artEditRoyaltyRatioLimit
  ]
  deployer.deploy(BazaaarSwapEtherProxyHero_v1, "0x8C213a6B185FE83383d03421aC058772F842De7D", "0x8C213a6B185FE83383d03421aC058772F842De7D", Ratios);
};
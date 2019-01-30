var HeroAsset = artifacts.require('token/mycryptoheroAssetes/HeroAsset')

contract('Deploy Extension', async function(accounts) {

    const HEROID1 = 40090001;
    const HEROID2 = 40090002;
    const HEROID3 = 40090003;
    const HEROID4 = 40090004;
    const HEROID5 = 40090005;
    const HEROID6 = 40090006;
    const HEROID7 = 40090007;
    const HEROID8 = 40090008;
    const HEROID9 = 40090009;

    it('Mint initial token', async function() {
      var heroAsset = await HeroAsset.new();
      console.log("Hero Address:" + heroAsset.address)
      await heroAsset.mint(accounts[0], HEROID1);
      await heroAsset.mint(accounts[0], HEROID2);
      await heroAsset.mint(accounts[0], HEROID3);
      await heroAsset.mint(accounts[0], HEROID4);
      await heroAsset.mint(accounts[0], HEROID5);
      await heroAsset.mint(accounts[0], HEROID6);
      await heroAsset.mint(accounts[0], HEROID7);
      await heroAsset.mint(accounts[0], HEROID8);
      await heroAsset.mint(accounts[0], HEROID9);
    })

})
var HeroAsset = artifacts.require('tokens/MCH/HeroAsset')

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
    const HEROID10 = 40090010;
    const HEROID11 = 40090011;
    const HEROID12 = 40090012;
    const HEROID13 = 40090013;
    const HEROID14 = 40090014;
    const HEROID15 = 40090015;
    const HEROID16 = 40090016;
    const HEROID17 = 40090017;
    const HEROID18 = 40090018;
    const HEROID19 = 40090019;
    const HEROID20 = 40090020;
    
    it('Mint initial token', async function() {
      var heroAsset = await HeroAsset.new();
      console.log("Hero Address:" + heroAsset.address)
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID1);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID2);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID3);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID4);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID5);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID6);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID7);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID8);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID9);
      await heroAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", HEROID10);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID11);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID12);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID13);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID14);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID15);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID16);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID17);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID18);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID19);
      await heroAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", HEROID20);
    })

})
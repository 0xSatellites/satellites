var ExAsset = artifacts.require('tokens/MCH/ExtensionAsset')

contract('Deploy Extension', async function(accounts) {

    const EXID1 = 10031438;
    const EXID2 = 10031434;
    const EXID3 = 10031435;
    const EXID4 = 10030773;
    const EXID5 = 10031438;
    const EXID6 = 10030773;
    const EXID7 = 10021522;
    const EXID8 = 10021522;
    const EXID9 = 30010201;
    const EXID10 = 30020121;
    const EXID11 = 40030124;
    const EXID12 = 30020121;
    
    it('mint initial token', async function() {
      var exAsset = await ExAsset.new();
      console.log("EX Address:" + exAsset.address)
      await exAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", EXID1);
      await exAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", EXID2);
      await exAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", EXID3);
      await exAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", EXID4);
      await exAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", EXID5);
      await exAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", EXID6);
      await exAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", EXID7);
      await exAsset.mint("0x04c599c3E1091CbD00e8da14Ed3a7E72cAeEdaF8", EXID8);
      await exAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", EXID9);
      await exAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", EXID10);
      await exAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", EXID11);
      await exAsset.mint("0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b", EXID12);
    })

})
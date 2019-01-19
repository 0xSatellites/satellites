pragma solidity 0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/roles/SignerRole.sol";

//nonce
//キャンセルした時にちゃんと出来ているか
contract BazaaarSwapEtherProxyHero is SignerRole {
    
    event Swap(address indexed _contract, uint _tokenId, uint _price);
    event CancellSwap(address indexed _contract, uint _tokenId, uint _price);
    
    // address public tokenContract = "0x273f7f8e6489682df756151f5525576e322d51a3";
    address public tokenContract = address(this);
    address public receiveAddressTokenOwner = address(0);
    address public receiveAddressSwapOwner = address(0);
    address public receiveAddressReferralOwner = address(0);
    uint public tokenOwnerCut = 500;
    uint public swapOwnerCut = 400;
    uint public referralOwnerCut = 100;
    
    function setReceiveAddressTokenOwner(address _address) public onlySigner {
        receiveAddressTokenOwner = _address;
    }
    
    function setReceiveAddressSwapOwner(address _address) public onlySigner {
        receiveAddressSwapOwner = _address;
    }
    
    function setReceiveAddressReferral(address _address) public onlySigner {
        receiveAddressReferralOwner = _address;
    }
    
    function setTokenOwnerCut(uint128 _cut) public onlySigner {
        require(_cut > 0 && _cut < 10000 - swapOwnerCut - referralOwnerCut);
        tokenOwnerCut = _cut;
    }
    
    function setSwapOwnerCut(uint128 _cut) public onlySigner {
        require(_cut > 0 && _cut < 10000 - tokenOwnerCut - referralOwnerCut);
        swapOwnerCut = _cut;
    }
    
    function setReferralOwnerCut(uint128 _cut) public onlySigner {
        require(_cut > 0 && _cut < 10000 - tokenOwnerCut - swapOwnerCut);
        referralOwnerCut = _cut;
    }
    
    function swap(address _fromContract, uint _fromId, bytes memory _sig) public payable {
        bytes32 dataHash = keccak256(abi.encodePacked(_fromContract, _fromId, msg.value));
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash));
        address recovered = getRecoveredAddress(_sig, prefixedHash);
        
        IERC721(_fromContract).transferFrom(recovered, msg.sender, _fromId);
        if (msg.value > 0) {
            uint totalCut = tokenOwnerCut + swapOwnerCut + referralOwnerCut;
            uint actualTotallCut = _computePublisherCut(msg.value, totalCut);
            uint actualTokenOwnerCut = actualTotallCut * tokenOwnerCut /10000;
            uint actualReferralOwnerCut = actualTotallCut * referralOwnerCut /10000;
            uint actualSwapOwnerCut = actualTotallCut - actualTokenOwnerCut - actualReferralOwnerCut;
            
            uint proceeds = msg.value - actualTotallCut;
            
            receiveAddressTokenOwner.transfer(actualTokenOwnerCut);
            receiveAddressSwapOwner.transfer(actualSwapOwnerCut);
            receiveAddressReferralOwner.transfer(actualReferralOwnerCut);
            msg.sender.transfer(proceeds); 
        }
        
        emit Swap(_fromContract, _fromId, msg.value);
    }
    
    function cancellSwap(address _fromContract, uint _fromId, bytes memory _sig, uint _price)public {
        bytes32 dataHash = keccak256(abi.encodePacked(_fromContract, _fromId, _price));
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash));
        address recovered = getRecoveredAddress(_sig, prefixedHash);
        
        require(recovered == msg.sender);
        
        IERC721(_fromContract).approve(msg.sender, _fromId);
        
        emit CancellSwap(_fromContract, _fromId, _price);
    }
    
    function getRecoveredAddress(bytes memory sig, bytes32 dataHash)
        internal
        pure
        returns (address addr)
    {
        bytes32 ra;
        bytes32 sa;
        uint8 va;
        // Check the signature length
        if (sig.length != 65) {
          return (address(0));
        }
        // Divide the signature in r, s and v variables
        assembly {
          ra := mload(add(sig, 32))
          sa := mload(add(sig, 64))
          va := byte(0, mload(add(sig, 96)))
        }
        if (va < 27) {
          va += 27;
        }
        address recoveredAddress = ecrecover(dataHash, va, ra, sa);
        return (recoveredAddress);
    }
    
    /*** Tools ***/
    function _computePublisherCut(uint _price, uint _cut) internal pure returns (uint) {
        return _price * _cut / 10000;
    }
    
}
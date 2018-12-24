pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";

contract Bazaaar {

    struct Item {
        address seller;
        uint    price;
        bool    exist;
    }    

    event Sell(address indexed _contract, uint _tokenId, uint _price);
    event Cancel(address indexed _contract, uint _tokenId);
    event Purchase(address indexed _contract, uint _tokenId, uint _price);

    mapping (address=>mapping(uint => Item)) public items;

    function sell(address _contract, uint _tokenId, uint128 _price) public {
        require(!items[_contract][_tokenId].exist);
        Item memory _item = Item(msg.sender, _price, true);
        items[_contract][_tokenId] = _item;
        IERC721(_contract).transferFrom(msg.sender, address(this), _tokenId);
        emit Sell(_contract, _tokenId, _price);
    }

    function cancel(address _contract, uint _tokenId) public {
        require(items[_contract][_tokenId].exist);
        require(items[_contract][_tokenId].seller == msg.sender);
        IERC721(_contract).transferFrom(address(this), msg.sender, _tokenId);
        delete items[_contract][_tokenId];
        emit Cancel(_contract, _tokenId);
    }

    function purchase(address _contract, uint _tokenId) public payable {
        require(items[_contract][_tokenId].exist);
        require(items[_contract][_tokenId].seller != msg.sender);
        require(items[_contract][_tokenId].price == msg.value);
        Item memory _item = items[_contract][_tokenId];
        delete items[_contract][_tokenId];
        IERC721(_contract).transferFrom(address(this), msg.sender, _tokenId);      
        if (_item.price > 0) {
            _item.seller.transfer(msg.value); 
        }
        emit Purchase(_contract, _tokenId, msg.value);
    }
    
}
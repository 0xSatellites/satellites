pragma solidity 0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract EtherDistributer is Pausable {
    using SafeMath for uint;

    address blockbaseAddress;
    address recipientAddress;

    constructor (address _blockbaseAddress, address _recipientAddress) public {
        blockbaseAddress = _blockbaseAddress;
        recipientAddress = _recipientAddress;
    }

    function () external payable whenNotPaused {
        uint amount = msg.value.div(2);
        blockbaseAddress.transfer(amount);
        recipientAddress.transfer(amount);
    }

    function updateBlockBaseAddress(address _blockbaseAddress) public onlyPauser {
        blockbaseAddress = _blockbaseAddress;
    }

    function updateRecipientAddress(address _recipientAddress) public onlyPauser {
        recipientAddress = _recipientAddress;
    }
}

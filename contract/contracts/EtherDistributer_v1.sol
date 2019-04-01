pragma solidity 0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract EtherDistributer_v1 {
    using SafeMath for uint;

    address blockbaseAddress;
    address recipientAddress;

    constructor (address _blockbaseAddress, address _recipientAddress) public {
        blockbaseAddress = _blockbaseAddress;
        recipientAddress = _recipientAddress;
    }

    function () external payable {
        uint amount = msg.value.div(2);
        blockbaseAddress.transfer(amount);
        recipientAddress.transfer(amount);
    }

}

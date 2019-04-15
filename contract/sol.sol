pragma solidity 0.4.24;

// File: /usr/src/app/bazaaar.io/contract/node_modules/openzeppelin-solidity/contracts/access/Roles.sol

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
  struct Role {
    mapping (address => bool) bearer;
  }

  /**
   * @dev give an account access to this role
   */
  function add(Role storage role, address account) internal {
    require(account != address(0));
    require(!has(role, account));

    role.bearer[account] = true;
  }

  /**
   * @dev remove an account's access to this role
   */
  function remove(Role storage role, address account) internal {
    require(account != address(0));
    require(has(role, account));

    role.bearer[account] = false;
  }

  /**
   * @dev check if an account has this role
   * @return bool
   */
  function has(Role storage role, address account)
    internal
    view
    returns (bool)
  {
    require(account != address(0));
    return role.bearer[account];
  }
}

// File: /usr/src/app/bazaaar.io/contract/node_modules/openzeppelin-solidity/contracts/access/roles/PauserRole.sol

contract PauserRole {
  using Roles for Roles.Role;

  event PauserAdded(address indexed account);
  event PauserRemoved(address indexed account);

  Roles.Role private pausers;

  constructor() internal {
    _addPauser(msg.sender);
  }

  modifier onlyPauser() {
    require(isPauser(msg.sender));
    _;
  }

  function isPauser(address account) public view returns (bool) {
    return pausers.has(account);
  }

  function addPauser(address account) public onlyPauser {
    _addPauser(account);
  }

  function renouncePauser() public {
    _removePauser(msg.sender);
  }

  function _addPauser(address account) internal {
    pausers.add(account);
    emit PauserAdded(account);
  }

  function _removePauser(address account) internal {
    pausers.remove(account);
    emit PauserRemoved(account);
  }
}

// File: /usr/src/app/bazaaar.io/contract/node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is PauserRole {
  event Paused(address account);
  event Unpaused(address account);

  bool private _paused;

  constructor() internal {
    _paused = false;
  }

  /**
   * @return true if the contract is paused, false otherwise.
   */
  function paused() public view returns(bool) {
    return _paused;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
  modifier whenNotPaused() {
    require(!_paused);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
  modifier whenPaused() {
    require(_paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() public onlyPauser whenNotPaused {
    _paused = true;
    emit Paused(msg.sender);
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() public onlyPauser whenPaused {
    _paused = false;
    emit Unpaused(msg.sender);
  }
}

// File: /usr/src/app/bazaaar.io/contract/node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a);
    uint256 c = a - b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}

// File: contracts/BazaaarProtocol_v2.sol

/**
 * Title  :  BazaaarProtocol_v1
 * Asset  :  CryptoKitties
 * Author :  BlockBase
 */
contract CTN {
    function entityIndexToApproved(uint256 tokenId)public view returns (address operator);
    function balanceOf(address owner) public view returns (uint256 count);
    function ownerOf(uint256 tokenId) public view returns (address owner);
    function transferFrom(address _from, address _to, uint256 _tokenId) public;
}

contract BazaaarProtocol_v2 is Pausable {
    using SafeMath for uint;

    event OrderMatched(
        bytes32 indexed hash,
        address maker,
        address taker,
        address asset,
        uint id
    );
    event OrderCancelled(
        bytes32 indexed hash,
        address maker,
        address asset,
        uint id
    );

    struct Order {
        address proxy;
        address maker;
        address taker;
        address creatorRoyaltyRecipient;
        address asset;
        uint id;
        uint price;
        uint nonce;
        uint salt;
        uint expiration;
        uint creatorRoyaltyRatio;
        uint referralRatio;
    }

    struct Amount {
        uint maker;
        uint creatorRoyalty;
        uint referral;
    }

    struct Sig {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    uint public ratioBase = 10000;
    mapping(address=>mapping(address=>mapping(uint=>uint))) private nonce;

    function nonce_(address maker, address asset, uint id)
        external
        view
        returns (uint)
    {
        return nonce[maker][asset][id];
    }

    function orderMatch_(address[6] addrs, uint[7] uints, uint8 v, bytes32 r, bytes32 s)
        external
        payable
        whenNotPaused
    {
        orderMatch(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]),
            Sig(v, r, s)
        );
        distribute(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]),
            addrs[5]
        );
    }

    function orderCancel_(address[5] addrs, uint[7] uints) external {
        orderCancel(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6])
        );
    }

    function requireValidOrder_(address[5] addrs, uint[7] uints, uint8 v, bytes32 r, bytes32 s)
        external
        view
        returns (bytes32)
    {
        return requireValidOrder(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]),
            Sig(v, r, s)
        );
    }

    function distribute(Order memory order, address referralRecipient)
        internal
    {
        CTN(order.asset).transferFrom(order.maker, msg.sender, order.id);
        Amount memory amount = computeAmount(order);
        if(amount.creatorRoyalty > 0){
            order.creatorRoyaltyRecipient.transfer(amount.creatorRoyalty);
        }
        if(amount.referral > 0){
            referralRecipient.transfer(amount.referral);
        }
        if(amount.maker > 0 ){
            order.maker.transfer(amount.maker);
        }
    }

    function computeAmount(Order memory order)
        internal
        view
        returns (Amount memory amount)
    {
        amount.creatorRoyalty = order.price.mul(order.creatorRoyaltyRatio).div(ratioBase);
        amount.referral = order.price.mul(order.referralRatio).div(ratioBase);
        amount.maker = order.price.sub(amount.creatorRoyalty).sub(amount.referral);
    }

    function orderMatch(Order memory order, Sig memory sig)
        internal
    {
        require(order.maker != msg.sender);
        require(order.taker == address(0x0) || order.taker == msg.sender);
        require(order.price == msg.value);
        bytes32 hash = requireValidOrder(order, sig);
        nonce[order.maker][order.asset][order.id]++;
        emit OrderMatched(hash, order.maker, msg.sender ,order.asset, order.id);
    }

    function orderCancel(Order memory order) internal {
        require(order.maker == msg.sender);
        bytes32 hash = hashToSign(order);
        nonce[order.maker][order.asset][order.id]++;
        emit OrderCancelled(hash, order.maker, order.asset, order.id);
    }

    function requireValidOrder(Order memory order, Sig memory sig)
        internal
        view
        returns (bytes32)
    {
        bytes32 hash = hashToSign(order);
        require(validateOrder(hash, order, sig));
        return hash;
    }

    function validateOrder(bytes32 hash, Order memory order, Sig memory sig)
        internal
        view
        returns (bool)
    {
        if (!validateAssetStatus(order)) {
            return false;
        }
        if (!validateOrderParameters(order)) {
            return false;
        }
        if (ecrecover(hash, sig.v, sig.r, sig.s) == order.maker) {
            return true;
        }
        return false;
    }

    function validateAssetStatus(Order memory order)
        internal
        view
        returns (bool)
    {
        if (CTN(order.asset).ownerOf(order.id) != order.maker) {
            return false;
        }
        if (CTN(order.asset).entityIndexToApproved(order.id) != address(this)) {
            return false;
        }
        return true;
    }

    function validateOrderParameters(Order memory order)
        internal
        view
        returns (bool)
    {
        if (order.proxy != address(this)) {
            return false;
        }
        if (order.expiration < now) {
            return false;
        }
        if (order.nonce != nonce[order.maker][order.asset][order.id]) {
            return false;
        }
        return true;
    }

    function hashToSign(Order memory order)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                hashOrder(order)
            ));
    }

    function hashOrder(Order memory order)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                order.proxy,
                order.maker,
                order.taker,
                order.creatorRoyaltyRecipient,
                order.asset,
                order.id,
                order.price,
                order.nonce,
                order.salt,
                order.expiration,
                order.creatorRoyaltyRatio,
                order.referralRatio
        ));
    }
}

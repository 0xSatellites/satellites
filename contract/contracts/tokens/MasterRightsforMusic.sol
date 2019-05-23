pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Pausable.sol";


contract MasterRightsforMusic is ERC721Full, ERC721Mintable, ERC721Pausable {

    string public tokenURIPrefix = "https://asia-northeast1-blockbase-bazaaar-sand.cloudfunctions.net/spMasterRightsforMusicAPI?id=";

    constructor () ERC721Full("Master Rights for Music" ,"MRM") public {
    }

    function setTokenURIPrefix(string  memory _tokenURIPrefix) public onlyMinter {
        tokenURIPrefix = _tokenURIPrefix;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        bytes32 tokenIdBytes;
        if (tokenId == 0) {
            tokenIdBytes = "0";
        } else {
            uint256 value = tokenId;
            while (value > 0) {
                tokenIdBytes = bytes32(uint256(tokenIdBytes) / (2 ** 8));
                tokenIdBytes |= bytes32(((value % 10) + 48) * 2 ** (8 * 31));
                value /= 10;
            }
        }

        bytes memory prefixBytes = bytes(tokenURIPrefix);
        bytes memory tokenURIBytes = new bytes(prefixBytes.length + tokenIdBytes.length);

        uint8 i;
        uint8 index = 0;

        for (i = 0; i < prefixBytes.length; i++) {
            tokenURIBytes[index] = prefixBytes[i];
            index++;
        }

        for (i = 0; i < tokenIdBytes.length; i++) {
            tokenURIBytes[index] = tokenIdBytes[i];
            index++;
        }

        return string(tokenURIBytes);
    }
}
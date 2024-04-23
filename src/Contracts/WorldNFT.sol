// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WorldNFT is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public tokenIdCounter;

    string public description;
    string public worldName;
    mapping(address => uint256[]) public ownerTokens;

    event WorldCreated(address indexed owner, uint256 indexed tokenId, string indexed tokenURI);
    event UpdatedWorldTokenURI(address indexed owner, uint256 indexed tokenId, string indexed tokenURI);

    constructor(string memory name_, string memory symbol_, string memory description_) ERC721(name_, symbol_) {
        description = description_;
        worldName = name_;
    }

    modifier isWorldOwner(uint256 tokenId_) {
        require(ownerOf(tokenId_) == msg.sender, "You are not the owner of this token");
        _;
    }

    modifier isUserTokenExists(address user_, uint256 tokenId_) {
        uint256[] memory tokenIds = ownerTokens[user_];
        bool exists = false;

        for(uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId_) {
                exists = true;
                break;
            }
        }

        require(exists, "Token does not exist for this user");
        _;
    }

    function createWorld(string memory tokenURI_) public {
        tokenIdCounter.increment();
        uint256 newTokenId = tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);
        ownerTokens[msg.sender].push(newTokenId);
        _setTokenURI(newTokenId, tokenURI_);

        emit WorldCreated(msg.sender, newTokenId, tokenURI_);
    }

    function tokenURI(uint256 tokenId_) public view override(ERC721, ERC721URIStorage) isWorldOwner(tokenId_) returns (string memory) {
        return super.tokenURI(tokenId_);
    }

    function fetchMetadata(address user_, uint256 tokenId_) public view isUserTokenExists(user_, tokenId_) returns (string memory) {
        string memory ipfsCid = tokenURI(tokenId_);
            string memory json = Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            '{"name": name(),',
                            '"description": description,',
                            '"cid": "',
                                ipfsCid,
                            '"}'
                        )
                    )
                )
            );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function updateTokenURI(address user_, uint256 tokenId_, string memory tokenURI_) public isWorldOwner(tokenId_) isUserTokenExists(user_, tokenId_) {
        super._setTokenURI(tokenId_, tokenURI_);
        
        emit UpdatedWorldTokenURI(user_, tokenId_, tokenURI_);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
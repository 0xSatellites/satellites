
![Satellites screenshot](./resources/repository/top.png)

:tada: Satellites - Launch a DEX Marketplace of NFT

:earth_americas: The satellite uses the 0x protocol and the original extension contract.

:mega: The Satellites team uses [IssueHunt](https://issuehunt.io/) for a sustainable open-source ecosystem.

## Quick start

``` bash
# install repository
$ git clone https://github.com/block-base/satellites.git

$ cd templates

# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev
```

#### Customization
1. Open the `plugins/config.ts` file and edit the params:

    - `networkIdToTokens` -- The Ethereum address which be hundled assets of ERC721.(default CryptoKitties) More information of the other assets can be [found here](https://github.com/block-base/satellites/wiki/ERC721-Asset-List).

    - `recipientAddress` -- The Ethereum address which you receive the fee recipient in orders your relayer.

    - `feeRatio` -- The percentage of the fee recipient of you.

2. Open the `nuxt.config.ts`file and edit service name etc.

## Supporting Satellites
Satellite is an open source project. This is an independent project.
When using satellites, a fee of the marketplace sales (default 1%) will be provided to satellites development funds.
The money is distributed to contributors and maintainers. And If you use Satellites please consider becoming a backer:

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/r/block-base/satellites)

## More Infomation
- [Discord](https://discord.gg/tdTegPC)
- [Twitter](https://twitter.com/satellites_js)
- [Medium](https://medium.com/blockbase)

## License
[Apache license 2.0](./LICENSE)
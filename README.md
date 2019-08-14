
![Satellites screenshot](./resources/repository/top.png)

:tada: Satellites - Launch a DEX Marketplace of NFT

:earth_americas: The Satellites use the [0x protocol](https://0x.org/) and the [Original Extension Contracts](https://medium.com/blockbase/development-of-new-0x-extensions-passer-and-distributor-contract-4b169ad8c607).

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

    - `feeRatio` -- The percentage of the fee which you receive.

2. Open the `nuxt.config.ts`file and edit service name etc.

## Supporting Satellites
Satellites is an open source project. This is an independent project.
When using Satellites, a fee of the marketplace sales (default 1%) will be provided to Satellites development funds.

The money is distributed to contributors and maintainers. And If you use Satellites please consider becoming a backer:

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/r/block-base/satellites)

## More Infomation
- [Discord](https://discord.gg/tdTegPC)
- [Twitter](https://twitter.com/satellites_js)
- [Medium](https://medium.com/blockbase)

## License
[Apache license 2.0](./LICENSE)
import Web3 from 'web3'
import contractInterface from '../../contractsInterfaces/VoteAndAuction.json'
import erc721ContractInterface from '../../contractsInterfaces/erc721.json'
import erc20ContractInterface from '../../contractsInterfaces/VoteToken.json'
import { VOTE_TOKEN, VOTE_AND_AUCTION_CONTRACT_ADDRESS, RINKEBY_NETWORK_VERSION } from "../../assets/consts/offersConsts"
import { processingToast, successToast, failedToast } from './toasts.js'

export const getWeb3Account = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.net.getId().then( id => {
          if (id !== RINKEBY_NETWORK_VERSION) {
            alert("Please switch to Rinkeby test network to use this app!");
          }
        }
      )
      return window.ethereum.enable().then( accounts => accounts[0].toLowerCase() );
    }
    alert("Install an Ethereum-compatible browser or extension running on Rinkeby test network to use this app!");
    return 0;
  }
  
export const getAllVotingProposals = async (address) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const crt = new web3.eth.Contract(contractInterface, VOTEANDAUCTIONCONTRACT, { from: address });
      const votingProposalsNumber = parseInt(await crt.methods.getAllVotingProposalsLen().call())
      return Promise.all(
        [...Array(votingProposalsNumber).keys()].map(
          id => crt.methods.allVotingProposals(id).call()
        )
      )
    }
    return [];
}

export const approveNFT = async (erc721ContractAddress, userAddress, tokenIdNFT) => {
    const web3 = new Web3(window.ethereum);
    const erc721crt = new web3.eth.Contract(
        erc20ContractInterface,
        VOTE_TOKEN,
        {from: userAddress}
    );
  
    // gas estimate
    erc721crt.methods.approve(VOTE_AND_AUCTION_CONTRACT_ADDRESS, tokenIdNFT).estimateGas((error, gasAmount) => {
      console.log("gas estimate for approve: " + gasAmount);
    });
  
    erc721crt.methods.approve(VOTE_AND_AUCTION_CONTRACT_ADDRESS, tokenIdNFT).send().on('transactionHash', (hash) => {
      processingToast(hash);
    }).on('receipt', (receipt) => {
      successToast("NFT has been approved!");
    }).on('error', (error) => {
      failedToast();
    });
}

export const approveVoteTokens = async (userAddress, numberOfTokens) => {
    const web3 = new Web3(window.ethereum);
    const erc721crt = new web3.eth.Contract(
      erc721ContractInterface,
      erc721ContractAddress,
      {from: userAddress}
    );
  
    erc721crt.methods.approve(VOTE_AND_AUCTION_CONTRACT_ADDRESS, numberOfTokens).send().on('transactionHash', (hash) => {
      processingToast(hash);
    }).on('receipt', (receipt) => {
      successToast("Vote Tokens have been approved!");
    }).on('error', (error) => {
      failedToast();
    });
}

export const createProposal = async (userAddress, smartContractAddressOfNFT, token_id, reservePrice) => {
    const web3 = new Web3(window.ethereum);
    const crt = new web3.eth.Contract(contractInterface, VOTE_AND_AUCTION_CONTRACT_ADDRESS, {from: userAddress});

    const weiReservePrice = web3.utils.toWei(reservePrice);

    crt.methods.createVotingProposal(
        smartContractAddressOfNFT,
        token_id,
        weiReservePrice
    ).send().on('transactionHash', (hash) => {
        processingToast(hash);
    }).on('receipt', (receipt) => {
        successToast("Voting Proposal has been created!");
    }).on('error', (error) => {
        failedToast();
    });
}

export const voteProposal = async (userAddress, proposalID, numberOfVotes) => {
    const web3 = new Web3(window.ethereum);
    const crt = new web3.eth.Contract(contractInterface, VOTE_AND_AUCTION_CONTRACT_ADDRESS, {from: userAddress});

    crt.methods.voteForProposal(
        proposalID,
        numberOfVotes
    ).send().on('transactionHash', (hash) => {
        processingToast(hash);
    }).on('receipt', (receipt) => {
        successToast("You have successfully voted!");
    }).on('error', (error) => {
        failedToast();
    });

}
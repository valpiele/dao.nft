import { getAllVotingProposals } from '../../services/web3/voteAndAuctionContract';
import { getAllVotingProposalsAssets } from '../../services/opensea/assets';

export const getAllVotingProposalsAction = () => {
    return (dispatch, getState) => {
        getAllVotingProposals().then( votingProposals => {
                const updatedProposals = votingProposals.map( (singleProposal) => {
                        singleProposal.owner = singleProposal.owner.toLowerCase();
                        singleProposal.smartContractAddressOfNFT = singleProposal.smartContractAddressOfNFT.toLowerCase();
                        return singleProposal;
                    } 
                )
                dispatch({ type: 'ADD_VOTE_PROPOSALS', voteProposals: updatedProposals })
            }
        )
    }
}

export const getAllVotingProposalsAssetsAction = (votingProposals) => {
    return (dispatch, getState) => {
        console.log(votingProposals);
        getAllVotingProposalsAssets(votingProposals).then( proposalAssets => {
                const updatedProposalAssets = proposalAssets.map(proposalAsset => proposalAsset.data)
                dispatch({ type: 'ADD_PROPOSALS_ASSETS', proposalAssets: updatedProposalAssets });
            }
        )
    }
}
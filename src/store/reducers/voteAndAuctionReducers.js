const initState = {
    voteProposals: [],
    proposalAssets: []
}

const voteAndAuctionReducers = (state = initState, action) => {
    if (action.type === 'ADD_VOTE_PROPOSALS') {
        let newVoteProposals = action.voteProposals;
        return {
            voteProposals: newVoteProposals,
            proposalAssets: state.proposalAssets
        }
      } else if (action.type === 'ADD_PROPOSALS_ASSETS') {
        let refreshedProposalsAssets = action.proposalAssets;
        return {
            voteProposals: state.voteProposals,
            proposalAssets: refreshedProposalsAssets
        }
      }
      return state;
}

export default voteAndAuctionReducers;
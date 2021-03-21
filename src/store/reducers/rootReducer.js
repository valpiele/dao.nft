import accountReducer from './accountReducer'
import leaseReducer from './leaseReducer'
import loanReducer from './loanReducer'
import voteAndAuctionReducers from './voteAndAuctionReducers'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  account: accountReducer,
  leasing: leaseReducer,
  loans: loanReducer,
  proposalsAndAuctions: voteAndAuctionReducers
});

export default rootReducer;

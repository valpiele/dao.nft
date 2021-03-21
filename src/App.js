import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastMessage } from 'rimble-ui';

import { getAccountAddressAction, getAccountAssetAction } from './store/actions/accountActions';
import { getLeaseOffersAction, getLeaseAssetsAction } from './store/actions/leaseActions';
import { getLoanRequestsAction, getLoanAssetsAction } from './store/actions/loanActions';
import { getAllVotingProposalsAction, getAllVotingProposalsAssetsAction } from './store/actions/voteAndAuctionActions';

import './assets/css/mystyles.css';
import Navbar from './components/layout/navbar/Navbar';
import HomePage from './components/layout/home/HomePage';
import UploadPage from './components/layout/upload/UploadPage';

import NewLeaseOffersPage from './components/layout/leasing/newlease/NewLeaseOfferPage';
import MyLeaseOffers from './components/layout/leasing/offers/MyLeaseOffers';
import AllLeaseOffersPage from './components/layout/leasing/offers/AllLeaseOffersPage';
import NewLoanRequestPage from './components/layout/loans/newloan/NewLoanRequestPage';
import MyLoanRequestsPage from './components/layout/loans/requests/MyLoanRequestsPage';
import AllLoanRequestsPage from './components/layout/loans/requests/AllLoanRequestsPage';

import { LENDING_CONTRACT_ADDRESS } from './assets/consts/requestsConsts';
import { LEASING_CONTRACT_ADDRESS } from './assets/consts/offersConsts';
import { VOTE_AND_AUCTION_CONTRACT_ADDRESS } from './assets/consts/offersConsts';
import contractInterface from './contractsInterfaces/LoansNFT.json';
import Web3 from 'web3';
// import { getAllVotingProposalsAssetsAction } from './store/actions/voteAndAuctionActions'

class App extends Component {
	componentDidMount() {
		this.props.getAccountAddressAction();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.userAddress !== this.props.userAddress) {
			this.props.getAccountAssetAction(this.props.userAddress);
			this.props.getLeaseOffersAction(this.props.userAddress);
			this.props.getLoanRequestsAction(this.props.userAddress);
			this.props.getAllVotingProposalsAction(this.props.userAddress);
			this.subscribeToEvents();
		}
		if (prevProps.leaseOffers.length !== this.props.leaseOffers.length) {
			this.props.getLeaseAssetsAction(this.props.leaseOffers);
		}
		if (prevProps.loanRequests.length !== this.props.loanRequests.length) {
			this.props.getLoanAssetsAction(this.props.loanRequests);
		}
		if (prevProps.proposals.length !== this.props.proposals.length) {
			this.props.getAllVotingProposalsAssetsAction(this.props.proposals);
		}
	}

	subscribeToEvents = () => {
		if (window.ethereum) {
			const web3 = new Web3(window.ethereum);
			const crtLending = new web3.eth.Contract(contractInterface, LENDING_CONTRACT_ADDRESS, {
				from: this.props.userAddress
			});
			const crtLeasing = new web3.eth.Contract(contractInterface, LEASING_CONTRACT_ADDRESS, {
				from: this.props.userAddress
			});
			const crtVotingAndAuction = new web3.eth.Contract(contractInterface, VOTE_AND_AUCTION_CONTRACT_ADDRESS, {
				from: this.props.userAddress
			});

			crtLending.events.allEvents().on('data', (event) => {
				this.props.getAccountAssetAction(this.props.userAddress);
				this.props.getLoanRequestsAction(this.props.userAddress);
			});
			crtLeasing.events.allEvents().on('data', (event) => {
				this.props.getAccountAssetAction(this.props.userAddress);
				this.props.getLeaseOffersAction(this.props.userAddress);
			});
			crtVotingAndAuction.events.allEvents().on('data', (event) => {
				this.props.getAccountAssetAction(this.props.userAddress);
				this.props.getAllVotingProposalsAction(this.props.userAddress);
			});
		}
	};

	render() {
		return (
			<BrowserRouter>
				<ToastMessage.Provider ref={(node) => (window.toastProvider = node)} />
				<Navbar />
				<Switch>
					<Route path="/newlease" component={NewLeaseOffersPage} />
					<Route path="/myleaseoffers" component={MyLeaseOffers} />
					<Route path="/allleaseoffers" component={AllLeaseOffersPage} />
					<Route path="/allloans" component={AllLoanRequestsPage} />
					<Route path="/upload" component={UploadPage} />
					<Route path="/" component={HomePage} />
				</Switch>
			</BrowserRouter>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userAddress: state.account.accountAddress.address,
		leaseOffers: state.leasing.leaseOffers,
		loanRequests: state.loans.loanRequests,
		proposals: state.proposalsAndAuctions.voteProposals
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getAccountAddressAction: () => dispatch(getAccountAddressAction()),
		getAccountAssetAction: (address) => dispatch(getAccountAssetAction(address)),
		getLeaseOffersAction: (address) => dispatch(getLeaseOffersAction(address)),
		getLeaseAssetsAction: (leaseOffers) => dispatch(getLeaseAssetsAction(leaseOffers)),
		getLoanRequestsAction: (address) => dispatch(getLoanRequestsAction(address)),
		getLoanAssetsAction: (loanRequests) => dispatch(getLoanAssetsAction(loanRequests)),
		getAllVotingProposalsAction: (address) => dispatch(getAllVotingProposalsAction(address)),
		getAllVotingProposalsAssetsAction: (votingProposals) =>
			dispatch(getAllVotingProposalsAssetsAction(votingProposals))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

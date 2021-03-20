import React, { Component } from 'react'
import { connect } from 'react-redux'
import AllLeaseOffers from './AllLeaseOffers'


class MyLeaseOffers extends Component {

  render() {
    let allLeaseOffers;
    allLeaseOffers = <AllLeaseOffers
            filterOwner={this.props.userAddress}/>

    return (
      <div className="container">
        <h5 className="grey-text text-darken-3 any-page-title-margin">My Listings</h5>
        <div className="wrapper">
        <div className='row'>
            {allLeaseOffers}
        </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userAddress: state.account.accountAddress.address
  }
}

export default connect(mapStateToProps)(MyLeaseOffers);

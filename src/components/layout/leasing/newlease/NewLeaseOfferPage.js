import React from 'react'
import MyAssetsCards from '../../cards/MyAssetsCards'

const NewLeaseOfferPage = () => {
  return (
    <div className="container">
      <h4 className="indigo-text text-darken-2 page-title-margin">Select NFT for voting</h4>
      <MyAssetsCards type="lease" />
    </div>
  )
}

export default NewLeaseOfferPage;

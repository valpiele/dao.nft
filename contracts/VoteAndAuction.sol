// Deployed at 0x914FB09A2Bd05e9e758a49Fb7ae2Ad66B391506D

pragma solidity >=0.8.0;  

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721Receiver.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract VoteAndAuction is IERC721Receiver {
    
    enum Status { ACTIVE, CANCELLED, ENDED }          
    
    struct VotingProposal {         
        uint votingID;
        address smartContractAddressOfNFT;
        uint tokenIdNFT;
        uint voteCount;
        uint reservePrice;
        address payable owner;
        Status status;
    }
    
    struct LiveAuction {
        uint auctionID;
        address smartContractAddressOfNFT;
        uint tokenIdNFT;
        uint reservePrice;
        address payable highestBidder;
        uint highestBid;
        uint endAuctionTime;
        Status status;
    }
    
    uint public totalVotingProposals;
    
    mapping (address => uint) public VotesCounter;          
    
    // TODO expose allVotingProposals length through getAllVotingProposalsLen()
    VotingProposal[] public allVotingProposals;
    VotingProposal[] public prevVotingProposals;

    // TODO expose liveAuctions length through getLiveAuctionsLen()
    LiveAuction[] public liveAuctions;
    LiveAuction[] public prevAuctions;

    address public manager;
    
    // NFT.DAO voting token on Rinkeby
    address constant votingTokenAddress = 0x8eC48F4ad0E9706A8120a4F6005B73f50992752D;
    IERC20 votingToken = IERC20(votingTokenAddress);
    
    modifier onlyManager() { // Modifier
        require(
            msg.sender == manager,
            "Only voting manager can call this."
        );
        _;
    }
    
    constructor() public {
        manager = msg.sender;
        totalVotingProposals = 0;
    }

    // Equivalent to 'bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))'
    // Or this.onERC721Received.selector
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data) public override returns (bytes4) {
        return 0x150b7a02;
    }

    function createVotingProposal(address smartContractAddressOfNFT,
                                uint tokenIdNFT,
                                uint reservePrice) public {
                                    
        IERC721 currentNFT = IERC721(smartContractAddressOfNFT);
        require(currentNFT.getApproved(tokenIdNFT) == address(this), "Transfer has to be approved first");
        
        // VotingProposal storage vProposal = allVotingProposals[totalVotingProposals];
        allVotingProposals.push(VotingProposal(
            totalVotingProposals,
            smartContractAddressOfNFT,
            tokenIdNFT,
            0,
            reservePrice,
            payable(msg.sender),
            Status.ACTIVE
        ));

        totalVotingProposals = totalVotingProposals + 1;
        
        currentNFT.safeTransferFrom(msg.sender, address(this), tokenIdNFT);
    }

    function voteForProposal(uint proposalID, uint numberOfVotes) public {
        
        require(votingToken.balanceOf(msg.sender) >= numberOfVotes, "You don't have enough votes");
        require(votingToken.allowance(msg.sender, address(this)) >= numberOfVotes, "You need to approve spending first");
        
        allVotingProposals[proposalID].voteCount = allVotingProposals[proposalID].voteCount + numberOfVotes;
        
        votingToken.transferFrom(msg.sender, address(this), numberOfVotes);
    }
    
    function ClaimUnVotedProposal(uint proposalID) public {
        require(prevVotingProposals[proposalID].owner == msg.sender, "You are not the original owner");
        IERC721 currentNFT = IERC721(prevVotingProposals[proposalID].smartContractAddressOfNFT);
        currentNFT.approve(msg.sender, prevVotingProposals[proposalID].tokenIdNFT);
        currentNFT.transferFrom(address(this), msg.sender, prevVotingProposals[proposalID].tokenIdNFT);
    }
    
    function quickSort(VotingProposal[] memory arr, uint left, uint right) private {
        uint i = left;
        uint j = right;
        if (i == j) return;
        VotingProposal memory pivot = arr[uint(left + (right - left) / 2)];
        while (i <= j) {
            while (arr[uint(i)].voteCount < pivot.voteCount) i++;
            while (pivot.voteCount < arr[uint(j)].voteCount) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }
    
    function closeVoting() public onlyManager{
        quickSort(allVotingProposals, 0, totalVotingProposals - 1);
        startLiveAuction(allVotingProposals);
        prevVotingProposals = allVotingProposals;
        delete allVotingProposals;
    }
    
    function startLiveAuction(VotingProposal[] memory winningProposals) public {
        prevAuctions = liveAuctions;
        uint len = winningProposals.length;
        if (len > 10) {
            len = 10;
        }
        delete liveAuctions;
        for (uint i = 0; i < len; i++) {
            liveAuctions.push(LiveAuction(
                    i,
                    winningProposals[i].smartContractAddressOfNFT,
                    winningProposals[i].tokenIdNFT,
                    winningProposals[i].reservePrice,
                    winningProposals[i].owner,
                    0,
                    block.timestamp + 2 days,
                    Status.ACTIVE
                )
            );
        }
    }
    
    function bid(uint auctionID) public payable {
        require(auctionID < 10, "Invalid auctionID");
        require(liveAuctions[auctionID].highestBid < msg.value && liveAuctions[auctionID].reservePrice < msg.value, "You need a higher bid");
        
        address payable prevBidder = liveAuctions[auctionID].highestBidder;

        prevBidder.send(liveAuctions[auctionID].highestBid);
        
        liveAuctions[auctionID].highestBid = msg.value;
    }
    
    function claimNFT(uint auctionID) public {
        require(msg.sender == liveAuctions[auctionID].highestBidder, "You are not the winner of the Auction");
        // TODO commented for testing
        // require(block.timestamp >= liveAuctions[auctionID].endAuctionTime, "Auction has not ended yet");
        
        IERC721 currentNFT = IERC721(liveAuctions[auctionID].smartContractAddressOfNFT);
        currentNFT.approve(msg.sender, liveAuctions[auctionID].tokenIdNFT);
        currentNFT.transferFrom(address(this), msg.sender, liveAuctions[auctionID].tokenIdNFT);
        
        // TODO add status
    }
    
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VotingSystem{

    // Election Phases
    //enum Phase {NotStarted, Round1, Round2, Finished} 
    //Phase public phase;

    // Status Approval
    enum ConfirmationStatus {Awaiting, Accepted, Denied}
    
    // Election Variable
         address public owner; // The addresws of the election owner
         string public electionName; // The name of the election
         uint256 public votingStartTime; // The starting time of the election
         uint256 public votingEndTime; // The ending time of election 
         uint256 public resultPublicationTime; //the time when the result will be published

         uint256 private CandidateID; // The Identification of the candidate
         uint256 private VoterID; // The Identification of the Voters


    // Voter Bookeeping
    struct Voter {
       // bool votedRoundOne;
        //bool votedRoundTwo;
        bool alreadyVoted;

        // off coz ipfs
        //string name;
        //uint256 age;
        //string email;
        //string phone;
        // off end of ipfs 

        string message;

        // on coz ipfs
        string ipfsHash; // all personal data stored here 
        // on end of ipfs 

        uint256 registeredId;
        address votersAddress;
        ConfirmationStatus status;
 }


   // Candidate Bookeeping 
   struct Candidate {
        //string name;
       
        //string message;
        //uint256 age;
        //string email;
        //string phone;
        //string bio;
        //string goals;
        //string experience;
        //string vision;

        

        uint256 registeredId;
        uint256 voteCalculation;
        address candidatesAddress;
        ConfirmationStatus status;
        string ipfsHash; // all personal data stored here manifesto/goals/documents etc 
        string message;

   }

   // Election Rounds
        //bytes32[] public candidates;
        //mapping(bytes32 => uint256) public VotesRoundOne; // First Round candidates are alllowed to be voted
        //mapping(bytes32 => uint256) public VotesRoundTwo; // Second Round candidates are allowed to be voted
        mapping (address => Voter) public voters;
        mapping (address => Candidate) public candidates;
        address[] public candidatesRegistered; // Candidate who are registered
        address[] public votersRegistered; // Voters who are registered good one
        //uint256[] public votersRegistered; // Voters who are registered

        address[] public acceptedCandidates; // Candidate who have been accepted for election
        address[] public acceptedVoters; // Voters who have been accepted to vote

        address [] public rejectedCandidates; // Candidate who have been rejected for election
        address[] public rejectedVoters; // Voters who have been rejected to vote

        address[] public votersWhoCasted; // Voters who have voted
        //address[] public voterList;  // to allow resetting voted flags between rounds

        // Runoff state
       /* bytes32[] public runoffCandidates; // Candidates participating in Second round 
        mapping(bytes32 => bool) public isRunoffCandidate;

        // Result 
        bytes32 public winner; // 
        bool public tieAfterRound2; // true if tie remains after second round*/

        // Only Owner can call this function 
        modifier onlyOwner() {
            require(msg.sender == owner, "Only owner");
            _;       
        }

        // Voting Modification During Election
        modifier votingModification() {
            require(block.timestamp >= votingStartTime && block.timestamp <= votingEndTime, "Voting still disabled");
            _;
        }



        // for testing
        modifier beforeVotingStarts(){
            require(votingStartTime == 0 || block.timestamp < votingStartTime, "Cannot modify after voting starts");
         _; 
        }

        //end of testing  

        // Constructor 
        constructor(string memory  _name) {
            owner = msg.sender;
            electionName = _name;
            CandidateID = 1;
            VoterID = 1;
        }


       

        // Register a voter 
    function registerVoter(string memory _ipfsHash) public {

        require(voters[msg.sender].votersAddress == address(0), // after 
        "You have already registered as a voter."
        );

        //require(
        //voters[msg.sender].status != ConfirmationStatus.Awaiting &&
        //voters[msg.sender].status != ConfirmationStatus.Accepted,
        //"You already have a pending or approved registration"
    //);



        Voter memory newVoter = Voter({
            /*votedRoundOne: false,
            votedRoundTwo: false,
            alreadyVoted: false,*/
            //alreadyVoted: false,

            //name: _name, off coz ipfs
            //age: _age, off coz ipfs
            //email: _email, off coz ipfs
            //phone: _phone, off coz ipfs
            //message: "Registration is awaiting approval",

            alreadyVoted: false,
            registeredId: VoterID,
            votersAddress: msg.sender,
            status: ConfirmationStatus.Awaiting,

            ipfsHash: _ipfsHash, // all personal data stored here
            message: "Registration is awaiting approval"


           
        });

        voters[msg.sender] = newVoter; // good 
       // new 
        //voters[msg.sendert].status == Accepted;

        votersRegistered.push(msg.sender); // good 
        VoterID++; // good

        

        //voters[VoterID] = newVoter; // after 
        //votersRegistered.push(VoterID);
        //VoterID++;


      


    }

        

        // Register a candidate
    function registerCandidate(string  memory _ipfsHash) public {

        require(candidates[msg.sender].candidatesAddress == address(0), // after
        "You have already registered as a candidate."
        );
        
        Candidate memory newCandidate = Candidate({
            //name: _name,
            //age: _age,
            //email: _email,
            //phone: _phone,
           
           // bio: _bio,
            //goals: _goals,
            //experience: _experience,
            //vision: _vision,
          
            registeredId: CandidateID,
            voteCalculation: 0,
            candidatesAddress: msg.sender,
            status: ConfirmationStatus.Awaiting,
            ipfsHash: _ipfsHash,
             message: "Registration is awaiting approval"
        });

        candidates[msg.sender] = newCandidate;

        // new 
        //candidates[msg.sender].status == Accepted; 
        candidatesRegistered.push(msg.sender);
        CandidateID++;
    }



        // Approval of Voter
        function approveVoter(address _votersAddress, string memory _message) public onlyOwner {
            Voter storage voter = voters [_votersAddress];
            require(voter.votersAddress != address(0), "This voter does not appear in our system.");
            voter.status = ConfirmationStatus.Accepted;
            voter.message = _message;
            acceptedVoters.push(_votersAddress);

          

                // remove from rejected lists
                    for (uint256 i = 0; i < rejectedVoters.length; i++) {
                        if (rejectedVoters[i] == _votersAddress) {
                            rejectedVoters[i] = rejectedVoters[rejectedVoters.length - 1];
                            rejectedVoters.pop();
                            break;
                        }
                    }

        }
        
        // approval of Candidate
        function approveCandidate(address _candidatesAddress, string memory _message) public onlyOwner {
            Candidate storage candidate = candidates [_candidatesAddress];
            require(candidate.candidatesAddress != address(0), "This candidate does not appear in our system.");
            candidate.status = ConfirmationStatus.Accepted;
            candidate.message = _message;
            acceptedCandidates.push(_candidatesAddress);

          

            // remove from rejected lists
                    for (uint256 i = 0; i < rejectedCandidates.length; i++) {
                        if (rejectedCandidates[i] == _candidatesAddress) {
                            rejectedCandidates[i] = rejectedCandidates[rejectedCandidates.length - 1];
                            rejectedCandidates.pop();
                            break;
                        }
                    }

        }

        // Reject Voter
        function rejectVoter(address _votersAddress, string memory _message) public onlyOwner {
            Voter storage voter = voters[_votersAddress];
            require(voter.votersAddress != address(0), "No voter data available");
            voter.status = ConfirmationStatus.Denied;
            voter.message = _message;
            rejectedVoters.push(_votersAddress); 

      

            // remove from approved lists
                for (uint256 i = 0; i < acceptedVoters.length; i++) {
                    if (acceptedVoters[i] == _votersAddress) {
                        acceptedVoters[i] = acceptedVoters[acceptedVoters.length - 1];
                        acceptedVoters.pop();
                        break;
                    }
                }
        }

        // Reject Candidate
        function rejectCandidate(address _candidatesAddress, string memory _message) public onlyOwner {
            Candidate storage candidate = candidates[_candidatesAddress];
            require(candidate.candidatesAddress != address(0), "No candidate data available");
            candidate.status = ConfirmationStatus.Denied;
            candidate.message = _message;
            rejectedCandidates.push(_candidatesAddress); 

        

            // remove from approved lists
                for (uint256 i = 0; i < acceptedCandidates.length; i++) {
                    if (acceptedCandidates[i] == _candidatesAddress) {
                        acceptedCandidates[i] = acceptedCandidates[acceptedCandidates.length - 1];
                        acceptedCandidates.pop();
                        break;
                    }
                }
        }

        // Starting time and ending time
        /*function timeofVoting(uint256 _electionStartTime, uint256 _electionEndTime) public onlyOwner {
            require(_electionStartTime < _electionEndTime, "Start time must occur before the end time");
            electionStartTime = _electionStartTime;
            electionEndTime = _electionEndTime;
        }*/

      
        // Get All Register Voters
        function ListofRegisteredVoters() public view returns (Voter[] memory) {
            Voter[] memory voterListArray = new Voter[](votersRegistered.length);
            for (uint256 i = 0; i < votersRegistered.length; i ++) {
                voterListArray[i] = voters[votersRegistered[i]];
            }
            return voterListArray;

        }

        // Get all Register Candidates
        function ListofRegisteredCandidates() public view returns(Candidate[] memory) {
            Candidate[] memory candidateListArray = new Candidate[](candidatesRegistered.length);
            for (uint256 i = 0; i < candidatesRegistered.length; i ++) {
                candidateListArray[i] = candidates[candidatesRegistered[i]];
            }
            return candidateListArray;

        }

        // Get all Approved Voters
        function ListofAcceptedVoters() public view returns(Voter[] memory) {
            Voter[] memory voterListArray = new Voter[](acceptedVoters.length);
            for (uint256 i = 0; i < acceptedVoters.length; i++) {
                voterListArray[i] = voters[acceptedVoters[i]];
            }
            return voterListArray;

        }

        // Get all Approved Candidate
         function ListofAcceptedCandidates() public view returns(Candidate[] memory) {
            Candidate[] memory candidateListArray = new Candidate[](acceptedCandidates.length);
            for (uint256 i = 0; i < acceptedCandidates.length; i++) {
                candidateListArray[i] = candidates[acceptedCandidates[i]];
            }
            return candidateListArray;

        
        }

        // Get all Rejected Voters
        function ListofRejectedVoters() public view returns(Voter[] memory) {
            Voter[] memory voterListArray = new Voter[](rejectedVoters.length);
            for (uint256 i = 0; i < rejectedVoters.length; i++) {
                voterListArray[i] = voters[rejectedVoters[i]];
            }
            return voterListArray;

        }

        // Get all Rejected Candidates
         function ListofRejectedCandidates() public view returns(Candidate[] memory) {
            Candidate[] memory candidateListArray = new Candidate[](rejectedCandidates.length);
            for (uint256 i = 0; i < rejectedCandidates.length; i++) {
                candidateListArray[i] = candidates[rejectedCandidates[i]];
            }
            return candidateListArray;

        
        }

        // Get Voter
        //function findVoter(address _votersAddress) public view returns (Voter memory) {
            //return voters[_votersAddress]; no more

            //Voter memory voter = voters[_votersAddress];
           //require(voter.votersAddress != address(0), "Voter not found");
           //require(voter.status == ConfirmationStatus.Accepted, "Voter is not accepted");
           //return voter;
        //}

        // Get Candidate
        //function findCandidate(address _candidatesAddress) public view returns (Candidate memory) {
            //return candidates[_candidatesAddress];no more

            //Candidate memory candidate = candidates[_candidatesAddress];
            //require(candidate.candidatesAddress != address(0), "Candidate not found");
            //require(candidate.status == ConfirmationStatus.Accepted, "Candidate is not accepted");
             //return candidate;
        //}

        // update Voter
        /*function updateVoter(string memory _name) public beforeVotingStarts {
            Voter storage voter = voters[msg.sender];
            require(voter.votersAddress != address(0), "No voter data available.");
            voter.name = _name;
        }*/

       // update Voter ipfs hash
       function updateVoter(address _addr, string memory _ipfsHash) 
       public 
       onlyOwner
       beforeVotingStarts

       {
       Voter storage voter = voters[_addr]; 
       require(voter.votersAddress != address(0), "No voter data available.");
       
       voter.ipfsHash = _ipfsHash;
       }



        // update candidate
        /*function updateCandidate(string memory _name) public beforeVotingStarts {
            Candidate storage candidate = candidates[msg.sender];
            require(candidate.candidatesAddress != address(0), "No candidate data available.");
            candidate.name = _name;
        }*/

       // update candidate ipfs hash 
       function updateCandidate(string memory _ipfsHash) public beforeVotingStarts {
        Candidate storage candidate = candidates[msg.sender];
        require(candidate.candidatesAddress != address(0), "No candidate data available.");
        candidate.ipfsHash = _ipfsHash;
       }




         // testing 2
         /*function searchVoter(string memory _ipfsHash, address _addr) public view returns (Voter[] memory) {
             uint count = 0;

             for (uint i = 0; i < votersRegistered.length; i++) {
             Voter memory v = voters[votersRegistered[i]];

             if (
            keccak256(bytes(v.ipfsHash)) == keccak256(bytes(_ipfsHash)) &&
            v.votersAddress == _addr
            ) {
            count++;
            }
           }

          Voter[] memory results = new Voter[](count);
          uint index = 0;

         for (uint i = 0; i < votersRegistered.length; i++) {
         Voter memory v = voters[votersRegistered[i]];

        if (
            keccak256(bytes(v.ipfsHash)) == keccak256(bytes(_ipfsHash)) &&
            v.votersAddress == _addr
        ) {
            results[index] = v;
            index++;
        }
       }

       return results;
       }*/

       // new search voter function with voter address only 
       function searchVoter(address _addr) public view returns (Voter memory) {
        //require(voters[_addr].votersAddress != address(0), "Voter not found");
        return voters[_addr];
       }


         
         // testing 2 end 

         // testing 3 
         // old function searchCandidate(string memory _name, address _addr) public view returns (Candidate[] memory)
           function searchCandidate(string memory _ipfsHash, address _addr) public view returns (Candidate[] memory) {
             uint count = 0;

             for (uint i = 0; i < candidatesRegistered.length; i++) {
             Candidate memory c = candidates[candidatesRegistered[i]];

             if (
            keccak256(bytes(c.ipfsHash)) == keccak256(bytes(_ipfsHash)) &&
            c.candidatesAddress == _addr
            ) {
            count++;
            }
           }

          Candidate[] memory results = new Candidate[](count);
          uint index = 0;

         for (uint i = 0; i < candidatesRegistered.length; i++) {
         Candidate memory c = candidates[candidatesRegistered[i]];

        if (
            //keccak256(bytes(c.name)) == keccak256(bytes(_name)) old 
            //keccak256(bytes(c.ipfsHash)) == keccak256(bytes(_ipfsHash)) new 
            keccak256(bytes(c.ipfsHash)) == keccak256(bytes(_ipfsHash)) &&
            c.candidatesAddress == _addr
        ) {
            results[index] = c;
            index++;
        }
       }

       return results;
       }

         // end testing 3

        // changerowner

        // changeOwner function to transfer ownership to a new address
        function changeOwner(address newOwner) public onlyOwner {
            require(newOwner != address(0), "New owner cannot be the zero address");
            owner = newOwner;
        }



        // resetcontract function to reset the contract state for a new election
        function resetContract() public onlyOwner {

            // election can only be reset after the end date
            require(votingEndTime != 0 && block.timestamp > votingEndTime, "Election is still ongoing. Cannot reset contract.");
              

            // Reset election details
            electionName = "";
            votingStartTime = 0;
            votingEndTime = 0;
            resultPublicationTime = 0;

            // Reset candidates
            for (uint256 i = 0; i < candidatesRegistered.length; i++) {
                delete candidates[candidatesRegistered[i]];
            }
            delete candidatesRegistered;
            delete acceptedCandidates;
            delete rejectedCandidates;

            // Reset voters
            for (uint256 i = 0; i < votersRegistered.length; i++) {
                delete voters[votersRegistered[i]];
            }
            delete votersRegistered;
            delete acceptedVoters;
            delete rejectedVoters;
            delete votersWhoCasted;

            // Reset IDs
            CandidateID = 1;
            VoterID = 1;
        }     


         // Starting Time and Ending Time of Election
       function startendVoting(uint256 _votingStartTime, uint256 _votingEndTime) public onlyOwner {
         require(votingStartTime == 0, "Voting already scheduled");
         require(_votingStartTime > block.timestamp, "Start time must be in the future");
         require(_votingStartTime < _votingEndTime, "Start time must be before end time");

         votingStartTime = _votingStartTime;
         votingEndTime = _votingEndTime;
       }

       // Modifier to check if voting is active
       modifier duringVotingPeriod() {
            require(block.timestamp >= votingStartTime, "Voting has not started yet");
            require(block.timestamp <= votingEndTime, "Voting has ended");
            _;  
       }

        // vote
        function vote(address _candidatesAddress) public duringVotingPeriod {
            Voter storage voter = voters[msg.sender];
            require(voter.status == ConfirmationStatus.Accepted, "You are not a confirmed voter.");
            require(!voter.alreadyVoted, "You have already voted");

            Candidate storage candidate = candidates[_candidatesAddress];
            require(candidate.status == ConfirmationStatus.Accepted, "Candidate is not accepted.");

            voter.alreadyVoted = true;
            candidate.voteCalculation++;
            votersWhoCasted.push(msg.sender);
            

        }
        // AllwhoVoted
        function getAllVotersWhoCasted() public view returns (Voter[] memory) {
            Voter[] memory voterListArray = new Voter[](votersWhoCasted.length);
            for (uint256 i = 0; i < votersWhoCasted.length; i ++) {
                voterListArray[i] = voters[votersWhoCasted[i]];
            }

            return voterListArray;
        }

        //  Current VotingStatus
        function CurrentVotingStatus() public view returns (Candidate memory) {
            Candidate memory leadingCandidate;
            uint highestScores = 0;

            for (uint256 i = 0; i < acceptedCandidates.length; i++) {
                Candidate memory candidate = candidates[acceptedCandidates[i]];
                if (candidate.voteCalculation > highestScores) {
                    highestScores = candidate.voteCalculation;
                    leadingCandidate = candidate;
                }
            }
            return leadingCandidate;
        }
        // Winning Candidate
        /*function winningCandidate() public view returns (Candidate memory) {
            //require(block.timestamp > votingEndTime, "Voting not finished  yet.");
            //return CurrentVotingStatus();
            require(acceptedCandidates.length > 0, "No Candidates accepted for election.");

            if(block.timestamp < votingEndTime) {
                return Candidate({
                    name: "Not decided yet",
                    age: 0,
                    email: "",
                    phone: "",
                    message: "Please wait until the election ends to see the winner.",
                    registeredId: 0,
                    voteCalculation: 0,
                    candidatesAddress: address(0),
                    status: ConfirmationStatus.Awaiting
                });
            }
            return CurrentVotingStatus();
        }*/

       // winning new version ipfs
       function winningCandidate() public view returns (Candidate memory) {
    require(acceptedCandidates.length > 0, "No Candidates accepted for election.");

    if (block.timestamp < votingEndTime) {
        return Candidate({
            registeredId: 0,
            voteCalculation: 0,
            candidatesAddress: address(0),
            status: ConfirmationStatus.Awaiting,
            ipfsHash: "",
            message: "Please wait until election ends"
        });
    }

    return CurrentVotingStatus();
}




       // Result Publication time 
         function setResultPublicationTime(uint256 _resultPublicationTime) public onlyOwner {
                require(resultPublicationTime == 0, "Result publication time already set");
                //require(_resultPublicationTime > block.timestamp, "Result publication time must be in the future");
                require(_resultPublicationTime > votingEndTime, "Result publication time must be after voting end time");

                resultPublicationTime = _resultPublicationTime;
                //votingEndTime = _votingEndTime;
         }





  }
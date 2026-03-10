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

         uint256 private CandidateID; // The Identification of the candidate
         uint256 private VoterID; // The Identification of the Voters


    // Voter Bookeeping
    struct Voter {
       // bool votedRoundOne;
        //bool votedRoundTwo;
        bool alreadyVoted;

        string name;
        uint256 age;
        string email;
        string phone;
        string message;
        //string ipfs;

        uint256 registeredId;
        address votersAddress;
        ConfirmationStatus status;
 }


   // Candidate Bookeeping 
   struct Candidate {
        string name;
        //string ipfs;
        string message;
        uint256 age;
        string email;
        string phone;
        //string bio;
        //string goals;
        //string experience;
        //string vision;


        uint256 registeredId;
        uint256 voteCalculation;
        address candidatesAddress;
        ConfirmationStatus status;

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

        // Constructor 
        constructor(string memory  _name) {
            owner = msg.sender;
            electionName = _name;
            CandidateID = 1;
            VoterID = 1;
        }


       

        // Register a voter 
    function registerVoter(string memory _name, uint256 _age, string memory _email, string memory _phone) public {

        //require(voters[msg.sender].votersAddress == address(0), // after 
        //"You have already registered as a voter.");

        Voter memory newVoter = Voter({
            /*votedRoundOne: false,
            votedRoundTwo: false,
            alreadyVoted: false,*/
            alreadyVoted: false,

            name: _name,
            age: _age,
            email: _email,
            phone: _phone,
            message: "Registration is awaiting approval",
            registeredId: VoterID,
            votersAddress: msg.sender,
            status: ConfirmationStatus.Awaiting
        });

        voters[msg.sender] = newVoter; // good 
        votersRegistered.push(msg.sender); // good 
        VoterID++; // good 

        //voters[VoterID] = newVoter; // after 
        //votersRegistered.push(VoterID);
        //VoterID++;
    }

        

        // Register a candidate
    function registerCandidate(string memory _name, uint256 _age, string memory _email, string memory _phone) public {
        Candidate memory newCandidate = Candidate({
            name: _name,
            age: _age,
            email: _email,
            phone: _phone,
           // bio: _bio,
            //goals: _goals,
            //experience: _experience,
            //vision: _vision,
            message: "Registration is awaiting approval",
            registeredId: CandidateID,
            voteCalculation: 0,
            candidatesAddress: msg.sender,
            status: ConfirmationStatus.Awaiting
        });

        candidates[msg.sender] = newCandidate;
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

        }
        
        // approval of Candidate
        function approveCandidate(address _candidatesAddress, string memory _message) public onlyOwner {
            Candidate storage candidate = candidates [_candidatesAddress];
            require(candidate.candidatesAddress != address(0), "This voter does not appear in our system.");
            candidate.status = ConfirmationStatus.Accepted;
            candidate.message = _message;
            acceptedCandidates.push(_candidatesAddress);

        }

        // Reject Voter
        function rejectVoter(address _votersAddress, string memory _message) public onlyOwner {
            Voter storage voter = voters[_votersAddress];
            require(voter.votersAddress != address(0), "No voter data available");
            voter.status = ConfirmationStatus.Denied;
            voter.message = _message;
            //acceptedVoters.push(_votersAddress); // testing 
        }

        // Reject Candidate
        function rejectCandidate(address _candidatesAddress, string memory _message) public onlyOwner {
            Candidate storage candidate = candidates[_candidatesAddress];
            require(candidate.candidatesAddress != address(0), "No candidate data available");
            candidate.status = ConfirmationStatus.Denied;
            candidate.message = _message;
            //acceptedCandidates.push(_candidatesAddress);
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

        // Get Voter
        function findVoter(address _votersAddress) public view returns (Voter memory) {
            //return voters[_votersAddress];

            Voter memory voter = voters[_votersAddress];
           require(voter.votersAddress != address(0), "Voter not found");
           require(voter.status == ConfirmationStatus.Accepted, "Voter is not accepted");
           return voter;
        }

        // Get Candidate
        function findCandidate(address _candidatesAddress) public view returns (Candidate memory) {
            //return candidates[_candidatesAddress];
            Candidate memory candidate = candidates[_candidatesAddress];
            require(candidate.candidatesAddress != address(0), "Candidate not found");
            require(candidate.status == ConfirmationStatus.Accepted, "Candidate is not accepted");
             return candidate;
        }

        // update Voter
        function updateVoter(string memory _name) public {
            Voter storage voter = voters[msg.sender];
            require(voter.votersAddress != address(0), "No voter data available.");
            voter.name = _name;
        }

        // update candidate
        function updateCandidate(string memory _name) public {
            Candidate storage candidate = candidates[msg.sender];
            require(candidate.candidatesAddress != address(0), "No voter data available.");
            candidate.name = _name;
        }

        // changerowner
        // resetContract
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
        function winningCandidate() public view returns (Candidate memory) {
            //require(block.timestamp > electionEndTime, "Voting period is not over yet.");
            return CurrentVotingStatus();
        }







  }
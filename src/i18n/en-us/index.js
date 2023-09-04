/* eslint-disable max-len */
export default {
    common: {
        appName: 'Telos Communities',
        buttons: {
            reset: 'reset',
            ok: 'OK',
            cancel: 'Cancel',
            continue: 'Continue',
            create: 'Create',
            logout: 'Logout',
            mint: 'Mint',
            register: 'Register',
            save: 'Save',
            discard: 'Discard',
            confirm: 'Confirm',
            editProfile: 'Edit profile',
        },
        defaultTitle: 'Title',
    },
    components: {
        notifications: {
            linkTip: 'Display on block explorer',
        },
    },
    forms: {
        errors: {
            accountFormat:
        'The account can contain lowercase characters only, numbers from 1 to 5 or a dot (.)',
            accountFormatBasic:
        'The account must contain 12 lowercase characters only and number from 1 to 5',
            accountLength: 'The account must contain at most 12 characters',
            accountNotAvailable: 'The account "{account}" already exists',
            accountNotExists: 'The account "{account}" does not exist',
            copyKey: 'Copy the key to a safe place',
            dateFuture: 'The date must be in the future',
            greaterOrEqualThan: 'The value must be greater than or equal to {value}',
            lowerOrEqualThan: 'The value must be lower than or equal to {value}',
            integer: 'Please type an integer',
            natural: 'Please type a natural number (>=0)',
            phoneFormat: 'Please type a valid phone',
            positiveInteger: 'The value must be greater than 0',
            required: 'This field is required',
            atLeast: 'You need at least {what}',
            unique: 'Repeated values are not allowed',
            token: 'The field must contain between 2 and 6 characters',
            tokenDecimals: 'The decimals must be between 2 and 9',
        },
        hints: {
            selectCountrie: 'Please select your country',
            pressToAddHobbie: 'Press enter to add a tag',
            pressToAddURL: 'Press enter to add a URL',
        },
    },
    menu: {
        trails: 'Voting',
        trailsBallots: 'Decide',
        amendBallots: 'Amend Ballots',
        TFElection: 'TF Election',
        polls: 'Polls',
        daos: 'DAOs',
        elections: 'Elections',
        proposals: 'Proposals',
        workerProposals: 'Worker proposals',
        tokens: 'Tokens',
        trailsTreasuries: 'DAOs',
        profiles: 'Profiles',
        contacts: 'Contacts',
        myProfile: 'My profile',
        chats: 'Chats',
        registerApp: 'Register App',
        appList: 'My Apps',
        authorizedApps: 'Authorized apps',
        developer: 'Developer',
        advanced: 'Advanced',
        resolve: 'Resolve',
        welcome: 'Welcome',
        admin: 'Admin',
        arbitrator: 'Arbitrator',
        cases: 'Cases',
    },
    notifications: {
        title: 'Transactions',
        tokens: {
            setmeta: 'Set token info',
            issue: 'Issue tokens',
            retire: 'Retire tokens',
            create: 'Create a token',
            transfer: 'Transfer tokens',
        },
        trails: {
            noBallot: 'Ballot not found',
            addBallot: 'Create a ballot',
            addTreasury: 'Create a DAO',
            castVote: 'Cast a vote',
            editTreasury: 'Edit a DAO',
            mintTokens: 'Mint tokens',
            registerVoter: 'Register as a voter',
            errorSigning: 'Error signing transaction',
            successSigning: 'Success signing transaction',
            deleteBallot: 'Delete ballot',
            endBallot: 'End ballot',
            cancelBallot: 'Cancel ballot',
        },
        poc: {
            lockSafe: 'Lock safe',
            unlockSafe: 'Unlock safe',
        },
    },
    lists: {
        empty: {
            countries: 'No countries',
        },
    },
    pages: {
        accounts: {
            add: {
                buttons: {
                    continue: 'Continue',
                    goToProfile: 'Take me to my profile',
                    signIn: 'Sign in',
                    verify: 'Verify Phone Number',
                    genKeys: 'Generate Keys',
                },
                congratulationsTitle: 'Congratulations',
                congratulationsSubtitle: 'Your account {account} has been created',
                createAccountHint: 'A verification code will be sent',
                createAccountTitle: 'Create an Account',
                forms: {
                    account: 'Account name',
                    accountHint: '12 characters, alphanumeric a-z, 1-5',
                    phoneCode: 'Code',
                    smsNumber: 'Phone number',
                    verificationCode: 'Verification code',
                },
                keyCopyClipboard: 'Key copied to clipboard',
                saveKeys:
          'Save your keys somewhere safe. They will not be stored for you.',
                title: 'Signup',
                verifyAccountGeneratingKey: 'Generating key pairs',
                verifyAccountHint: 'Copy both keys to a safe place before continuing',
                verifyOTPTitle: 'Here are your keys:',
            },
        },
        trails: {
            ballots: {
                stakeBeforeVoting: 'Stake before voting',
                needPositiveVote: 'You need voting power',
                stakeBeforeVotingLong:
          'You must have TLOS staked for CPU and/or NET before voting on this ballot',
                needPositiveVoteLong: {
                    liquid:
            'You must have have non-zero balance for this token before voting on this ballot',
                    stake:
            'You need to aquire and stake any amount of this token before voting on this ballot.',
                    both: 'You need any amount of liquid or staked tokens before voting on this ballot.',
                },
                ballotSelection: {
                    minAndMax: 'You can select from {min} to {max} options',
                    onlyOne: 'You can select 1 option only',
                    maxAllowed: "You've selected the maximum allowed options",
                    stillCanSelect: 'You can select {remaining} more options',
                },
                joinDAO: 'Join DAO',
                joinAndVote: 'Join DAO & Vote',
                signInToVote: 'Sign in to vote',
                vote: 'Vote',
                ends: 'Ends',
                end: 'End',
                starts: 'Starts',
                delete: 'Delete',
                requestAmount: 'request amount',
                openBallotHeader: 'Open this ballot for voting',
                openBallot: 'Open for voting',
                notOpened: 'not open yet',
                welcomeCard: {
                    title: 'Hi, ',
                    textBeginning: 'Welcome to the ',
                    textBold: 'Telos DAO and Proposals portal',
                    textEnd:
            '. This is the place where you can influence the development ' +
            'of the Telos blockchain. Your voice matters!',
                    btnLabel: 'OK, got it',
                },
                actionBar: {
                    sorting: 'Sort by',
                    filterTitle: 'Filter',
                    typeFilter: 'Type',
                    statusFilter: 'Status',
                    groupFilter: 'DAO',
                    typeOptions: {
                        referendum: 'Referendum',
                        poll: 'Poll',
                        proposal: 'Proposal',
                    },
                    statusOptions: {
                        action: 'Action',
                        notStarted: 'Not started',
                        expired: 'Expired',
                        closed: 'Closed',
                        cancelled: 'Cancelled',
                        archived: 'Archived',
                        setup: 'Setup',
                    },
                    btnApply: 'Apply',
                    btnDiscard: 'Discard',
                    btnDiscardAll: 'Discard all filters',
                    btnConfirm: 'Confirm',
                    btnCreatePoll: 'Create a poll',
                    btnCreateProposal: 'Create a Proposal',
                    btnCreateaDAO: 'Create a DAO',
                },
            },
            treasuries: {
                settings: {
                    burnable: 'If enabled, the token manager can burn their own token',
                    maxmutable:
            'If enabled, the token manager can change token max supply',
                    reclaimable:
            'If enabled, the token manager can take away tokens from any user without extra permission',
                    stakeable: 'Enable this feature to allow users to stake their tokens',
                    transferable:
            'Enable this feature to allow users to transfer their tokens.' +
            'Consider that this is the primary feature,' +
            'do not disable this feature unless you know what you are doing',
                    unstakeable:
            'If enabled, users who have staked their tokens can not unstake them anymore',
                },
                card: {
                    maxSupply: 'Max supply',
                    openedBallots: 'Opened decisions',
                    supply: 'Supply',
                    registered: 'Registered',
                    registerVoter: 'Register as a voter',
                },
                registerVoterDialog: {
                    title: 'Do you want to register to this DAO?',
                },
            },
        },
        index: {
            buttons: {
                createAccount: 'Create account',
                login: 'Login',
            },
            router: {
                chat: 'Chat',
                signUp: 'Sign Up',
                chatList: 'Chat List',
                contactList: 'Contact List',
                registerApp: 'Register App',
                appList: 'App List',
            },
        },
        signUp: {
            form: {
                avatar: 'Avatar URL',
                presentation: 'Bio',
                name: 'Name',
                status: 'Status',
                firstName: 'First Name',
                lastName: 'Last Name',
                preferMethodComm: 'Preferred method of communication',
                sms: 'SMS Number',
                email: 'Email',
                currentSms: 'Current SMS Number',
                currentEmail: 'Current Email',
                timeZone: 'Time Zone',
                tags: 'Tags',
                btnSave: 'Save',
                newCustomFieldName: 'Write the name of new custom field',
                editCustomFieldName: 'Write the new field name',
                addCustomField: 'Add custom field',
            },
        },
        general: {
            search: 'Search',
            name: 'Name',
            eosAccount: 'eosAccount',
            domain: 'Domain',
            defaultChatList: 'There are no chats yet',
            defaultMessageList: 'There are no messages yet',
            defaultContactList: 'There are no contacts yet',
            defaultAppList: 'There are no apps yet',
            noAccountsFound: 'No accounts found',
            confirmActions: 'Do you want confirm this action?',
            private: 'Private',
            public: 'Public',
        },
        registerApp: {
            form: {
                urlBase: 'URL',
                urlImage: 'Image URL',
                name: 'Name',
                appId: 'AppId',
                shortName: 'Short Name',
                ownerAccount: 'Owner Account',
                confirmDeleteApp: 'Do you want to delete this app?',
                confirmEnableApp: 'Do you want to enable the OAuth of this app?',
                confirmDisableApp: 'Do you want to disable the OAuth of this app?',
                confirmRevokeAccessApp:
          'Do you want to revoke OAuth access of this app?',
                urlRedirection: 'URL Redirection',
                appType: 'App Type',
                revokeAccess: 'Revoke access',
                secret: 'Secret',
            },
        },
        login: {
            getApp: 'Download the app',
            title: 'Select your wallet',
            selectAccount: 'Please select an account',
        },
        testnetRotation: {
            title: 'Add your testnet BP to the schedule',
        },
        testnetDevelopers: {
            title: 'Get a testnet account or testnet TLOS',
        },
        tokens: {
            title: 'Token management',
        },
        validators: {
            title: 'Validators',
        },
        claim: {
            claimAccount: 'Claim account',
            claimCheck: {
                title: 'Check if your account has been claimed',
                checkButton: 'Check account',
            },
            removeMe: {
                title:
          'Claim your account by removing it from the unclaimed account list',
            },
        },
        poc: {
            smartsafe: {
                title: 'SmartSafe POC',
                last_unlocker: 'Last unlocked by',
                last_unlock_time: 'Last unlocked',
                lock: 'Lock',
                unlock: 'Unlock',
                locked_by: 'Locked by',
                lock_time: 'Locked at',
            },
        },
        verifyProfile: {
            verifySMS: 'Verify SMS',
            codeSMS: 'Verification code',
            verifyEMAIL: 'Verify EMAIL',
            codeEMAIL: 'Verification code',
        },
        profileLogin: {
            failed: 'Unable to login to the profile service',
        },
        resolve: {
            not_applicable: 'n/a',
            closed_case: 'closed case',
            accepted: 'accepted',
            rejected: 'rejected',
            ruled: 'ruled',
            claimant: 'Claimant',
            respondant: 'Respondant',
            submit: 'Submit',
            close: 'Close',
            cancel: 'Cancel',
            category: 'Category',
            validated: 'validated',

            menu_welcome: 'Welcome',
            menu_elections: 'Elections',
            menu_arbitrator: 'Arbitrator',
            menu_cases: 'Cases',
            menu_account: 'Account',

            admin_step_case_setup: 'Setup & Nominee Registration',
            admin_step_case_content_1:
        'Admin is able to set the configuration parameters for the smart contract, including election duration, arbitration term length, and number of arbitration seats to be filled.',
            admin_step_case_content_2:
        'Therea are currently {seats} arbitration seats available',
            admin_step_cand_reg: 'Candidate Registration',
            admin_step_cand_reg_content:
        'Nominees are able to add and remove themselves as an official candidate to the upcoming election.',
            admin_step_election_ready: 'Election Ready to Start',
            admin_step_election_ready_content:
        'Election is ready to start pending administration launch',
            admin_step_election_ready_cta: 'Start Election',
            admin_step_voting: 'Voting',
            admin_step_voting_content:
        'Users are able to vote for the candidate(s) of choice.',
            admin_step_election_finalization: 'Election Finalization',
            admin_step_election_finalization_content:
        'Voting has completed and admin needs to execute {endelection} action to process the vote results and begin the arbitration term for the winning candidates. Users will also be able to start nominating themselves for the next election, whenever that may happen to be.',
            admin_step_election_finalization_cta: 'Finalize Election',
            admin_status_nominee_reg: 'Nominee Registration',
            admin_status_election_prep: 'Election Preparaation',
            admin_status_election_finalization: 'Election Finalization',

            arb_available: 'Available',
            arb_unavailable: 'Unavailable',
            arb_removed: 'Removed',
            arb_expired: 'Expired',

            assigned_cases_title: 'Assigned Cases',

            case_status_setup: 'Case Setup',
            case_status_awaiting: 'Awaiting Arbs',
            case_status_arbs_assigned: 'Arbs Assigned',
            case_status_investigation: 'Case Investigation',
            case_status_decision: 'Decision',
            case_status_enforcement: 'Enforcement',
            case_status_resolved: 'Resolved',
            case_status_dismissed: 'Dismissed',
            case_status_cancelled: 'Cancelled',
            case_status_mistrial: 'Mistrial',
            offer_status_pending: 'Pending',
            offer_status_accepted: 'Accepted',
            offer_status_rejected: 'Rejected',
            offer_status_dismissed: 'Dismissed',

            claim_filed: 'Filed',
            claim_responded: 'Responded',
            claim_accepted: 'Accepted',
            claim_dismissed: 'Dismissed',

            claim_category_undecided: 'Undecided',
            claim_category_lost: 'Lost Key Recovery',
            claim_category_reversal: 'Transaction Reversal',
            claim_category_emergency: 'Emergency Intervention',
            claim_category_contested: 'Contested Ownership',
            claim_category_relief: 'Unexecuted Relief',
            claim_category_breach: 'Contract Breach',
            claim_category_ip: 'Misused CR IP',
            claim_category_tort: 'A Tort',
            claim_category_bp: 'BP Penalty Reversal',
            claim_category_arb: 'Wrongful Arbitration Act',
            claim_category_exec: 'Act Exec Relief',
            claim_category_works: 'Works Project Failure',
            claim_category_tbnoa: 'TBNOA Breach',
            claim_category_misc: 'Misc',

            election_status_created: 'Created',
            election_stauts_live: 'Live',
            election_status_ended: 'Ended',

            case_summary: 'Case Summary',
            case_summary_intro_content:
        '{claimant} is the claimant, with {respondant} being the respondant. There {arbs} assigned to the case.',
            case_summary_status: 'Case is currently in {status} mode.',
            case_summary_deadline:
        'Arbitrators have until {deadline} to submit their offers.',
            case_summary_add_claim: 'Add claim to case',
            case_summary_delete: 'Delete case',
            case_summary_history_loading: 'Loading case history...',
            case_summary_history_title: 'Case History',
            case_action_readycase: "{actor} changed case {id}'s status to 'ready'",
            case_action_assign: '{actor} assigned arbitrator {arbToAssign} to case',
            case_action_respond: '{actor} responded to claim {id} with {link}',
            case_action_accept: '{actor} changed claim {id} status to {class}',
            case_action_exec: '{actor} executed claim {id}',
            case_action_add: '{actor} added claim {id}',
            case_action_shred: '{actor} shredded the case {id}',
            case_action_make_offer:
        '{actor} made offer with estimate {hours} at {rate} per hour',
            case_action_respond_offer: '{actor} {accept} {offer} from {arbitrator}',
            case_action_respond_offer_inset: 'offer {tooltip}',
            case_action_start:
        '{actor} started case, giving respondant {days} days to respond to claims',
            case_action_settle: '{actor} settled claim {id} with {link}',
            case_action_review:
        '{actor} reviewed claim {id} {claimInfo} {responseInfo}',
            case_action_review_claim_info:
        'Claimant has {daysClaimant} days to provide more information.',
            case_action_review_response_info:
        'Respondant has {daysResponse} days to provide more information',
            case_action_update_claim:
        '{actor} updated claim {id} with document {link}',
            case_action_set_ruling: '{actor} (admin) {link} on case',
            case_action_validate: '{actor} (admin) {ruling} case',
            case_action_close: '{actor} {close}',
            create_case_title: 'Create New Case',
            create_case_account_name: 'Telos account name',
            create_case_account_error: 'Must be valid Telos account name',
            add_claim_title: 'Add Claim',

            create_case_heading: 'Create a new case',
            create_cass_text:
        'Do you have an asset related issue that you’d like the network’s arbitration system to resolve? We believe that a transparent process benefits everyone.',

            meet_arbitrators_title: 'Meet Your Arbitrators',
            meet_arbitrators_info:
        'Arbitrators are elected by the Telos community and bear the responsibility of ruling on cases as they are submitted.',

            case_steps_setup_title: 'Case Setup',
            case_steps_setup_content:
        'Case has been set up, and the claimant is able to submit additional claims. Arbitrators have not yet been assigned, and the respondant is not yet allowed to respond to the individual claims.',
            case_steps_ready: 'Ready Case',
            case_steps_awaiting_title: 'Awaiting Arbitrators',
            case_steps_awaiting_content:
        'After a case file has been built and is ready for review, the case enters the "Awaiting Arbitrators" stage where any arbitrator can send an offer to the claimant with their hourly rate and the estimated number of hours to judge the case. To accept an offer the claimant will need to pay the whole cost upfront. However, the funds will not be transferred to the arbitrator until the case is resolved, and can be returned in case of mistrial.',
            case_steps_submit_offer: 'Submit Offer',
            case_steps_update_offer: 'Update Offer',
            case_steps_dismiss_offer: 'Dismiss Offer',
            case_steps_assigned_title: 'Arbitrators Assigned',
            case_steps_assigned_content:
        'Now that the arbitrator(s) has been assigned, case waits for the arbitrator to begin the case investigation.',
            case_steps_start: 'Start Case',
            case_steps_investigation_title: 'Case Investigation',
            case_steps_investigation_content:
        'Arbitrator begins to investigate the individual claims. Claimant can update their claims, especially if more info is required by the arbitrator. Respondant will also be able to respond to claims made by the claimant.',
            case_steps_finalize_title: 'Finalize Case',
            case_steps_decision_title: 'Decision',
            case_steps_decision_content:
        'Admin will validate the case, which is meant to ensure that the arbitrator performed their job appropiately. If the case is considered valid, the case fee will be added to the smart contract funds and the arbitrator will be paid for their service. On the other hand, if the case is invalidated both the fee and the arbitrator rate cost will be returned to the claimant and the case will be considered {dismissed}',
            case_steps_dismissed: 'dismissed',
            case_steps_approve: 'Approve',
            case_steps_reject: 'Reject',
            case_steps_enforce_title: 'Enforcement',
            case_steps_enforce_content:
        'In this stage, the network validators will apply the ruling that has been set by the arbitrator. Once the actions have been executed, the admin can close the case.',
            case_steps_close_cta: 'Close Case',
            case_steps_case_closed: 'Case Closed',

            elections_heading: "Elect Telos's Next Arbitrators",
            elections_intro:
        "As a leader in blockchain governance, Telos allows any user with a Telos account to nominate themselves as a candidate for the position of arbitrator. Do you have a background in arbitration? Consider nominating yourself. Know someone else who you think would make a good arbitrator? Ask them to nominate themselves. If they win the election they may find themselves ruling on some of the community's most important cases.",
            elections_nominees: 'Current nominees:',
            elections_more_info: 'More info',

            election_steps_register_title: 'Nominee Registration',
            election_steps_register_content:
        'Admin is able to set the configuration parameters for the smart contract, including election duration, arbitration term length, and number of arbitration seats to be filled.',
            election_steps_nominate_self: 'Nominate Self',
            election_steps_remove_nomination: 'Remove Nomination',
            election_steps_candidate_registration: 'Candidate Registration',
            election_steps_candidate_registration_content:
        'Nominees are able to add and remove themselves as an official candidate to the upcoming election.',
            election_steps_register_candidate_cta: 'Register as Candidate',
            election_steps_remove_candidacy: 'Remove Candidacy',
            election_steps_ready: 'Election Ready to Start',
            election_steps_pending:
        'Election is ready to start pending administration launch',
            election_steps_voting_title: 'Voting',
            election_steps_voting_content:
        'Users are able to vote for the candidate(s) of choice.',
            election_steps_arbitration_title: 'Arbitration',
            election_steps_arbitration_content:
        'Voting has completed and admin needs to execute {endElection} action to process the vote results and begin the arbitration term for the winning candidates. Users will also be able to start nominating themselves for the next election, whenever that may happen to be.',
            election_steps_view_cases_cta: 'View Cases',

            election_status_created_heading: 'Elections Coming Soon!',
            election_status_created_text:
        'There is an upcoming election, and we are currently taking nominations. Think that you would make a good arbitrator? Then consider nominating yourself!',
            election_status_created_cta: 'View Elections',
            election_status_live_heading: 'Election is Live!',
            election_status_live_text:
        'An election is currently underway and every vote matters, especially yours! Head on over to Decide Voter and select this term’s arbitrators.',
            election_status_live_cta: 'View Elections',
            election_status_finalizing_heading: 'Election Has Ended',
            election_status_finalizing_text:
        "An election has recently finished. See how the candidates did, and who will be one of Telos's newest arbitrators.",
            election_status_finalizing_cta: 'View Election Results',
            election_status_ended_heading: 'Arbitration is Currently Ongoing!',
            election_status_ended_text:
        'There are currently active arbitrators for this period. You can view the ongoing arbitration cases by heading to the cases page.',
            election_status_ended_cta: 'View Cases',
            election_intro_first:
        'When valuable assets are in question, there can arise disputes over fairness, oversight, and ownership. Resolve is how Telos finds equitable solutions to these kinds of issues on our community led network.',
            election_intro_second:
        'Do you have an asset related issue that you’d like the network’s arbitration system to resolve? We believe that a transparent process benefits everyone.',
            election_intro_subheading: 'Create a new case',
            election_intro_view_cases: 'View Cases',
            election_intro_admin_cta: 'Admin Dashboard',
            election_intro_arb_cta: 'Arbitrator Dashboard',

            arb_table_title: 'Abitrators',
            arb_table_arb: 'Arbitrator',
            arb_table_status: 'Status',
            arb_table_open_cases: 'Open Cases',
            arb_table_closed_cases: 'Closed Cases',
            arb_table_credentials: 'Credentials',
            arb_table_elected: 'Elected',
            arb_table_term_end: 'Term Ends',
            arb_table_languages: 'Languages',

            begin_voting_heading: 'Start Voting Period',
            begin_voting_ballot_label: 'Ballot ID',
            begin_voting_ballot_hint: '12 characters a-z and 1-5',
            begin_voting_ballot_error: 'Must be 12 characters, a-z and / or 1-5',
            begin_voting_submit_cta: 'Submit',
            begin_voting_cancel_cta: 'Cancel',

            candidates_title: 'Candidates',
            candidateS_more_info: 'more info',
            case_files_title: 'Case Files',
            case_files_view: 'View',
            case_files_id: 'ID',
            case_files_claimant: 'Claimant',
            case_files_respondant: 'Respondant',
            case_files_arbitrators: 'Arbitrators',
            case_files_approvals: 'Approvals',
            case_files_status: 'Status',
            case_files_updated: 'Last Updated',
            case_files_actions: 'Actions',

            claim_table_title: 'Claims',
            claims_table_view: 'View',
            claims_table_more_info_claimant:
        'Click to view info needed from claimant',
            claims_table_more_info_respondant:
        'Click to view info needed from respondant',
            claims_table_actions: 'Actions',
            claims_table_respond_cta: 'Respond',
            claims_table_request_more: 'Request More Info',
            claims_table_settle_cta: 'Settle Claim',
            claims_table_update: 'Update Claim',

            claims_table_id: 'ID',
            claims_table_summary: 'Claim',
            claims_table_claimant_deadline: 'Claimant Deadline',
            claims_table_category: 'Category',
            claims_table_decision: 'Decision',
            claims_table_response: 'Response',
            claims_table_respoondant_deadline: 'Respondant Deadline',
            claims_table_status: 'Status',
            claims_table_actions_column: 'Actions',

            dismiss_offer_heading: 'Dismiss Offer',
            dismiss_offer_text:
        'Are you sure that you would like to remove your offer to arbitrate this case? You will not be able to make a new offer for this case.',
            dismiss_offer_dismiss_cta: 'Dismiss',
            dismiss_offer_cancel_cta: 'Cancel',

            elections_table_title: 'Elections',
            elections_table_view_info: 'View Info',
            elections_table_vote_now: 'Vote now',
            elections_table_seats: 'Seats',
            elections_table_end_add: 'End Add Candidates',
            elections_table_end_voting: 'End Voting',

            elections_table_id: 'ID',
            elections_table_ballot_name: 'Ballot Name',
            elections_table_candidates: 'Candidates',
            elections_table_start_voting: 'Start Voting',
            elections_table_status: 'Status',

            file_upload_label: 'Info Link',
            file_upload_hint: '46 or 49 character IPFS hash',
            file_upload_error: "Must be valid IPFS hash (eg 'Qmdn7bZ8z25b...')",
            file_upload_failed: 'Upload failed',

            init_election_heading: 'Start Election Preparation',
            init_election_submit: 'Submit',
            init_election_cancel: 'Cancel',

            make_offer_heading: 'Submit Offer',
            make_offer_text:
        'Please give an estimate for the total amount of work that you believe is necessary to evaluate and reach a decision on the case.',
            make_offer_hours: 'Estimated Hours',
            make_offer_hours_hint: 'Please enter a number greater than 0',
            make_offer_rate_label: '$ / hour',
            make_offer_rate_hint: 'Please enter a number greater than 0',
            make_offer_estimate_total: 'Estimate total: ${total}',
            make_offer_submit: 'Submit',
            make_offer_cancel: 'Cancel',

            nominate_self_heading: 'Nominate Self',
            nominate_self_submit: 'Submit',
            nominate_self_cancel: 'Cancel',

            offers_table_title: 'Offers',
            offers_table_respond: 'Respond',
            offers_table_status: 'Status',
            offers_table_hours: 'Hours',
            offers_table_arb: 'Arbitrator',
            offers_table_rate: 'Rate',
            offers_table_total: 'Total',
            offers_table_actions: 'Actions',

            ready_case_title: 'Ready Case',
            ready_case_text:
        'Are you sure that you would like set the case to "Ready" mode? This will open up the case to offers from arbitrators, who will make bids for the case work.',
            ready_case_deduction:
        'A fee of {tlosFee} TLOS will be deducted from your balance ({balance}).',
            ready_case_deficit:
        'Since your balance of { balance } is not enough to cover the fee, this transaction will also include a transfer of {adjustedDeficit} TLOS from your account to the contract.',
            ready_case_ready: 'Ready',
            ready_case_cancel: 'Cancel',

            respond_claim_title: 'Respond to Claim',
            respond_claim_submit: 'Submit',
            respond_claim_cancel: 'Cancel',

            respond_offer_title: 'Respond',
            respond_offer_text:
        'Are you sure that you would like to accept this offer? You will not be able to change your mind.',
            respond_offer_error:
        'Since your balance of { balance } is not enough to cover the {tlosFee} fee, this transaction will also include a transfer of { adjustedDeficit } TLOS from your account to the contract.',
            respond_offer_accept: 'Accept',
            respond_offer_reject: 'Reject',
            respond_offer_cancel: 'Cancel',

            review_claim_title: 'Request More Info',
            review_claim_instructions:
        'You may ask either the claimant, respondant, or both for more information regarding this claim',
            review_claim_more_info: 'More claim info needed',
            review_claim_claimant_days: 'Number days for claimant to respond',
            review_claim_claimant_error: 'Please enter a number greater than 0',
            review_claim_more_response: 'More response info needed',
            review_claim_respondant_days: 'Number days for respondant to respond',
            review_claim_respondant_error: 'Please enter a number greater than 0',
            review_claim_submit: 'Submit',
            review_claim_cancel: 'Cancel',
            review_claim_no_info_needed:
        'If you do not require more info, exit out of this form',

            finalize_case_title: 'Finalize Case',
            finalize_case_instructions:
        'Upload a document specifying your ruling on this particular case',
            finalize_case_submit: 'Submit',
            finalize_case_cancel: 'Cance',

            settle_claim_title: 'Settle Claim',
            settle_claim_instructions:
        'Choose whether this particular claim should be accepted or rejected',
            settle_claim_accept: 'Accept claim',
            settle_claim_reject: 'Reject claim',
            settle_claim_error: 'Please choose accept or reject',
            settle_claim_submit: 'Submit',
            settle_claim_cancel: 'Cancel',

            shred_case_title: 'Delete Case',
            shred_case_instructions:
        'Are you sure that you would like to delete the case?',
            shred_case_delete: 'Delete',
            shred_case_cancel: 'Cancel',

            start_case_title: 'Start Case',
            start_case_label: 'Number days for respondant to respond',
            start_case_error: 'Please enter a number greater than 0',
            start_case_start: 'Start Case',
            start_case_cancel: 'Cancel',
            start_case_info_request_label: 'Requested Info Link',

            update_claim_title: 'Update Claim',
            update_claim_update_cta: 'Update',
            update_claim_cancel_cta: 'Cancel',

            account_heading: 'Manage your account',
            account_instructions:
        'Track your Resolve balance, deposit TLOS to interact with the arbitration contract, and withdraw your TLOS balance',
            account_balance: 'Balance:',
            account_balance_withdraw: 'Withdraw',
        },
    },
};

const scenarios = [
  {
    id: 1,
    title: "Case of the Vanishing Code",
    description: "An alert pings your terminal: a Linux system’s CPU is screaming. You spot a cron job pulling a script from a shady URL, but it vanishes before you can blink. The server’s silent now, but the shadows whisper of a breach. What do you chase?",
    choices: [
      {
        id: "1a",
        text: "Check the user's command history",
        outcome: "You dig into ~/.bash_history and find 'curl' commands pulling a ghost script. The trail’s fresh.",
        successCriteria: "Telemetry Successful",
        next: [
          {
            id: "1a1",
            text: "Preserve history and analyze script commands",
            outcome: "You lock down the history file and trace a malicious script fetching payloads. The system’s clean—for now.",
            successCriteria: "Correlation Successful",
            next: null
          },
          {
            id: "1a2",
            text: "Search for modified files",
            outcome: "A hidden binary lurks in /tmp, pulsing with intent. You erase it, but the city’s still watching.",
            successCriteria: "Analyze Successful",
            next: null
          }
        ]
      },
      {
        id: "1b",
        text: "Inspect /var/log/syslog or /var/log/cron",
        outcome: "The logs scream: the cron job ran, pulling scripts like a thief in the night.",
        successCriteria: "Telemetry Successful",
        next: [
          {
            id: "1b1",
            text: "Correlate timestamps with network logs",
            outcome: "Timestamps align with data leaking to an IP. You slam the firewall shut.",
            successCriteria: "Correlation Successful",
            next: null
          },
          {
            id: "1b2",
            text: "Check for log tampering",
            outcome: "Logs are sliced—someone’s covering tracks. You pull backups to see the truth.",
            successCriteria: "Analyze Successful",
            next: null
          }
        ]
      },
      {
        id: "1c",
        text: "Analyze network connections with netstat or ss",
        outcome: "An outbound connection hums to an unknown IP, quiet but deadly.",
        successCriteria: "Telemetry Successful",
        next: [
          {
            id: "1c1",
            text: "Trace the IP address",
            outcome: "The IP ties to a C2 server. You cut the system off, leaving the shadows empty.",
            successCriteria: "Correlation Successful",
            next: null
          },
          {
            id: "1c2",
            text: "Monitor ongoing traffic",
            outcome: "You snag malicious packets, crafting a signature to hunt the next threat.",
            successCriteria: "Analyze Successful",
            next: null
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "The Ghost Account",
    description: "A 3-year-old account, 'testuser,' haunts your Windows domain. No one claims it, but it’s been whispering in the network’s veins. Is it a ghost or a snake? What do you hunt?",
    choices: [
      {
        id: "2a",
        text: "Review Security Event Logs for logon events",
        outcome: "Event ID 4624 blinks: 'testuser' logged in remotely last week. Someone’s playing games.",
        successCriteria: "Telemetry Successful",
        next: [
          {
            id: "2a1",
            text: "Trace the source IP",
            outcome: "The IP’s from outside the city, a clear breach. You kill the account’s access.",
            successCriteria: "Correlation Successful",
            next: null
          },
          {
            id: "2a2",
            text: "Check logon times",
            outcome: "Logons at 3 AM—ghosts don’t sleep. You flag it for incident response.",
            successCriteria: "Analyze Successful",
            next: null
          }
        ]
      },
      {
        id: "2b",
        text: "Check group memberships in Active Directory",
        outcome: "Testuser’s in Domain Admins, a crown it shouldn’t wear.",
        successCriteria: "Telemetry Successful",
        next: [
          {
            id: "2b1",
            text: "Remove from privileged groups",
            outcome: "You strip its admin rights, locking the vault. The account’s just a shell now.",
            successCriteria: "Analyze Successful",
            next: null
          },
          {
            id: "2b2",
            text: "Audit other group changes",
            outcome: "Unauthorized group shifts pop up—a wider breach. You sound the alarm.",
            successCriteria: "Correlation Successful",
            next: null
          }
        ]
      },
      {
        id: "2c",
        text: "Examine file access with audit policies",
        outcome: "Audit logs show 'testuser' rifling through HR files, quiet as a thief.",
        successCriteria: "Telemetry Successful",
        next: [
          {
            id: "2c1",
            text: "Lock down affected files",
            outcome: "You seal the HR files, stopping the bleed. Case closed, but the city hums.",
            successCriteria: "Analyze Successful",
            next: null
          },
          {
            id: "2c2",
            text: "Check for additional unauthorized access",
            outcome: "More files touched—a pattern emerges. You call for a full audit.",
            successCriteria: "Correlation Successful",
            next: null
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "The Forgotten Server",
    description: "A web server running WordPress, untouched for 3 years, hums in your network’s shadows. Its code’s ancient, a beacon for trouble. Has it been cracked? What do you trace?",
    choices: [
      {
        id: "3a",
        text: "Check wp-content for suspicious files",
        outcome: "A rogue PHP script squats in wp-content/uploads, pulsing with malice.",
        successCriteria: "Coding Successful",
        next: [
          {
            id: "3a1",
            text: "Quarantine the script",
            outcome: "You purge the script and sweep for others. The server’s clean, but the neon burns.",
            successCriteria: "Analyze Successful",
            next: null
          },
          {
            id: "3a2",
            text: "Check file timestamps",
            outcome: "Fresh timestamps scream intrusion. You patch WordPress, sealing the gate.",
            successCriteria: "Analyze Successful",
            next: null
          }
        ]
      },
      {
        id: "3b",
        text: "Review HTTP access logs",
        outcome: "Logs show POST requests hammering a weak plugin, relentless as rain.",
        successCriteria: "Telemetry Successful",
        next: [
          {
            id: "3b1",
            text: "Disable the plugin",
            outcome: "You kill the plugin, shutting the door. The exploit’s dead, for now.",
            successCriteria: "Coding Successful",
            next: null
          },
          {
            id: "3b2",
            text: "Analyze request payloads",
            outcome: "SQL injection attempts glare back. You harden the database, eyes open.",
            successCriteria: "Analyze Successful",
            next: null
          }
        ]
      },
      {
        id: "3c",
        text: "Monitor network traffic from the server",
        outcome: "The server’s beaconing to a C2 server, a digital heartbeat of betrayal.",
        successCriteria: "Telemetry Successful",
        next: [
          {
            id: "3c1",
            text: "Isolate the server",
            outcome: "You cut the server off, silencing the C2. The compromise is caged.",
            successCriteria: "Analyze Successful",
            next: null
          },
          {
            id: "3c2",
            text: "Capture traffic for analysis",
            outcome: "You grab the traffic, mapping the attacker’s tools. IDS rules tighten.",
            successCriteria: "Correlation Successful",
            next: null
          }
        ]
      }
    ]
  }
];
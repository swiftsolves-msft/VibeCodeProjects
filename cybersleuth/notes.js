const notesContent = document.getElementById('notes-content');
const notesWindow = document.getElementById('notes-window');

const notesData = {
  "1a": {
    definitions: "Command History (~/.bash_history): On Linux systems, the command history is stored in a file called ~/.bash_history in the user's home directory. It logs commands executed in the terminal, which can reveal suspicious activity.<br><br>cron: A time-based job scheduler in Unix-like systems. It runs scripts or commands at specified intervals, often used for automation but can be exploited to execute malicious code.",
    reasoning: "Checking the user's command history is a key step in incident response. It helps identify what commands were run, especially if an attacker used the terminal to download or execute malicious scripts. This can reveal the initial infection vector or persistence mechanisms.",
    value: "By examining the command history, a security professional can quickly trace unauthorized actions, such as downloading a script via 'curl' (a command-line tool to transfer data). This provides a starting point for deeper investigation and helps prevent further damage."
  },
  "1a1": {
    definitions: "Preserving History: Making a copy of ~/.bash_history to prevent tampering by an attacker.<br><br>Script Commands: Analyzing the commands in the script to understand their purpose, such as downloading additional malware or establishing persistence.",
    reasoning: "Preserving the command history ensures evidence isn't lost if an attacker modifies or deletes the file. Analyzing script commands helps understand the attacker's intent and methods, such as whether they installed malware or exfiltrated data.",
    value: "This action secures critical evidence for forensic analysis and helps identify the full scope of the compromise. It can lead to discovering additional malicious scripts or payloads, allowing the security team to clean the system effectively."
  },
  "1a2": {
    definitions: "Modified Files: Files that have been recently changed or created, often found using commands like 'find' or 'ls -lt' to check timestamps.",
    reasoning: "Searching for modified files helps identify where an attacker may have placed malicious binaries or scripts, such as in /tmp, a common directory for temporary files that attackers exploit.",
    value: "Finding and removing malicious files prevents further execution of harmful code. It also helps map the attacker's actions on the system, aiding in containment and recovery."
  },
  "1b": {
    definitions: "Syslog (/var/log/syslog): A log file on Linux systems that records system events, including cron job executions.<br><br>Cron Log (/var/log/cron): A specific log for cron activities, showing when and what jobs were executed.",
    reasoning: "Inspecting logs like syslog or cron logs helps track scheduled tasks that might be malicious. Cron jobs pulling scripts from external URLs are a common persistence mechanism for attackers.",
    value: "This action reveals unauthorized cron jobs, allowing a security professional to disable them and stop ongoing malicious activity. It also provides timestamps for correlating with other events, building a timeline of the attack."
  },
  "1b1": {
    definitions: "Timestamps: The date and time a log entry was recorded, used to match events across different logs.<br><br>Network Logs: Logs from tools like firewalls or intrusion detection systems (IDS) that record network traffic.",
    reasoning: "Correlating timestamps between cron logs and network logs helps identify if data was exfiltrated or if the cron job communicated with a malicious server, indicating a breach.",
    value: "This correlation pinpoints the exact time of malicious activity, enabling the security team to block the malicious IP and prevent further data loss. It strengthens the incident response by linking system and network events."
  },
  "1b2": {
    definitions: "Log Tampering: When an attacker modifies or deletes log entries to hide their activities, often detected by gaps or inconsistencies in logs.",
    reasoning: "Checking for log tampering ensures the integrity of evidence. Attackers often alter logs to cover their tracks, so restoring from backups can reveal the true extent of their actions.",
    value: "Identifying tampering confirms an active intrusion, prompting a deeper investigation. Restoring logs from backups provides a clearer picture of the attack, aiding in attribution and mitigation."
  },
  "1c": {
    definitions: "netstat: A command-line tool to display network connections, routing tables, and interface statistics.<br><br>ss: A modern replacement for netstat, used to show socket statistics and active connections.",
    reasoning: "Analyzing network connections with netstat or ss helps identify unauthorized outbound connections, such as those to a command-and-control (C2) server, which attackers use to control compromised systems.",
    value: "Detecting suspicious connections allows a security professional to isolate the system and block the malicious IP, stopping further communication with the attacker. This is critical for containing the breach."
  },
  "1c1": {
    definitions: "IP Address Tracing: Using tools like WHOIS or geolocation services to identify the owner and location of an IP address.<br><br>C2 Server: A command-and-control server used by attackers to send commands to compromised systems.",
    reasoning: "Tracing the IP address of an outbound connection can confirm if it’s a known malicious server, such as a C2 server, indicating a serious compromise.",
    value: "Confirming the IP as a C2 server allows the security team to cut off the connection, preventing further attacker control. It also provides intelligence for threat hunting and reporting to authorities."
  },
  "1c2": {
    definitions: "Ongoing Traffic Monitoring: Using tools like tcpdump or Wireshark to capture and analyze network traffic in real-time.",
    reasoning: "Monitoring traffic helps capture malicious packets, revealing the attacker's methods and allowing the creation of signatures to detect similar attacks in the future.",
    value: "Capturing packets provides actionable data for developing intrusion detection rules, enhancing future defenses. It also helps understand the attacker's tactics, improving incident response."
  },
  "2a": {
    definitions: "Security Event Logs: Logs in Windows systems (accessed via Event Viewer) that record events like logons, accessed under Event ID 4624 for successful logins.",
    reasoning: "Reviewing logon events helps identify unauthorized access, especially if an old account like 'testuser' is being used, which might indicate a compromised account.",
    value: "This action detects misuse of dormant accounts, a common tactic for persistence. Identifying unauthorized logons enables the security team to disable the account and investigate further."
  },
  "2a1": {
    definitions: "Source IP: The IP address from which a logon attempt originated, often recorded in Security Event Logs.",
    reasoning: "Tracing the source IP of a logon event can reveal if the access came from an external, potentially malicious location, confirming a breach.",
    value: "Identifying an external IP as the source of a logon allows the security team to block it and disable the compromised account, stopping further unauthorized access and containing the incident."
  },
  "2a2": {
    definitions: "Logon Times: The timestamps of logon events, recorded in Security Event Logs.",
    reasoning: "Checking logon times can reveal suspicious activity, such as logons at odd hours (e.g., 3 AM), which are unlikely for legitimate users and may indicate an attack.",
    value: "Flagging unusual logon times helps confirm unauthorized access, prompting further investigation through incident response. It aids in building a timeline of the attack for better response."
  },
  "2b": {
    definitions: "Active Directory (AD): A Microsoft service for managing users, groups, and permissions in a Windows domain.<br><br>Group Memberships: The security groups a user belongs to, such as Domain Admins, which grant elevated privileges.",
    reasoning: "Checking group memberships in Active Directory helps identify if an account has been given unauthorized privileges, such as being added to Domain Admins, a common escalation tactic.",
    value: "Detecting unauthorized group memberships allows the security team to remove the account from privileged groups, reducing the risk of further damage. It also highlights a potential privilege escalation attack."
  },
  "2b1": {
    definitions: "Privileged Groups: Groups like Domain Admins in Active Directory that grant high-level access to systems and data.",
    reasoning: "Removing an account from privileged groups prevents an attacker from using it to access sensitive systems or data, limiting their ability to cause harm.",
    value: "This action reduces the attacker's capabilities, protecting critical resources. It also forces the attacker to find another method of escalation, buying time for further investigation and response."
  },
  "2b2": {
    definitions: "Group Changes: Modifications to group memberships in Active Directory, often logged in Security Event Logs.",
    reasoning: "Auditing group changes helps identify if an attacker has modified other accounts or groups, indicating a broader compromise beyond the initial account.",
    value: "Discovering additional unauthorized changes triggers a wider investigation, ensuring all compromised accounts are addressed. It helps contain the breach and prevent further escalation."
  },
  "2c": {
    definitions: "Audit Policies: Windows settings that enable logging of specific actions, such as file access, configured via Group Policy.<br><br>File Access: Actions like reading or modifying files, logged in Security Event Logs.",
    reasoning: "Examining file access logs helps identify if an account has accessed sensitive data, such as HR files, which could indicate data theft or reconnaissance by an attacker.",
    value: "Detecting unauthorized file access allows the security team to secure the affected files and assess the extent of data exposure. It helps prevent further data breaches and informs incident response."
  },
  "2c1": {
    definitions: "Locking Down Files: Restricting access to files by modifying permissions or moving them to a secure location.",
    reasoning: "Locking down affected files prevents further unauthorized access, stopping the attacker from continuing to steal or modify sensitive data.",
    value: "This action protects critical data, such as HR files, from further compromise. It helps contain the incident and gives the security team time to investigate and mitigate the breach."
  },
  "2c2": {
    definitions: "Unauthorized Access: Access to files or systems by an account that shouldn’t have permission, often detected through audit logs.",
    reasoning: "Checking for additional unauthorized access helps identify the full scope of the compromise, ensuring no other sensitive data was accessed by the attacker.",
    value: "A full audit ensures all affected areas are identified and secured, preventing further data loss. It also provides a comprehensive view of the attack, aiding in recovery and future prevention."
  },
  "3a": {
    definitions: "wp-content: A directory in WordPress where themes, plugins, and uploads are stored, often targeted by attackers to inject malicious scripts.<br><br>Suspicious Files: Files that don’t belong, such as PHP scripts in uploads, often detected by unusual names or timestamps.",
    reasoning: "Checking wp-content for suspicious files helps identify if an attacker has injected malicious code, a common method to maintain persistence or execute attacks on a WordPress server.",
    value: "Finding malicious scripts allows the security team to remove them, stopping ongoing attacks. It also highlights vulnerabilities in the WordPress setup, prompting updates or patches to prevent future exploits."
  },
  "3a1": {
    definitions: "Quarantine: Isolating a file by moving it to a secure location or restricting its execution to prevent harm.",
    reasoning: "Quarantining a malicious script prevents it from executing further, stopping the attack while preserving the file for forensic analysis.",
    value: "This action halts the immediate threat, protecting the server and its users. It also allows for detailed analysis of the script, which can reveal the attacker’s methods and help prevent similar attacks."
  },
  "3a2": {
    definitions: "File Timestamps: The creation or modification time of a file, checked using commands like 'ls -l' or 'stat' on Linux.",
    reasoning: "Checking file timestamps helps identify recently modified or created files, which can indicate an intrusion if they align with the time of a suspected attack.",
    value: "Identifying recent changes confirms an active intrusion, allowing the security team to patch vulnerabilities (e.g., outdated WordPress versions) and remove malicious files, securing the server."
  },
  "3b": {
    definitions: "HTTP Access Logs: Logs generated by web servers (e.g., Apache, Nginx) that record HTTP requests, often found in /var/log/apache2/access.log.<br><br>POST Requests: HTTP requests used to send data to a server, often exploited to upload malicious files or execute code.",
    reasoning: "Reviewing HTTP access logs helps identify suspicious requests, such as repeated POST requests to a vulnerable plugin, which could indicate an exploit attempt.",
    value: "Detecting malicious requests allows the security team to disable the vulnerable plugin, stopping the attack. It also provides evidence of the attack method, aiding in mitigation and future prevention."
  },
  "3b1": {
    definitions: "Plugin: A WordPress component that adds functionality, often targeted by attackers if not updated.",
    reasoning: "Disabling a vulnerable plugin prevents further exploitation, as attackers often target outdated plugins to gain access to a server.",
    value: "This action stops the immediate threat, protecting the server from further compromise. It also highlights the need to update or replace the plugin, improving overall security."
  },
  "3b2": {
    definitions: "Request Payloads: The data sent in an HTTP request, often analyzed to detect malicious content like SQL injection attempts.<br><br>SQL Injection: An attack where malicious SQL code is inserted into a query, often via form inputs, to manipulate a database.",
    reasoning: "Analyzing request payloads helps identify attack patterns, such as SQL injection attempts, which can reveal vulnerabilities in the web application.",
    value: "Detecting SQL injection attempts allows the security team to harden the database (e.g., using prepared statements), preventing data theft or manipulation. It also informs future security measures."
  },
  "3c": {
    definitions: "Network Traffic: Data sent and received over a network, monitored using tools like tcpdump or Wireshark.<br><br>C2 Server: A command-and-control server used by attackers to manage compromised systems.",
    reasoning: "Monitoring network traffic from the server helps identify if it’s communicating with a C2 server, indicating a compromise and active attacker control.",
    value: "Detecting C2 communication allows the security team to isolate the server, stopping the attacker’s control. It also provides evidence for further investigation and threat intelligence."
  },
  "3c1": {
    definitions: "Isolate: Disconnecting a system from the network to prevent further communication with an attacker.",
    reasoning: "Isolating the server cuts off communication with the C2 server, preventing the attacker from sending further commands or exfiltrating data.",
    value: "This action contains the breach, protecting the network and data. It buys time for the security team to investigate and remediate the compromise without further interference."
  },
  "3c2": {
    definitions: "Traffic Capture: Recording network traffic using tools like tcpdump or Wireshark for analysis.<br><br>IDS Rules: Rules for an Intrusion Detection System to detect and alert on malicious activity.",
    reasoning: "Capturing traffic allows the security team to analyze the attacker’s communication patterns, enabling the creation of IDS rules to detect similar attacks in the future.",
    value: "This action enhances future defenses by adding detection capabilities. It also provides insights into the attacker’s tactics, improving overall security posture and incident response."
  }
};

function updateNotes(choice, scenario, isOutcome = false, socOutcome = "", supportOutcome = "") {
  const note = notesData[choice.id] || { definitions: "No notes available.", reasoning: "", value: "" };
  let content = `<strong>Action:</strong> ${choice.text}<br><br>`;
  if (!isOutcome) {
    content += `<strong>Definitions:</strong><br>${note.definitions}<br><br>`;
    content += `<strong>Why Do This?</strong><br>${note.reasoning}<br><br>`;
    content += `<strong>Value:</strong><br>${note.value}`;
  } else {
    content += `<strong>Outcome:</strong><br>${choice.outcome}<br><br>`;
    content += `<strong>Roll Result:</strong><br>`;
    content += isOutcome ? `SOC: ${socOutcome}, Support: ${supportOutcome}` : "No roll yet.";
  }
  notesContent.innerHTML = content;
  notesWindow.scrollTop = 0; // Scroll to top for new content
}

## SSH Proxy Tunnel Maker

### Setup Instructions

Follow these steps to set up and run the SSH Proxy Tunnel Maker:

1. **Update and upgrade packages:**
	```bash
	apt upgrade -y && apt update -y
	```

2. **Install required dependencies:**
	```bash
	apt install -y ca-certificates curl gnupg
	```

3. **Add NodeSource GPG key:**
	```bash
	sudo mkdir -p /etc/apt/keyrings
	curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
	```

4. **Add Node.js 22.x repository:**
	```bash
	echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
	```

5. **Update package lists and install Node.js:**
	```bash
	apt update
	apt install nodejs -y
	```

6. **Install additional tools:**
	```bash
	apt install netcat -y
	apt install screen -y
	```

7. **Test connectivity (optional):**
	```bash
	nc -vz 31.58.228.58 1337
	```

8. **Start the proxy in a screen session:**
	```bash
	screen -S proxy node .
	```

---

**Note:**
- Edit the code as needed for your use case.
- For more details, see `setup.txt`.
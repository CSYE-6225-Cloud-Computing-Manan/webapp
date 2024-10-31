#!/bin/bash

#wait for 30 seconds till the instance is up and running
sleep 30

# Update the system packages
sudo apt-get update

# Create a group and user, then add the user to the group
echo "Creating user csye6225 with no login shell."
sudo groupadd csye6225
sudo useradd -M -g csye6225 -s /usr/sbin/nologin csye6225


# Install necessary dependencies
echo "Installing Node.js."
sudo curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Check if Node.js and npm are installed
echo "Node.js and npm installed."
sudo node -v
sudo npm -v

# Install MySQL
# echo "Installing MySQL."
# sudo apt-get install -y mysql-server 
# sudo systemctl start mysql
# sudo systemctl start mysql


# Install unzip
echo "Installing unzip."
sudo apt-get install -y unzip

# Move the webapp.zip file to the desired directory and unzip it
echo "Moving webapp.zip and unzipping the webapp"
sudo mkdir -p /home/csye-6225
sudo mv /tmp/webapp.zip /home/csye-6225
sudo unzip /home/csye-6225/webapp.zip -d /home/csye-6225/webapp

# Change ownership of the webapp directory to appuser
sudo chown -R csye6225:csye6225 /home/csye-6225/webapp

# Download and install the CloudWatch Agent
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# Install the downloaded package
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Clean up the downloaded .deb file
sudo rm amazon-cloudwatch-agent.deb

sudo mv /tmp/cloudwatch-config.json /opt/cloudwatch-config.json

# Run npm install to install application dependencies
echo "Running npm install..."
cd /home/csye-6225/webapp/webapp
sudo npm install

# Remove git if it is present
sudo apt-get remove -y git
gitRemoved=$?

if [ $gitRemoved -eq 0 ]; then 
    echo "Git is present and it is removed successfully."
else
    echo "Git is not present."
fi

sudo rm -rf /home/csye-6225/webapp/webapp/.git
sudo rm -f /home/csye-6225/webapp/webapp/.gitignore
sudo rm -rf /home/csye-6225/webapp/webapp/.github

# Enable and start the systemd service (assuming it is startup.service)
echo "Enabling and starting systemd service..."
sudo mv /tmp/startup.service /etc/systemd/system/startup.service
sudo systemctl daemon-reload
sudo systemctl enable amazon-cloudwatch-agent
# sudo systemctl enable startup.service
# # sudo systemctl start startup.service
# sudo systemctl status startup.service
# sudo journalctl -u startup.service


echo "AMI build process completed."



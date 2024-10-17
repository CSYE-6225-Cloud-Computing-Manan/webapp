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
echo "Installing MySQL."
sudo apt-get install -y mysql-server 
sudo systemctl start mysql
sudo systemctl start mysql


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

# echoing the variables
echo "DB_USERNAME: $DB_USERNAME"
echo "DB_PASSWORD: $DB_PASSWORD"
echo "DB_NAME: $DB_NAME"
echo "DB_HOST: $DB_HOST"
echo "DB_DIALECT: $DB_DIALECT"
echo "PORT: $PORT"

# Alter root user password and create the database
echo "Configuring MySQL root user with password and creating the database."
sudo mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS $DB_NAME;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
EOF

# Check if the database was created successfully
echo "Verifying if the database $DB_NAME was created."
sudo mysql -u root -p'manan1234' -e "SHOW DATABASES LIKE '$DB_NAME';"


# Create the .env file for the application
echo "Creating the .env file..."
cd /home/csye-6225/webapp/webapp
sudo touch .env
sudo chmod 666 .env 
echo PORT=$PORT | sudo tee -a .env
echo DB_USERNAME=$DB_USERNAME | sudo tee -a .env
echo DB_PASSWORD=$DB_PASSWORD | sudo tee -a .env
echo DB_NAME=$DB_NAME | sudo tee -a .env
echo DB_HOST=$DB_HOST | sudo tee -a .env
echo DB_DIALECT=$DB_DIALECT | sudo tee -a .env


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
sudo systemctl enable startup.service
sudo systemctl start startup.service
sudo systemctl status startup.service
sudo journalctl -u startup.service


echo "App startup process completed."



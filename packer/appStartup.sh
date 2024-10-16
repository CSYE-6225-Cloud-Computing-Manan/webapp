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


# Install unzip
echo "Installing unzip."
sudo apt-get install -y unzip

# Move the webapp.zip file to the desired directory and unzip it
echo "Moving webapp.zip and unzipping the webapp"
sudo mkdir -p /home/csye-6225
sudo mv /tmp/webapp.zip /home/csye-6225
sudo unzip /home/csye-6225/webapp.zip -d /home/csye-6225/webapp/webapp

# Change ownership of the webapp directory to appuser
sudo chown -R csye6225:csye6225 /home/csye-6225/webapp/webapp

# Create the MySQL database and set the database password
ROOT_PASSWORD=$(sudo grep 'temporary password' /var/log/mysqld.log | awk '{print $NF;}')
echo "${ROOT_PASSWORD}"
sudo mysql -u "root" --password="${ROOT_PASSWORD}" --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"

# echo "Creating MySQL database and setting permissions..."
# sudo -E mysql -u root -proot -e "ALTER USER '$DB_USERNAME'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';"
# sudo -E mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
# sudo -E mysql -u root -proot -e "FLUSH PRIVILEGES;"


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


# Enable and start the systemd service (assuming it is startup.service)
echo "Enabling and starting systemd service..."
sudo mv /tmp/startup.service /etc/systemd/system/startup.service
sudo systemctl daemon-reload
sudo systemctl enable startup.service
sudo systemctl start startup.service

echo "App startup process completed."


